import React, { useState } from 'react';
import {
  ActivityIndicator as NativeActivityIndicator, Platform, Text, ToastAndroid, View, ScrollView,
  TouchableOpacity, FlatList, TouchableHighlight, RefreshControl, ShadowPropTypesIOS
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Icon, Input, Divider } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { text } from '../modules/Constants';
import { addSubtractDays, friendlyDate, wait, formatDate } from '../modules/helpers';

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

//route.params?.someParam ?? 'defaultValue';

export const PasswordInput = (props) => {
  return <Input
    {...props}
    leftIcon={{ name: props.leftIconName ?? 'lock', color: styles.iconPrimary.color }}
    containerStyle={[{ marginTop: 30, paddingLeft: 0 }, props.containerStyle]}
    inputContainerStyle={[props.inputContainerStyle]}
    inputStyle={[{ marginLeft: 10 }, styles.bodyText, props.inputStyle]}
    leftIconContainerStyle={{ marginLeft: 0 }}
    placeholderTextColor={styles.placeholderText.color}
    autoCompleteType='off'
    autoCorrect={false}
    secureTextEntry={true}
  />
};

export const PasswordInputWithButton = (props) => {
  return <Input
    {...props}
    inputContainerStyle={[{ borderBottomWidth: 0 }, props.inputContainerStyle]}
    inputStyle={[{ marginLeft: 10 }, styles.bodyTextLarge, styles.textDark, props.inputStyle]}
    containerStyle={[styles.highlightBackground, styles.rounded, props.containerStyle]}
    placeholderTextColor={props.placeholderHighlight ?? styles.placeholderHighlight.color}
    autoCompleteType='off'
    autoCorrect={false}
    secureTextEntry={true}
    rightIcon={<RoundButton name="keyboard-arrow-right" onPress={props.onPress} />}
  />
};

export const RoundButton = (props) => {
  return <Icon {...props}
    onPress={props.onPress}
    iconStyle={[styles.roundedButton, props.iconStyle]}
    containerStyle={[styles.roundedButtonContainer, props.containerStyle]}
  />
}

export const StyledDatePicker = (props) => {
  /* DateTimePicker shows by default when rendered so need to hide and only show e.g. on button press */
  const [show, setShow] = useState(false);

  const showDatepicker = () => {
    setShow(true);
  };

  const onChange = (event, newDate) => {
    setShow(false);
    if (props.onChange) props.onChange(event, newDate);
  };

  const format = props.format ? props.format : 'ddd, MMM D Y';
  const displayText = props.date ? formatDate(props.date, format) : (props.placeholder ? props.placeholder : text.general.dateAndTime);

  return (
    <View style={{ justifyContent: 'center' }}>
      <View>
        <TouchableOpacity onPress={showDatepicker}>
          <Text style={[styles.bodyText, { marginHorizontal: 10 }]}>{displayText}</Text>
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          is24Hour={props.is24Hour ? props.is24Hour : false}
          display="default"
          mode={props.mode ? props.mode : 'datetime'}
          value={props.date ? props.date : new Date()}
          onChange={onChange}
          style={props.style ? props.style : {}}
        />
      )}
    </View>
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
      props.onChange(null, addSubtractDays(props.date, numDays));
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
        onChange={(event, newDate) => { if (props.onChange) props.onChange(event, newDate); }}
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
    <Button buttonStyle={styles.buttonPrimary} titleStyle={[styles.subTitleText, {opacity: 1}]}
      icon={props.name ? <IconForButton name={props.name} iconStyle={props.iconStyle} /> : {}}
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

export const LinkButton = (props) => {
  return (
    <Button {...props} titleStyle={[styles.subTitleText, props.titleStyle]} type="clear" />
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

export class ListWithRefresh extends React.Component {
  /* ScrollView or FlatList with pulldown refresh. 
  Cannot be functional component because for WidgetList we use a ref to scroll to top and will get this warning 
  "Function components cannot be given refs. Attempts to access this ref will fail. */

  constructor(props) {
    super(props);
    this.state = { refreshing: false };
  }

  onRefresh() {
    this.setState({ refreshing: true });
    if (this.props.onPulldownRefresh)
      this.props.onPulldownRefresh();
    wait(2000).then(() => this.setState({ refreshing: false })); /* TODO: remove the wait and hook up to redux callback maybe  */
  }

  render() {
    if (this.props.useFlatList)
      return <List {...this.props} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />} data={this.props.data} />;
    /* deault to ScrollView */
    return <ScrollView {...this.props} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />}
      ref={ref => this.scrollView = ref} /* this is needed for scrollTo */
      onContentSizeChange={(contentWidth, contentHeight) => {
        if (this.props.onChangeScrollToTop)
          this.scrollView.scrollTo({ animated: true, duration: 1000 });
      }}
    >
      {this.props.children}
    </ScrollView>;
  }
}

export const List = (props) => {

  function renderListItem({ item, index }) {
    /* list item with left icon, title, subtitle, right text and right chevron icon */
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

  return (
    <FlatList
      data={props.data}
      renderItem={(item, index) => props.renderItem ? props.renderItem(item, index) : renderListItem(item, index)}
      keyExtractor={item => item.id}
      {...props}
    />
  );
}

export const ActivityIndicator = (props) => {
  return <NativeActivityIndicator {...props} size={props.size ?? 'large'}
    style={[{ alignSelf: 'center', borderRadius: 50, padding: 2, opacity: 0.8 }, styles.highlightBackground, props.style]}
  />
};

export const HorizontalLine = (props) => {
  return <Divider style={[styles.highlightBackground, { marginVertical: 15 }, props.style]} width={props.width ?? 50} height={props.height ?? 2} />
}