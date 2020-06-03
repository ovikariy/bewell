import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { text, stateConstants } from '../modules/Constants';
import {
  ActivityIndicator, ParagraphText, Toast, PasswordInputWithButton, Spacer, HorizontalLine, ButtonPrimary
} from '../components/MiscComponents';
import { View, ScrollView, Share } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { isNullOrEmpty, formatDate, consoleLogWithColor, consoleColors } from '../modules/helpers';
import { startBackup, getExportData, finishBackup } from '../redux/backupRestoreActionCreators';
import * as FileHelpers from '../modules/FileHelpers';
import { StackActions } from '@react-navigation/native';
import { shareAsync } from 'expo-sharing';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.BACKUPRESTORE]: state[stateConstants.BACKUPRESTORE]
  };
}

const mapDispatchToProps = dispatch => ({
  startBackup: () => dispatch(startBackup()),
  getExportData: (password) => dispatch(getExportData(password)),
  finishBackup: () => dispatch(finishBackup())
});

class BackupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null
    }
  }

  componentDidMount() {
    this.props.startBackup();
  }

  reset() {
    this.setState({
      ...this.state,
      password: null
    });
  }

  getExportData() {
    if (isNullOrEmpty(this.state.password)) {
      Toast.show(text.backupScreen.message1);
      return;
    }
    this.props.getExportData(this.state.password);
  }

  export() {
    const data = this.props[stateConstants.BACKUPRESTORE].backupData;
    if (!data) {
      Toast.show(text.backupScreen.message2);
      return;
    }
    this.exportAsync(data).then(() => { });
  }

  exportAsync = async (data) => {
    /*
      1. After encrypted data has been loaded from the Async Storage 
      2. Write the data to a temp file in a cache directory. Files stored here may be automatically deleted by the system when low on storage.
      3. Share the file e.g. to Google Drive
      4. Cleanup prior temp files (the current file can be cleanup up on the next go round because we don't want to wait for the user to complete 
         the sharing process in case it hangs etc)
    */
    try {
      const exportDirectory = await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.ExportDirectory);
      const exportFilename = 'morning-app-export-' + formatDate(new Date(), 'MMMDDYYYY-hhmmss') + '.morning';
      const exportFilepath = exportDirectory + '/' + exportFilename;

      const oldExportFiles = await FileHelpers.readDirectoryAsync(exportDirectory);
      await FileHelpers.writeFileAsync(exportFilepath, JSON.stringify(data));
      shareAsync(exportFilepath);
      FileHelpers.deleteFilesAsync(exportDirectory, oldExportFiles);
      this.props.finishBackup();
    } catch (err) {
      console.log(err);
      Toast.show(err);
    }
  }

  renderPasswordField() {
    /* re-prompt for password even if logged in; if verified then allow setting PIN */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.backupScreen.textPassword}</ParagraphText>
      <Spacer height={70} />
      <PasswordInputWithButton value={this.state.password}
        containerStyle={styles.bottomPositioned}
        placeholder={text.backupScreen.placeholder1}
        onPress={() => this.getExportData()}
        onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
      />
    </View>;
  }

  renderExportButton() {
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.backupScreen.exportSubExplanation}</ParagraphText>
      <Spacer height={70} />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: 280 }]}
        buttonStyle={styles.buttonSecondary}
        title={text.backupScreen.buttonExport}
        onPress={() => { this.export() }}
      />
    </View>;
  }

  renderExportComplete() {
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.backupScreen.textComplete}</ParagraphText>
      <Spacer height={70} />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: 180 }]}
        title={text.backupScreen.buttonDone}
        onPress={() => { this.props.navigation.dispatch(StackActions.popToTop()) }}
      />
    </View>;
  }

  renderFields() {
    if (this.props[stateConstants.BACKUPRESTORE].isComplete === true) {
      return this.renderExportComplete();
    }
    if (this.props[stateConstants.BACKUPRESTORE].backupDataReady !== true) {
      return this.renderPasswordField();
    }
    return this.renderExportButton();
  }

  render() {
    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}  /** @see devnotes.md#region 1.1 */>
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 100 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.backupScreen.exportExplanation}</ParagraphText>
            <HorizontalLine />
            {this.renderFields()}
            {this.props[stateConstants.OPERATION].isLoading ?
              <ActivityIndicator style={{ position: 'absolute' }} /> : <View />}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupScreen);