import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import { text, stateConstants } from '../modules/Constants';
import { setUserPassword } from '../redux/SecurityActionCreators';
import { ParagraphText, PasswordInput } from '../components/MiscComponents';
import { ToastAndroid, ActivityIndicator, View } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return { [stateConstants.OPERATION]: state[stateConstants.OPERATION] };
}

const mapDispatchToProps = dispatch => ({
  setUserPassword: (oldPassword, newPassword) => dispatch(setUserPassword(oldPassword, newPassword))
});

class PasswordScreen extends Component {
  static navigationOptions = {
    title: text.passwordScreen.title
  };

  constructor(props) {
    super(props);

    this.state = {
      oldPassword: null,
      newPassword: null,
      newPasswordReentered: null,
    }
  }

  applyChanges() {
    if (this.state.newPassword !== this.state.newPasswordReentered) {
      ToastAndroid.show(text.passwordScreen.message1, ToastAndroid.LONG);
      return;
    }
    this.props.setUserPassword(this.state.oldPassword, this.state.newPassword);

    this.setState({
      ...this.state,
      oldPassword: null,
      newPassword: null,
      newPasswordReentered: null,
    });
  }

  render() {
    if (this.props[stateConstants.OPERATION].errMess)
      ToastAndroid.show(this.props[stateConstants.OPERATION].errMess, ToastAndroid.LONG);
    if (this.props[stateConstants.OPERATION].successMess)
      ToastAndroid.show(this.props[stateConstants.OPERATION].successMess, ToastAndroid.LONG);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true} style={{ padding: 20 }} >
          { /* TODO: test modal activity indicator while data is being encrypted and saved */
            this.props[stateConstants.OPERATION].isLoading ? <ActivityIndicator /> : <View />}
          <ParagraphText>{text.passwordScreen.explanation}</ParagraphText>
          <PasswordInput
            placeholder={text.passwordScreen.currentPlaceholder}
            value={this.state.oldPassword}
            onChangeText={(value) => { this.setState({ ...this.state, oldPassword: value }) }}
          />
          <PasswordInput
            placeholder={text.passwordScreen.newPlaceholder}
            value={this.state.newPassword}
            leftIconName='lock-outline'
            onChangeText={(value) => { this.setState({ ...this.state, newPassword: value }) }}
          />
          <PasswordInput
            placeholder={text.passwordScreen.reEnterPlaceholder}
            value={this.state.newPasswordReentered}
            leftIconName='lock-outline'
            onChangeText={(value) => { this.setState({ ...this.state, newPasswordReentered: value }) }}
          />
          <Button
            disabled={!this.state.newPassword || this.state.newPassword != this.state.newPasswordReentered}
            containerStyle={{ marginTop: 50 }}
            title={text.passwordScreen.apply}
            onPress={() => { this.applyChanges() }}
            icon={<Icon
              containerStyle={{ marginRight: 20 }}
              name='check'
              size={20}
              color='white'
            />}
          />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PasswordScreen);


