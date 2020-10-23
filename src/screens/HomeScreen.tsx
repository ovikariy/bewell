import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import WidgetListComponent from '../components/WidgetListComponent';
import { ItemTypes } from '../modules/constants';
import { load, removeFromReduxAndPersist, updateReduxAndPersist } from '../redux/mainActionCreators';
import { DatePickerWithArrows } from '../components/MiscComponents';
import { FloatingToolbar, DeleteWidgetItemButton, ViewHistoryButton } from '../components/ToolbarComponents';
import { getStorageKeyFromDate, consoleColors, consoleLogWithColor } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { deleteImageFromDiskAsync } from '../modules/io';
import { CreateWidgetFactory, WidgetBase } from '../modules/widgetFactory';
import { RootState } from '../redux/store';
import { ItemBase, ItemBaseAssociativeArray, AppNavigationProp } from '../modules/types';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE
});

const mapDispatchToProps = {
  load,
  removeFromReduxAndPersist,
  updateReduxAndPersist
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface HomeScreenState {
  selectedDate: Date,
  selectedItem?: WidgetBase
}

interface HomeScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'Home'>
}

class HomeScreen extends Component<HomeScreenProps, HomeScreenState>  {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  constructor(props: HomeScreenProps) {
    super(props);
    this.state = {
      selectedDate: new Date(),
      selectedItem: undefined
    };
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
    this.props.removeFromReduxAndPersist(storeKey, this.props.STORE.items, item.id);
    if (item.type === ItemTypes.IMAGE)
      this.afterDeleteCleanupImageFile(item);
    this.setState({ ...this.state, selectedItem: undefined });
  }

  render() {
    const widgetFactory = CreateWidgetFactory(this.context);
    const selectedDateString = new Date(this.state.selectedDate).toLocaleDateString();
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    let data: WidgetBase[] = [];
    if (this.props.STORE && this.props.STORE.items)
      data = (this.props.STORE.items[selectedMonth] as WidgetBase[] || []).filter((item) => new Date(item.date).toLocaleDateString() === selectedDateString);
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} >
          <DatePickerWithArrows value={this.state.selectedDate} onChange={(event, newDate) => this.selectedDateChanged(event, newDate)} />
          <WidgetListComponent
            dailyData={data}
            selectedDate={this.state.selectedDate}
            selectedItem={this.state.selectedItem}
            widgetFactory={widgetFactory}
            onChange={(newDailyData) => { this.onDataChange(newDailyData); }}
            onSelected={(selectedItem) => { this.onSelected(selectedItem); }}
            onPulldownRefresh={() => this.refreshItems()}
          />
        </ScreenContent>
        <FloatingToolbar isVisible={this.state.selectedItem !== undefined}>
          <DeleteWidgetItemButton item={this.state.selectedItem} onDelete={(storeKey, item) => { this.deleteItem(storeKey, item); }} />
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
    this.props.updateReduxAndPersist(selectedMonth, this.props.STORE.items, newDailyData);
    this.setState({ ...this.state, selectedItem: undefined });
  }

  onSelected(selectedItem: WidgetBase) {
    selectedItem === this.state.selectedItem ?
      this.setState({ ...this.state, selectedItem: undefined }) :
      this.setState({ ...this.state, selectedItem });
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

export default connector(HomeScreen);