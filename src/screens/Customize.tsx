import React, { Component } from 'react';
import { EncryptedSettingsEnum, ItemTypes } from '../modules/constants';
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
        id: EncryptedSettingsEnum.WidgetOrder,
        title: language.widgetOrder,
        iconName: 'widgets',
        iconType: 'material-community',
        onPress: () => { this.props.navigation.navigate('CustomizeWidgets'); }
      }
    ];

    /** add encrypted settings */
    Object.values(EncryptedSettingsEnum).forEach(item => {
      if (widgetFactory[item]) {
        const widgetConfig = widgetFactory[item].config;
        listItems.push({
          id: widgetConfig.itemTypeName,
          title: widgetConfig.widgetTitle,
          iconName: widgetConfig.addIcon.name,
          iconType: widgetConfig.addIcon.type,
          onPress: () => { this.props.navigation.navigate('CustomizeSetting', { id: widgetConfig.itemTypeName, title: widgetConfig.widgetTitle }); }
        });
      }
    });

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