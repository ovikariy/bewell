import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { signInPassword, signInPIN } from '../redux/authActionCreators';
import { text, stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, Toast, showMessages, PasswordInputWithButton, Spacer, HorizontalLine, LinkButton, PINInputWithButton } from '../components/MiscComponents';
import { View, ScrollView, ImageBackground } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';
import { Image } from 'react-native-animatable';

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
  }

  submitPIN() {
    if (!this.state.PIN) {
      Toast.show(text.signInScreen.message3);
      return;
    }
    this.props.signInPIN(this.state.PIN);
    this.setState({ ...this.state, PIN: null })
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    /* if the password is saved in store, it means it has been ecnrypted with a PIN number and 
    the user opted for a PIN login */
    const isPasswordSignIn = this.props[stateConstants.AUTH] && this.props[stateConstants.AUTH].hasPasswordInStore !== true;

    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 40 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.signInScreen.text1}</ParagraphText>
            <HorizontalLine />
            {isPasswordSignIn ?
              <React.Fragment>
                <ParagraphText style={[styles.bodyTextLarge]}>{text.signInScreen.text2}</ParagraphText>
                <Spacer height={70} />
                <PasswordInputWithButton
                  containerStyle={[styles.bottomPositioned]}
                  placeholder={text.signInScreen.currentPlaceholder2}
                  onPress={() => this.submitPassword()}
                  value={this.state.password}
                  leftIconName='lock-outline'
                  onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
                />
              </React.Fragment>
              : <React.Fragment>
                <ParagraphText style={[styles.bodyTextLarge]}>{text.signInScreen.text3}</ParagraphText>
                <Spacer height={70} />
                <PINInputWithButton
                  containerStyle={[styles.bottomPositioned]}
                  placeholder={text.signInScreen.currentPlaceholder3}
                  onPress={() => this.submitPIN()}
                  value={this.state.PIN}
                  leftIconName='lock-outline'
                  onChangeText={(value) => { this.setState({ ...this.state, PIN: value }) }}
                />
              </React.Fragment>
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