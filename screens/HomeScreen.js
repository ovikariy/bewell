import React from 'react';
import { Alert, ToastAndroid, View, KeyboardAvoidingView } from 'react-native';
import { Icon, Button } from 'react-native-elements';
import { styles, Colors } from '../assets/styles/style';
import { ScreenBackground } from '../components/ScreenComponents';
import { widgetConfig } from '../constants/Lists';
import { connect } from 'react-redux';
import { ItemTypes } from '../constants/Constants';
import { loadItems, postItems, logStorageData } from '../redux/CommonActionCreators';
import { RoundIconButton, StyledDatePicker } from '../components/FormFields';
import WidgetList from '../components/WidgetList';
import moment from 'moment';

import { AES, enc } from 'crypto-js';
import * as SecureStore from 'expo-secure-store';

const mapStateToProps = state => {
  return {
    sleep: state.sleep,
    mood: state.mood,
    gratitude: state.gratitude,
    note: state.note,
    dream: state.dream,
    componentState: state.componentState
  }
} 

const mapDispatchToProps = dispatch => ({
  loadItems: (itemType) => dispatch(loadItems(itemType)),
  postItems: (itemTypeName, item) => dispatch(postItems(itemTypeName, item)),
  logStorageData: () => dispatch(logStorageData()) //TODO: this is for debug
});

export const getFromSecureStore = (key, options) =>
  SecureStore.getItemAsync(key, options);

export const saveToSecureStore = (key, value, options) =>
  SecureStore.setItemAsync(key, value, options);

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight:
      <RoundIconButton
        name='check'
        size={15}
        containerStyle={[
          { paddingTop: 6, paddingRight: 6 },
          navigation.getParam('canSave') === true ? {} : { display: 'none' }
        ]}
        canSave={navigation.getParam('canSave') === true}
        onPress={navigation.getParam('save')}
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
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={40} enabled>
        <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
          <View style={styles.selectedDateContainer}>
            <Button onPress={() => { this.subtractDay() }}
              type='clear'
              icon={
                <Icon
                  name='chevron-left'
                  size={30}
                  color={Colors.tintColor}
                />}
            />
            <StyledDatePicker
              date={new Date(this.state.selectedDate)}
              format='ddd, MMM D Y'
              style={{ width: 180, borderBottomWidth: 0, paddingTop: 3 }}
              customStyles={{
                dateInput: {
                  borderWidth: 0
                },
                dateText: {
                  fontSize: 20,
                  color: Colors.tintColor /* TODO: see how to concat these with existing styles */
                }
              }}
              onDateChange={(newDate) => { this.selectedDateChanged(newDate) }} />
            <Button onPress={() => { this.addDay() }}
              type='clear'
              icon={
                <Icon
                  name='chevron-right'
                  size={30}
                  color={Colors.tintColor}
                />}
            />
          </View>
          <WidgetList
            navigation={this.props.navigation}
            dailyData={this.state.dailyData}
            selectedDate={this.state.selectedDate}
            onChange={(newDailyData) => { this.widgetListChanged(newDailyData) }} />
        </ScreenBackground>
      </KeyboardAvoidingView>
    );
  }

  getFilteredData(date) {
    const selectedDateString = new Date(date).toLocaleDateString();

    const filtered = {};
    filtered[ItemTypes.MOOD] = this.props.mood.items.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString);
    filtered[ItemTypes.SLEEP] = this.props.sleep.items.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString);
    filtered[ItemTypes.GRATITUDE] = this.props.gratitude.items.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString);
    filtered[ItemTypes.DREAM] = this.props.dream.items.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString);
    filtered[ItemTypes.NOTE] = this.props.note.items.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString);

    return filtered; 
  }

  selectedDateChanged(newDate) {
    if (this.props.navigation.getParam('canSave') === true) {
      Alert.alert(
        'Save changes?',
        'Would you like to save changes before navigating away?',
        [
          {
            text: 'Don\'t save',
            style: 'cancel',
            onPress: () => {
              this.selectedDateChangeConfirmed(newDate);
            }
          },
          {
            text: 'Save',
            onPress: () => {
              this.save();
              this.selectedDateChangeConfirmed(newDate);
            }
          }
        ],
        { cancelable: false }
      );
    }
    else
      this.selectedDateChangeConfirmed(newDate);

  }

  addDay() {
    this.selectedDateChanged(moment(this.state.selectedDate).add(1, 'days'));
  }

  subtractDay() {
    this.selectedDateChanged(moment(this.state.selectedDate).subtract(1, 'days'));
  }

  selectedDateChangeConfirmed(newDate) {
    this.setState({
      ...this.state,
      selectedDate: new Date(newDate),
      dailyData: this.getFilteredData(newDate)
    });
    this.props.navigation.setParams({ canSave: false });
  }

  widgetListChanged(newDailyData) {
    //this.props.logStorageData();  //TODO: key persist:root is loaded with data that remains unencrypted in AsyncStorage while the app is running?
    this.setState({ ...this.state, dailyData: newDailyData });
    this.props.navigation.setParams({ canSave: true });
  }

  save = () => {
    for (var itemTypeName in widgetConfig) {
      const widgetItems = this.state.dailyData[itemTypeName];
      const nonEmptyItems = widgetItems.filter(item => !this.isEmptyItem(item));
      if (nonEmptyItems.length > 0)
        this.props.postItems(itemTypeName, nonEmptyItems);
    }

    this.props.navigation.setParams({ canSave: false });
    ToastAndroid.show('Saved!', ToastAndroid.LONG);
  }

  isEmptyItem(item) {
    /* if an item only has an id property we don't want to save it because it is an empty item
    added by the plus button on a multi item widget but not updated by the user */
    return (Object.keys(item).filter(key => (key != 'id' && key != 'date')).length === 0)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);



