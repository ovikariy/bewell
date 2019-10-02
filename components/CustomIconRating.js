import React, { Component } from 'react';
import { View } from 'react-native';
import { ButtonGroup, Text } from 'react-native-elements';
import MorningAppIconFont from './CustomIconFont.js'
import { styles } from '../assets/styles/style';

export const CustomIconRating = (props) => {
  return (
    <ButtonGroup
      {...props}
      onPress={(selectedIndex) => { props.onPress(selectedIndex) }}
      containerStyle={styles.ratingButtonGroupContainer}
      innerBorderStyle={{ width: 0 }}
    />
  )
}

export const CustomIconRatingItem = (props) => {
  return (
    <View style={styles.ratingContainer, styles.centered}>
      <View style={[styles.ratingOutlineContainer, props.selected ? styles.ratingOutlineContainerSelected: '' ]} >
        <View style={[styles.ratingIconContainer, props.value.backgroundStyle]}>
            <MorningAppIconFont name={props.value.icon} style={[styles.ratingIconStyle, props.value.iconStyle]} />
        </View>
      </View>
      <Text style={[styles.bodyText, styles.centered]}>{props.value.name}</Text>
    </View>
  )
}