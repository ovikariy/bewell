import React, { Component } from 'react';
import { connect } from 'react-redux';
import { text, stateConstants } from '../modules/Constants';
import { startChangePassword, verifyCredentials, updatePassword } from '../redux/passwordActionCreators';
import { ParagraphText, PasswordInput, ActivityIndicator, ButtonPrimary, HorizontalLine, Spacer, PINInputWithButton, PasswordInputWithButton } from '../components/MiscComponents';
import { ToastAndroid, View } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { styles } from '../assets/styles/style';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import { isNullOrEmpty, consoleColors } from '../modules/helpers';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.AUTH]: state[stateConstants.AUTH],
    [stateConstants.CHANGEPASSWORD]: state[stateConstants.CHANGEPASSWORD]
  };
}

const mapDispatchToProps = dispatch => ({
  startChangePassword: () => dispatch(startChangePassword()),
  verifyCredentials: (password, pin) => dispatch(verifyCredentials(password, pin)),
  updatePassword: (oldPassword, newPassword, pin) => dispatch(updatePassword(oldPassword, newPassword, pin))
});

class PasswordScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPassword: null,
      newPassword: null,
      newPasswordReentered: null,
      PIN: null
    }
  }

  componentDidMount() {
    this.props.startChangePassword();
  }

  verifyPassword() {
    if (isNullOrEmpty(this.state.oldPassword)) {
      Toast.show(text.passwordScreen.textConfirmPassword);
      return;
    }
    this.props.verifyCredentials(this.state.oldPassword, null);
  }

  verifyPin() {
    if (isNullOrEmpty(this.state.PIN)) {
      Toast.show(text.passwordScreen.textConfirmPIN);
      return;
    }
    this.props.verifyCredentials(null, this.state.PIN);
  }

  done() {
    this.setState({
      ...this.state,
      oldPassword: null,
      newPassword: null,
      newPasswordReentered: null,
      PIN: null
    });
    this.props.navigation.dispatch(StackActions.popToTop())
  }

  save() {
    if (isNullOrEmpty(this.state.oldPassword) || isNullOrEmpty(this.state.newPassword) || this.state.newPassword.length < 8) {
      ToastAndroid.show(text.passwordScreen.message2, ToastAndroid.LONG);
      return;
    }
    if (this.state.newPassword !== this.state.newPasswordReentered) {
      ToastAndroid.show(text.passwordScreen.message1, ToastAndroid.LONG);
      return;
    }
    this.props.updatePassword(this.state.oldPassword, this.state.newPassword, this.state.PIN);
  }

  renderPasswordChangeComplete() {
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.passwordScreen.textDone}</ParagraphText>
      <Spacer height={70} />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: 180 }]}
        title={text.passwordScreen.buttonDone}
        onPress={() => { this.done() }}
      />
    </View>;
  }

  renderCredentialsReprompt() {
    /* re-prompt for credentials */
    if (this.props[stateConstants.AUTH].isPinLocked) {
      return <View style={styles.flex}>
        <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.passwordScreen.textConfirmPIN}</ParagraphText>
        <HorizontalLine />
        <PINInputWithButton
          containerStyle={[styles.bottomPositioned]}
          placeholder={text.passwordScreen.pinPlaceholder}
          onPress={() => this.verifyPin()}
          value={this.state.PIN}
          leftIconName='lock-outline'
          onChangeText={(value) => { this.setState({ ...this.state, PIN: value }) }}
        />
      </View>
    }
    else {
      return <View style={styles.flex}>
        <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.passwordScreen.textConfirmPassword}</ParagraphText>
        <HorizontalLine />
        <PasswordInputWithButton
          containerStyle={[styles.bottomPositioned]}
          placeholder={text.passwordScreen.currentPlaceholder}
          onPress={() => this.verifyPassword()}
          value={this.state.password}
          leftIconName='lock-outline'
          onChangeText={(value) => { this.setState({ ...this.state, oldPassword: value }) }}
        />
      </View>
    }
  }

  renderPasswordFields() {
    /* if the user uses PIN lock then we ask for both PIN and password; 
    password for security reasons and PIN for encrypting new password */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.passwordScreen.explanation}</ParagraphText>
      <Spacer height={20} />
      <ParagraphText style={[styles.placeholderText, { fontSize: 16 }]}>{text.passwordScreen.textInstructions}</ParagraphText>
      <Spacer height={20} />
      {this.props[stateConstants.AUTH].isPinLocked ?
        <PasswordInput
          inputStyle={styles.bodyTextLarge}
          placeholder={text.passwordScreen.currentPlaceholder}
          value={this.state.oldPassword}
          leftIconName='lock-outline'
          onChangeText={(value) => { this.setState({ ...this.state, oldPassword: value }) }}
        /> : <React.Fragment />}
      <PasswordInput
        inputStyle={styles.bodyTextLarge}
        placeholder={text.passwordScreen.newPlaceholder}
        value={this.state.newPassword}
        leftIconName='lock-outline'
        onChangeText={(value) => { this.setState({ ...this.state, newPassword: value }) }}
      />
      <PasswordInput
        inputStyle={styles.bodyTextLarge}
        placeholder={text.passwordScreen.reEnterPlaceholder}
        value={this.state.newPasswordReentered}
        leftIconName='lock-outline'
        onChangeText={(value) => { this.setState({ ...this.state, newPasswordReentered: value }) }}
        onSubmitEditing={() => { this.save() }}
      />
      <ButtonPrimary
        containerStyle={[{ marginTop: 60, width: 200, alignSelf: 'center' }]}
        buttonStyle={styles.buttonSecondary}
        title={text.passwordScreen.apply}
        onPress={() => { this.save() }}
        name='check'
      />
    </View>;
  }

  renderFields() {
    if (this.props[stateConstants.CHANGEPASSWORD].isComplete === true) {
      return this.renderPasswordChangeComplete();
    }
    if (this.props[stateConstants.CHANGEPASSWORD].isPasswordVerified !== true) {
      return this.renderCredentialsReprompt();
    }
    return this.renderPasswordFields();
  }

  render() {
    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 100 }} >
            {this.renderFields()}
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ position: 'absolute' }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordScreen);


