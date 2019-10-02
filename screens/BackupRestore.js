import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Button, Icon } from 'react-native-elements';
import { text, Errors, storeConstants, stateConstants } from '../modules/Constants';
import { ParagraphText, PasswordInput, Toast, showMessages } from '../components/MiscComponents';
import { ActivityIndicator, View, Text, KeyboardAvoidingView } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { shareAsync } from 'expo-sharing';
import { getDocumentAsync } from 'expo-document-picker';
import { importItemsIntoStorage } from '../redux/BackupRestoreActionCreators';
import { getStorageDataForExportAsync } from '../modules/StorageHelpers';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as FileHelpers from '../modules/FileHelpers';
 
const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION]
  }
    ;
}

const mapDispatchToProps = dispatch => ({
  importItemsIntoStorage: (items) => dispatch(importItemsIntoStorage(items))
});

class BackupRestoreScreen extends Component {
  static navigationOptions = {
    title: text.backupScreen.title
  };

  constructor(props) {
    super(props);

    this.state = { appPassword: '', needAppPassword: false, filePassword: '', needFilePassword: false };
    this.data = [];
  }

  export() {
    this.exportAsync().then(() => { });
  }

  import() {
    this.importAsync().then(() => { });
  }

  exportAsync = async () => {
    /*
      1. Get the encrypted data from the Async Storage 
      2. Write the data to a temp file in a cache directory. Files stored here may be automatically deleted by the system when low on storage.
      3. Share the file e.g. to Google Drive
      4. Cleanup prior temp files (the current file can be cleanup up on the next go round because we don't want to wait for the user to complete 
         the sharing process in case it hangs etc)
    */

    try {
      const data = await getStorageDataForExportAsync();
      const exportDirectory = await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.ExportDirectory);
      const exportFilename = 'morning-app-export-' + moment().format('YYMMMDD-hhmmss') + '.txt'; //TODO: rename to .morning or custom ext to assoc file type with app
      const exportFilepath = exportDirectory + '/' + exportFilename;

      const oldExportFiles = await FileHelpers.readDirectoryAsync(exportDirectory);
      await FileHelpers.writeFileAsync(exportFilepath, JSON.stringify(data));
      shareAsync(exportFilepath);
      await FileHelpers.deleteFilesAsync(exportDirectory, oldExportFiles);

    } catch (err) {
      console.log(err);
      Toast.show(err);
    }
  }

  importAsync = async () => {
    try {
      const importDirectory = await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.ImportDirectory);
      const importFilename = 'morning-app-import-' + moment().format('YYMMMDD-hhmmss') + '.txt';
      const importFilepath = importDirectory + '/' + importFilename;

      const docPickerResult = await getDocumentAsync({ copyToCacheDirectory: false });
      if (docPickerResult.type !== 'success')
        return; /* the user cancelled */

      /* copy to cache directory otherwise error when reading from its original location  */
      await FileHelpers.clearDirectoryAsync(importDirectory);
      await FileHelpers.copyFileAsync(docPickerResult.uri, importFilepath);

      const data = await FileHelpers.getJSONfromFileAsync(importFilepath);
      if (!data || data.length <= 0)
        throw new Error(text.backupScreen.emptyFile);

      this.data = data;

      await this.loadImportDataIntoStorageAsync();
      await FileHelpers.clearDirectoryAsync(FileHelpers.ImportDirectory);

    } catch (err) {
      console.log('\r\n' + Errors.ImportError + err.message + '\r\n' + err.stack + '\r\n');
      Toast.show(Errors.ImportError + err.message);
      FileHelpers.clearDirectoryAsync(FileHelpers.ImportDirectory);
    }
  }

  loadImportDataIntoStorageAsync = async () => {
    // this.data = [
    //   ["Wf4rh34+qer48MSihQbrsCADTNfn31tavmFhnxX+S/o=", "U2FsdGVkX184dB4pXueAFrxIz9ZwhN1MTnSOdVu/jMC0DoUXGMOJls2ZptvvjkoVlrMmBuwipR3NV4ChVgfetfMAFRZYkQTXizbYMrlyk1/lyn8G+rcBlUe1gh2gqScp"],
    //   ["J8PUrI3a39kNZrcqbV7BeMKzs0Hc8uYYlMXzHjZW6ko=", null],
    //   ["@Morning:DATAENCRYPTIONKEY", "U2FsdSLkX19umzDCod0cZ8u26/kfkYpizswaFdzVWDNf02FAl7Hxq2RRM64xRk4LKDeB2+PxYLy/INk0wod+7w=="]
    // ];

    try {
      let itemsToBeSaved = [];
      const appPassword = this.state.appPassword.trim();
      let filePassword = this.state.filePassword.trim();

      /* has the user already setup the password in the app */
      const appPasswordProtected = await SecurityHelpers.isPasswordSet();

      if (appPasswordProtected) {
        if (appPassword == '') {
          this.setState({ ...this.state, needAppPassword: true }); /* ask user to enter password */
          return;
        }

        const isPasswordValid = await SecurityHelpers.isPasswordMatchingExisting(appPassword);
        if (isPasswordValid !== true) {
          Toast.show(Errors.InvalidPassword);
          return;
        }
      }

      const dataEncryptionKeyValuePair = this.data.find(item => item.length == 2 && item[0] == storeConstants.DataEncryptionStoreKey);
      const dataEncryptionKey = dataEncryptionKeyValuePair ? dataEncryptionKeyValuePair[1] : null;
      if (!dataEncryptionKey) {
        /* data in the file is not encrypted */
        itemsToBeSaved = this.data;
      }
      else {
        const appPasswordCanDecrypt = await SecurityHelpers.tryDecryptDataAsync(dataEncryptionKey, appPassword);
        if (appPasswordCanDecrypt !== true) {
          /* could not decrypt with current app password, the user must have changed the password since the file was exported */
          if (filePassword == '') {
            this.setState({ ...this.state, needFilePassword: true }); /* ask user to enter the password used to encrypt the file */
            return;
          }

          const filePasswordCanDecrypt = await SecurityHelpers.tryDecryptDataAsync(dataEncryptionKey, filePassword);
          if (filePasswordCanDecrypt !== true) {
            Toast.show(Errors.InvalidFilePassword);
            return;
          }
        }

        filePassword = filePassword || appPassword;
        itemsToBeSaved = await SecurityHelpers.decryptAllItems(this.data, dataEncryptionKey, filePassword);
      }

      if (!itemsToBeSaved || itemsToBeSaved.length <= 0) {
        Toast.show(text.backupScreen.noValidRecords);
      }
      else {
        this.props.importItemsIntoStorage(itemsToBeSaved);
      }
      this.setState({ ...this.state, needAppPassword: false, needFilePassword: false });

    } catch (err) {
      Toast.show(Errors.ImportError + err.message);
      console.log('\r\n' + Errors.ImportError + err.message + '\r\n' + err.stack + '\r\n');
    }
  }

  render() {

    showMessages(this.props[stateConstants.OPERATION]);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true} style={{ padding: 20 }} >
          {this.props[stateConstants.OPERATION].isLoading ? <ActivityIndicator /> : <View />}
          <ParagraphText style={{ marginTop: 30 }}>{text.backupScreen.exportExplanation}</ParagraphText>
          <Button
            containerStyle={{ marginTop: 20 }}
            title={text.backupScreen.export}
            onPress={() => { this.export() }}
            icon={<Icon
              containerStyle={{ marginRight: 20 }}
              name='arrow-downward'
              size={20}
              color='white'
            />}
          />
          <ParagraphText style={{ marginTop: 30 }}>{text.backupScreen.importExplanation}</ParagraphText>
          <Button
            containerStyle={{ marginTop: 20 }}
            title={text.backupScreen.import}
            onPress={() => { this.import() }}
            icon={<Icon
              containerStyle={{ marginRight: 20 }}
              name='arrow-upward'
              size={20}
              color='white'
            />}
          />
        </ScreenContent>
      </ScreenBackground>
    );
  }

  renderAppPasswordPrompt() {
    return (
      <KeyboardAvoidingView
        style={{ display: this.state.needAppPassword ? 'flex' : 'none' }}
        behavior="padding"
        keyboardVerticalOffset={40}
        enabled
      >
        <ParagraphText style={{ marginTop: 30 }}>{text.backupScreen.passwordExplanation}</ParagraphText>
        <PasswordInput
          placeholder={text.backupScreen.passPlaceholder}
          value={this.state.appPassword}
          leftIconName='lock-outline'
          onChangeText={(value) => { this.setState({ ...this.state, appPassword: value }) }}
        />
        <Button
          containerStyle={{ marginTop: 20 }}
          title={text.backupScreen.proceed}
          onPress={() => { this.loadImportDataIntoStorageAsync() }}
          disabled={!this.state.appPassword}
          icon={<Icon
            containerStyle={{ marginRight: 20 }}
            name='check'
            size={20}
            color='white'
          />}
        />
      </KeyboardAvoidingView>
    )
  }

  renderFilePasswordPrompt() {
    return (
      <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={40}
        style={{ display: this.state.needFilePassword ? 'flex' : 'none' }}
      >
        <ParagraphText style={{ marginTop: 30 }}>{text.backupScreen.fileExplanation}</ParagraphText>
        <PasswordInput
          placeholder={text.backupScreen.filePlaceholder}
          value={this.state.filePassword}
          leftIconName='lock-outline'
          onChangeText={(value) => { this.setState({ ...this.state, filePassword: value }) }}
        />
        <Button
          containerStyle={{ marginTop: 20 }}
          title={text.backupScreen.proceed}
          onPress={() => { this.loadImportDataIntoStorageAsync() }}
          disabled={!this.state.filePassword}
          icon={<Icon
            containerStyle={{ marginRight: 20 }}
            name='check'
            size={20}
            color='white'
          />}
        />
      </KeyboardAvoidingView>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupRestoreScreen);


