import React, { Component } from 'react';
import { debounce } from 'lodash';
import { connect, ConnectedProps } from 'react-redux';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import WidgetListComponent from '../components/WidgetListComponent';
import { stateConstants, ItemTypes } from '../modules/Constants';
import { load, persistRedux, updateRedux, removeFromRedux } from '../redux/mainActionCreators';
import { DatePickerWithArrows } from '../components/MiscComponents';
import { FloatingToolbar, DeleteWidgetItemButton, ViewHistoryButton } from '../components/ToolbarComponents';
import { getStorageKeyFromDate, consoleColors, consoleLogWithColor } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';
import { deleteImageFromDiskAsync } from '../modules/FileHelpers';
import { CreateWidgetFactory, WidgetBase } from '../modules/WidgetFactory';
import { RootState } from '../redux/configureStore';
import { ItemBase, ItemBaseAssociativeArray } from '../modules/types';
import { Text } from 'react-native';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE
})

const mapDispatchToProps = {
  load: (key: string) => load(key),
  updateRedux: (key: string, items: ItemBase[]) => updateRedux(key, items),
  remove: (key: string, id: string) => removeFromRedux(key, id),
  persistRedux: (items: ItemBaseAssociativeArray, dirtyKeys: { [key: string]: string }) => persistRedux(items, dirtyKeys)
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface HomeScreenState {
  selectedDate: Date,
  selectedItem?: WidgetBase
}

interface HomeScreenProps {
  navigation: any;
}

class HomeScreen extends Component<PropsFromRedux & HomeScreenProps, HomeScreenState>  {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  constructor(props: PropsFromRedux & HomeScreenProps) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      selectedItem: undefined
    }
  }

  componentDidMount() {
    this.refreshItems();

    const language = this.context.language;
    //this.props.navigation.navigate('Settings', { screen: 'BackupRestore' });
    //this.props.navigation.navigate('ItemHistory', { 'title': language['sleep'], 'itemType': ItemTypes.SLEEP });
  }

  refreshItems() {
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    this.props.load(selectedMonth);
    this.setState({ ...this.state, selectedItem: undefined });
  }

  deleteItem(storeKey: string, item: WidgetBase) {
    this.props.remove(storeKey, item.id);
    if (item.type === ItemTypes.IMAGE)
      this.afterDeleteCleanupImageFile(item);
    this.persist();
    this.setState({ ...this.state, selectedItem: undefined });
  }

  render() {
    const widgetFactory = CreateWidgetFactory(this.context);
    const selectedDateString = new Date(this.state.selectedDate).toLocaleDateString();
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    let data: WidgetBase[] = [];
    if (this.props.STORE && this.props.STORE.items)
      data = (this.props.STORE.items[selectedMonth] as WidgetBase[] || []).filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString);
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} >
          <DatePickerWithArrows value={this.state.selectedDate} onChange={(event, newDate) => this.selectedDateChanged(event, newDate)} />
          <WidgetListComponent
            dailyData={data}
            selectedDate={this.state.selectedDate}
            selectedItem={this.state.selectedItem}
            widgetFactory={widgetFactory}
            onChange={(newDailyData) => { this.onDataChange(newDailyData) }}
            onSelected={(selectedItem) => { this.onSelected(selectedItem) }}
            onPulldownRefresh={() => this.refreshItems()}
          />
        </ScreenContent>
        <FloatingToolbar isVisible={this.state.selectedItem != null}>
          <DeleteWidgetItemButton item={this.state.selectedItem} onDelete={(storeKey, item) => { this.deleteItem(storeKey, item) }} />
          <ViewHistoryButton item={this.state.selectedItem} itemConfig={this.state.selectedItem ? widgetFactory[this.state.selectedItem.type].config : undefined} navigation={this.props.navigation} />
        </FloatingToolbar>
      </ScreenBackground>
    );
  }

  selectedDateChanged(event: any, newDate: Date | undefined) {
    if (!newDate)
      return;
    this.setState({ ...this.state, selectedDate: newDate, selectedItem: undefined });
  }

  onDataChange(newDailyData: ItemBase[]) {
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    this.props.updateRedux(selectedMonth, newDailyData);
    this.persistAfterDelay();
    this.setState({ ...this.state, selectedItem: undefined });
  }

  onSelected(selectedItem: WidgetBase) {
    selectedItem === this.state.selectedItem ?
      this.setState({ ...this.state, selectedItem: undefined }) :
      this.setState({ ...this.state, selectedItem });
  }

  persistAfterDelay = debounce(() => this.persist(), 6000, {});

  persist() { 
    const store = this.props.STORE;
    if (!store.dirtyKeys || !(Object.keys(store.dirtyKeys).length > 0))
      return;
    this.props.persistRedux(store.items, store.dirtyKeys);
  }

  afterDeleteCleanupImageFile(item: WidgetBase) {
    /* IMAGE widget stores image file in app document directory and needs to be cleaned up after delete */
    if (!item)
      return;
    const imageProps = (item as any).imageProps;
    if (!imageProps || !imageProps.filename)
      return;

    deleteImageFromDiskAsync(imageProps.filename)
      .then(() => { })
      .catch((error) => {
        console.log(error);
      });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);