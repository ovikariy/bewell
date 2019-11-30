import React from 'react';
import { debounce } from 'lodash';
import { connect } from 'react-redux';
import { Icon, Button, Text, Image } from 'react-native-elements';
import { styles, colors } from '../assets/styles/style';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import WidgetList from '../components/WidgetList';
import { WellKnownStoreKeys, storeConstants, stateConstants, text } from '../modules/Constants';
import { load, persistRedux, updateRedux, replaceRedux } from '../redux/mainActionCreators';
import { DatePickerWithArrows } from '../components/MiscComponents';
import { getHashtagsFromText, getStorageKeyFromDate } from '../modules/helpers';

const mapStateToProps = state => {
  return { [stateConstants.OPERATION]: state[stateConstants.OPERATION] };
};

const mapDispatchToProps = dispatch => ({
  load: (key) => dispatch(load(key)),
  updateRedux: (key, items) => dispatch(updateRedux(key, items)),
  replaceRedux: (key, items) => dispatch(replaceRedux(key, items)),
  persistRedux: (state) => dispatch(persistRedux(state))
});

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: text.homeScreen.title,
    headerRight:
      <Image
        source={require('../assets/images/logo_small.png')}
        style={styles.logoImageSmall}
        containerStyle={{ paddingRight: 10 }}
      />
  })

  constructor(props) {
    super(props);

    this.state = {
      selectedDate: new Date()
    }
  }

  componentDidMount() {
    this.refreshItems();
  }

  refreshItems() {
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    this.props.load(selectedMonth);
    this.props.load(WellKnownStoreKeys.TAGS);
  }

  render() {
    const selectedDateString = new Date(this.state.selectedDate).toLocaleDateString();
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    let data = []; //
    if (this.props[stateConstants.OPERATION] && this.props[stateConstants.OPERATION].store)
      data = (this.props[stateConstants.OPERATION].store[selectedMonth] || []).filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString);
    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} onPulldownRefresh={() => this.refreshItems()}>
          <DatePickerWithArrows date={this.state.selectedDate} onChange={(newDate) => this.selectedDateChanged(newDate)} />
          <WidgetList
            navigation={this.props.navigation}
            dailyData={data}
            selectedDate={this.state.selectedDate}
            onChange={(newDailyData) => { this.onDataChange(newDailyData) }} />
        </ScreenContent>
      </ScreenBackground>
    );
  }

  selectedDateChanged(newDate) {
    this.persist();
    this.selectedDateChangeConfirmed(newDate);
  }

  selectedDateChangeConfirmed(newDate) {
    this.setState({ ...this.state, selectedDate: new Date(newDate) });
  }

  onDataChange(newDailyData) {
    const selectedMonth = getStorageKeyFromDate(this.state.selectedDate);
    this.props.updateRedux(selectedMonth, newDailyData);
    this.persistAfterDelay(newDailyData);
    this.props.navigation.setParams({ canSave: true });
  }

  persistAfterDelay = debounce(function (newDailyData) {
    this.persist(newDailyData);
  }, 3000);

  persist = (newDailyData) => {
    /* update tags here instead of onDataChange otherwise we'll get a separate tag when each letter is typed */
    if (newDailyData)
      this.updateRecentTags(newDailyData);
    if (!this.props[stateConstants.OPERATION].dirtyKeys)
      return;
    this.props.persistRedux(this.props[stateConstants.OPERATION]);
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



