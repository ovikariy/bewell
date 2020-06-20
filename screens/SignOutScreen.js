import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { stateConstants } from '../modules/Constants';
import { signOut } from '../redux/authActionCreators';
import { ActivityIndicator, ParagraphText, HorizontalLine, Spacer, LinkButton, ButtonPrimary } from '../components/MiscComponents';
import { View } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { CommonActions } from '@react-navigation/native';
import { LanguageContext } from '../modules/helpers';

const mapStateToProps = state => {
  return { [stateConstants.OPERATION]: state[stateConstants.OPERATION] };
}

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut())
});

class SignOutScreen extends Component {
  static contextType = LanguageContext;

  render() {
    const language = this.context;
    return (
      <ScreenBackground>
        <ScreenContent style={{ paddingHorizontal: 40, marginTop: 100 }} >
          <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.signOutClick}</ParagraphText>
          <HorizontalLine />
          <ParagraphText style={[styles.bodyTextLarge]}>{language.signOutWillClear}</ParagraphText>
          <Spacer height={70} />
          <ButtonPrimary
            containerStyle={{ alignSelf: 'center', marginTop: 20 }}
            title={language.signOut}
            onPress={() => { this.props.signOut(); }}
          />
          <Spacer height={40} />
          <LinkButton title={language.goBackNo} titleStyle={{ opacity: 0.5 }}
            onPress={() => this.props.navigation.dispatch(CommonActions.goBack())} />
          {this.props[stateConstants.OPERATION].isLoading ?
            <ActivityIndicator style={{ position: 'absolute', top: 200 }} /> : <View />}
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignOutScreen);


