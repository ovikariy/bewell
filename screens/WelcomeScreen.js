import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initialize } from '../redux/welcomeActionCreators';
import { stateConstants } from '../modules/Constants';
import { ActivityIndicator, ParagraphText, Spacer, HorizontalLine, ButtonPrimary } from '../components/MiscComponents';
import { ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenHeader } from '../components/ScreenComponents';
import { AppContext } from '../modules/AppContext';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.AUTH]: state[stateConstants.AUTH]
  };
}

const mapDispatchToProps = dispatch => ({
  initialize: () => dispatch(initialize())
});

class WelcomeScreen extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);
  } 

  componentDidMount() {
    if (this.props[stateConstants.AUTH].isInitialized !== true && this.props[stateConstants.AUTH].isEncrypted === true) {
      /* we can get here if isInitialized flag in the keychain was cleared somehow 
      but user data is present and encrypted in AsyncStorage, we should set isInitialized 
      and the user should be redirected to login  */
      this.props.initialize();
    }
  }

  quickSetup() {
    if (this.props[stateConstants.AUTH].isEncrypted === true)
      this.props.navigation.navigate('SignIn');
    else
      this.props.navigation.navigate('SetupPassword');
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenHeader />
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 40 }}   >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.welcomeFriend}</ParagraphText>
            <HorizontalLine />
            <ParagraphText style={[styles.bodyTextLarge]}>{language.track}</ParagraphText>
            <Spacer height={40} />
            <ButtonPrimary
              containerStyle={styles.bottomPositioned}
              buttonStyle={{ paddingHorizontal: 50 }}
              title={language.quickSetup}
              onPress={() => { this.quickSetup() }}
              name='chevron-right' iconRight={true} iconStyle={[styles.iconPrimary]}
            />
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ position: 'absolute' }} /> : <React.Fragment />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);


