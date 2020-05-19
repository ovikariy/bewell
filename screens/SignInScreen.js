import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { signInPassword, signInPIN } from '../redux/authActionCreators';
import { text, stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, Toast, showMessages, PasswordInputWithButton, Spacer, HorizontalLine, LinkButton, PINInputWithButton } from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';

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
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      PIN: null
    }
  }

  submitPassword() {
    if (!this.state.password) {
      Toast.show(text.signInScreen.message2);
      return;
    }
    this.props.signInPassword(this.state.password);
    this.setState({ ...this.state, password: null });
  }

  submitPIN() {
    if (!this.state.PIN) {
      Toast.show(text.signInScreen.message3);
      return;
    }
    this.props.signInPIN(this.state.PIN);
    this.setState({ ...this.state, PIN: null });
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 30 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.signInScreen.text1}</ParagraphText>
            <HorizontalLine />
            <Spacer height={70} />
            {this.props[stateConstants.AUTH].isPinLocked ?
              <PINInputWithButton
                containerStyle={[styles.bottomPositioned]}
                placeholder={text.signInScreen.currentPlaceholder3}
                onPress={() => this.submitPIN()}
                value={this.state.PIN}
                leftIconName='lock-outline'
                onChangeText={(value) => { this.setState({ ...this.state, PIN: value }) }}
              />
              :
              <PasswordInputWithButton
                containerStyle={[styles.bottomPositioned]}
                placeholder={text.signInScreen.currentPlaceholder2}
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