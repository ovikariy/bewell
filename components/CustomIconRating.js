import React, { Component } from 'react';
import { View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import CustomIcon from './CustomIconFont.js'
import { styles, Colors } from '../assets/styles/style';

export const CustomIconRating = (props) => {
  return (
    <ButtonGroup
      {...props}
      onPress={(selectedIndex) => { props.onPress(selectedIndex) }}
      containerStyle={{ height: 80, borderWidth: 0, backgroundColor: 'transparent' }}
      innerBorderStyle={{ width: 0 }}
    />
  )
}

export const CustomIconRatingItem = (props) => {
  return (
    <View style={{
      borderRadius: 50, borderWidth: 3, borderStyle: 'dotted', padding: 2,
      borderColor: props.selected ? '#ffffff' : 'transparent'
    }} >
      <View style={[styles.ratingIconContainer, {
        backgroundColor: props.value.color,
      }]}>
        {/* <Icon name={item.icon} size={50} type='font-awesome' color={this.props.value && this.props.value.rating === index ? item.color : Colors.tintColor} /> */}
        <CustomIcon name={props.value.icon} size={40} color={'#ffffff'} />
      </View>
    </View>

  )
}