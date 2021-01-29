import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { sizes } from '../assets/styles/style';
import { ParagraphText, ButtonPrimary } from '../components/MiscComponents';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { AppContext } from '../modules/appContext';
import { AppNavigationProp } from '../modules/types';
import { RootState } from '../redux/store';

const mapStateToProps = (state: RootState) => ({
  OPERATION: state.OPERATION
});

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>;

function BackupRestoreScreen(props: PropsFromRedux & {
  navigation: AppNavigationProp<'BackupRestore'>
}) {
  const { language, styles } = React.useContext(AppContext);
  const { navigation } = props;

  return (
    <ScreenBackground isLoading={props.OPERATION.isLoading}>
      <ScreenContent isKeyboardAvoidingView={true} style={styles.screenBodyContainerLargeMargin} >
        <ParagraphText style={[styles.bodyTextLarge, { marginTop: sizes[30] }]}>{language.exportExplanation}</ParagraphText>
        <ButtonPrimary
          containerStyle={{ marginTop: sizes[20] }}
          title={language.export}
          onPress={() => { navigation.navigate('Backup'); }}
          iconName='arrow-downward'
        />
        <ParagraphText style={[styles.bodyTextLarge, { marginTop: sizes[30] }]}>{language.importExplanationLong}</ParagraphText>
        <ButtonPrimary
          containerStyle={{ marginTop: sizes[20] }}
          title={language.import}
          onPress={() => { navigation.navigate('Restore'); }}
          iconName='arrow-upward'
        />
      </ScreenContent>
    </ScreenBackground>
  );
}

export default connector(BackupRestoreScreen);


