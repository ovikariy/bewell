import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { setupNewEncryption } from '../redux/passwordActionCreators';
import { initialize } from '../redux/welcomeActionCreators';
import { ParagraphText, Toast, PasswordInputWithButton, Spacer, HorizontalLine } from '../components/MiscComponents';
import { ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenImageHeader } from '../components/ScreenComponents';
import { isNullOrEmpty } from '../modules/utils';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';

const mapStateToProps = (state: RootState) => ({
  OPERATION: state.OPERATION
});

const mapDispatchToProps = {
  setupNewEncryption,
  initialize
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface SetupPasswordScreenState {
  password?: string,
  passwordReentered?: string,
  showPasswordReentered: boolean,
  instructionText: string
}

/* this screen is shown on app launch if the user has not setup security yet */
class SetupPasswordScreen extends Component<PropsFromRedux, SetupPasswordScreenState> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: PropsFromRedux) {
    super(props);
    this.state = {
      password: undefined,
      passwordReentered: undefined,
      showPasswordReentered: false,
      instructionText: ''
    };
  }

  reset() {
    this.setState({
      ...this.state,
      password: undefined,
      passwordReentered: undefined,
      showPasswordReentered: false,
      instructionText: ''
    });
  }

  showPasswordReenter() {
    const language = this.context.language;

    if (!this.state.password || isNullOrEmpty(this.state.password) || this.state.password.length < 8) {
      Toast.show(language.passwordMinimum);
      return;
    }
    this.setState({ ...this.state, showPasswordReentered: true, instructionText: language.passwordPleaseReEnter });
  }

  submitPassword() {
    const language = this.context.language;

    if (this.state.password !== this.state.passwordReentered) {
      Toast.show(language.passwordsMatch);
      this.reset();
      return;
    }

    if (!this.state.password || isNullOrEmpty(this.state.password) || this.state.password.length < 8) {
      Toast.show(language.passwordMinimum);
      return;
    }

    this.props.setupNewEncryption(this.state.password);
    this.props.initialize();
    this.reset();
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    const passwordField = this.state.showPasswordReentered === false ?
      <PasswordInputWithButton
        containerStyle={[styles.bottomPositioned]}
        placeholder={language.passwordEnterNewPlaceholder}
        onPress={() => this.showPasswordReenter()}
        value={this.state.password}
        onChangeText={(value) => { this.setState({ ...this.state, password: value }); }}
      /> :
      <PasswordInputWithButton
        containerStyle={[styles.bottomPositioned]}
        placeholder={language.passwordReEnterPlaceholder}
        onPress={() => this.submitPassword()}
        value={this.state.passwordReentered}
        onChangeText={(value) => { this.setState({ ...this.state, passwordReentered: value }); }}
      />;

    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#scrollView-and-keyboard */>
          <ScreenImageHeader />
          <ScreenContent style={styles.screenBodyContainerMediumMargin}>
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.secureDataWith}</ParagraphText>
            <HorizontalLine />
            <ParagraphText style={[styles.bodyTextLarge]}>{this.state.instructionText || language.passwordMinimum}</ParagraphText>
            {!this.props.OPERATION.isLoading && passwordField}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connector(SetupPasswordScreen);


