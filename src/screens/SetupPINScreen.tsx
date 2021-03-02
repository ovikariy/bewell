import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  ParagraphText, Toast, PasswordInputWithButton,
  Spacer, HorizontalLine, PINInputWithButton, ButtonPrimary
} from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { isNullOrEmpty } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { StackActions } from '@react-navigation/native';
import { startPINsetup, verifyPassword, submitPIN } from '../redux/pinSetupActionCreators';
import { RootState } from '../redux/store';
import { AppNavigationProp } from '../modules/types';
import { sizes } from '../assets/styles/style';

const mapStateToProps = (state: RootState) => ({
  OPERATION: state.OPERATION,
  PINSETUP: state.PINSETUP
});

const mapDispatchToProps = {
  verifyPassword,
  submitPIN,
  startPINsetup
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface SetupPINScreenState {
  password?: string,
  PIN?: string,
  PINreentered?: string,
  showPINReentered: boolean
}

interface SetupPINScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'SetupPIN'>
}

class SetupPINScreen extends Component<SetupPINScreenProps, SetupPINScreenState> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: SetupPINScreenProps) {
    super(props);
    this.state = {
      password: undefined,
      PIN: undefined,
      PINreentered: undefined,
      showPINReentered: false
    };
  }

  componentDidMount() {
    this.props.startPINsetup(); /* this will reset flags used to determine if password has been verified etc */
  }

  reset() {
    this.setState({
      ...this.state,
      password: undefined,
      PIN: undefined,
      PINreentered: undefined,
      showPINReentered: false
    });
  }

  showPINfieldReenter() {
    const language = this.context.language;

    if (!this.state.PIN || isNullOrEmpty(this.state.PIN) || this.state.PIN.length < 4) {
      Toast.show(language.pinUseDigits);
      return;
    }
    this.setState({
      ...this.state,
      showPINReentered: true
    });
  }

  submitPIN() {
    const language = this.context.language;

    if (!this.state.PIN || this.state.PIN !== this.state.PINreentered) {
      Toast.show(language.pinMatch);
      this.setState({
        ...this.state,
        PIN: undefined,
        PINreentered: undefined,
        showPINReentered: false
      });
      return;
    }

    if (!this.state.password || isNullOrEmpty(this.state.password)) {
      Toast.show(language.passwordPleaseEnter);
      return;
    }

    this.props.submitPIN(this.state.password, this.state.PIN);
  }

  verifyPassword() {
    const language = this.context.language;

    if (!this.state.password || isNullOrEmpty(this.state.password)) {
      Toast.show(language.passwordPleaseEnter);
      return;
    }
    this.props.verifyPassword(this.state.password);
  }

  renderPINSetupComplete() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.pinHasSet}</ParagraphText>
      <Spacer />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, styles.buttonMedium]}
        title={language.done}
        onPress={() => { this.props.navigation.dispatch(StackActions.popToTop()); }}
      />
    </View>;
  }

  renderPasswordField() {
    const language = this.context.language;
    const styles = this.context.styles;

    /* re-prompt for password even if logged in; if verified then allow setting PIN */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordConfirm}</ParagraphText>
      <Spacer />
      <PasswordInputWithButton value={this.state.password}
        containerStyle={styles.bottomPositioned}
        placeholder={language.password}
        onPress={() => this.verifyPassword()}
        onChangeText={(value) => { this.setState({ ...this.state, password: value }); }}
      />
    </View>;
  }

  renderPINField() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.pinEnter}</ParagraphText>
      <Spacer height={sizes[20]} />
      <ParagraphText style={[styles.placeholderText, { fontSize: sizes[16] }]}>{language.pinTip}</ParagraphText>
      <Spacer   />
      <PINInputWithButton value={this.state.PIN}
        containerStyle={styles.bottomPositioned}
        placeholder={language.pinEnter}
        onPress={() => this.showPINfieldReenter()}
        onChangeText={(value) => { this.setState({ ...this.state, PIN: value }); }}
      />
    </View>;
  }

  renderPINReenter() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.pinReEnter}</ParagraphText>
      <Spacer   />
      <PINInputWithButton value={this.state.PINreentered}
        containerStyle={styles.bottomPositioned}
        placeholder={language.pinReEnterPlaceholder}
        onPress={() => this.submitPIN()}
        onChangeText={(value) => { this.setState({ ...this.state, PINreentered: value }); }}
      />
    </View>;
  }

  renderFields() {
    if (this.props.PINSETUP.isPinSetupComplete === true)
      return this.renderPINSetupComplete();

    if (this.props.PINSETUP.isPasswordVerified !== true)
      return this.renderPasswordField();

    if (this.state.showPINReentered === true)
      return this.renderPINReenter();

    return this.renderPINField();
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
        <ScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={{ flexGrow: 1 }}  /** @see devnotes.md#scrollView-and-keyboard */>
          <ScreenContent style={styles.screenBodyContainerLargeMargin} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.pinLockYourApp}</ParagraphText>
            <HorizontalLine />
            {this.renderFields()}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connector(SetupPINScreen);