import React from 'react';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { Icon, Button, Text, Image } from 'react-native-elements';
import { styles, colors } from '../assets/styles/style';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import WidgetList from '../components/WidgetList';
import { ItemTypes, OtherItemTypes, widgetConfig, stateConstants, text } from '../modules/Constants';
import { loadItems, postItems, deleteMultiItems } from '../redux/mainActionCreators';
import { DatePickerWithArrows } from '../components/MiscComponents';
import { getHashtagsFromText } from '../modules/helpers';

/*

TODO: 
* redux get's updated every time a user makes a change but not the DB 
* remove HomeScreen local state, use redux only
* the DB gets updated only when save is executed - after trolled amount of inactivity or when navigating away from homescreen
* DB partitioning by date interval such as a month instead of by item type; better for loading and management

*/
const mapStateToProps = state => {
  return { [stateConstants.OPERATION]: state[stateConstants.OPERATION] };
}

const mapDispatchToProps = dispatch => ({
  loadItems: (itemType) => dispatch(loadItems(itemType)),
  postItems: (itemTypeName, item, options) => dispatch(postItems(itemTypeName, item, options)),
  deleteMultiItems: (itemTypeName, ids) => dispatch(deleteMultiItems(itemTypeName, ids)),
});

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'YOUR WELLBEING',
    headerRight:
      <Image
        source={require('../assets/images/logo_small.png')}
        style={{ width: 30, height: 30 }}
        containerStyle={{ paddingRight: 10 }}
      />
  })

  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date(),
      dailyData: this.getFilteredData(new Date())
    }

    /* navigation options doesn't have access to the insance of HomeScreen 
    so we pass values via navigation.setParams */
    this.props.navigation.setParams({ canSave: false });
    this.props.navigation.setParams({ save: this.save });
  }

  componentDidMount() {
    this.refreshItems();
  }

  refreshItems() {
    for (var itemTypeName in widgetConfig) {
      this.props.loadItems(itemTypeName);
    };
  }

  render() {
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true}>
          <DatePickerWithArrows date={this.state.selectedDate} onChange={(newDate) => this.selectedDateChanged(newDate)} />
          <WidgetList
            navigation={this.props.navigation}
            dailyData={this.state.dailyData}
            selectedDate={this.state.selectedDate}
            onChange={(newDailyData) => { this.onDataChange(newDailyData) }} />
        </ScreenContent>
      </ScreenBackground>
    );
  }

  getFilteredData(date) {
    const selectedDateString = new Date(date).toLocaleDateString();
    const filtered = {};
    Object.keys(ItemTypes).map((itemType) =>
      filtered[itemType] = (this.props[stateConstants.OPERATION].items[itemType] || []).filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString)
    );
    return filtered;
  }

  selectedDateChanged(newDate) {
    if (this.props.navigation.getParam('canSave') === true) {
      this.save();
      this.selectedDateChangeConfirmed(newDate);
    }
    else
      this.selectedDateChangeConfirmed(newDate);
  }

  selectedDateChangeConfirmed(newDate) {
    //this.refreshItems();
    this.setState({
      ...this.state,
      selectedDate: new Date(newDate),
      dailyData: this.getFilteredData(newDate)
    });
    this.props.navigation.setParams({ canSave: false });
  }

  onDataChange(newDailyData) {
    this.setState({ ...this.state, dailyData: newDailyData });
    this.saveAfterDelay();
    this.props.navigation.setParams({ canSave: true });
  }

  saveAfterDelay = debounce(function () {
    this.save();
  }, 2000);

  save = () => {
    for (var itemTypeName in widgetConfig) {
      const widgetItems = this.state.dailyData[itemTypeName];
      //TODO: check if the item is changed and don't post if haven't changed
      const nonEmptyItems = widgetItems.filter(item => !this.isEmptyItem(item));

      if (nonEmptyItems.length > 0) {
        this.props.postItems(itemTypeName, nonEmptyItems, { silent: true });
        this.saveRecentTags(nonEmptyItems);
      }
    }
    this.props.navigation.setParams({ canSave: false });
  }

  saveRecentTags = (records) => {
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
      this.props.postItems(OtherItemTypes.TAGS, tags, { silent: true });
  }

  isEmptyItem(item) {
    /* if an item only has an id property we don't want to save it because it is an empty item
    added by the plus button but not updated by the user */
    return (Object.keys(item).filter(key => (key != 'id' && key != 'date')).length === 0)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);



