import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  ParagraphText, Toast, PasswordInputWithButton,
  Spacer, HorizontalLine, ButtonPrimary, ButtonSecondary
} from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { isNullOrEmpty, formatDate } from '../modules/utils';
import { startBackup, getExportData, finishBackup } from '../redux/backupRestoreActionCreators';
import * as FileHelpers from '../modules/io';
import { StackActions } from '@react-navigation/native';
import { shareAsync } from 'expo-sharing';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppError, AppNavigationProp } from '../modules/types';

const mapStateToProps = (state: RootState) => ({
  OPERATION: state.OPERATION,
  BACKUPRESTORE: state.BACKUPRESTORE
});

const mapDispatchToProps = {
  startBackup,
  getExportData,
  finishBackup
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

interface BackupScreenState {
  password?: string;
}

interface BackupScreenProps extends PropsFromRedux {
  navigation: AppNavigationProp<'Backup'>
}

class BackupScreen extends Component<BackupScreenProps, BackupScreenState> {
  static contextType = AppContext;
  context!: React.ContextType<typeof AppContext>;

  constructor(props: BackupScreenProps) {
    super(props);
    this.state = {
      password: undefined
    };
  }

  componentDidMount() {
    this.props.startBackup();
  }

  reset() {
    this.setState({
      ...this.state,
      password: undefined
    });
  }

  getExportData() {
    const language = this.context.language;

    if (!this.state.password || isNullOrEmpty(this.state.password)) {
      Toast.show(language.passwordPleaseEnter);
      return;
    }

    this.props.getExportData(this.state.password + '');
  }

  export() {
    const language = this.context.language;

    const data = this.props.BACKUPRESTORE.backupData;
    if (!data || data.length <= 0) {
      Toast.show(language.exportNoData);
      return;
    }
    this.exportAsync(data).then(() => { });
  }

  exportAsync = async (data: [string, string][]) => {

    /*
      1. After encrypted data has been loaded from the Async Storage
      2. Write the data to a temp file in a cache directory. Files stored here may be automatically deleted by the system when low on storage.
      3. Share the file e.g. to Google Drive
      4. Cleanup prior temp files (the current file can be cleanup up on the next go round because we don't want to wait for the user to complete
         the sharing process in case it hangs etc)
    */
    try {
      const exportDirectory = await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.FileSystemConstants.ExportDirectory);
      const exportFilename = 'morning-app-export-' + formatDate(new Date(), 'MMMDDYYYY-hhmmss') + '.morning';
      const exportFilepath = exportDirectory + '/' + exportFilename;

      const oldExportFiles = await FileHelpers.readDirectoryAsync(exportDirectory);
      await FileHelpers.writeFileAsync(exportFilepath, JSON.stringify(data), {});
      shareAsync(exportFilepath);
      FileHelpers.deleteFilesAsync(exportDirectory, oldExportFiles);
      this.props.finishBackup();
    }
    catch (error) {
      console.log(error);
      (error instanceof AppError !== true) ?
        Toast.showTranslated(error.message, this.context) :
        Toast.showError(error, this.context);
    }
  };

  renderPasswordField() {
    const language = this.context.language;
    const styles = this.context.styles;
    /* re-prompt for password even if logged in; if verified then allow setting PIN */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.passwordConfirm}</ParagraphText>
      <Spacer height={70} />
      <PasswordInputWithButton value={this.state.password || ''}
        containerStyle={styles.bottomPositioned}
        placeholder={language.passwordEnter}
        onPress={() => this.getExportData()}
        onChangeText={(value) => { this.setState({ ...this.state, password: value }); }}
      />
    </View>;
  }

  renderExportButton() {
    const language = this.context.language;
    const styles = this.context.styles;
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.exportSubExplanation}</ParagraphText>
      <Spacer height={70} />
      <ButtonSecondary
        containerStyle={[styles.bottomPositioned, { width: 280 }]}
        buttonStyle={styles.buttonSecondary}
        title={language.export}
        onPress={() => { this.export(); }}
      />
    </View>;
  }

  renderExportComplete() {
    const language = this.context.language;
    const styles = this.context.styles;
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{language.exportComplete}</ParagraphText>
      <Spacer height={70} />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: 180 }]}
        title={language.done}
        onPress={() => { this.props.navigation.dispatch(StackActions.popToTop()); }}
      />
    </View>;
  }

  renderFields() {
    if (this.props.BACKUPRESTORE.isComplete === true)
      return this.renderExportComplete();

    if (this.props.BACKUPRESTORE.backupDataReady !== true)
      return this.renderPasswordField();

    return this.renderExportButton();
  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;
    return (
      <ScreenBackground isLoading={this.props.OPERATION.isLoading}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}  /** @see devnotes.md#region 1.1 */>
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 100 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.exportExplanation}</ParagraphText>
            <HorizontalLine />
            {this.renderFields()}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connector(BackupScreen);