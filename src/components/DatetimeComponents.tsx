import React, { useState } from 'react';
import { Platform, Text, View, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button, Overlay } from 'react-native-elements';
import { addSubtractDays, isValidDate, formatDate, addSubtractFromDate } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { sizes } from '../assets/styles/style';
import { ButtonRow, IconForButton, LinkButton, StyledScrollPicker } from './MiscComponents';
import moment from 'moment';

interface StyledDatePickerProps {
  value?: Date;
  mode?: any;
  format?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  placeholder?: string;
  defaultMinutes?: number;
  defaultHours?: number;
  onChange?: (event: any, date?: Date) => void;
}

export const StyledDatePicker = (props: StyledDatePickerProps) => {
  const context = React.useContext(AppContext);
  const language = context.language;
  const styles = context.styles;
  /* DateTimePicker shows by default when rendered so need to hide and only show e.g. on button press */
  const [show, setShow] = useState(false);

  function onChange(event: any, newDate: any) {
    setShow(false);
    if (props.onChange)
      props.onChange(event, newDate);
  }

  const format = props.format ? props.format : 'ddd, MMM D Y';
  const displayText = props.value ? formatDate(props.value, format) : (props.placeholder ? props.placeholder : language.dateAndTime);

  return (
    <View style={{ justifyContent: 'center' }}>
      <View>
        <TouchableOpacity onPress={() => setShow(true)}>
          <Text style={[styles.bodyText, { marginHorizontal: sizes[10] }, props.textStyle]}>{displayText}</Text>
        </TouchableOpacity>
      </View>
      { show && getPlatformSpecificPicker()}
    </View>
  );

  function getDefaultDate() {
    const defaultDate = new Date();
    if (props.defaultMinutes !== undefined)
      defaultDate.setMinutes(props.defaultMinutes);
    if (props.defaultHours !== undefined)
      defaultDate.setHours(props.defaultHours);
    return defaultDate;
  }

  function getPlatformSpecificPicker() {
    const defaultDate = getDefaultDate();

    if (Platform.OS === 'ios') {
      return <DateTimePickerIOS
        {...props}
        show={show}
        value={props.value || defaultDate}
        onChange={onChange}
        onCancel={() => setShow(false)}
      />;
    }
    else {
      return <DateTimePicker
        mode={props.mode ? props.mode : 'date'}
        value={props.value || defaultDate}
        onChange={onChange}
        style={props.style ? props.style : {}}
      />;
    }
  }
};

const DateTimePickerIOS = (props: StyledDatePickerProps & { show?: boolean, onCancel: () => void; }) => {
  const { language, styles } = React.useContext(AppContext);
  const [value, setValue] = useState(props.value);

  function onOkPress() {
    if (props.onChange) props.onChange(null, value);
  };

  function onCancelPress() {
    setValue(props.value);
    props.onCancel();
  };

  return (
    <Modal animationType='fade' transparent={true} visible={props.show}>
      <View style={styles.modalWrapper}>
        <View style={[styles.modal, styles.brightBackground, { paddingBottom: sizes[20] }]}>
          <DateTimePicker
            mode={props.mode ? props.mode : 'date'}
            value={value || new Date()}
            display={'spinner'}
            onChange={(event: any, newDate: any) => setValue(newDate)}
            style={[{ width: sizes[255] }]}
          />
          {/* centered and stretched button row */}
          <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: sizes[20] }}>
              <LinkButton title={language.cancel} titleStyle={[styles.buttonText, styles.dimColor]}
                onPress={onCancelPress} />
              <LinkButton title={language.ok} titleStyle={[styles.buttonText, styles.dimColor]}
                onPress={onOkPress} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const TimePicker = (props: StyledDatePickerProps & { value?: Date }) => {
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
  );
};

