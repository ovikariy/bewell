import React from 'react';
import DatePicker from 'react-native-datepicker';
import { text } from '../modules/Constants';
import MorningAppIconFont from './CustomIconFont.js'
import { addSubtractDays, friendlyDate } from '../modules/helpers';
import { Input, Button, Icon } from 'react-native-elements';
import { styles, fonts, colors } from '../assets/styles/style';
import { Text, ActivityIndicator, View, Platform, ToastAndroid } from 'react-native';

export const Heading1 = (props) => {
  return <Text {...props} style={[styles.heading, styles.centered, props.style]} />;
};

export const Spacer = (props) => {
  return <View style={[
    props.width ? { width: props.width } : {},
    props.height ? { height: props.height } : {}
  ]} />;
};

export const ParagraphText = (props) => {
  return <Text {...props} style={[styles.bodyText, props.style]} />;
};

export const Toast = {
  show(message, duration) {
    Platform.OS === 'ios' ? alert(message) : ToastAndroid.show(message, duration || ToastAndroid.LONG);
  }
};

export const TextArea = (props) => {
  return (
    <TextInput
      multiline={true}
      numberOfLines={3}
      textAlignVertical='top'
      inputStyle={[styles.bodyText, styles.textArea]}
      {...props}
    />
  )
};

export const TextInput = (props) => {
  return (
    <Input
      inputStyle={[styles.textInput]}
      placeholderTextColor={colors.placeholderText}
      inputContainerStyle={styles.textAreaContainer}
      {...props}
    />
  )
};

export const PasswordInput = (props) => {
  return <Input
    {...props}
    leftIcon={{ name: props.leftIconName ? props.leftIconName : 'lock', color: colors.bright }}
    containerStyle={{ marginTop: 30, paddingLeft: 0 }}
    inputStyle={styles.bodyText}
    leftIconContainerStyle={{ marginLeft: 0, marginRight: 10 }}
    placeholderTextColor={colors.placeholderText}
    autoCompleteType='off'
    autoCorrect={false}
    secureTextEntry={true}
  />
};

export const StyledDatePicker = (props) => {
  return (
    <DatePicker
      showIcon={false}
      is24Hour={false}
      placeholder={text.general.dateAndTime}
      confirmBtnText={text.general.Confirm}
      cancelBtnText={text.general.Cancel}
      customStyles={{
        dateText: styles.bodyText,
        dateInput: styles.formField,
      }}
      {...props}
    />
  )
}

export const TimePicker = (props) => {
  return (
    <View style={styles.formItem}>
      <StyledDatePicker
        {...props}
        format='LT' /* Local Time (format support by moment.js) */  /* maybe allow settings overwrite */
        mode='time'
        placeholder={text.general.pickTime}
      />
    </View>
  )
};

export const IconForButton = (props) => {
  return <Icon iconStyle={styles.iconPrimarySmall} {...props} />
}

export const DatePickerWithArrows = (props) => {

  function changeDays(numDays) {
    if (props.onChange)
      props.onChange(addSubtractDays(props.date, numDays));
  }

  return (
    <View style={styles.selectedDateContainer}>
      <Button onPress={() => { changeDays(-1) }}
        type='clear'
        icon={<IconForButton name='chevron-left' iconStyle={styles.iconSecondary} />}
      />
      <StyledDatePicker
        date={new Date(props.date)}
        format='ddd, MMM D Y'
        style={{ width: 160 }}
        onDateChange={(newDate) => { if (props.onChange) props.onChange(newDate); }}
        getDateStr={(date) => { return friendlyDate(date, { showLongFormat: true }) }}

      />
      <Button onPress={() => { changeDays(1) }}
        type='clear'
        icon={<IconForButton name='chevron-right' iconStyle={styles.iconSecondary} />}
      />
    </View>
  );
};

export const ButtonPrimary = (props) => {
  return (
    <Button buttonStyle={styles.buttonPrimary}
      icon={<IconForButton name={props.name} />}
      {...props} />
  )
};

export const IconButton = (props) => {
  return (
    <Button buttonStyle={styles.buttonSecondary}
      icon={<IconForButton name={props.iconName} type={props.iconType} iconStyle={styles.iconPrimary} />}
      {...props} />
  )
};

export function showMessages(operation) {
  if (operation.errMess)
    Toast.show(operation.errMess);
  if (operation.successMess)
    Toast.show(operation.successMess);
}

/* TODO: make a global loading component; maybe part of ScreenBackground or ScreenContent on the bottom like a Toast */
export const Loading = () => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator style={{ paddingTop: 20, paddingBottom: 20 }} size='large' />
      <Text style={styles.bodyText}>{text.general.Loading}</Text>
    </View>
  );
};