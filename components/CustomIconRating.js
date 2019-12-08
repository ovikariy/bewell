import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-elements';
import MorningAppIconFont from './CustomIconFont.js'
import { styles } from '../assets/styles/style';

export const CustomIconRating = (props) => {
  return (
    <View style={styles.ratingButtonGroupContainer}>
      {props.children}
    </View>
  )
}

export const CustomIconRatingItem = (props) => {

  const icon = props.onPress ? /* sometimes we don't want the icon clickable e.g. ItemHistory */
    <Button type='clear' containerStyle={[styles.ratingIconContainer, props.value.backgroundStyle]}
      onPress={() => props.onPress ? props.onPress(props.id) : {}} icon={
      <MorningAppIconFont name={props.value.icon} style={[styles.ratingIconStyle, props.value.iconStyle]} />}/>
    :
    <View style={[styles.ratingIconContainer, props.value.backgroundStyle]}>
      <MorningAppIconFont name={props.value.icon} style={[styles.ratingIconStyle, props.value.iconStyle]} />
    </View>;

  return (
    <View style={[styles.ratingContainer, styles.centered]}>
      <View style={[styles.ratingOutlineContainer, props.selected ? styles.ratingOutlineContainerSelected : '']} >
        {icon}
      </View>
      <Text style={[styles.bodyText, styles.centered]}>{props.value.name}</Text>
    </View>
  )
}