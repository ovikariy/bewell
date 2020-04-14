import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { Button, Icon } from 'react-native-elements';
import { setUserPassword } from '../redux/securityActionCreators';
import { text, stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, PasswordInput, Toast, showMessages } from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
  };
}

const mapDispatchToProps = dispatch => ({
  setUserPassword: (oldPassword, newPassword) => dispatch(setUserPassword(oldPassword, newPassword))
});

/* this screen is shown on app launch if the user has not setup security yet */
class SetupPINScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: null,
      newPasswordReentered: null
    }
  }

  navigateHome() {
    this.props.navigation.navigate('Home');
  }

  navigateToPIN() {
    this.props.navigation.navigate('Settings', { screen: 'PIN' });
  }

  savePassword() {
    if (this.state.newPassword !== this.state.newPasswordReentered) {
      Toast.show(text.passwordScreen.message1);
      return;
    }
    this.props.setUserPassword(null, this.state.newPassword);

    this.setState({
      ...this.state,
      newPassword: null,
      newPasswordReentered: null,
    });
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent style={{ padding: 20, paddingTop: 40 }} >
          {/* ScrollView is used here because it handles keyboard dismiss properly, otherwise keyboard remains visible even after leaving the text input and pressing buttons on the screen
           if cannot use a ScrollView use another approach: https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native */}
          <ScrollView>
            <ParagraphText style={styles.bodyTextLarge}>{text.setupSecurityScreen.text1}</ParagraphText>
            <PasswordInput
              placeholder={text.setupSecurityScreen.placeholder1}
              value={this.state.newPassword}
              leftIconName='lock-outline'
              onChangeText={(value) => { this.setState({ ...this.state, newPassword: value }) }}
            />
            <PasswordInput
              placeholder={text.setupSecurityScreen.placeholder2}
              value={this.state.newPasswordReentered}
              leftIconName='lock-outline'
              onChangeText={(value) => { this.setState({ ...this.state, newPasswordReentered: value }) }}
            />
            <Button
              disabled={!this.state.newPassword || this.state.newPassword != this.state.newPasswordReentered}
              containerStyle={{ marginTop: 50 }}
              title={text.setupSecurityScreen.button1}
              onPress={() => { this.savePassword() }}
              icon={<Icon
                containerStyle={{ marginRight: 20 }}
                name='check'
                size={20}
                color='white'
              />}
            />
            <ParagraphText style={[styles.centered, { marginTop: 100, marginBottom: 30 }]}>{text.setupSecurityScreen.text2}</ParagraphText>
            <Button
              containerStyle={{ alignItems: 'center', marginBottom: 20 }}
              buttonStyle={[styles.buttonPrimary, { paddingHorizontal: 50 }]}
              title={text.setupSecurityScreen.button2}
              onPress={() => { this.navigateToPIN() }}
            />
            <Button
              containerStyle={{ alignItems: 'center', marginBottom: 20 }}
              buttonStyle={[styles.buttonPrimary, { paddingHorizontal: 50 }]}
              title={text.setupSecurityScreen.button3}
              onPress={() => { this.navigateHome() }}
            />
            {this.props[stateConstants.OPERATION].isLoading ? <ActivityIndicator /> : <View />}
          </ScrollView>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupPINScreen);


