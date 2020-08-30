import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { signInPassword, signInPIN } from '../redux/authActionCreators';
import { stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, Toast, PasswordInputWithButton, Spacer, HorizontalLine, PINInputWithButton } from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenImageHeader } from '../components/ScreenComponents';
import { AppContext } from '../modules/AppContext';
import { RootState } from '../redux/configureStore';

const mapStateToProps = (state: RootState) => ({
  AUTH: state.AUTH,
  OPERATION: state.OPERATION
})

const mapDispatchToProps = {
  signInPassword: (password: string) => signInPassword(password),
  signInPIN: (pin: string) => signInPIN(pin)
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface SignInScreenState {
  password?: string,
  PIN?: string
}

interface SignInScreenProps {
}

class SignInScreen extends Component<PropsFromRedux & SignInScreenProps, SignInScreenState> {

  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  constructor(props: PropsFromRedux & SignInScreenProps) {
    super(props);
    this.state = {
      password: undefined,
      PIN: undefined
    }
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
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenImageHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 30 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.welcomeBack}</ParagraphText>
            <HorizontalLine />
            <Spacer height={70} />
            {this.props.AUTH.isPinLocked ?
              <PINInputWithButton
                containerStyle={[styles.bottomPositioned]}
                placeholder={language.pinEnter}
                onPress={() => this.submitPIN()}
                value={this.state.PIN}
                onChangeText={(value) => { this.setState({ ...this.state, PIN: value }) }}
              />
              :
              <PasswordInputWithButton
                containerStyle={[styles.bottomPositioned]}
                placeholder={language.passwordEnter}
                onPress={() => this.submitPassword()}
                value={this.state.password}
                onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
              />
            }
            {this.props.OPERATION.isLoading ?
              <ActivityIndicator style={{ position: 'absolute' }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen);