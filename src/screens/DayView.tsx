import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import WidgetListComponent from '../components/WidgetListComponent';
import { ItemTypes, StoreConstants } from '../modules/constants';
import { load, removeFromReduxAndPersist, updateReduxAndPersist } from '../redux/mainActionCreators';
import { Spacer } from '../components/MiscComponents';
import { FloatingToolbar, DeleteWidgetItemButton, ViewHistoryButton } from '../components/ToolbarComponents';
import { getStorageKeyFromDate, consoleLogWithColor } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { deleteImageFromDiskAsync } from '../modules/io';
import { CreateWidgetFactory } from '../modules/widgetFactory';
import { RootState } from '../redux/store';
import { AppNavigationProp, AppRouteProp, ItemBase, WidgetBase } from '../modules/types';
import { dimensions, sizes } from '../assets/styles/style';
import { DatePickerWithArrows } from '../components/DatetimeComponents';

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

interface DayViewState {
  selectedDate: Date,
  selectedItem?: WidgetBase
}

interface DayViewProps extends PropsFromRedux {
  navigation: any
  route: any
}

class DayView extends Component<DayViewProps, DayViewState>  {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: DayViewProps) {
    super(props);
    this.state = {
      selectedDate: (props.route.params && props.route.params.date) ? new Date(props.route.params.date) : new Date(),
      selectedItem: undefined
    };
  }

  componentDidMount() {
    this.refreshItems();
  }

  refreshItems() {
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    this.props.load(StoreConstants.SETTINGSENCRYPTED); /** e.g. customizations to MOVE and CREATE lists */
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
          {!dimensions.isSmallDevice && <Spacer height={sizes[20]} />}
          <DatePickerWithArrows value={this.state.selectedDate} onChange={(event, newDate) => this.selectedDateChanged(event, newDate)} />
          <Spacer height={sizes[5]} />
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
          {/* don't show history button here as it is not needed and now can get to this view from history screen by tapping on calendar day
          <ViewHistoryButton item={this.state.selectedItem} itemConfig={this.state.selectedItem ? widgetFactory[this.state.selectedItem.type].config : undefined} navigation={this.props.navigation} /> */}
        </FloatingToolbar>
      </ScreenBackground>
    );
  }

  selectedDateChanged(event: any, newDate: Date | undefined) {
    if (!newDate)
      return;
    /** since data in storage is keyed by month, we need to re-load it when selected month changes */
    const selectedMonth = getStorageKeyFromDate(newDate);
    const previousMonth = getStorageKeyFromDate(this.state.selectedDate);
    if (selectedMonth !== previousMonth)
      this.props.load(selectedMonth);
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
        consoleLogWithColor(error);
      });
  }
}

export default connector(DayView);