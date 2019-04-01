import React, { Component } from 'react';
import { View, ToastAndroid, FlatList, ScrollView } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import * as ItemTypes from '../constants/ItemTypes';
import { loadItems, postItems } from '../redux/CommonActionCreators';
import { ScreenActions } from '../components/ScreenActions';
import { ScreenContainer } from '../components/ScreenContainer';
import { HeaderOptions } from '../constants/Constants';
import { styles } from '../assets/styles/style';

const mapStateToProps = state => {
  return {
    gratitude: state.gratitude
  }
}

const mapDispatchToProps = dispatch => ({
  loadGratitudes: () => dispatch(loadItems(ItemTypes.GRATITUDE)),
  postGratitudes: (gratitudes) => dispatch(postItems(ItemTypes.GRATITUDE, gratitudes))
});

class GratitudeScreen extends Component {
  static navigationOptions = {
    title: 'Today I\'m grateful for...',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
    this.state = {
      gratitudes: this.getBlankGratitudeList()
    }
  }

  componentDidMount() {
    this.props.loadGratitudes();
  }

  getBlankGratitudeList() {
    return ['', '', '']; /* start with 3 blank fields by default */
  }

  handleGratitudeChanged(value, index) {
    let gratitudes = this.state.gratitudes ? this.state.gratitudes : [];
    if (gratitudes.length < index)
      gratitudes.push(value);
    else
      gratitudes[index] = value;
    this.setState({ gratitudes: gratitudes });
    console.log('----------------gratitue ' + JSON.stringify(this.state.gratitudes));
  }

  saveGratitudes() {
    const nonEmptyGratitudes = [];
    const date = new Date();

    for (var index in this.state.gratitudes) {
      if ((this.state.gratitudes[index] + '').trim() == '')
        continue; /* don't send blanks */
      const newItem = {
        id: date.getTime() + (index > 0 ? '_' + index : ''), /* use ticks for ID plus index if more than one */
        note: this.state.gratitudes[index],
        date: date.toISOString()
      }
      nonEmptyGratitudes.push(newItem);
    }

    if (nonEmptyGratitudes.length == 0) {
      ToastAndroid.show('Nothing to save', ToastAndroid.LONG);
      return;
    }

    this.props.postGratitudes(nonEmptyGratitudes);
    this.setState({ gratitudes: this.getBlankGratitudeList() });
    ToastAndroid.show('Gratitudes saved!', ToastAndroid.LONG);
    this.props.navigation.navigate('GratitudeHistory');
  }

  addGratitudeItem() {
    this.setState({ gratitudes: this.state.gratitudes.concat([{}]) })
  }

  render() {
    const renderGratitudeItem = ({ item, index }) => {
      return (
        <View style={{ marginTop: 20 }} key={index}>
          <Input label={index + 1 + '.'}
            placeholder="I'm grateful for..."
            onChangeText={(value) => this.handleGratitudeChanged(value, index)}
          />
        </View>
      );
    }

    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScrollView style={styles.screenBody}>
          <FlatList style={{ marginTop: 40, marginBottom: 20 }}
            data={this.state.gratitudes}
            renderItem={renderGratitudeItem}
            keyExtractor={(item, index) => index + ''} /* keyExtractor expects a string */
          />
          <View style={{ marginTop: 20, alignItems: 'flex-start' }}>
            <Button type='clear' title='Add another item'
              icon={{ name: 'plus-circle-outline', type: 'material-community', size: 40 }}
              onPress={() => { this.addGratitudeItem() }}
            />
          </View>
          <ScreenActions itemName='Gratitude' navigation={this.props.navigation}
            canSave={true} /**TODO: add a check here */
            onPressSave={() => { this.saveGratitudes() }}
          ></ScreenActions>
        </ScrollView>
      </ScreenContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GratitudeScreen);