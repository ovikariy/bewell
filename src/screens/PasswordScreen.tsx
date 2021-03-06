import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { startChangePassword, verifyCredentials, updatePassword } from '../redux/passwordActionCreators';
import { ParagraphText, PasswordInput, ButtonPrimary, HorizontalLine, Spacer, PINInputWithButton, PasswordInputWithButton, Toast, ButtonSecondary } from '../components/MiscComponents';
import { ToastAndroid, View } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { ScrollView } from 'react-native-gesture-handler';
import { StackActions } from '@react-navigation/native';
import { isNullOrEmpty } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppNavigationProp } from '../modules/types';
import { sizes } from '../assets/styles/style';

const mapStateToProps = (state: RootState) => ({
  STORE: state.STORE,
  AUTH: state.AUTH,
  OPERATION: state.OPERATION,
  CHANGEPASSWORD: state.CHANGEPASSWORD
});

const mapDispatchToProps = {
  startChangePassword,
  verifyCredentials,
  updatePassword
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface PasswordScreenState {
  oldPassword?: string,
  newPassword?: string,
  newPasswordReentered?: string,
  PIN?: string
}

interface PasswordScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'Password'>
}

class PasswordScreen extends Component<PasswordScreenProps, PasswordScreenState> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: PasswordScreenProps) {
    super(props);

    this.state = {
      oldPassword: undefined,
      newPassword: undefined,
      newPasswordReentered: undefined,
      PIN: undefined
    };
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
    this.props.verifyCredentials(this.state.oldPassword, undefined);
  }

  verifyPin() {
    const language = this.context.language;

    if (isNullOrEmpty(this.state.PIN)) {
      Toast.show(language.pinConfirm);
      return;
    }
    this.props.verifyCredentials(undefined, this.state.PIN);
  }

  done() {
    this.setState({
      ...this.state,
      oldPassword: undefined,
      newPassword: undefined,
      newPasswordReentered: undefined,
      PIN: undefined
    });
    this.props.navigation.dispatch(StackActions.popToTop());
  }

  save() {
    const language = this.context.language;

    if (!this.state.oldPassword || isNullOrEmpty(this.state.oldPassword) || !this.state.newPassword || isNullOrEmpty(this.state.newPassword) || this.state.newPassword.length < 8) {
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
      <Spacer />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, styles.buttonMedium]}
        title={language.done}
        onPress={() => { this.done(); }}
      />
    </View>;
  }

  renderCredentialsReprompt() {
    const language = this.context.language;
    const styles = this.context.styles;

    /* re-prompt for credentials */
    if (this.props.AUTH.isPinLocked) {
      return <View style={styles.flex}>
        <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.pinConfirm}</ParagraphText>
        <HorizontalLine />
        <PINInputWithButton
          containerStyle={[styles.bottomPositioned]}
          placeholder={language.pinEnter}
          onPress={() => this.verifyPin()}
          value={this.state.PIN}
          onChangeText={(value) => { this.setState({ ...this.state, PIN: value }); }}
        />
      </View>;
    }
    else {
      return <View style={styles.flex}>
        <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.passwordConfirm}</ParagraphText>
        <HorizontalLine />
        <PasswordInputWithButton
          containerStyle={[styles.bottomPositioned]}
          placeholder={language.passwordEnter}
          onPress={() => this.verifyPassword()}
          value={this.state.oldPassword}
          onChangeText={(value) => { this.setState({ ...this.state, oldPassword: value }); }}
        />
      </View>;
    }
  }

  renderPasswordFields() {
    const language = this.context.language;
    const styles = this.context.styles;

    /* if the user uses PIN lock then we ask for both PIN and password;
    password for security reasons and PIN for encrypting new password */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordChoose}</ParagraphText>
      <Spacer height={sizes[20]} />
      <ParagraphText style={[styles.placeholderText, { fontSize: sizes[16] }]}>{language.passwordMinimum}</ParagraphText>
      <Spacer height={sizes[20]} />
      {this.props.AUTH.isPinLocked ?
        <PasswordInput
          inputStyle={styles.bodyTextLarge}
          placeholder={language.passwordConfirmPlaceholder}
          value={this.state.oldPassword}
          onChangeText={(value) => { this.setState({ ...this.state, oldPassword: value }); }}
        /> : <React.Fragment />}
      <PasswordInput
        inputStyle={styles.bodyTextLarge}
        placeholder={language.passwordEnterNewPlaceholder}
        value={this.state.newPassword}
        onChangeText={(value) => { this.setState({ ...this.state, newPassword: value }); }}
      />
      <PasswordInput
        inputStyle={styles.bodyTextLarge}
        placeholder={language.passwordReEnterPlaceholder}
        value={this.state.newPasswordReentered}
        onChangeText={(value) => { this.setState({ ...this.state, newPasswordReentered: value }); }}
        onSubmitEditing={() => { this.save(); }}
      />
      <ButtonSecondary
        containerStyle={[styles.buttonSmallCentered]}
        title={language.save}
        onPress={() => { this.save(); }}
        iconName='check'
      />
    </View>;
  }

  renderFields() {
    if (this.props.CHANGEPASSWORD.isComplete === true)
      return this.renderPasswordChangeComplete();

    if (this.props.CHANGEPASSWORD.isPasswordVerified !== true)
      return this.renderCredentialsReprompt();

    return this.renderPasswordFields();
  }

  render() {
    const styles = this.context.styles;

    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#scrollView-and-keyboard */>
          <ScreenContent style={styles.screenBodyContainerLargeMargin} >
            {this.renderFields()}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connector(PasswordScreen);


