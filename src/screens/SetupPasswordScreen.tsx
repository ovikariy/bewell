import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { setupNewEncryption } from '../redux/passwordActionCreators';
import { initialize } from '../redux/welcomeActionCreators';
import { stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, Toast, PasswordInputWithButton, Spacer, HorizontalLine } from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenImageHeader } from '../components/ScreenComponents';
import { isNullOrEmpty } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';
import { RootState } from '../redux/configureStore';

const mapStateToProps = (state: RootState) => ({
  OPERATION: state.OPERATION
})

const mapDispatchToProps = {
  setupNewEncryption: (password: string) => setupNewEncryption(password),
  initialize: () => initialize()
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface SetupPasswordScreenState {
  password?: string,
  passwordReentered?: string,
  showPasswordReentered: boolean,
  instructionText: string
}

/* this screen is shown on app launch if the user has not setup security yet */
class SetupPasswordScreen extends Component<PropsFromRedux, SetupPasswordScreenState> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  constructor(props: PropsFromRedux) {
    super(props);
    this.state = {
      password: undefined,
      passwordReentered: undefined,
      showPasswordReentered: false,
      instructionText: ''
    }
  }

  reset() {
    const language = this.context.language;

    this.setState({
      ...this.state,
      password: undefined,
      passwordReentered: undefined,
      showPasswordReentered: false,
      instructionText: language.passwordMinimum
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
      this.setState({
        ...this.state,
        password: undefined,
        passwordReentered: undefined,
        showPasswordReentered: false
      });
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

    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenImageHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 40 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.secureDataWith}</ParagraphText>
            <HorizontalLine />
            <ParagraphText style={[styles.bodyTextLarge]}>{this.state.instructionText}</ParagraphText>
            <Spacer height={40} />
            <View style={[styles.bottomPositioned]} >
              {this.state.showPasswordReentered == false ?
                <PasswordInputWithButton
                  containerStyle={{ minWidth: 300 }}
                  placeholder={language.passwordEnterNewPlaceholder}
                  onPress={() => this.showPasswordReenter()}
                  value={this.state.password}
                  onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
                /> :
                <PasswordInputWithButton
                  containerStyle={{ minWidth: 300 }}
                  placeholder={language.passwordReEnterPlaceholder}
                  onPress={() => this.submitPassword()}
                  value={this.state.passwordReentered}
                  onChangeText={(value) => { this.setState({ ...this.state, passwordReentered: value }) }}
                />
              }
            </View>
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connector(SetupPasswordScreen);


