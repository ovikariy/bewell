import React, { ReactNode } from 'react';
import { AppContext } from '../modules/appContext';
import { WidgetComponentPropsBase, WidgetConfig, WidgetFactory } from '../modules/widgetFactory';
import { WidgetBase, WidgetBaseFields } from '../modules/types';
import { Text, View } from 'react-native';
import { friendlyTime } from '../modules/utils';
import { CustomIconType, CustomIconRating, CustomIconRatingItem } from './CustomIconRating';
import * as Animatable from 'react-native-animatable';
import { sizes } from '../assets/styles/style';
import { ItemTypes } from '../modules/constants';

export interface CustomIconRatingComponentWidgetType extends WidgetBase {
  rating?: number;
}

export interface CustomIconRatingComponentProps extends WidgetComponentPropsBase {
  value: CustomIconRatingComponentWidgetType;
  onChange: (newValue: CustomIconRatingComponentWidgetType) => void
}

export const CustomIconRatingComponent = (props: CustomIconRatingComponentProps) => {
  const ratings = !props.config.icons ? <View /> : props.config.icons.map((icon: CustomIconType, index: number) => {
    return (
      <CustomIconRatingItem key={index} id={index} value={icon}
        iconStyle={{ fontSize: sizes[30] }}
        containerStyle={{ height: sizes[50], width: sizes[50] }}
        selected={props.value && props.value.rating === index}
        onPress={(rating) => {
          if (!Number.isInteger(rating))
            return; //nothing to do since rating wasn't selected
          if (props.onChange)
            props.onChange({ ...props.value, rating });
        }} />
    );
  });
  return (
    <Animatable.View animation="fadeIn" duration={500}>
      <CustomIconRating>{ratings}</CustomIconRating>
    </Animatable.View>
  );
};

export interface CustomIconRatingHistoryComponentProps {
  item: CustomIconRatingComponentWidgetType;
  isSelectedItem: boolean;
  config: WidgetConfig;
}
export const CustomIconRatingHistoryComponent = (props: CustomIconRatingHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  /* config is basically this object i.e config[itemType]  */
  /* custom render item to show mood icon in the row */
  const ratingIcons = props.config.icons;
  if (!ratingIcons || props.item.rating === undefined)
    return <View />;
  const ratingIcon = ratingIcons[props.item.rating];
  return (
    <View style={{ margin: sizes[10], alignContent: 'center' }}>
      <Text style={styles.bodyText}>
        {friendlyTime(props.item.date)}</Text>
      <CustomIconRatingItem id={props.item.rating || -1} value={ratingIcon} textColor={styles.titleText.color}
        iconStyle={{ fontSize: sizes[26] }}
        containerStyle={{ height: sizes[40], width: sizes[40] }} />
    </View>
  );
};

