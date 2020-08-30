import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ParagraphText, ActivityIndicator, ButtonPrimary } from '../components/MiscComponents';
import { View } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { AppContext } from '../modules/AppContext';
import { RootState } from '../redux/configureStore';

const mapStateToProps = (state: RootState) => ({
  OPERATION: state.OPERATION
});

const connector = connect(mapStateToProps, {});
type PropsFromRedux = ConnectedProps<typeof connector>

interface BackupRestoreScreenProps {
  navigation: any;
}

class BackupRestoreScreen extends Component<PropsFromRedux & BackupRestoreScreenProps> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;
  
  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    return (
      <ScreenBackground>
        <ScreenContent isKeyboardAvoidingView={true} style={{ padding: 20 }} >
          {this.props.OPERATION.isLoading ? <ActivityIndicator /> : <View />}
          <ParagraphText style={[styles.bodyTextLarge, { marginTop: 30 }]}>{language.exportExplanation}</ParagraphText>
          <ButtonPrimary
            containerStyle={{ marginTop: 20 }}
            title={language.export}
            onPress={() => { this.props.navigation.navigate('Backup') }}
            iconName='arrow-downward'
          />
          <ParagraphText style={[styles.bodyTextLarge, { marginTop: 30 }]}>{language.importExplanationLong}</ParagraphText>
          <ButtonPrimary
            containerStyle={{ marginTop: 20 }}
            title={language.import}
            onPress={() => { this.props.navigation.navigate('Restore') }}
            iconName='arrow-upward'
          />
        </ScreenContent>
      </ScreenBackground>
    );
  }

  }

export default connector(BackupRestoreScreen);


