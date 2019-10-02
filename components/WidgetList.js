import React from 'react';
import { ScrollView, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { updateArrayImmutable, updateTimeStringToNow } from '../modules/helpers';
import { ButtonPrimary, IconButton } from './MiscComponents';
import Widget from '../components/Widget';
import { widgetConfig } from '../modules/Constants';
import { styles, colors } from '../assets/styles/style';
import { Image, Text } from 'react-native-elements';
import moment from 'moment';

class WidgetList extends React.Component {

  constructor(props) {
    super(props);
  }

  onChange(itemTypeName, newWidgetDailyData) {
    const newDailyData = updateArrayImmutable(this.props.dailyData[itemTypeName], newWidgetDailyData);
    this.props.onChange({ ...this.props.dailyData, [itemTypeName]: newDailyData });
  }

  addBlankRecordOfType(itemTypeName) {
    const selecetedDateCurrentTime = updateTimeStringToNow(this.props.selectedDate);
    //TODO: use a better ID such as guid
    const emptyRecord = { id: new Date(selecetedDateCurrentTime).getTime(),
      type: itemTypeName, date: selecetedDateCurrentTime }

    this.onChange(itemTypeName, emptyRecord);
  }

  showMoreNewButtons() {
    //TODO: implement
  }

  renderAddNewButtons() {
    const widgetButtons = Object.values(widgetConfig).map((item) => {
      return <IconButton iconName={item.addIcon.name} iconType={item.addIcon.type} key={'button' + item.itemTypeName}
        containerStyle={styles.flex}
        onPress={() => this.addBlankRecordOfType(item.itemTypeName)} />
    });
    widgetButtons.push(<IconButton iconName='more-horiz' key={'more'}
      containerStyle={styles.flex}
      onPress={() => this.showMoreNewButtons()} />)
    return widgetButtons;
  }

  onSelectedWidget() {
    console.log('widget selected ');
  }

  renderSortedWidgets() {
    /* collect widgets for each itemTypeName into a single array so they could be sorted by date */
    const widgets = [];
    let key = 0;

    for (const itemTypeName in widgetConfig) {
      const records = this.props.dailyData[itemTypeName];
      for (const record in records) {
        widgets.push({
          key: key,
          date: moment(records[record].date),
          element: <Widget key={key}
            itemTypeName={itemTypeName}
            value={records[record]}
            selectedDate={this.props.selectedDate}
            navigation={this.props.navigation}
            onSelected={() => this.onSelectedWidget()}
            onChange={(itemTypeName, newWidgetDailyData) => this.onChange(itemTypeName, newWidgetDailyData)} />

        });
        key++;
      }
    }

    if (!widgets.length > 0)
      return this.renderWelcomeMessage();

    //TODO: sort isn't the best for dates because milliseconds are not accurate enough especially in automated testing. 
    // Tried UTC strings, moment().valueOf(), moment.diff with precise flag, new Date, new Date().getTime() none of these have more than 3 digit millis precision
    const sortedWidgets = widgets.sort((a, b) => b.date.diff(a.date));
    return sortedWidgets.map((item) => {
      return item.element;
    });
  }

  renderWelcomeMessage() {
    return (
      <View style={[styles.centered, styles.flex]}>
        <Image source={require('../assets/images/arrow-up.png')} style={styles.imageContainer} />
        <Text style={[styles.titleText, styles.centered, styles.spacedOut]}>How are you?</Text>
        <Text style={[styles.subTitleText, styles.centered, styles.spacedOut]}>Tap the buttons above to add to your wellbeing</Text>
        <Text style={[styles.subTitleText, styles.centered, styles.spacedOut]}>(e.g. Note or Mood)</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.flex}>
        <View style={[styles.addNewWidgetsButtonContainer, styles.centered]}>{this.renderAddNewButtons()}</View>
        <ScrollView style={styles.flex}
          ref={ref => this.scrollView = ref} /* this is needed for scrollTo */
          onContentSizeChange={(contentWidth, contentHeight) => {
            /* scroll to top as new items are added */
            this.scrollView.scrollTo({ animated: true, duration: 1000 });
          }}>
          <Animatable.View animation="fadeInUp" duration={100}>
            {this.renderSortedWidgets()}
          </Animatable.View>
        </ScrollView >
      </View>
    );
  }

}

export default WidgetList;