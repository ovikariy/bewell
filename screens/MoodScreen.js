import React, { Component } from 'react';
import { View, Text, ScrollView, ToastAndroid } from 'react-native';
import { Icon, Input, Button } from 'react-native-elements';
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
    mood: state.mood
  }
}

const mapDispatchToProps = dispatch => ({
  postMood: (mood) => dispatch(postItem(ItemTypes.MOOD, mood))
});

class MoodScreen extends Component {
  static navigationOptions = {
    title: 'Record Mood',
    ...HeaderOptions
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedMoodIndex: -1,
      note: ''
    }
  }

  updateMoodIndex(selectedMoodIndex) {
    this.setState({ selectedMoodIndex })
  }

  recordMood() {

    if (!Number.isInteger(this.state.selectedMoodIndex))
      throw new Error('Rating must be numeric');

    const date = new Date();
    const newMood = {
      id: date.getTime(), /* use ticks for ID */
      rating: this.state.selectedMoodIndex,
      note: this.state.note,
      date: date.toISOString()
    }

    this.props.postMood(newMood);
    this.setState({ selectedMoodIndex: -1, note: '' });
    ToastAndroid.show('Mood saved!', ToastAndroid.LONG);
    this.props.navigation.navigate('MoodHistory');
  }

  render() {
    /* button group expects buttons as an array of functions that return a component object */
    const buttons = moodRatingIcons.map((item, index) => {
      return ({
        element: () =>
          <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
            <Icon name={item.icon} raised size={40} type='font-awesome' color={item.color}
              reverse={this.state.selectedMoodIndex === index ? true : false} />
            <Text>{item.name}</Text>
          </View>
      })
    });

    return (
      <ScreenContainer imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScrollView style={styles.screenBody}>
          <Animatable.View animation="fadeIn" duration={500} style={{ marginTop: 40, marginBottom: 20 }}>
            <CustomIconRating buttons={buttons}
              containerStyle={{ height: 150, borderWidth: 0 }}
              onPress={(selectedMoodIndex) => { this.updateMoodIndex(selectedMoodIndex) }} />
          </Animatable.View>
          <View style={{ marginTop: 20 }}>
            <Input multiline={true}
              placeholder=' (Optional) add a note...'
              onChangeText={(note) => this.setState({ note })}
              value={this.state.note}
            />
          </View>
          <ScreenActions itemName='Mood' navigation={this.props.navigation}
            canSave={this.state.selectedMoodIndex < 0 ? false : true}
            onPressSave={() => { this.recordMood() }}
          ></ScreenActions>
        </ScrollView>
      </ScreenContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoodScreen);


