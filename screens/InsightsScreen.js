import React, { Component } from 'react';
import { text, ItemTypes } from '../modules/Constants';
import { View, Text, FlatList, TouchableHighlight } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { WidgetFactory } from '../modules/WidgetFactory';
import { styles } from '../assets/styles/style';
import { IconForButton, List } from '../components/MiscComponents';

class InsightsScreen extends Component {
  static navigationOptions = {
    title: text.insightsScreen.title
  };

  constructor(props) {
    super(props);
  }

  render() {

    const data = [];
    Object.keys(ItemTypes).forEach(itemType => {
      const widgetConfig = WidgetFactory[itemType].config;
      data.push({
        id: itemType,
        text: widgetConfig.widgetTitle,
        iconName: widgetConfig.addIcon.name,
        onPress: () => { this.props.navigation.navigate('ItemHistory', { 'itemType': itemType }); }
      })
    });

    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={{ paddingVertical: 20 }} >
          <List data={data} />
        </ScreenContent>
      </ScreenBackground>
    );
  }

  // renderItem({ item, index }) {

  //   const widgetConfig = WidgetFactory[item].config;
  //   //TODO: show item count from redux in a badge
  //   return (
  //     <TouchableHighlight key={item}
  //       style={[styles.dimBackground, { height: 70, marginBottom: 2, backgroundColor: '#ffffff20' }]}
  //       onPress={() => { this.props.navigation.navigate('ItemHistory', { 'itemType': item }); }}>
  //       <View style={[styles.row, styles.flex, { alignItems: 'center' }]}>
  //         <IconForButton name={widgetConfig.addIcon.name} type='font-awesome' iconStyle={[styles.iconSecondary, { marginRight: 20 }]} />
  //         <Text style={[styles.heading, { flex: 1 }]}>{widgetConfig.widgetTitle}</Text>
  //         <IconForButton iconStyle={styles.iconPrimarySmall} name='chevron-right' type='font-awesome' />
  //       </View>
  //     </TouchableHighlight>
  //   );
  // };
}

export default InsightsScreen;