export const CustomIconRatingHistorySummaryComponent = (props: { items: WidgetBase[], config: WidgetConfig, widgetFactory: WidgetFactory }) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  const language = context.language;

  const itemsGroupedByItemType = new Map<string, WidgetBase[]>();
  const datesOfItemsWithGoodDays = {} as { [key: string]: string };
  props.items?.forEach(item => {
    const date = new Date(item.date).toLocaleDateString(); /** we want to count one item of itemType per day */
    const collection = itemsGroupedByItemType.get(item[WidgetBaseFields.type]);
    if (!collection)
      itemsGroupedByItemType.set(item[WidgetBaseFields.type], [item]);
    else {
      if (collection.find(x => x.date && new Date(x.date).toLocaleDateString() === date))
        return; /** don't add item, we already have it for this day */
      collection.push(item);
    }
    if (item[WidgetBaseFields.type] === props.config.itemTypeName)
      datesOfItemsWithGoodDays[date] = date;
  });

  const itemsWithGoodDays = itemsGroupedByItemType.get(props.config.itemTypeName)?.filter((item: CustomIconRatingComponentWidgetType) => item.rating === 0);
  const numGoodDays = itemsWithGoodDays?.length;
  if (!numGoodDays || numGoodDays <= 0)
    return <React.Fragment />; /** TODO: what to show when no good days?  */
  const summaryLines = renderSummaryLines();
  return (
    <View style={{
      margin: sizes[10], alignContent: 'center', marginVertical: sizes[20], paddingVertical: sizes[20],
      borderColor: styles.toolbarContainer.backgroundColor, borderTopWidth: 1
    }}>
      {renderGoodDayCount()}
      {summaryLines?.length > 0 && <Text style={[styles.bodyTextLarge, { marginVertical: sizes[20], paddingHorizontal: '10%' }]}>{language.outOfThoseDays + ':'}</Text>}
      {summaryLines}
    </View>
  );

  function renderGoodDayCount() {
    return <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: '10%' }}>
      <Text style={[styles.bodyText, { fontSize: 100, flex: 1, textAlign: 'center', color: styles.toolbarContainer.backgroundColor }]}>{numGoodDays}</Text>
      <Text style={[styles.titleText, { fontSize: 30, flex: 1, textAlign: 'left' }]}>
        {props.config.historySummary}
      </Text>
    </View>;
  }

  function renderSummaryLines() {
    const summaryLines = [] as { key: number, value: ReactNode }[];
    itemsGroupedByItemType.forEach((itemTypeItems, key) => {
      //skip the item type for which we are viewing history e.g. if we're viewing Mood history then mood count would already be shown in renderGoodDayCount
      if (key === props.config.itemTypeName)
        return;

      //skip items that don't fall on the good days we're talking about
      const itemTypeItemsForGoodDays = itemTypeItems?.filter(item => {
        const date = new Date(item.date).toLocaleDateString();
        return datesOfItemsWithGoodDays[date] === date;
      });

      if (!(itemTypeItemsForGoodDays?.length > 0))
        return;

      const widgetTitle = props.widgetFactory[key].config.widgetTitle;

      if (key === ItemTypes.SLEEP || key === ItemTypes.MOOD) {
        const goodRatingName = props.widgetFactory[key].config.icons[0].name;
        const goodRatingItems = itemTypeItemsForGoodDays?.filter(item => item.rating === 0);

        if (!(goodRatingItems?.length > 0))
          return;

        summaryLines.push({
          key: goodRatingItems?.length,
          value: renderSummaryLine(key, goodRatingItems?.length, widgetTitle + ': ' + goodRatingName)
        });
      }
      else {
        summaryLines.push({
          key: itemTypeItemsForGoodDays?.length,
          value: renderSummaryLine(key, itemTypeItemsForGoodDays?.length, widgetTitle)
        });
      }
    });

    /** sort summary lines with item counts in descending order */
    return summaryLines.sort((a, b) => b.key - a.key).map(item => item.value);
  }

  function renderSummaryLine(key: string, itemCount: number, summaryText: string) {
    return <View key={key} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[styles.bodyTextLarge, { flex: 1, textAlign: 'right', color: styles.titleText.color, fontWeight: 'bold' }]}>
        {itemCount}
      </Text>
      <Text style={[styles.bodyTextLarge, { marginLeft: sizes[15], flex: 3, textAlign: 'left' }]}>
        {summaryText}
      </Text>
    </View>;
  };
};

export const CustomIconRatingCalendarComponent = (props: CustomIconRatingHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;

  /* config is basically this object i.e config[itemType]  */
  /* custom render item to show small mood icon in the calendar */
  const ratingIcons = props.config.icons;
  if (!ratingIcons || props.item.rating === undefined)
    return <View />;
  const ratingIcon = ratingIcons[props.item.rating];
  return <CustomIconRatingItem id={props.item.rating || -1} value={ratingIcon} hideText={true}
    iconStyle={[styles.ratingIconSmallStyle, { color: styles.brightColor.color }]}
    containerStyle={[styles.ratingIconSmallContainer, { margin: -2 }]} />;
};