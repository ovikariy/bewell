import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Image, Text } from 'react-native-elements';
import { WidgetComponent } from './WidgetComponent';
import { updateArrayImmutable, updateTimeStringToNow, getNewUuid } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { WidgetBase, WidgetFactory } from '../modules/widgetFactory';
import { Toolbar, ToolbarButton } from './ToolbarComponents';
import { ListWithRefresh } from './MiscComponents';
import { images } from '../modules/constants';
import { sizes } from '../assets/styles/style';

interface WidgetListComponentProps {
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
    const selecetedDateCurrentTime = updateTimeStringToNow(this.props.selectedDate.toISOString());
    const emptyRecord = {
      id: getNewUuid(),
      type: itemTypeName,
      date: selecetedDateCurrentTime
    } as WidgetBase;

    this.onChange(emptyRecord);
  }

  renderAddNewButtons(widgetFactory: WidgetFactory) {
    const language = this.context.language;
    let hasNonQuickAccessItems = false; /* isQuickAccess will make this widget's add button always visible on home screen, the rest of items will be shown if button 'more' is pressed  */
    const widgetButtons = Object.values(widgetFactory).map((item) => {
      if (!item.config.isQuickAccess)
        hasNonQuickAccessItems = true;
      if (!this.state.showAllAddButtons && !item.config.isQuickAccess)
        return;
      return <ToolbarButton iconName={item.config.addIcon.name} title={item.config.addIcon.text} iconType={item.config.addIcon.type} key={'button' + item.config.itemTypeName}
        onPress={() => this.addBlankRecordOfType(item.config.itemTypeName)} />;
    });
    if (hasNonQuickAccessItems) {
      widgetButtons.push(<ToolbarButton iconType='material'
        iconName={this.state.showAllAddButtons ? 'arrow-drop-up' : 'arrow-drop-down'} key={'more'}
        title={this.state.showAllAddButtons ? language.less : language.more}
        onPress={() => this.setState({ ...this.state, showAllAddButtons: !this.state.showAllAddButtons })} />);
    }
    return widgetButtons;
  }

  renderSortedWidgets(widgetFactory: WidgetFactory) {
    /* collect widgets for each itemTypeName into a single array so they could be sorted by date */
    const sortedData = this.props.dailyData.sort((b: WidgetBase, a: WidgetBase) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);
    const widgets = sortedData.map(record => {
      return this.renderWidget(widgetFactory, record);
    });

    if (!(widgets.length > 0))
      return this.renderWelcomeMessage();
    return widgets;
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

    return (
      <View style={[styles.flex]}>
        <Toolbar style={{ flex: 0, paddingVertical: sizes[6] }}>{this.renderAddNewButtons(this.props.widgetFactory)}</Toolbar>
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