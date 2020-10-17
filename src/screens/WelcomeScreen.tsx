import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { initialize } from '../redux/welcomeActionCreators';
import { ParagraphText, Spacer, HorizontalLine, ButtonPrimary } from '../components/MiscComponents';
import { ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent, ScreenImageHeader } from '../components/ScreenComponents';
import { AppContext } from '../modules/AppContext';
import { RootState } from '../redux/configureStore';

const mapStateToProps = (state: RootState) => ({
  AUTH: state.AUTH,
  OPERATION: state.OPERATION
})

const mapDispatchToProps = {
  initialize
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

interface WelcomeScreenProps {
  navigation: any;
}

class WelcomeScreen extends Component<PropsFromRedux & WelcomeScreenProps> {

  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  componentDidMount() {
    if (this.props.AUTH.isInitialized !== true && this.props.AUTH.isEncrypted === true) {
      /* we can get here if isInitialized flag in the keychain was cleared somehow 
      but user data is present and encrypted in AsyncStorage, we should set isInitialized 
      and the user should be redirected to login  */
      this.props.initialize();
    }
  }

  quickSetup() {
    if (this.props.AUTH.isEncrypted === true)
      this.props.navigation.navigate('SignIn');
    else
      this.props.navigation.navigate('SetupPassword');
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} /** @see devnotes.md#region 1.1 */>
          <ScreenImageHeader />
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
              iconName='chevron-right' iconRight={true} iconStyle={styles.iconPrimary}
            />
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connector(WelcomeScreen);


