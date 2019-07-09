import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUserPassword, clearMessages } from '../redux/SecurityActionCreators';
import { styles, Colors } from '../assets/styles/style';
import { ParagraphText } from '../components/FormFields';
import { ToastAndroid, ActivityIndicator, View, Text } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    security: state.security
  }
}

const mapDispatchToProps = dispatch => ({
  setUserPassword: (oldPassword, newPassword) => dispatch(setUserPassword(oldPassword, newPassword)),
  clearMessages: () => dispatch(clearMessages())
});

const PasswordInput = (props) => {
  return <Input
    {...props}
    leftIcon={{ name: props.leftIconName ? props.leftIconName : 'lock', color: Colors.placeholderText }}
    containerStyle={{ marginTop: 30, paddingLeft: 0 }}
    inputStyle={styles.text}
    leftIconContainerStyle={{ marginLeft: 0, marginRight: 10 }}
    placeholderTextColor={Colors.placeholderText}
    autoCompleteType='off'
    autoCorrect={false}
    secureTextEntry={true}
  />
};

class PasswordScreen extends Component {
  static navigationOptions = {
    title: 'Set Password'
  };

  constructor(props) {
    super(props);

    this.state = {
      oldPassword: null,
      newPassword: null,
      newPasswordReentered: null,
    }
  }

  componentDidMount() {
    this.props.clearMessages();
  }

  applyChanges() {
    if (this.state.newPassword !== this.state.newPasswordReentered) {
      ToastAndroid.show('New password and re-entered new password must match', ToastAndroid.LONG);
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
    if (this.props.security.errMess)
      ToastAndroid.show(this.props.security.errMess, ToastAndroid.LONG);
    if (this.props.security.successMess)
      ToastAndroid.show(this.props.security.successMess, ToastAndroid.LONG);
      
    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true} style={{ padding: 20 }} >
          { /* TODO: test modal activity indicator while data is being encrypted and saved */
            this.props.security.isLoading ? <ActivityIndicator /> : <View />}
          <ParagraphText>Make your data private and protect it with a password</ParagraphText>
          <PasswordInput
            placeholder='Enter current password'
            value={this.state.oldPassword}
            onChangeText={(value) => { this.setState({ ...this.state, oldPassword: value }) }}
          />
          <PasswordInput
            placeholder='Enter new password'
            value={this.state.newPassword}
            leftIconName='lock-outline'
            onChangeText={(value) => { this.setState({ ...this.state, newPassword: value }) }}
          />
          <PasswordInput
            placeholder='Re-enter new password'
            value={this.state.newPasswordReentered}
            leftIconName='lock-outline'
            onChangeText={(value) => { this.setState({ ...this.state, newPasswordReentered: value }) }}
          />
          <Button
            disabled={!this.state.newPassword || this.state.newPassword != this.state.newPasswordReentered}
            containerStyle={{ marginTop: 50 }}
            title='Apply Changes'
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