export const DatePickerWithArrows = (props: StyledDatePickerProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  function changeDays(numDays: number) {
    if (props.onChange)
      props.onChange(null, addSubtractDays(props.value, numDays));
  }

  function onChange(event: any, newDate?: Date) {
    if (isValidDate(newDate) && props.onChange)
      props.onChange(event, newDate);
  }

  return (
    <View style={styles.selectedDateContainer}>
      <Button onPress={() => { changeDays(-1); }}
        type='clear'
        icon={<IconForButton name='chevron-left' iconStyle={styles.iconSecondary} />}
      />
      <StyledDatePicker
        value={props.value ? new Date(props.value) : new Date(NaN)}
        format='ddd, MMM D Y'
        textStyle={styles.bodyTextLarge}
        style={{ width: sizes[150] }}
        onChange={onChange}
      />
      <Button onPress={() => { changeDays(1); }}
        type='clear'
        icon={<IconForButton name='chevron-right' iconStyle={styles.iconSecondary} />}
      />
    </View>
  );
};

/** Month picker which when pressed shows an overlay popup with year wheel on the left and month wheel on the right */
export const MonthPicker = (props: { selectedDate: Date, onChange: (newDate?: Date) => void }) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  const language = context.language;

  const selectedDate = props.selectedDate ? props.selectedDate : new Date();
  const months = moment.months();

  const [show, setShow] = useState(false);
  const [selectedYear, setSelectedYear] = useState({ value: -1, index: -1 });
  const [selectedMonth, setSelectedMonth] = useState({ value: -1, index: -1 });

  return <View style={[styles.selectedDateContainer]}>
    <Button onPress={() => { changeMonths(-1); }}
      type='clear'
      icon={<IconForButton name='chevron-left' iconStyle={styles.iconSecondary} />}
    />
    <TouchableOpacity style={{ alignSelf: 'center' }} onPress={() => setShow(true)}><Text style={styles.bodyTextLarge}>{months[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear()}</Text></TouchableOpacity>
    <Button onPress={() => { changeMonths(1); }}
      type='clear'
      icon={<IconForButton name='chevron-right' iconStyle={styles.iconSecondary} />}
    />
    {show && showPicker()}
  </View>;

  function showPicker() {

    const years = [] as number[]; /** show years from lets say 2000 to 10 years from now */
    const year = selectedDate.getFullYear();
    const yearIndex = year - 2000;
    for (let i = 2000; i < year + 10; i++)
      years.push(i);

    const month = months[selectedDate.getMonth()];
    const monthIndex = months.indexOf(month);

    const pickerHeight = sizes[180];
    return <Overlay height={pickerHeight + sizes[100]} isVisible={true}>
      <View>
        <View style={{ height: pickerHeight, flexDirection: 'row' }}>
          <StyledScrollPicker data={years} selectedIndex={yearIndex} pickerHeight={pickerHeight}
            onValueChange={(data: any, selectedIndex: any) => { setSelectedYear({ value: data, index: selectedIndex }); }} />
          <StyledScrollPicker data={months} selectedIndex={monthIndex} pickerHeight={pickerHeight}
            onValueChange={(data: any, selectedIndex: any) => { setSelectedMonth({ value: data, index: selectedIndex }); }} />
        </View>
        <View>
          <ButtonRow justifyButtons='space-evenly' buttons={[{ title: language.cancel, onPress: onCancelPress }, { title: language.ok, onPress: onOkPress }]} />
        </View>
      </View>
    </Overlay>;
  }



  function changeMonths(numMonths: number) {
    const newDate = addSubtractFromDate(props.selectedDate, numMonths, 'months').toDate();
    onChange(newDate);
  }

  function onChange(newDate?: Date) {
    if (isValidDate(newDate) && props.onChange)
      props.onChange(newDate);
  }

  function onOkPress() {
    const selectedDate = new Date();
    selectedDate.setFullYear(selectedYear.value);
    selectedDate.setMonth(selectedMonth.index);
    onChange(selectedDate);
    setShow(false);
  }

  function onCancelPress() {
    setShow(false);
  }
};