import moment from 'moment';
import React from 'react';
import { ScrollView, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Image, Text, colors } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { Widget } from '../components/Widget';
import { text } from '../modules/Constants';
import { updateArrayImmutable, updateTimeStringToNow, getNewUuid } from '../modules/helpers';
import { WidgetFactory } from '../modules/WidgetFactory';
import { Toolbar, ToolbarButton } from './ToolbarComponents';
import { ListWithRefresh } from './MiscComponents';

class WidgetList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showAllAddButtons: false
    }
  }

  onChange(newWidgetDailyData) {
    const newDailyData = updateArrayImmutable(this.props.dailyData, newWidgetDailyData);
    this.props.onChange(newDailyData);
  }

  addBlankRecordOfType(itemTypeName) {
    const selecetedDateCurrentTime = updateTimeStringToNow(this.props.selectedDate);
    const emptyRecord = {
      id: getNewUuid(),
      type: itemTypeName, date: selecetedDateCurrentTime
    }

    this.onChange(emptyRecord);
  }

  renderAddNewButtons() {
    const widgetButtons = Object.values(WidgetFactory).map((item) => {
      if (!this.state.showAllAddButtons && !item.config.isQuickAccess)
        return;
      return <ToolbarButton iconName={item.config.addIcon.name} text={item.config.addIcon.text} iconType={item.config.addIcon.type} key={'button' + item.config.itemTypeName}
        onPress={() => this.addBlankRecordOfType(item.config.itemTypeName)} />
    });
    widgetButtons.push(<ToolbarButton iconType='material' containerStyle={{ alignSelf: 'flex-end' }}
      iconName={this.state.showAllAddButtons ? 'arrow-drop-up' : 'arrow-drop-down'} key={'more'}
      text={this.state.showAllAddButtons ? 'less' : 'more'}
      onPress={() => this.setState({ ...this.state, showAllAddButtons: !this.state.showAllAddButtons })} />)
    return widgetButtons;
  }

  renderSortedWidgets() {
    /* collect widgets for each itemTypeName into a single array so they could be sorted by date */
    const widgets = this.props.dailyData.map(record => {
      return {
        key: record.id,
        date: moment(record.date),
        element: <Widget key={record.id}
          selectedDate={this.props.selectedDate}
          isSelected={this.props.selectedItem ? (this.props.selectedItem.id === record.id || false) : false}
          itemTypeName={record.type}
          value={record}
          onChange={(newWidgetDailyData) => this.onChange(newWidgetDailyData)}
          onSelected={() => this.props.onSelected(record)}
        />
      }
    });

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
        <Text style={[styles.titleText, styles.centered, styles.spacedOut]}>{text.widgets.welcomeMessage1}</Text>
        <Text style={[styles.subTitleText, styles.centered, styles.spacedOut]}>{text.widgets.welcomeMessage2}</Text>
        <Text style={[styles.subTitleText, styles.centered, styles.spacedOut]}>{text.widgets.welcomeMessage3}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={[styles.flex]}>
        <Toolbar style={{ flex: 0 }}>{this.renderAddNewButtons()}</Toolbar>
        <ListWithRefresh style={[styles.flex, styles.toolbarBottomOffset]}
          onPulldownRefresh={() => this.props.onPulldownRefresh()}
        >
          <Animatable.View animation="fadeInUp" duration={100}>
            {this.renderSortedWidgets()}
          </Animatable.View>
        </ListWithRefresh>
      </View>
    );
  }

}

export default WidgetList;