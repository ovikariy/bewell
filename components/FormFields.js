import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Input, Button, Icon, Badge } from 'react-native-elements';
import { styles, Fonts, Colors, Size } from '../assets/styles/style';
import DatePicker from 'react-native-datepicker';
import { View } from 'react-native-animatable';

export class ParagraphText extends React.Component {
  render() {
    return <Text style={[this.props.style, styles.text]} {...this.props} />;
  }
};

export class TextArea extends React.Component {
  render() {
    return (
      <Input {...this.props}
        multiline={true}
        numberOfLines={3}
        textAlignVertical='top'
        inputStyle={styles.textArea}
        placeholderTextColor={Colors.placeholderText}
        inputContainerStyle={styles.textAreaContainer}
      />
    )
  }
};

export class StyledDatePicker extends React.Component {
  render() {
    return (
      <DatePicker
        {...this.props}
        showIcon={false}
        is24Hour={false}
        placeholder='date and time'
        confirmBtnText='Confirm'
        cancelBtnText='Cancel'
        customStyles={{
          dateText: {
            color: (this.props.disabled) ? Colors.disabledColor : Colors.tintColor,
            fontSize: Fonts.defaultTextSize
          },
          dateInput: {
            borderWidth: 0,
            borderBottomWidth: 1,
            // ...this.props.customStyles.dateInput  //TODO: need to assign only if dataInput not null
          },
          disabled: {
            backgroundColor: '#eeeeee00',
            // ...this.props.customStyles.disabled //TODO: need to assign only if disabled not null
          },
          ...this.props.customStyles
        }}
      />
    )
  }
}

export class FormTimePicker extends React.Component {
  render() {
    return (
      <View style={styles.formItem}>
        <StyledDatePicker
          {...this.props}
          format='LT' /* Local Time (format support by moment.js) */  /* maybe allow settings overwrite */
          mode='time'
        />
      </View>
    )
  }
};

export class RoundIconButton extends React.Component {
  render() {
    return (
      <Button
        {...this.props}
        disabled={this.props.disabled ? this.props.disabled : (this.props.canSave ? false : true)}
        type='clear'
        reverseColor={true}
        buttonStyle={{ margin: 0, padding: 0 }}
        raised
        icon={<Icon
          name={this.props.name}
          size={this.props.size ? this.props.size : 20}
          color={this.props.color ? this.props.color : (this.props.canSave ? Colors.primaryButton : Colors.tintColor)}
          reverse
        />}
      />
    )
  }
};

export const WidgetHeader = (props) => {
  return (
    <View style={[styles.widgetTitleContainer]}>
      <TouchableOpacity onPress={() => props.onPress ? props.onPress() : undefined}>
        <ParagraphText style={[styles.widgetTitle]}>{props.title}</ParagraphText>
      </TouchableOpacity>
      {props.subTitle ? 
        <ParagraphText style={[styles.widgetSubTitle]}>{props.subTitle}</ParagraphText> : <View />}      
      {props.showWidgetButtons ?
        <WidgetButtons /> : <View />}
      {props.children}
    </View>
  )
};

export const WidgetButtons = (props) => {
  return (
    /* add zIndex to the button container otherwise buttons won't be clickable */
    <View style={styles.widgetButtonContainer}>
      <Button onPress={() => { props.onAddPress ? props.onAddPress() : {} }}
        type='clear'
        icon={<Icon name='add' size={30} color={Colors.tintColor} />}
        containerStyle={[{ flexDirection: 'row' }, props.canAddNewItem === true ? {} : { display: 'none' }]}
      />
      {/* <Badge value='2 / 3' containerStyle={{ marginTop: -9 }}
        badgeStyle={{ backgroundColor: 'transparent', padding: 7, paddingTop: 7, paddingBottom: 7 }} /> */}
    </View>
  )
}