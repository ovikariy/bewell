import React from 'react';
import {ScrollView, Text, View, StyleSheet } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { connect } from 'react-redux';
import * as ItemTypes from '../constants/ItemTypes';
import { loadItems, postItem } from '../redux/CommonActionCreators';
import moment from 'moment';

import { AreaChart, Grid, XAxis } from 'react-native-svg-charts'
import { Circle, Path } from 'react-native-svg'
 
const mapStateToProps = state => {
  return {
    sleep: state.sleep,
    mood: state.mood,
    gratitude: state.gratitude,
    note: state.note,
    dream: state.dream
  }
}

const mapDispatchToProps = dispatch => ({
  loadItems: (itemType) => dispatch(loadItems(itemType)),
  postItem: (itemTypeName, item) => dispatch(postItem(itemTypeName, item))
});

const numDays = 7;

class ChartScreen extends React.Component {
  static navigationOptions = {
    title: 'Charts'
  };

  getData() {
    const data = [];
    const today = new Date();

    for (var i = 1; i < numDays; i++) {
      const date = moment(today).subtract(i, 'days').toDate().toLocaleDateString();
      const mood = this.props.mood.moods.filter((mood) => new Date(mood.date).toLocaleDateString() == date)[0];
      const sleep = this.props.sleep.sleeps.filter((sleep) => new Date(sleep.date).toLocaleDateString() == date)[0];
      data.push({
        date: date,
        mood: mood ? mood.rating : null,
        sleep: sleep ? sleep.rating : null
      })
    }

    console.log("chart " + JSON.stringify(data));
    return data;
  }

  render() {
    // const data = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80]
    // const data2 = [50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80].reverse();

    const color1 = 'rgb(134, 65, 244)',
      color2 = 'rgba(11, 205, 120)';

    const allData = this.getData();

    const moods = allData.map((item) => item.mood);
    const sleeps = allData.map((item) => item.sleep);

    const MoodDecorator = ({ x, y, data }) => {
      return data.map((value, index) => (
        <Circle
          key={index}
          cx={x(index)}
          cy={y(value)}
          r={4}
          stroke={color1}
          fill={color1}
        />
      ))
    }

    const MoodLine = ({ line }) => (
      <Path
        d={line}
        stroke={color1}
        fill={'none'}
      /> 
    )

    const SleepDecorator = ({ x, y, data }) => {
      return data.map((value, index) => (
        <Circle
          key={index}
          cx={x(index)}
          cy={y(value)}
          r={4}
          stroke={color2}
          fill={color2}
        />
      ))
    }

    const SleepLine = ({ line }) => (
      <Path
        d={line}
        stroke={color2}
        fill={'none'}
      />
    )

    return (

      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true}>
          <AreaChart
            style={{ height: 200 }}
            data={moods}
            svg={{ fill: 'rgba(134, 65, 244, 0.2)' }}
            contentInset={{ top: 20, bottom: 30 }}
          >
            <Grid />
            <MoodLine />
            <MoodDecorator />
            <XAxis
              data={moods.map((item) => item.date)}
              contentInset={{ top: 20, bottom: 20 }}
              svg={{
                fill: 'grey',
                fontSize: 10,
              }}
              numberOfTicks={numDays}

            />
          </AreaChart>
          <AreaChart
            style={StyleSheet.absoluteFill}
            data={sleeps}
            svg={{ fill: 'rgba(11, 205, 120, 0.2)' }}
            contentInset={{ top: 20, bottom: 30 }}
          >
            <Grid />
            <SleepLine />
            <SleepDecorator />
          </AreaChart>
        </ScreenContent>
      </ScreenBackground>
    )
  }

  getFilteredData(date) {
    const selectedDateString = new Date(date).toLocaleDateString();

    const filtered = {};
    filtered[ItemTypes.MOOD] = this.props.mood.moods.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString)[0];
    filtered[ItemTypes.SLEEP] = this.props.sleep.sleeps.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString)[0];
    filtered[ItemTypes.GRATITUDE] = this.props.gratitude.gratitudes.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString)[0];
    filtered[ItemTypes.DREAM] = this.props.dream.dreams.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString)[0];
    filtered[ItemTypes.NOTE] = this.props.note.notes.filter((item) => new Date(item.date).toLocaleDateString() == selectedDateString)[0];

    return filtered;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ChartScreen);



