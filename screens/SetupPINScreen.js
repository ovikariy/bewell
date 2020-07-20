import React, { Component } from 'react';
import { connect } from 'react-redux';
import { stateConstants } from '../modules/Constants';
import {
  ActivityIndicator, ParagraphText, Toast, PasswordInputWithButton, Spacer, 
  HorizontalLine, PINInputWithButton, ButtonPrimary
} from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';
import { isNullOrEmpty } from '../modules/helpers';
import { AppContext } from '../modules/AppContext';
import { StackActions } from '@react-navigation/native';

import { startPINsetup, verifyPassword, submitPIN } from '../redux/pinSetupActionCreators';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.PINSETUP]: state[stateConstants.PINSETUP]
  };
}

const mapDispatchToProps = dispatch => ({
  verifyPassword: (password) => dispatch(verifyPassword(password)),
  submitPIN: (password, pin) => dispatch(submitPIN(password, pin)),
  startPINsetup: () => dispatch(startPINsetup())
});

class SetupPINScreen extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {
      password: null,
      PIN: null,
      PINreentered: null,
      showPINReentered: false
    }
  }

  componentDidMount() {
    this.props.startPINsetup(); /* this will reset flags used to determine if password has been verified etc */
  }

  reset() {
    this.setState({
      ...this.state,
      password: null,
      PIN: null,
      PINreentered: null,
      showPINReentered: false
    });
  }

  showPINfieldReenter() {
    const language = this.context.language;

    if (isNullOrEmpty(this.state.PIN) || this.state.PIN.length < 4) {
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

    if (this.state.PIN !== this.state.PINreentered) {
      Toast.show(language.pinMatch);
      this.setState({
        ...this.state,
        PIN: null,
        PINreentered: null,
        showPINReentered: false
      });
      return;
    }
    this.props.submitPIN(this.state.password, this.state.PIN);
  }

  verifyPassword() {
    const language = this.context.language;

    if (isNullOrEmpty(this.state.password)) {
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
      <Spacer height={70} />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: 180 }]}
        title={language.done}
        onPress={() => { this.props.navigation.dispatch(StackActions.popToTop()) }}
      />
    </View>;
  }

  renderPasswordField() {
    const language = this.context.language;
    const styles = this.context.styles;

    /* re-prompt for password even if logged in; if verified then allow setting PIN */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordConfirm}</ParagraphText>
      <Spacer height={70} />
      <PasswordInputWithButton value={this.state.password}
        containerStyle={styles.bottomPositioned}
        placeholder={language.password}
        onPress={() => this.verifyPassword()}
        onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
      />
    </View>;
  }

  renderPINField() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.pinEnter}</ParagraphText>
      <Spacer height={20} />
      <ParagraphText style={[styles.placeholderText, { fontSize: 16 }]}>{language.pinTip}</ParagraphText>
      <Spacer height={70} />
      <PINInputWithButton value={this.state.PIN}
        containerStyle={styles.bottomPositioned}
        placeholder={language.pinEnter}
        onPress={() => this.showPINfieldReenter()}
        onChangeText={(value) => { this.setState({ ...this.state, PIN: value }) }}
      />
    </View>;
  }

  renderPINReenter() {
    const language = this.context.language;
    const styles = this.context.styles;

    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.pinReEnter}</ParagraphText>
      <Spacer height={70} />
      <PINInputWithButton value={this.state.PINreentered}
        containerStyle={styles.bottomPositioned}
        placeholder={language.pinReEnterPlaceholder}
        onPress={() => this.submitPIN()}
        onChangeText={(value) => { this.setState({ ...this.state, PINreentered: value }) }}
      />
    </View>;
  }

  renderFields() {
    if (this.props[stateConstants.PINSETUP].isPinSetupComplete === true) {
      return this.renderPINSetupComplete();
    }
    if (this.props[stateConstants.PINSETUP].isPasswordVerified !== true) {
      return this.renderPasswordField();
    }
    if (this.state.showPINReentered === true) {
      return this.renderPINReenter();
    }
    return this.renderPINField();
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}  /** @see devnotes.md#region 1.1 */>
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 100 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.pinLockYourApp}</ParagraphText>
            <HorizontalLine />
            {this.renderFields()}
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ position: 'absolute' }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupPINScreen);