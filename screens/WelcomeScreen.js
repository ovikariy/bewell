import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { Button, Icon } from 'react-native-elements';
import { text, stateConstants } from '../modules/Constants';
import { initialize, skipSecuritySetup } from '../redux/authActionCreators';
import {
  ActivityIndicator, ParagraphText, PasswordInput, Toast,
  showMessages, Spacer, HorizontalLine, LinkButton, ButtonPrimary, IconForButton
} from '../components/MiscComponents';
import { View, ScrollView, ImageBackground, Image } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.AUTH]: state[stateConstants.AUTH]
  };
}

const mapDispatchToProps = dispatch => ({
  initialize: () => dispatch(initialize()),
  skipSecuritySetup: () => dispatch(skipSecuritySetup())
});

class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  quickSetup() {
    this.props.navigation.navigate('SetupSecurity');
  }

  skipSetup() {
    this.props.initialize();
    this.props.skipSecuritySetup();
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground>
        <ScrollView /** @see devnotes.md#region 1.1 */>
          <ScreenHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 40 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.welcomeScreen.text1}</ParagraphText>
            <HorizontalLine />
            <ParagraphText style={[styles.bodyTextLarge]}>{text.welcomeScreen.text2}</ParagraphText>
            <Spacer height={40} />
            <ButtonPrimary
              containerStyle={{ marginTop: 20 }}
              title={text.welcomeScreen.button1}
              onPress={() => { this.quickSetup() }}
              name='chevron-right' iconRight={true} iconStyle={[styles.iconPrimary]}
            />
            <Spacer height={40} />
            <LinkButton title={text.welcomeScreen.button2} titleStyle={{ opacity: 0.5 }}
              onPress={() => this.skipSetup()} />
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ position: 'absolute', top: 150 }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);


