import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { text, stateConstants } from '../modules/Constants';
import { skipSecuritySetup } from '../redux/welcomeActionCreators';
import { ActivityIndicator, ParagraphText, showMessages, Spacer, HorizontalLine, LinkButton, ButtonPrimary } from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
  };
}

const mapDispatchToProps = dispatch => ({
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
    this.props.skipSecuritySetup();
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 40 }}   >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.welcomeScreen.text1}</ParagraphText>
            <HorizontalLine />
            <ParagraphText style={[styles.bodyTextLarge]}>{text.welcomeScreen.text2}</ParagraphText>
            <Spacer height={40} />
            <View style={[styles.bottomPositioned]} >
              <ButtonPrimary
                buttonStyle={{ paddingHorizontal: 50 }}
                title={text.welcomeScreen.button1}
                onPress={() => { this.quickSetup() }}
                name='chevron-right' iconRight={true} iconStyle={[styles.iconPrimary]}
              />
              <Spacer height={20} />
              <LinkButton title={text.welcomeScreen.button2} titleStyle={{ opacity: 0.5 }}
                onPress={() => this.skipSetup()} />
            </View>
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ position: 'absolute' }} /> : <React.Fragment />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);


