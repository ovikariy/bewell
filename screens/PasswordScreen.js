import React, { Component } from 'react';
import { connect } from 'react-redux';
import { stateConstants } from '../modules/Constants';
import { startChangePassword, verifyCredentials, updatePassword } from '../redux/passwordActionCreators';
import { ParagraphText, PasswordInput, ActivityIndicator, ButtonPrimary, HorizontalLine, Spacer, PINInputWithButton, PasswordInputWithButton, Toast, ButtonSecondary } from '../components/MiscComponents';
import { ToastAndroid, View } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import { isNullOrEmpty } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';

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
  static contextType = AppContext;

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
    const language = this.context.language;
    if (isNullOrEmpty(this.state.oldPassword)) {
      Toast.show(language.passwordConfirm);
      return;
    }
    this.props.verifyCredentials(this.state.oldPassword, null);
  }

  verifyPin() {
    const language = this.context.language;

    if (isNullOrEmpty(this.state.PIN)) {
      Toast.show(language.pinConfirm);
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
    const language = this.context.language;

    if (isNullOrEmpty(this.state.oldPassword) || isNullOrEmpty(this.state.newPassword) || this.state.newPassword.length < 8) {
      ToastAndroid.show(language.passwordFieldsRequired, ToastAndroid.LONG);
      return;
    }
    if (this.state.newPassword !== this.state.newPasswordReentered) {
      ToastAndroid.show(language.passwordsMatch, ToastAndroid.LONG);
      return;
    }
    this.props.updatePassword(this.state.oldPassword, this.state.newPassword, this.state.PIN);
  }

  renderPasswordChangeComplete() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordChanged}</ParagraphText>
      <Spacer height={70} />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: 180 }]}
        title={language.done}
        onPress={() => { this.done() }}
      />
    </View>;
  }

  renderCredentialsReprompt() {
    const language = this.context.language;
    const styles = this.context.styles;

    /* re-prompt for credentials */
    if (this.props[stateConstants.AUTH].isPinLocked) {
      return <View style={styles.flex}>
        <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.pinConfirm}</ParagraphText>
        <HorizontalLine />
        <PINInputWithButton
          containerStyle={[styles.bottomPositioned]}
          placeholder={language.pinEnter}
          onPress={() => this.verifyPin()}
          value={this.state.PIN}
          leftIconName='lock-outline'
          onChangeText={(value) => { this.setState({ ...this.state, PIN: value }) }}
        />
      </View>
    }
    else {
      return <View style={styles.flex}>
        <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.passwordConfirm}</ParagraphText>
        <HorizontalLine />
        <PasswordInputWithButton
          containerStyle={[styles.bottomPositioned]}
          placeholder={language.passwordEnter}
          onPress={() => this.verifyPassword()}
          value={this.state.password}
          leftIconName='lock-outline'
          onChangeText={(value) => { this.setState({ ...this.state, oldPassword: value }) }}
        />
      </View>
    }
  }

  renderPasswordFields() {
    const language = this.context.language;
    const styles = this.context.styles;

    /* if the user uses PIN lock then we ask for both PIN and password; 
    password for security reasons and PIN for encrypting new password */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordChoose}</ParagraphText>
      <Spacer height={20} />
      <ParagraphText style={[styles.placeholderText, { fontSize: 16 }]}>{language.passwordMinimum}</ParagraphText>
      <Spacer height={20} />
      {this.props[stateConstants.AUTH].isPinLocked ?
        <PasswordInput
          inputStyle={styles.bodyTextLarge}
          placeholder={language.passwordConfirmPlaceholder}
          value={this.state.oldPassword}
          leftIconName='lock-outline'
          onChangeText={(value) => { this.setState({ ...this.state, oldPassword: value }) }}
        /> : <React.Fragment />}
      <PasswordInput
        inputStyle={styles.bodyTextLarge}
        placeholder={language.passwordEnterNewPlaceholder}
        value={this.state.newPassword}
        leftIconName='lock-outline'
        onChangeText={(value) => { this.setState({ ...this.state, newPassword: value }) }}
      />
      <PasswordInput
        inputStyle={styles.bodyTextLarge}
        placeholder={language.passwordReEnterPlaceholder}
        value={this.state.newPasswordReentered}
        leftIconName='lock-outline'
        onChangeText={(value) => { this.setState({ ...this.state, newPasswordReentered: value }) }}
        onSubmitEditing={() => { this.save() }}
      />
      <ButtonSecondary 
        containerStyle={[{ marginTop: 60, width: 200, alignSelf: 'center' }]}
        title={language.save}
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
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 70 }} >
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


