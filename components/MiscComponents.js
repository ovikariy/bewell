import React from 'react';
import { ActivityIndicator, Platform, Text, ToastAndroid, View, TouchableOpacity, FlatList, TouchableHighlight } from 'react-native';
import DatePicker from 'react-native-datepicker';
import { Button, Icon, Input } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { text } from '../modules/Constants';
import { addSubtractDays, friendlyDate } from '../modules/helpers';

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

export const ClearTextArea = (props) => {
  /* no background no borders */
  return (
    <Input
      multiline={true}
      numberOfLines={3}
      textAlignVertical='top'
      autoFocus={props.value ? false : true}
      inputStyle={[styles.bodyText, styles.clearTextArea]}
      placeholderTextColor={styles.placeholderText.color}
      inputContainerStyle={styles.clearTextAreaContainer}
      {...props}
    />
  )
};

export const PasswordInput = (props) => {
  return <Input
    {...props}
    leftIcon={{ name: props.leftIconName ? props.leftIconName : 'lock', color: styles.iconPrimary.color }}
    containerStyle={{ marginTop: 30, paddingLeft: 0 }}
    inputStyle={styles.bodyText}
    leftIconContainerStyle={{ marginLeft: 0, marginRight: 10 }}
    placeholderTextColor={styles.placeholderText}
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
        placeholder={props.placeholder || text.general.pickTime}
      />
    </View>
  )
};

export const IconForButton = (props) => {
  return <Icon iconStyle={[styles.iconPrimarySmall, props.iconStyle]} {...props} />
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
        onDateChange={(formattedDateString, newDate) => { if (props.onChange) props.onChange(newDate); }}
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
    <TouchableOpacity style={[styles.buttonSecondary, props.containerStyle]} {...props} >
      {props.iconName ? <IconForButton name={props.iconName} type={props.iconType} iconStyle={[props.iconStyle || styles.iconPrimary]} /> : <View></View>}
      {props.text ? <Text style={[props.titleStyle || styles.toolbarButtonText]}>{props.text}</Text> : <View></View>}
    </TouchableOpacity>
    // <Button buttonStyle={styles.buttonSecondary}
    //   icon={<IconForButton name={props.iconName} type={props.iconType} iconStyle={[props.iconStyle || styles.iconPrimary]} />}
    //   {...props} />
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

export const EmptyList = () => {
  return (
    <View style={[styles.centered, styles.flex, { marginTop: 40 }]} >
      <Text style={styles.subTitleText}>{text.listItems.EmptyList}</Text>
    </View>
  )
}

export const List = (props) => {
  return (
    <FlatList
      data={props.data}
      renderItem={(item, index) => renderItem(item, index)}
      keyExtractor={item => item.id}
    />
  );

  function renderItem({ item, index }) {
    return (
      <TouchableHighlight key={item.id}
        style={[styles.dimBackground, styles.listItemContainer]}
        onPress={item.onPress ? item.onPress : null} >
        <View style={[styles.row, styles.flex, { alignItems: 'center' }]}>
          <IconForButton name={item.iconName} type='font-awesome' iconStyle={[styles.iconSecondary, styles.listItemLeftIcon]} />
          <View>
            <Text style={[styles.heading2]}>{item.title}</Text>
            {item.subTitle ? <Text style={[styles.subHeading, styles.flex]}>{item.subTitle}</Text> : <View />}
          </View>
          {item.itemCount ? <View style={[styles.flex, { alignItems: 'flex-end', marginRight: 15 }]}><Text style={[styles.subHeading]}>{item.itemCount}</Text></View> : <View style={styles.flex} />}
          {item.onPress ? <IconForButton iconStyle={styles.iconPrimarySmall} name='chevron-right' type='font-awesome' /> : <View />}
        </View>
      </TouchableHighlight>
    );
  };
}

