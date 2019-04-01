import React, { Component } from 'react';
import { View, Text, ScrollView, ToastAndroid } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { connect } from 'react-redux';
import * as ItemTypes from '../constants/ItemTypes';
import { postItem } from '../redux/CommonActionCreators';
import * as Animatable from 'react-native-animatable';
import CustomIconRating from '../components/CustomIconRating';
import { moodRatingIcons } from '../constants/Lists';
import { ScreenActions } from '../components/ScreenActions';
import { ScreenContainer } from '../components/ScreenContainer';
import { HeaderOptions } from '../constants/Constants';

const mapStateToProps = state => {
  return {
    sleep: state.sleep
  }
}

const mapDispatchToProps = dispatch => ({
  postSleep: (sleep) => dispatch(postItem(ItemTypes.SLEEP, sleep))
});

class SleepScreen extends Component {
  static navigationOptions = {
    title: 'Record Sleep',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSleepIndex: -1,
      note: ''
    }
  }

  updateSleepIndex(selectedSleepIndex) {
    this.setState({ selectedSleepIndex: selectedSleepIndex })
  }

  recordSleep() {

    if (!Number.isInteger(this.state.selectedSleepIndex))
      throw new Error('Rating must be numeric');

    const date = new Date();
    const newSleep = {
      id: date.getTime(), /* use ticks for ID */
      rating: this.state.selectedSleepIndex,
      note: this.state.note,
      date: date.toISOString()
    }

    this.props.postSleep(newSleep);
    this.setState({ selectedSleepIndex: -1, note: '' });
    ToastAndroid.show('Sleep record saved!', ToastAndroid.LONG);
    this.props.navigation.navigate('SleepHistory');
  }

  render() {
    /* button group expects buttons as an array of functions that return a component object */
    /* TODO: custom sleep icons */
    const buttons = moodRatingIcons.map((item, index) => {
      return ({
        element: () =>
          <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
            <Icon name={item.icon} raised size={40} type='font-awesome' color={item.color}
              reverse={this.state.selectedSleepIndex === index ? true : false} />
            <Text>{item.name}</Text>
          </View>
      })
    });

    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScrollView style={styles.screenBody}>
          <View style={{ marginTop: 40, marginBottom: 20 }}>
            <Text style={styles.h1}>How was your sleep?</Text>
          </View>
          <Animatable.View animation="fadeIn" duration={500}>
            <CustomIconRating buttons={buttons}
              containerStyle={{ height: 150, borderWidth: 0 }}
              onPress={(selectedSleepIndex) => { this.updateSleepIndex(selectedSleepIndex) }} />
          </Animatable.View>
          {/* TODO: add time went to bed and woke up */}
          <View style={{ marginTop: 20 }}>
            <Input
              placeholder=' (Optional) add a note...'
              onChangeText={(note) => this.setState({ note })}
              value={this.state.note}
            />
          </View>
          <ScreenActions itemName='Sleep' navigation={this.props.navigation}
            canSave={this.state.selectedSleepIndex < 0 ? false : true}
            onPressSave={() => { this.recordSleep() }}
          ></ScreenActions>
        </ScrollView>
      </ScreenContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SleepScreen);


