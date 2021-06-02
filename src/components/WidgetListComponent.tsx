import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Image, Text } from 'react-native-elements';
import { WidgetComponent } from './WidgetComponent';
import { updateArrayImmutable, updateTimeStringToNow, getNewUuid } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { WidgetFactory } from '../modules/widgetFactory';
import { WidgetBase } from '../modules/types';
import { Toolbar, ToolbarButton } from './ToolbarComponents';
import { ListWithRefresh } from './MiscComponents';
import { images } from '../modules/constants';
import { sizes } from '../assets/styles/style';

interface WidgetListComponentProps {
  orderedWidgetsTypes: any[]; /** array of widget types ordered to user preference */
  dailyData: WidgetBase[];
  selectedDate: Date;
  selectedItem?: WidgetBase;
  widgetFactory: WidgetFactory;
  onChange: (newDailyData: WidgetBase[]) => void;
  onSelected: (selectedItem: WidgetBase) => void;
  onPulldownRefresh: () => void;
}

interface WidgetListComponentState {
  showAllAddButtons?: boolean
}
class WidgetListComponent extends React.Component<WidgetListComponentProps, WidgetListComponentState>  {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  toolbarHeight = sizes[54]; /* fixed height so only the first button row is visible, works flexibly with languages where widget names are long */

  constructor(props: WidgetListComponentProps) {
    super(props);
    this.state = {
      showAllAddButtons: false
    };
  }

  onChange(newWidgetDailyData: WidgetBase) {
    const newDailyData = updateArrayImmutable(this.props.dailyData, newWidgetDailyData);
    this.props.onChange(newDailyData);
  }

  addBlankRecordOfType(itemTypeName: string) {
    const selectedDateCurrentTime = updateTimeStringToNow(this.props.selectedDate.toISOString());
    const emptyRecord = {
      id: getNewUuid(),
      type: itemTypeName,
      date: selectedDateCurrentTime,
      dateCreated: new Date().toISOString()
    } as WidgetBase;

    this.onChange(emptyRecord);
  }

  renderAddNewButtons(widgetFactory: WidgetFactory) {
    const widgetButtons = this.props.orderedWidgetsTypes.map((item, index) => {
      const widget = widgetFactory[item];
      return <ToolbarButton containerStyle={{ height: this.toolbarHeight, marginHorizontal: sizes[3] + '%' }} /** margin as percent to work well with different screens */
        title={widget.config.addIcon.text}
        iconName={widget.config.addIcon.name} iconType={widget.config.addIcon.type} key={'button' + widget.config.itemTypeName}
        onPress={() => this.addBlankRecordOfType(widget.config.itemTypeName)} />;
    });
    return widgetButtons;
  }

  renderSortedWidgets(widgetFactory: WidgetFactory) {
    /* collect widgets for each itemTypeName into a single array so they could be sorted by date */
    //const sortedData = this.props.dailyData.sort((b: WidgetBase, a: WidgetBase) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
    const sortedWidgets = [];
    for (let i = this.props.dailyData.length - 1; i >= 0; i--) /** feature requested: reverse sort by array index so items show in the order they were added, newest first */
      sortedWidgets.push(this.renderWidget(widgetFactory, this.props.dailyData[i]));

    if (!(sortedWidgets.length > 0))
      return this.renderWelcomeMessage();
    return sortedWidgets;
  }

  renderWidget(widgetFactory: WidgetFactory, record: WidgetBase) {
    const widgetFactoryType = widgetFactory[record.type];
    return <WidgetComponent key={record.id}
      config={widgetFactoryType.config}
      renderWidgetItem={widgetFactoryType.renderWidgetItem}
      selectedDate={this.props.selectedDate}
      isSelected={this.props.selectedItem ? (this.props.selectedItem.id === record.id || false) : false}
      value={record}
      onChange={(newWidgetDailyData) => this.onChange(newWidgetDailyData)}
      onSelected={() => this.props.onSelected(record)}
    />;
  }

  renderWelcomeMessage() {
    const language = this.context.language;
    const theme = this.context.theme;
    const styles = this.context.styles;
    return (
      <View style={[styles.centered, styles.flex, { paddingTop: sizes[50] }]}>
        {/* tintColor is not a valid prop type but it works in terms of changing color and I don't see another way to doing it via styles */}
        <Image source={images['arrow_up_' + theme.id]} style={[styles.widgetArrowContainer]} />
        <Text style={[styles.titleText, styles.centered, styles.spacedOut]}>{language.howAreYou}</Text>
        <Text style={[styles.subTitleText, styles.centered, styles.spacedOut]}>{language.tapAddButtons}</Text>
      </View>
    );
  }

  render() {
    const styles = this.context.styles;
    const language = this.context.language;

    return (
      <View style={[styles.flex]}>
        <View style={{ flexDirection: 'row' }}>
          <Toolbar style={{
            flex: 6, height: this.state.showAllAddButtons ? 'auto' : this.toolbarHeight + sizes[6],
            overflow: 'hidden', alignContent: 'flex-start', paddingVertical: sizes[5]
          }}>
            {this.renderAddNewButtons(this.props.widgetFactory)}
          </Toolbar>
          <Toolbar style={{ flex: 1, paddingVertical: sizes[5], flexDirection: 'column' }}>
            <ToolbarButton iconType='material' containerStyle={{}}
              iconName={this.state.showAllAddButtons ? 'arrow-drop-up' : 'arrow-drop-down'} key={'more'}
              title={this.state.showAllAddButtons ? language.less : language.more}
              onPress={() => this.setState({ ...this.state, showAllAddButtons: !this.state.showAllAddButtons })} />
          </Toolbar>
        </View>
        <ListWithRefresh style={[styles.flex, styles.toolbarBottomOffset]}
          onPulldownRefresh={() => this.props.onPulldownRefresh()}
        >
          <Animatable.View animation="fadeInUp" duration={100}>
            {this.renderSortedWidgets(this.props.widgetFactory)}
          </Animatable.View>
        </ListWithRefresh>
      </View>
    );
  }

}

export default WidgetListComponent;