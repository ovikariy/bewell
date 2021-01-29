import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { signInPassword, signInPIN } from '../redux/authActionCreators';
import { ParagraphText, Toast, PasswordInputWithButton, Spacer, HorizontalLine, PINInputWithButton } from '../components/MiscComponents';
import { ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenImageHeader } from '../components/ScreenComponents';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';

const mapStateToProps = (state: RootState) => ({
  AUTH: state.AUTH,
  OPERATION: state.OPERATION
});

const mapDispatchToProps = {
  signInPassword,
  signInPIN
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface SignInScreenState {
  password?: string,
  PIN?: string
}

interface SignInScreenProps extends PropsFromRedux {
}

class SignInScreen extends Component<SignInScreenProps, SignInScreenState> {

  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: SignInScreenProps) {
    super(props);
    this.state = {
      password: undefined,
      PIN: undefined
    };
  }

  submitPassword() {
    const language = this.context.language;

    if (!this.state.password) {
      Toast.show(language.passwordInvalid);
      return;
    }
    this.props.signInPassword(this.state.password);
    this.setState({ ...this.state, password: undefined });
  }

  submitPIN() {
    const language = this.context.language;

    if (!this.state.PIN) {
      Toast.show(language.pinInvalid);
      return;
    }
    this.props.signInPIN(this.state.PIN);
    this.setState({ ...this.state, PIN: undefined });
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#scrollView-and-keyboard */>
          <ScreenImageHeader />
          <ScreenContent style={styles.screenBodyContainerSmallMargin} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.welcomeBack}</ParagraphText>
            <HorizontalLine />
            {this.props.AUTH.isPinLocked ?
              <PINInputWithButton
                containerStyle={[styles.bottomPositioned]}
                placeholder={language.pinEnter}
                onPress={() => this.submitPIN()}
                value={this.state.PIN}
                onChangeText={(value) => { this.setState({ ...this.state, PIN: value }); }}
              />
              :
              <PasswordInputWithButton
                containerStyle={[styles.bottomPositioned]}
                placeholder={language.passwordEnter}
                onPress={() => this.submitPassword()}
                value={this.state.password}
                onChangeText={(value) => { this.setState({ ...this.state, password: value }); }}
              />
            }
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connector(SignInScreen);