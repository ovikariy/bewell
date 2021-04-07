import React, { PropsWithChildren, useState } from 'react';
import {
  ActivityIndicator as NativeActivityIndicator, Platform, Text, ToastAndroid, View, ScrollView,
  TouchableOpacity, FlatList, RefreshControl, TextInput, Dimensions, Image,
  StyleProp, ViewStyle, TextProps, TextInputProps, TextStyle, ActivityIndicatorProps
} from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Button, Icon, Input, Divider, InputProps, IconProps, ButtonProps, DividerProps, Overlay } from 'react-native-elements';
import { wait } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { brokenImageURI, ErrorMessage } from '../modules/constants';
import { getTranslationMessage } from '../modules/translations';
import { AppError } from '../modules/types';
import { sizes } from '../assets/styles/style';
import { AppContextState } from '../redux/reducerTypes';
import ScrollPicker from 'react-native-wheel-scrollview-picker';

export const Spacer = (props: { width?: number, height?: number }) => {

  return <View style={[
    props.width ? { width: props.width } : {},
    props.height ? { height: props.height } : { height: sizes[70] }
  ]} />;
};

export const ParagraphText = (props: PropsWithChildren<TextProps>) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return <Text {...props} style={[styles.bodyText, props.style]} />;
};

export const Toast = {
  show(message: string, duration?: number) {
    Platform.OS === 'ios' ? alert(message) : ToastAndroid.show(message, duration || ToastAndroid.LONG);
  },
  showError(error: AppError, context: AppContextState) {
    let translated = getTranslationMessage(context.language, error.message);
    if (error.code)
      translated += ' ' + error.code;
    this.show(translated);
  },
  showTranslated(message: string, context: AppContextState) {
    const translated = getTranslationMessage(context.language, message);
    this.show(translated);
  }
};

export const ClearTextArea = (props: InputProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  /* no background no borders */
  return (
    <Input
      multiline={true}
      scrollEnabled={false} /* this is needed for iOS with multiline input and KeyboardAvoidingView */
      numberOfLines={3}
      textAlignVertical='top'
      autoFocus={props.value ? false : true}
      inputStyle={[styles.bodyText, styles.clearTextArea]}
      placeholderTextColor={styles.placeholderText.color}
      inputContainerStyle={styles.clearTextAreaContainer}
      {...props}
    />
  );
};

//route.params?.someParam ?? 'defaultValue';

export const PasswordInput = (props: InputProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <Input
    {...props}
    leftIcon={{ name: 'lock', color: styles.iconPrimary.color }}
    containerStyle={[{ marginTop: sizes[30], paddingLeft: 0 }, props.containerStyle]}
    inputContainerStyle={[props.inputContainerStyle]}
    inputStyle={[{ marginLeft: sizes[10] }, styles.bodyText, props.inputStyle]}
    leftIconContainerStyle={{ marginLeft: 0 }}
    placeholderTextColor={styles.placeholderText.color}
    autoCompleteType='off'
    autoCorrect={false}
    secureTextEntry={true}
  />;
};

interface PasswordInputWithButtonProps extends InputProps {
  onPress?: () => void;
}

export const PasswordInputWithButton = (props: PasswordInputWithButtonProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <Input
    {...props}
    inputContainerStyle={[{ borderBottomWidth: 0 }, props.inputContainerStyle]}
    inputStyle={[{ marginLeft: sizes[10] }, styles.bodyText, props.inputStyle]}
    containerStyle={[styles.brightBackground, styles.rounded, styles.border, props.containerStyle]}
    placeholderTextColor={styles.placeholderHighlight.color}
    autoCompleteType='off'
    numberOfLines={1}
    autoCorrect={false}
    secureTextEntry={true}
    rightIcon={<RoundButton name="keyboard-arrow-right" onPress={props.onPress} />}
    onSubmitEditing={() => {
      if (props.onPress)
        props.onPress();
    }}
  />;
};

interface PINInputWithButtonProps extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const PINInputWithButton = (props: PINInputWithButtonProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  function onChangeText(value: string) {
    if (props.onChangeText)
      props.onChangeText(value.replace(/[^0-9]/g, ''));
  }

  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, props.containerStyle]}>
    <TextInput
      {...props}
      style={[styles.bodyText, styles.titleText, {
        paddingVertical: sizes[10], borderBottomWidth: 1,
        borderColor: styles.buttonPrimary.borderColor
      }]}
      placeholderTextColor={styles.placeholderText.color}
      autoCompleteType='off'
      autoFocus={true}
      autoCorrect={false}
      secureTextEntry={true}
      keyboardType='numeric'
      onChangeText={(value) => { onChangeText(value); }}
      onSubmitEditing={() => {
        if (props.onPress)
          props.onPress();
      }}
    />
    <RoundButton containerStyle={{ marginLeft: sizes[30] }} name="keyboard-arrow-right" onPress={props.onPress} />
  </View>;
};

