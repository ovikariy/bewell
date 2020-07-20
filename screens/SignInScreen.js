import React, { Component } from 'react';
import { connect } from 'react-redux';
import { signInPassword, signInPIN } from '../redux/authActionCreators';
import { stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, Toast, PasswordInputWithButton, Spacer, HorizontalLine, PINInputWithButton } from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';
import { AppContext } from '../modules/AppContext';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.AUTH]: state[stateConstants.AUTH]
  };
}

const mapDispatchToProps = dispatch => ({
  signInPassword: (password) => dispatch(signInPassword(password)),
  signInPIN: (pin) => dispatch(signInPIN(pin))
});

class SignInScreen extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      password: null,
      PIN: null
    }
  }

  submitPassword() {
    const language = this.context.language;

    if (!this.state.password) {
      Toast.show(language.passwordInvalid);
      return;
    }
    this.props.signInPassword(this.state.password);
    this.setState({ ...this.state, password: null });
  }

  submitPIN() {
    const language = this.context.language;

    if (!this.state.PIN) {
      Toast.show(language.pinInvalid);
      return;
    }
    this.props.signInPIN(this.state.PIN);
    this.setState({ ...this.state, PIN: null });
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 30 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.welcomeBack}</ParagraphText>
            <HorizontalLine />
            <Spacer height={70} />
            {this.props[stateConstants.AUTH].isPinLocked ?
              <PINInputWithButton
                containerStyle={[styles.bottomPositioned]}
                placeholder={language.pinEnter}
                onPress={() => this.submitPIN()}
                value={this.state.PIN}
                leftIconName='lock-outline'
                onChangeText={(value) => { this.setState({ ...this.state, PIN: value }) }}
              />
              :
              <PasswordInputWithButton
                containerStyle={[styles.bottomPositioned]}
                placeholder={language.passwordEnter}
                onPress={() => this.submitPassword()}
                value={this.state.password}
                leftIconName='lock-outline'
                onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
              />
            }
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ position: 'absolute' }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);