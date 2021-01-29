import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { signOut } from '../redux/authActionCreators';
import { ParagraphText, HorizontalLine, Spacer, LinkButton, ButtonPrimary } from '../components/MiscComponents';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { CommonActions } from '@react-navigation/native';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppNavigationProp } from '../modules/types';
import { sizes } from '../assets/styles/style';

const mapStateToProps = (state: RootState) => ({
  OPERATION: state.OPERATION
});

const mapDispatchToProps = {
  signOut
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface SignOutProps extends PropsFromRedux{
  navigation: AppNavigationProp<'SignOut'>
}

class SignOutScreen extends Component<SignOutProps> {

  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
        <ScreenContent style={styles.screenBodyContainerLargeMargin} >
          <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.signOutClick}</ParagraphText>
          <HorizontalLine />
          <ParagraphText style={[styles.bodyTextLarge]}>{language.signOutWillClear}</ParagraphText>
          <Spacer   />
          <ButtonPrimary
            containerStyle={{ alignSelf: 'center', marginTop: sizes[20] }}
            title={language.signOut}
            onPress={() => { this.props.signOut(); }}
          />
          <Spacer height={sizes[40]} />
          <LinkButton title={language.goBackNo} titleStyle={{ opacity: 0.5 }}
            onPress={() => this.props.navigation.dispatch(CommonActions.goBack())} />
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connector(SignOutScreen);


