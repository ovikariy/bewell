import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { Text, Button } from 'react-native-elements';
import MorningAppIconFont from './CustomIconFont';
import { AppContext } from '../modules/AppContext';

export const CustomIconRating = (props: { children: ReactNode }) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <View style={styles.ratingButtonGroupContainer}>
      {props.children}
    </View>
  );
};

export interface CustomIconType {
  name: string,
  icon: string,
  iconStyle?: ViewStyle,
  backgroundStyle?: ViewStyle
}

interface CustomIconRatingItemType {
  id: number,
  value: CustomIconType,
  selected?: boolean,
  textColor?: string,
  onPress?: ((id: number) => void)
}

export const CustomIconRatingItem = (props: CustomIconRatingItemType) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  const icon = props.onPress ? /* sometimes we don't want the icon clickable e.g. ItemHistory */
    <Button type='clear' containerStyle={[styles.ratingIconContainer, props.value.backgroundStyle]}
      onPress={() => props.onPress ? props.onPress(props.id) : {}} icon={
        <MorningAppIconFont name={props.value.icon} style={[styles.ratingIconStyle, props.value.iconStyle]} />} />
    :
    <View style={[styles.ratingIconContainer, props.value.backgroundStyle]}>
      <MorningAppIconFont name={props.value.icon} style={[styles.ratingIconStyle, props.value.iconStyle]} />
    </View>;

  return (
    <View style={[styles.flex, styles.centered]}>
      <View style={[styles.ratingOutlineContainer, props.selected ? styles.ratingOutlineContainerSelected : '']} >
        {icon}
      </View>
      <Text style={[styles.bodyText, styles.centered, props.textColor ? { color: props.textColor } : '']}>{props.value.name}</Text>
    </View>
  );
};