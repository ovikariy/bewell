import React from 'react';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import WidgetList from '../components/WidgetList';
import { stateConstants, ItemTypes } from '../modules/Constants';
import { load, persistRedux, updateRedux, removeFromRedux } from '../redux/mainActionCreators';
import { DatePickerWithArrows } from '../components/MiscComponents';
import { FloatingToolbar, DeleteWidgetItemButton, ViewHistoryButton } from '../components/ToolbarComponents';
import { getStorageKeyFromDate, consoleColors, consoleLogWithColor } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';
import { deleteImageFromDiskAsync } from '../modules/FileHelpers';

const mapStateToProps = state => {
  return { [stateConstants.STORE]: state[stateConstants.STORE] };
};

const mapDispatchToProps = dispatch => ({
  load: (key) => dispatch(load(key)),
  updateRedux: (key, items) => dispatch(updateRedux(key, items)),
  remove: (key, id) => dispatch(removeFromRedux(key, id)),
  persistRedux: (items, dirtyKeys) => dispatch(persistRedux(items, dirtyKeys))
});

class HomeScreen extends React.Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      selectedItem: null
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
    this.setState({ ...this.state, selectedItem: null });
  }

  deleteItem(storeKey, item) {
    this.props.remove(storeKey, item.id);
    if (item.type === ItemTypes.IMAGE)
      this.afterDeleteCleanupImageFile(item);
    this.persist();
    this.setState({ ...this.state, selectedItem: null });
  }

  render() {
    const selectedDateString = new Date(this.state.selectedDate).toLocaleDateString();
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    let data = [];
    if (this.props[stateConstants.STORE] && this.props[stateConstants.STORE].items)
      data = (this.props[stateConstants.STORE].items[selectedMonth] || []).filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString);
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} >
          <DatePickerWithArrows date={this.state.selectedDate} onChange={(event, newDate) => this.selectedDateChanged(event, newDate)} />
          <WidgetList
            navigation={this.props.navigation}
            dailyData={data}
            selectedDate={this.state.selectedDate}
            selectedItem={this.state.selectedItem}
            onChange={(newDailyData) => { this.onDataChange(newDailyData) }}
            onSelected={(selectedItem) => { this.onSelected(selectedItem) }}
            onPulldownRefresh={() => this.refreshItems()}
          />
        </ScreenContent>
        <FloatingToolbar isVisible={this.state.selectedItem != null}>
          <DeleteWidgetItemButton item={this.state.selectedItem} onDelete={(storeKey, item) => { this.deleteItem(storeKey, item) }} />
          <ViewHistoryButton item={this.state.selectedItem} navigation={this.props.navigation} />
        </FloatingToolbar>
      </ScreenBackground>
    );
  }

  selectedDateChanged(event, newDate) {
    this.setState({ ...this.state, selectedDate: new Date(newDate), selectedItem: null });
  }

  onDataChange(newDailyData) {
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    this.props.updateRedux(selectedMonth, newDailyData);
    this.persistAfterDelay();
    this.setState({ ...this.state, selectedItem: null });
  }

  onSelected(selectedItem) {
    selectedItem === this.state.selectedItem ?
      this.setState({ ...this.state, selectedItem: null }) :
      this.setState({ ...this.state, selectedItem });
  }

  persistAfterDelay = debounce(function () {
    this.persist();
  }, 6000);

  persist = () => {
    const state = this.props[stateConstants.STORE];
    if (!state.dirtyKeys || !(Object.keys(state.dirtyKeys).length > 0))
      return;
    this.props.persistRedux(state.items, state.dirtyKeys);
  }

  afterDeleteCleanupImageFile(item) {
    /* IMAGE widget stores image file in app document directory and needs to be cleaned up after delete */
   if (!item || !item.imageProps || !item.imageProps.filename)
     return;

   deleteImageFromDiskAsync(item.imageProps.filename)
     .then(() => {})
     .catch((error) => {
       console.log(error);
     });
 }

}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);