export const RoundButton = (props: IconProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return <Icon {...props}
    onPress={props.onPress}
    iconStyle={{ ...styles.roundedButton, ...props.iconStyle }}
    containerStyle={[styles.roundedButtonContainer, props.containerStyle]}
  />;
};

export const ButtonRow = (props: { containerStyle?: ViewStyle, buttons: { title: string, onPress: () => void }[], justifyButtons?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' }) => {
  const styles = React.useContext(AppContext).styles;
  return <View style={[{ flexDirection: 'row', alignSelf: 'stretch' }, props.containerStyle]}>
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: props.justifyButtons ? props.justifyButtons : 'space-between', marginTop: sizes[20] }}>
      {props.buttons.map((button, index) => {
        return <LinkButton key={index} title={button.title} titleStyle={[styles.buttonText, styles.dimColor]}
          onPress={button.onPress} />;
      })}
    </View>
  </View>;
};

export const IconForButton = (props: IconProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return <Icon iconStyle={{ ...styles.iconPrimarySmall, ...props.iconStyle }} {...props} />;
};
export interface ButtonPropsInterface extends ButtonProps {
  iconName?: string,
  iconType?: string,
  iconStyle?: TextStyle
}

export const ButtonSecondary = (props: ButtonPropsInterface) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <ButtonPrimary {...props}
      buttonStyle={[styles.buttonSecondary, props.buttonStyle]}
      titleStyle={[styles.brightColor, { opacity: 1 }, props.titleStyle]}
    />
  );
};

export const ButtonTertiary = (props: ButtonPropsInterface) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <ButtonSecondary {...props}
      containerStyle={[{ width: 'auto' }, props.containerStyle]}
      buttonStyle={[styles.buttonTertiary, props.buttonStyle]}
      iconRight={props.iconRight || true}
      iconType={props.iconType || 'font-awesome'}
      iconStyle={props.iconStyle || { marginLeft: sizes[10], marginRight: 0, fontSize: sizes[16], color: styles.brightColor.color }}
      titleStyle={props.titleStyle || [styles.bodyText, styles.brightColor, { textTransform: 'none' }]}
    />
  );
};

export const ButtonPrimary = (props: ButtonPropsInterface) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <Button {...props}
      containerStyle={[{ width: sizes[255] }, props.containerStyle]}
      buttonStyle={[styles.buttonPrimary, props.buttonStyle]}
      titleStyle={[styles.buttonText, props.titleStyle]}
      icon={props.iconName ? <IconForButton name={props.iconName} type={props.iconType || 'default'} iconStyle={{ ...{ marginRight: sizes[20], color: styles.buttonText.color }, ...props.iconStyle }} /> : <React.Fragment />} />
  );
};

export const IconButton = (props: ButtonPropsInterface) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <TouchableOpacity style={[props.containerStyle]} {...props} >
      {props.iconName ? <IconForButton name={props.iconName} type={props.iconType} iconStyle={props.iconStyle ? props.iconStyle : styles.iconPrimary} /> : <View></View>}
      {props.title ? <Text style={[props.titleStyle || styles.toolbarButtonText]}>{props.title}</Text> : <View></View>}
    </TouchableOpacity>
  );
};

export const LinkButton = (props: ButtonPropsInterface) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return (
    <Button {...props} titleStyle={[styles.subTitleText, props.titleStyle]} type="clear" />
  );
};

export function showMessages(operation: any, context: AppContextState) {
  if (!operation.error && !operation.successMessage)
    return;

  if (operation.error)
    Toast.showError(operation.error, context);
  else
    Toast.showTranslated(operation.successMessage, context);
}

export const LoadingScreeenOverlay = (props: { style?: ViewStyle, text?: string }) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <Loading {...props} style={[styles.loadingScreeenOverlay, props.style]} />;
};

export const Loading = (props: { style?: ViewStyle, text?: string }) => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;
  return (
    <View style={[{
      alignItems: 'center', justifyContent: 'center', alignSelf: 'center',
      flex: 1,
    }, props.style]}>
      <ActivityIndicator color={styles.highlightColor.color} style={[{ padding: 0, marginBottom: sizes[10] }, styles.highlightBackground]} size='large' />
      <Text style={styles.bodyText}>{props.text || language.loading}</Text>
    </View>
  );
};

