import React, { useState } from 'react';
import {
  ActivityIndicator as NativeActivityIndicator, Platform, Text, ToastAndroid, View, ScrollView,
  TouchableOpacity, FlatList, RefreshControl, TextInput, Picker, Dimensions, Image
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Icon, Input, Divider } from 'react-native-elements';
import { addSubtractDays, isValidDate, wait, formatDate } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';
import { brokenImageURI, Errors } from '../modules/Constants';

export const Spacer = (props) => {
  return <View style={[
    props.width ? { width: props.width } : {},
    props.height ? { height: props.height } : {}
  ]} />;
};

export const ParagraphText = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return <Text {...props} style={[styles.bodyText, props.style]} />;
};

export const Toast = {
  show(message, duration) {
    Platform.OS === 'ios' ? alert(message) : ToastAndroid.show(message, duration || ToastAndroid.LONG);
  },
  showTranslated(codes, context) {
    /*
      codes param can be a string or an array and is used for looking up translation of messages
      the codes without a matching translation will be shown as is
      e.g. ['InvalidCredentials', 'A1001']  will be shown as 'Invalid credentials, please try again A1001'
      e.g. ['InvalidCredentials'] or just a string 'InvalidCredentials' will be shown as 'Invalid credentials, please try again '
    */
    const language = context.language;
    if (typeof codes === 'string') {
      if (language[codes])
        this.show(language[codes]);
      else
        this.show(codes);
      return;
    }

    if (Array.isArray(codes)) {
      const translated = [];
      for (code in codes) {
        if (language[codes[code]])
          translated.push(language[codes[code]]);
        else
          translated.push(codes[code]);
      }
      this.show(translated.join(' '));
      return;
    }
  }
};

export const ClearTextArea = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
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
  const context = React.useContext(AppContext);
  const styles = context.styles;

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
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <Input
    {...props}
    inputContainerStyle={[{ borderBottomWidth: 0 }, props.inputContainerStyle]}
    inputStyle={[{ marginLeft: 10 }, styles.bodyTextLarge, props.inputStyle]}
    containerStyle={[styles.brightBackground, styles.rounded, styles.border, props.containerStyle]}
    placeholderTextColor={styles.placeholderHighlight.color}
    autoCompleteType='off'
    autoCorrect={false}
    secureTextEntry={true}
    rightIcon={<RoundButton name="keyboard-arrow-right" onPress={props.onPress} />}
    onSubmitEditing={() => {
      if (props.onPress)
        props.onPress();
    }}
  />
};

export const PINInputWithButton = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  function onChangeText(value) {
    if (props.onChangeText)
      props.onChangeText(value.replace(/[^0-9]/g, ''));
  }

  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, props.containerStyle]}>
    <TextInput
      {...props}
      style={[styles.bodyText, styles.hugeText, {
        paddingVertical: 7, borderBottomWidth: 1,
        borderColor: styles.buttonPrimary.borderColor
      }]}
      placeholderTextColor={styles.placeholderText.color}
      autoCompleteType='off'
      autoFocus={true}
      autoCorrect={false}
      secureTextEntry={true}
      keyboardType='numeric'
      onChangeText={(value) => { onChangeText(value) }}
      onSubmitEditing={() => {
        if (props.onPress)
          props.onPress();
      }}
    />
    <RoundButton containerStyle={{ marginLeft: 30 }} name="keyboard-arrow-right" onPress={props.onPress} />
  </View>
};

export const RoundButton = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return <Icon {...props}
    onPress={props.onPress}
    iconStyle={[styles.roundedButton, props.iconStyle]}
    containerStyle={[styles.roundedButtonContainer, props.containerStyle]}
  />
}

export const StyledDatePicker = (props) => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;
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
  const displayText = props.date ? formatDate(props.date, format) : (props.placeholder ? props.placeholder : language.dateAndTime);

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
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;
  return (
    <View style={styles.formItem}>
      <StyledDatePicker
        {...props}
        format='LT' /* Local Time (format support by moment.js) */  /* maybe allow settings overwrite */
        mode='time'
        placeholder={props.placeholder || language.pickTime}
      />
    </View>
  )
};

export const IconForButton = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return <Icon iconStyle={[styles.iconPrimarySmall, props.iconStyle]} {...props} />
}

export const DatePickerWithArrows = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  function changeDays(numDays) {
    if (props.onChange)
      props.onChange(null, addSubtractDays(props.date, numDays));
  }

  function onChange(event, newDate) {
    if (isValidDate(newDate) && props.onChange)
      props.onChange(event, newDate);
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
        onChange={onChange}
      />
      <Button onPress={() => { changeDays(1) }}
        type='clear'
        icon={<IconForButton name='chevron-right' iconStyle={styles.iconSecondary} />}
      />
    </View>
  );
};

export const ButtonSecondary = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <ButtonPrimary {...props}
      buttonStyle={[styles.buttonSecondary, props.buttonStyle]}
      titleStyle={[styles.brightColor, { opacity: 1 }, props.titleStyle]}
    />
  )
};

