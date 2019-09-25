import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Icon, Button } from 'react-native-elements';
import { styles, Colors } from '../assets/styles/style';
import { ScreenBackground } from '../components/ScreenComponents';
import WidgetList from '../components/WidgetList';
import { widgetConfig } from '../constants/Lists';
import { ItemTypes } from '../constants/Constants';
import { loadItems, postItems } from '../redux/CommonActionCreators';
import { RoundIconButton, StyledDatePicker } from '../components/FormFields';
import { Alert, ToastAndroid, View, KeyboardAvoidingView } from 'react-native';

const mapStateToProps = state => {
  const props = {};
  Object.keys(ItemTypes).map((itemType) =>
    props[itemType] = state[itemType]
  );
  return props;
}

const mapDispatchToProps = dispatch => ({
  loadItems: (itemType) => dispatch(loadItems(itemType)),
  postItems: (itemTypeName, item) => dispatch(postItems(itemTypeName, item)),
});

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
              format='ddd, M D Y'
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

    console.log('r\n\ All props ' + JSON.stringify(this.props));
    const filtered = {};
    Object.keys(ItemTypes).map((itemType) =>
      filtered[itemType] = this.props[itemType].items.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString)
    );

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