export const EmptyList = () => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;
  return (
    <View style={[styles.centered, styles.flex, { marginTop: sizes[50] }]} >
      <Text style={styles.subTitleText}>{language.emptyList}</Text>
    </View>
  );
};

interface ListWithRefreshProps {
  data?: any,
  style?: StyleProp<ViewStyle>,
  useFlatList?: boolean,
  onChangeScrollToTop?: boolean,
  onPulldownRefresh?: (() => void),
}
interface ListWithRefreshState { refreshing: boolean }

export class ListWithRefresh extends React.Component<ListWithRefreshProps, ListWithRefreshState> {
  /* ScrollView or FlatList with pulldown refresh.
  Cannot be functional component because for WidgetList we use a ref to scroll to top and will get this warning
  "Function components cannot be given refs. Attempts to access this ref will fail. */

  scrollView: any;

  constructor(props: ListWithRefreshProps) {
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
    /* default to ScrollView */
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

export const List = (props: any) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  function renderListItem({ item }: any) {
    /* list item with left icon, title, subtitle, right text and right chevron icon */
    return (
      <TouchableOpacity key={item.id} activeOpacity={0.7}
        style={[styles.dimBackground, styles.listItemContainer]}
        onPress={item.onPress ? item.onPress : null} >
        <View style={[styles.row, styles.flex, { alignItems: 'center' }]}>
          {item.iconName ? <IconForButton name={item.iconName} type={item.iconType ?? 'font-awesome'} iconStyle={styles.iconSecondary} containerStyle={styles.listItemLeftIcon} /> : <React.Fragment />}
          {item.itemContent ? item.itemContent :
            <View style={styles.flex}>
              <Text style={[styles.heading2]}>{item.title}</Text>
              {item.subTitle ? <Text style={[styles.subHeading, styles.flex]}>{item.subTitle}</Text> : <View />}
            </View>}
          {item.itemCount ? <View style={[{ alignItems: 'flex-end', marginRight: sizes[16] }]}><Text style={[styles.subHeading]}>{item.itemCount}</Text></View> : <View />}
          {item.onPress ? <View style={[{ alignItems: 'flex-end', marginRight: sizes[16] }]}><IconForButton iconStyle={[styles.iconPrimarySmall]} name='chevron-right' type='font-awesome' /></View> : <View />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      ListEmptyComponent={<EmptyList />}
      keyExtractor={item => item.id}
      {...props}
      renderItem={({ item }) => props.renderItem ? props.renderItem({ item }) : renderListItem({ item })}
    />
  );
};

export const ActivityIndicator = (props: ActivityIndicatorProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <NativeActivityIndicator {...props} size={props.size ?? 'large'}
    style={[{ alignSelf: 'center', borderRadius: 50, padding: 2, opacity: 0.8, backgroundColor: styles.brightColor.color }, props.style]}
  />;
};

export const HorizontalLine = (props: DividerProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  return <Divider style={[styles.highlightBackground, { marginVertical: sizes[16], width: sizes[50], height: 2 }, props.style]} />;
};

export interface StyledPickerItemType { label: string, value: string }
interface StyledPickerProps {
  title: string,
  show?: boolean,
  selectedValue?: string,
  onCancelChange?: () => void,
  onValueChange?: (itemValue: React.ReactText, itemIndex: number) => void
  items: StyledPickerItemType[]
}

export const StyledPicker = (props: StyledPickerProps) => {
  const { styles, language } = React.useContext(AppContext);

  if (!props.items)
    return <View />;

  const options = props.items.map((item) => item.label);
  options.push(language.cancel); /* append cancel button last */

  const selectedItem = props.items.find((item) => item.value === props.selectedValue);
  return (
    <View>
      <Text style={styles.bodyText}>{selectedItem && selectedItem.label}</Text>
      {props.show && <ActionSheet options={options} {...props} />}
    </View>
  );
};

export const ActionSheet = (props: StyledPickerProps & { options: string[] }) => {
  const { showActionSheetWithOptions } = useActionSheet();
  /** separated useActionSheet into a separate component because was giving an error when used inside StyledPicker:
   *  Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.*/
  return (
    <View>
      <React.Fragment />
      {showActionSheetWithOptions(
        {
          title: props.title,
          cancelButtonIndex: props.options.length - 1,
          options: props.options
        },
        (index) => {
          if (index === props.options.length - 1 && props.onCancelChange) { /* cancel button pressed */
            props.onCancelChange();
            return;
          }
          if (props.onValueChange)
            props.onValueChange(props.items[index].value, index);
        }
      )}
    </View>
  );
};

export interface ImageProps {
  imageType?: 'image' | 'video';
  filename: string,
  width: number;
  height: number;
  exif?: {
    [key: string]: any;
  };
}

interface StyledImageProps {
  image: string,
  imageProps: ImageProps
}

export const StyledImage = (props: StyledImageProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  const language = context.language;

  if (!props.imageProps || !props.image || props.image === brokenImageURI) {
    return <View style={{ width: '100%', borderWidth: 1, alignItems: 'center', borderColor: styles.bodyText.color }}>
      <ParagraphText style={{ margin: sizes[20] }}>{language[ErrorMessage.ImageNotFound]}</ParagraphText>
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
      height,
      width
    }} />;
};

export const StyledScrollPicker = (props: { data: any[], selectedIndex: number, pickerHeight: number, onValueChange: (data: any, selectedIndex: any) => void }) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return <ScrollPicker
    dataSource={props.data}
    selectedIndex={props.selectedIndex}
    renderItem={(data: any, index: any) => { }}
    onValueChange={props.onValueChange}
    wrapperHeight={props.pickerHeight}
    wrapperBackground={styles.brightBackground.color}
    itemHeight={sizes[60]}
    activeItemTextStyle={styles.bodyText}
    highlightColor={styles.bodyText.color}
    highlightBorderWidth={1}
  />;
};


export interface WheelPickerProps {
  value?: any;
  placeholder?: string;
  textLeft?: string;
  textRight?: string;
  icon?: IconProps;
  isSelected?: boolean;
  containerStyle?: StyleProp<ViewStyle>
}

/** WheelPickerReadonly is useful if need to show the same component as the wheel picker without the clickable part e.g. inside ExerciseComponent */
export const WheelPickerReadonly = (props: WheelPickerProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  //TODO: translation for <pick value>
  return <View style={[{ flexDirection: 'row' }, props.containerStyle]}>
    {props.icon && <IconForButton type={props.icon.type || 'material-community'} iconStyle={styles.bodyText} containerStyle={[{ justifyContent: 'center' }, styles.spacedOut]} {...props.icon} />}
    {props.textLeft && <Text style={[styles.bodyText, styles.spacedOut]}>{props.textLeft}</Text>}
    <Text style={[styles.bodyText, styles.spacedOut, { marginLeft: sizes[10] }]}>{props.value || props.placeholder || '<pick value>'}</Text>
    {(props.textRight && props.value !== undefined) && <Text style={[styles.bodyText, styles.spacedOut]}>{props.textRight}</Text>}
  </View>;
};

/** Wheel picker */
export const WheelPicker = (props: WheelPickerProps & { data: any[], firstValueIsEmpty?: boolean, title?: string, onChange: (selectedValue?: any) => void }) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  const language = context.language;

