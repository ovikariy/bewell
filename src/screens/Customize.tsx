import React, { Component } from 'react';
import { ItemTypes } from '../modules/constants';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { CreateWidgetFactory } from '../modules/widgetFactory';
import { List } from '../components/MiscComponents';
import { AppContext } from '../modules/appContext';
import { AppNavigationProp } from '../modules/types';

interface CustomizeScreenProps {
  navigation: AppNavigationProp<'Customize'>
}

class CustomizeScreen extends Component<CustomizeScreenProps> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  render() {
    const styles = this.context.styles;
    const language = this.context.language;

    const widgetFactory = CreateWidgetFactory(this.context);

    const listItems: any = [
      {
        id: ItemTypes.MOVE,
        title: language.movement,
        iconName: widgetFactory[ItemTypes.MOVE].config.addIcon.name,
        iconType: widgetFactory[ItemTypes.MOVE].config.addIcon.type,
        onPress: () => { this.props.navigation.navigate('CustomizeSetting', { id: ItemTypes.MOVE, title: language.movement }); }
      },
      {
        id: ItemTypes.CREATE,
        title: language.creativity,
        iconName: widgetFactory[ItemTypes.CREATE].config.addIcon.name,
        iconType: widgetFactory[ItemTypes.CREATE].config.addIcon.type,
        onPress: () => { this.props.navigation.navigate('CustomizeSetting', { id: ItemTypes.CREATE, title: language.creativity }); }
      }
    ];

    return (
      <ScreenBackground>
        <ScreenContent style={[styles.screenBodyContainerLargeMargin, { paddingHorizontal: 0 }]}>
          <List data={listItems} />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default CustomizeScreen;