import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { signOut } from '../redux/authActionCreators';
import { ParagraphText, HorizontalLine, Spacer, LinkButton, ButtonPrimary } from '../components/MiscComponents';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { CommonActions } from '@react-navigation/native';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/configureStore';

const mapStateToProps = (state: RootState) => ({
  OPERATION: state.OPERATION
});

const mapDispatchToProps = {
  signOut
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface SignOutProps {
  navigation: any;
}

class SignOutScreen extends Component<PropsFromRedux & SignOutProps> {

  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
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
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignOutScreen);


