import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { signIn } from '../redux/authActionCreators';
import { text, stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, Toast, showMessages, PasswordInputWithButton, Spacer, HorizontalLine, LinkButton } from '../components/MiscComponents';
import { View, ScrollView, ImageBackground } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';
import { Image } from 'react-native-animatable';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
  };
}

const mapDispatchToProps = dispatch => ({
  signIn: (password) => dispatch(signIn(password))
});

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null
    }
  }

  submitPassword() {
    if (!this.state.password) {
      Toast.show(text.signInScreen.message1);
      return;
    }
    this.props.signIn(this.state.password);
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground>
        <ScrollView /** @see devnotes.md#region 1.1 */>
          <ScreenHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 40 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.signInScreen.text1}</ParagraphText>
            <HorizontalLine />
            <ParagraphText style={[styles.bodyTextLarge]}>{text.signInScreen.text2}</ParagraphText>
            <Spacer height={70} />
            <PasswordInputWithButton
              placeholder={text.signInScreen.currentPlaceholder}
              onPress={() => this.submitPassword()}
              value={this.state.password}
              leftIconName='lock-outline'
              onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
            />
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ marginTop: 40 }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);