export const ButtonPrimary = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <Button {...props}
      containerStyle={[{ width: 250 }, props.containerStyle]}
      buttonStyle={[styles.buttonPrimary, props.buttonStyle]}
      titleStyle={[styles.buttonText, props.titleStyle]}
      icon={props.name ? <IconForButton name={props.name} iconStyle={[{ marginRight: 20, color: styles.brightColor.color }, props.iconStyle]} /> : null} />
  )
};

export const IconButton = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <TouchableOpacity style={[props.containerStyle]} {...props} >
      {props.iconName ? <IconForButton name={props.iconName} type={props.iconType} iconStyle={[props.iconStyle || styles.iconPrimary]} /> : <View></View>}
      {props.text ? <Text style={[props.titleStyle || styles.toolbarButtonText]}>{props.text}</Text> : <View></View>}
    </TouchableOpacity>
  )
};

export const LinkButton = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <Button {...props} titleStyle={[styles.subTitleText, props.titleStyle]} type="clear" />
  )
};

export function showMessages(operation, context) {
  /*
      errCodes and successCodes are used for looking up translation of messages
      the codes without a matching translation will be shown as is
      errCodes and successCodes can be an array or a string if just one code
      e.g. ['InvalidCredentials', 'A1001']  will be shown as 'Invalid credentials, please try again A1001'
      e.g. ['InvalidCredentials'] or just a string 'InvalidCredentials' will be shown as 'Invalid credentials, please try again '
  */

  if (!operation.errCodes && !operation.successCodes)
    return;

  const codes = operation.errCodes ? operation.errCodes : operation.successCodes;
  Toast.showTranslated(codes, context);
}

/* TODO: make a global loading component; maybe part of ScreenBackground or ScreenContent on the bottom like a Toast */
export const Loading = () => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator style={{ paddingTop: 20, paddingBottom: 20 }} size='large' />
      <Text style={styles.bodyText}>{language.loading}</Text>
    </View>
  );
};

export const EmptyList = () => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;
  return (
    <View style={[styles.centered, styles.flex, { marginTop: 40 }]} >
      <Text style={styles.subTitleText}>{language.emptyList}</Text>
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
  const context = React.useContext(AppContext);
  const styles = context.styles;

  function renderListItem({ item, index }) {
    /* list item with left icon, title, subtitle, right text and right chevron icon */
    return (
      <TouchableOpacity key={item.id} activeOpacity={0.7}
        style={[styles.dimBackground, styles.listItemContainer]}
        onPress={item.onPress ? item.onPress : null} >
        <View style={[styles.row, styles.flex, { alignItems: 'center' }]}>
          {item.iconName ? <IconForButton name={item.iconName} type='font-awesome' iconStyle={[styles.iconSecondary, styles.listItemLeftIcon]} /> : <React.Fragment />}
          {item.itemContent ? item.itemContent :
            <View>
              <Text style={[styles.heading2]}>{item.title}</Text>
              {item.subTitle ? <Text style={[styles.subHeading, styles.flex]}>{item.subTitle}</Text> : <View />}
            </View>}
          {item.itemCount ? <View style={[styles.flex, { alignItems: 'flex-end', marginRight: 15 }]}><Text style={[styles.subHeading]}>{item.itemCount}</Text></View> : <View style={styles.flex} />}
          {item.onPress ? <IconForButton iconStyle={styles.iconPrimarySmall} name='chevron-right' type='font-awesome' /> : <View />}
        </View>
      </TouchableOpacity>
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
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <NativeActivityIndicator {...props} size={props.size ?? 'large'}
    style={[{ alignSelf: 'center', borderRadius: 50, padding: 2, opacity: 0.8, backgroundColor: styles.brightColor.color }, props.style]}
  />
};

export const HorizontalLine = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <Divider style={[styles.highlightBackground, { marginVertical: 15 }, props.style]} width={props.width ?? 50} height={props.height ?? 2} />
}

export const StyledPicker = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <Picker
    {...props}
    style={[{ width: 200, height: 20, marginLeft: -9 }, styles.bodyText, props.style]}
  >
    {props.items.map((item) => {
      return <Picker.Item label={item.label} value={item.value} key={item.label} />
    })}
  </Picker>
}

export const StyledImage = (props) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  const language = context.language;

  if (!props.imageProps || !props.image || props.image == brokenImageURI) {
    return <View style={{ width: '100%', borderWidth: 1, alignItems: 'center', borderColor: styles.bodyText.color }}>
      <ParagraphText style={{ margin: 20 }}>{language[Errors.ImageNotFound]}</ParagraphText>
    </View>;
  }
  const imageProps = props.imageProps;
  const image = props.image;/* base64 string */

  const windowWidth = Dimensions.get('window').width;
  const resizeBy = (windowWidth) / imageProps.width;

  const width = resizeBy * imageProps.width;
  const height = resizeBy * imageProps.height;

  return <Image
    source={{ uri: 'data:image/png;base64,' + image }}
    style={{
      resizeMode: 'contain',
      height: height,
      width: width
    }} />
}