import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';
import { text, stateConstants } from '../modules/Constants';
import { styles } from '../assets/styles/style';
import { signUp } from '../redux/authActionCreators';
import { ActivityIndicator, ParagraphText, PasswordInput, Toast, showMessages } from '../components/MiscComponents';
import { View } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { ScrollView } from 'react-native-gesture-handler';

const mapStateToProps = state => {
  return { [stateConstants.OPERATION]: state[stateConstants.OPERATION] };
}

const mapDispatchToProps = dispatch => ({
  signUp: (password) => dispatch(signUp(password))
});

class SignUpScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: null
    }
  }

  signIn() {
    if (!this.state.password || (this.state.password + '').trim() == '')
      Toast.show('Please enter the password');
    else
      this.props.signUp(this.state.password);
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent style={{ padding: 20, paddingTop: 40 }} >
           {/* ScrollView is used here because it handles keyboard dismiss properly, otherwise keyboard remains visible even after leaving the text input and pressing buttons on the screen
           if cannot use a ScrollView use another approach: https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native */}
          <ScrollView>
            <ParagraphText style={styles.bodyTextLarge}>{text.signUpScreen.explanation}</ParagraphText>
            <PasswordInput
              placeholder={text.signUpScreen.currentPlaceholder}
              value={this.state.password}
              onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
            />
            <Button
              containerStyle={{ marginTop: 50 }}
              title={text.signUpScreen.button}
              onPress={() => { this.signIn() }}
              icon={<Icon
                containerStyle={{ marginRight: 20 }}
                name='check'
                size={20}
                color='white'
              />}
            />
            {this.props[stateConstants.OPERATION].isLoading ? <ActivityIndicator /> : <View />}
          </ScrollView>
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);


