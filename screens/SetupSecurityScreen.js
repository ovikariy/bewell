import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { setupNewEncryption } from '../redux/securityActionCreators';
import { initialize, skipSecuritySetup } from '../redux/authActionCreators';
import { text, stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, PasswordInput, Toast, showMessages, PasswordInputWithButton, Spacer, HorizontalLine, LinkButton } from '../components/MiscComponents';
import { View, ScrollView, ImageBackground } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';
import { Image } from 'react-native-animatable';

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
      newPassword: null,
      newPasswordReentered: null,
      showNewPasswordReentered: false,
      instructionText: text.setupSecurityScreen.text2
    }
  }

  reset() {
    this.setState({
      ...this.state,
      newPassword: null,
      newPasswordReentered: null,
      showNewPasswordReentered: false,
      instructionText: text.setupSecurityScreen.text2
    });
  }

  showPasswordReenter() {
    this.setState({ ...this.state, showNewPasswordReentered: true, instructionText: text.setupSecurityScreen.text3 });
  }

  skipSecuritySetup() {
    this.props.skipSecuritySetup();
    this.props.initialize();
    this.reset();
  }

  submitPassword() {
    if (this.state.newPassword !== this.state.newPasswordReentered) {
      Toast.show(text.setupSecurityScreen.message1);
      this.setState({
        ...this.state,
        newPassword: null,
        newPasswordReentered: null,
        showNewPasswordReentered: false
      });
    }
    this.props.setupNewEncryption(this.state.newPassword);
    this.props.initialize();
    this.reset();
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground>
        <ScrollView /** @see devnotes.md#region 1.1 */>
          <ScreenHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 40 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.setupSecurityScreen.text1}</ParagraphText>
            <HorizontalLine />
            <ParagraphText style={[styles.bodyTextLarge]}>{this.state.instructionText}</ParagraphText>
            <Spacer height={40} />
            {this.state.showNewPasswordReentered == false ?
              <View style={styles.flex}>
                <PasswordInputWithButton
                  placeholder={text.setupSecurityScreen.placeholder1}
                  onPress={() => this.showPasswordReenter()}
                  value={this.state.newPassword}
                  leftIconName='lock-outline'
                  onChangeText={(value) => { this.setState({ ...this.state, newPassword: value }) }}
                />
              </View> : <View>
                <PasswordInputWithButton
                  placeholder={text.setupSecurityScreen.placeholder2}
                  onPress={() => this.submitPassword()}
                  value={this.state.newPasswordReentered}
                  leftIconName='lock-outline'
                  onChangeText={(value) => { this.setState({ ...this.state, newPasswordReentered: value }) }}
                />
              </View>
            }
            <Spacer height={40} />
            <LinkButton title={text.setupSecurityScreen.link1} titleStyle={{ opacity: 0.5 }}
              onPress={() => this.skipSecuritySetup()} />
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ marginTop: 40 }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupSecurityScreen);


