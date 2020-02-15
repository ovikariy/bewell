import React from 'react';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { Image } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import WidgetList from '../components/WidgetList';
import { WellKnownStoreKeys, stateConstants, text } from '../modules/Constants';
import { load, persistRedux, updateRedux, removeFromRedux } from '../redux/mainActionCreators';
import { DatePickerWithArrows } from '../components/MiscComponents';
import { FloatingToolbar, DeleteItemButton, ToolbarButton, ViewHistoryButton } from '../components/ToolbarComponents';
import { getHashtagsFromText, getStorageKeyFromDate } from '../modules/helpers';

const mapStateToProps = state => { 
  return { [stateConstants.OPERATION]: state[stateConstants.OPERATION] }; 
}; 

const mapDispatchToProps = dispatch => ({
  load: (key) => dispatch(load(key)),
  updateRedux: (key, items) => dispatch(updateRedux(key, items)), 
  remove: (key, id) => dispatch(removeFromRedux(key, id)),
  persistRedux: (state) => dispatch(persistRedux(state))
});  

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      selectedItem: null
    }
    //this.props.navigation.navigate('ItemHistory', { 'itemType': ItemTypes.SLEEP });
  }

  componentDidMount() {
    this.refreshItems();

    console.log('++++++++ HomeScreen mounted');
    //subscribe to blur event
  }

  componentWillUnmount() {
    //unsubscribe to blur event
    console.log('++++++++ HomeScreen unmounted');
  }

  refreshItems() {
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    this.props.load(selectedMonth);
    this.props.load(WellKnownStoreKeys.TAGS);
    this.setState({ ...this.state, selectedItem: null });
  }

  deleteItem(storeKey, itemId) {
    this.props.remove(storeKey, itemId);
    this.persist();
    this.setState({ ...this.state, selectedItem: null });
  }

  render() {
    //TODO: bug add note with tags, tags get added to redux. navigate to insights and back home, tags are blank in redux
    console.log('\r\n home render tags ' + this.props[stateConstants.OPERATION].store[WellKnownStoreKeys.TAGS]);

    const selectedDateString = new Date(this.state.selectedDate).toLocaleDateString();
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    let data = [];
    if (this.props[stateConstants.OPERATION] && this.props[stateConstants.OPERATION].store)
      data = (this.props[stateConstants.OPERATION].store[selectedMonth] || []).filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString);
    return ( 
      <ScreenBackground> 
        {/*todo: move refresh */ }
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
          <DeleteItemButton item={this.state.selectedItem} onDelete={(storeKey, itemId) => { this.deleteItem(storeKey, itemId) }} />
          <ViewHistoryButton item={this.state.selectedItem} navigation={this.props.navigation} />
        </FloatingToolbar>
      </ScreenBackground>
    );
  }

  selectedDateChanged(event, newDate) {
    /* TODO: figure out how to persist on screen change also because can navigate to history screen not just change date */
    this.persist();
    this.setState({ ...this.state, selectedDate: new Date(newDate), selectedItem: null });
  } 

  onDataChange(newDailyData) {
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    this.props.updateRedux(selectedMonth, newDailyData);
    this.updateTagsAfterDelay(newDailyData); /* don't update tags right away because can end up with partial word tags */
    this.persistAfterDelay(); 
  }

  onSelected(selectedItem) {
    selectedItem === this.state.selectedItem ?
      this.setState({ ...this.state, selectedItem: null }) :
      this.setState({ ...this.state, selectedItem }); 
  }

  updateTagsAfterDelay = debounce(function (newDailyData) {
    this.updateRecentTags(newDailyData);
  }, 3000); //TODO: remove this and make better

  persistAfterDelay = debounce(function () {
    this.persist();
  }, 6000); //TODO: reduce time maybe

  persist = () => {
    /* update tags here instead of onDataChange otherwise we'll get a separate tag when each letter is typed
    TODO: make this better maybe persist tags only on blur or screen change */
    const state = this.props[stateConstants.OPERATION];
    if (!state.dirtyKeys || !(Object.keys(state.dirtyKeys).length > 0))
      return;
    this.props.persistRedux(state);
  }

  updateRecentTags = (records) => {
    /* if a record has a note field with hashtags in it, save them separately to be recently used */
    const tags = [];
    records.forEach(record => {
      if (!record.note || record.note.indexOf('#') < 0)
        return;

      const tagsFromText = getHashtagsFromText(record.note);
      if (tagsFromText.length <= 0)
        return;

      tagsFromText.forEach(tagFromNote => {
        tags.push({ id: tagFromNote, date: new Date().toISOString() });
      })
    });

    if (tags.length > 0)
      this.props.updateRedux(WellKnownStoreKeys.TAGS, tags);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);



