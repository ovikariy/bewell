import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { setupNewEncryption } from '../redux/securityActionCreators';
import { initialize, skipSecuritySetup } from '../redux/welcomeActionCreators';
import { text, stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, Toast, showMessages, PasswordInputWithButton, Spacer, HorizontalLine, LinkButton } from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';
import { isNullOrEmpty } from '../modules/helpers';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
  };
}

const mapDispatchToProps = dispatch => ({
  setupNewEncryption: (password) => dispatch(setupNewEncryption(password)),
  skipSecuritySetup: () => dispatch(skipSecuritySetup()),
  initialize: () => dispatch(initialize())
});

/* this screen is shown on app launch if the user has not setup security yet */
class SetupSecurityScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      passwordReentered: null,
      showPasswordReentered: false,
      instructionText: text.setupSecurityScreen.text2
    }
  }

  reset() {
    this.setState({
      ...this.state,
      password: null,
      passwordReentered: null,
      showPasswordReentered: false,
      instructionText: text.setupSecurityScreen.text2
    });
  }

  showPasswordReenter() {
    if (isNullOrEmpty(this.state.password) || this.state.password.length < 8) {
      Toast.show(text.setupSecurityScreen.message2);
      return;
    }
    this.setState({ ...this.state, showPasswordReentered: true, instructionText: text.setupSecurityScreen.text3 });
  }

  skipSecuritySetup() {
    this.props.skipSecuritySetup();
    this.reset();
  }

  submitPassword() {
    if (this.state.password !== this.state.passwordReentered) {
      Toast.show(text.setupSecurityScreen.message1);
      this.setState({
        ...this.state,
        password: null,
        passwordReentered: null,
        showPasswordReentered: false
      });
    }
    this.props.setupNewEncryption(this.state.password);
    this.props.initialize();
    this.reset();
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 40 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.setupSecurityScreen.text1}</ParagraphText>
            <HorizontalLine />
            <ParagraphText style={[styles.bodyTextLarge]}>{this.state.instructionText}</ParagraphText>
            <Spacer height={40} />
            <View style={[styles.bottomPositioned]} >
              {this.state.showPasswordReentered == false ?
                <PasswordInputWithButton
                  containerStyle={{ minWidth: 300 }}
                  placeholder={text.setupSecurityScreen.placeholder1}
                  onPress={() => this.showPasswordReenter()}
                  value={this.state.password}
                  leftIconName='lock-outline'
                  onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
                /> :
                <PasswordInputWithButton
                  containerStyle={{ minWidth: 300 }}
                  placeholder={text.setupSecurityScreen.placeholder2}
                  onPress={() => this.submitPassword()}
                  value={this.state.passwordReentered}
                  leftIconName='lock-outline'
                  onChangeText={(value) => { this.setState({ ...this.state, passwordReentered: value }) }}
                />
              }
              <Spacer height={20} />
              <LinkButton title={text.setupSecurityScreen.link1} titleStyle={{ opacity: 0.5 }}
                onPress={() => this.skipSecuritySetup()} />
            </View>
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ position: 'absolute' }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupSecurityScreen);


