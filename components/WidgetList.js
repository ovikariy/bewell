import React from 'react';
import { ScrollView, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Image, Text, colors } from 'react-native-elements';
import { styles } from '../assets/styles/style';
import { Widget } from '../components/Widget';
import { text } from '../modules/Constants';
import { updateArrayImmutable, updateTimeStringToNow, getNewUuid, dateDiff, LanguageContext } from '../modules/helpers';
import { WidgetFactory } from '../modules/WidgetFactory';
import { Toolbar, ToolbarButton } from './ToolbarComponents';
import { ListWithRefresh } from './MiscComponents';

class WidgetList extends React.Component {
  static contextType = LanguageContext;

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
    const language = this.context;
    const widgetFactory = WidgetFactory(language);
    const widgetButtons = Object.values(widgetFactory).map((item) => {
      if (!this.state.showAllAddButtons && !item.config.isQuickAccess)
        return;
      return <ToolbarButton iconName={item.config.addIcon.name} text={item.config.addIcon.text} iconType={item.config.addIcon.type} key={'button' + item.config.itemTypeName}
        onPress={() => this.addBlankRecordOfType(item.config.itemTypeName)} />
    });
    widgetButtons.push(<ToolbarButton iconType='material' 
      iconName={this.state.showAllAddButtons ? 'arrow-drop-up' : 'arrow-drop-down'} key={'more'}
      text={this.state.showAllAddButtons ? language.less : language.more}
      onPress={() => this.setState({ ...this.state, showAllAddButtons: !this.state.showAllAddButtons })} />)
    return widgetButtons;
  }

  renderSortedWidgets() {
    /* collect widgets for each itemTypeName into a single array so they could be sorted by date */
    const sortedData = this.props.dailyData.sort((a, b) => dateDiff(b.date, a.date));
    const widgets = sortedData.map(record => {
      return this.renderWidget(record, this.props);
    });

    if (!widgets.length > 0)
      return this.renderWelcomeMessage();
    return widgets;
  }

  renderWidget(record, props) {
    return <Widget key={record.id}
      selectedDate={props.selectedDate}
      isSelected={props.selectedItem ? (props.selectedItem.id === record.id || false) : false}
      itemTypeName={record.type}
      value={record}
      onChange={(newWidgetDailyData) => this.onChange(newWidgetDailyData)}
      onSelected={() => props.onSelected(record)}
    />
  }

  renderWelcomeMessage() {
    const language = this.context;
    return (
      <View style={[styles.centered, styles.flex, { paddingTop: 40 }]}>
        <Image source={require('../assets/images/arrow-up.png')} style={[styles.imageContainer, { height: 50, width: 15 }]} />
        <Text style={[styles.titleText, styles.centered, styles.spacedOut]}>{language.howAreYou}</Text>
        <Text style={[styles.subTitleText, styles.dimColor, styles.centered, styles.spacedOut]}>{language.tapAddButtons}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={[styles.flex]}>
        <Toolbar style={{ flex: 0, paddingVertical: 6 }}>{this.renderAddNewButtons()}</Toolbar>
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