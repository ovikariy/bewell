import React from 'react';
import { TouchableOpacity, SectionList, Image, StyleSheet, Text, View, Button } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Constants from 'expo-constants';
import { text } from '../modules/Constants';
import { styles, colors } from '../assets/styles/style';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { ParagraphText } from '../components/MiscComponents';
import { Icon } from 'react-native-elements';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: text.settingsScreen.title
  };

  constructor(props) {
    super(props);
    //this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'BackupRestore' }));
  }

  render() {
    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true}>
          <Settings navigation={this.props.navigation} />
        </ScreenContent>
      </ScreenBackground>
    )
  }
}

class Settings extends React.Component {
  render() {
    const sections = [
      {
        data: [{ value: <SectionText text={text.settingsScreen.dataPrivacy} iconName='lock' onPress={() => { this.props.navigation.navigate('Password') }} /> }]
      },
      {
        data: [{ value: <SectionText text={text.settingsScreen.importExport} iconName='retweet' onPress={() => { this.props.navigation.navigate('BackupRestore') }} /> }]
      },
      // {
      //   data: [{ }],
      //   title: 'This is a section separator'
      // },
      {
        data: [{ value: <SectionText text={text.settingsScreen.version} iconName='info-circle' subText={Constants.manifest.version} /> }],
      }
    ];

    return (
      <SectionList style={{ marginTop: 20, marginLeft: 10 }}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        stickySectionHeadersEnabled={true}
        keyExtractor={(item, index) => index}
        sections={sections}
      />
    );
  }

  renderSectionHeader = ({ section }) => {
    return section.title ? <SectionHeader title={section.title} /> : <View />;
  };

  renderItem = ({ item }) => {
    if (!item.value) {
      return (<View />);
    }
    return (
      <SectionContent>
        {item.value}
      </SectionContent>
    );
  };
}

const SectionHeader = ({ title }) => {
  return (
    <View>
      <Text style={styles.bodyText}>
        {title}
      </Text>
    </View>
  );
};

const SectionContent = props => {
  return (
    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
      {props.children}
    </View>
  );
};

const SectionText = props => {
  const sectionIcon = <Icon containerStyle={{ marginRight: 10 }}
    iconStyle={{ width: 30, height: 30 }}
    type='font-awesome'
    name={props.iconName}
    color={colors.bright}
  />;

  const sectionText = <View>
    <ParagraphText style={styles.titleText}>{props.text}</ParagraphText>
    <ParagraphText style={styles.subTitleText}>{props.subText}</ParagraphText>
  </View>;

  if (!props.onPress) {
    return (
      <View style={{ flexDirection: 'row' }}>
        {sectionIcon}
        {sectionText}
      </View>
    );
  }
  else {
    return (
      <TouchableOpacity onPress={() => { props.onPress(); }} style={{ flexDirection: 'row' }}>
        {sectionIcon}
        {sectionText}
      </TouchableOpacity>
    );
  }
};