  const [show, setShow] = useState(false);
  const [selectedValue, setSelectedValue] = useState(props.value);

  return <View>
    <TouchableOpacity onPress={() => setShow(true)}>
      <WheelPickerReadonly {...props} />
    </TouchableOpacity>
    {show && showPicker()}
  </View>;

  function showPicker() {
    const pickerHeight = sizes[180];
    const selectedIndex = props.data?.indexOf(props.value);
    return <Overlay height={pickerHeight + sizes[100]} isVisible={true}>
      <View>
        {props.title && <Text style={[styles.bodyTextLarge, styles.dimColor, styles.spacedOut]}>{props.title}</Text>}
        <View style={{ height: pickerHeight, flexDirection: 'row' }}>
          <StyledScrollPicker data={props.data} selectedIndex={selectedIndex} pickerHeight={pickerHeight}
            onValueChange={onValueChange} />
        </View>
        <View>
          <ButtonRow justifyButtons='space-evenly' buttons={[{ title: language.cancel, onPress: onCancelPress }, { title: language.ok, onPress: onOkPress }]} />
        </View>
      </View>
    </Overlay>;
  }

  function onValueChange(value: any, selectedIndex: any) {
    if (props.firstValueIsEmpty && selectedIndex === 0) /** first item is for clearing selected e.g. data={['none', 1, 2, 3, 4, 5]} */
      setSelectedValue(undefined);
    else
      setSelectedValue(value);
  }

  function onOkPress() {
    if (props.onChange)
      props.onChange(selectedValue);
    setShow(false);
  }

  function onCancelPress() {
    setShow(false);
  }
};