import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ParagraphText, PasswordInput } from '../components/FormFields';
import { ToastAndroid, ActivityIndicator, View, Text, KeyboardAvoidingView } from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import moment from 'moment';

import * as StorageHelpers from '../modules/StorageHelpers';
import * as SecurityHelpers from '../modules/SecurityHelpers';
import * as FileHelpers from '../modules/FileHelpers';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { DataEncryptionStoreKey } from '../constants/Constants';
import { importItemsIntoStorage } from '../redux/BackupRestoreActionCreators';

const mapStateToProps = state => {
  return {
    operation: state.operation
  }
}

const mapDispatchToProps = dispatch => ({
  importItemsIntoStorage: (items) => dispatch(importItemsIntoStorage(items))
});

class BackupRestoreScreen extends Component {
  static navigationOptions = {
    title: 'Import and Export'
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
      1. TODO: re-prompt for password or pin 
      2. Get the encrypted data from the Async Storage 
      3. Write the data to a temp file in a cache directory. Files stored here may be automatically deleted by the system when low on storage.
      4. Share the file e.g. to Google Drive
      5. Cleanup prior temp files (the current file can be cleanup up on the next go round because we don't want to wait for the user to complete 
         the sharing process in case it hangs etc)
    */

    try {
      const data = await StorageHelpers.getStorageDataForExportAsync();
      const exportDirectory = await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.ExportDirectory);
      const exportFilename = 'morning-app-export-' + moment().format('YYMMMDD-hhmmss') + '.txt'; //TODO: rename to .morning or custom ext to assoc file type with app
      const exportFilepath = exportDirectory + '/' + exportFilename;

      const oldExportFiles = await FileHelpers.readDirectoryAsync(exportDirectory);
      await FileHelpers.writeFileAsync(exportFilepath, JSON.stringify(data)); 
      Sharing.shareAsync(exportFilepath);
      await FileHelpers.deleteFilesAsync(exportDirectory, oldExportFiles);

    } catch (err) {
      console.log(err);
      ToastAndroid.show(err, ToastAndroid.LONG);
    }
  }

  importAsync = async () => {
    try {
      const importDirectory = await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.ImportDirectory);
      const importFilename = 'morning-app-import-' + moment().format('YYMMMDD-hhmmss') + '.txt';
      const importFilepath = importDirectory + '/' + importFilename;

      const docPickerResult = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (docPickerResult.type !== 'success')
        return; /* the user cancelled */

      /* copy to cache directory otherwise error when reading from its original location  */
      await FileHelpers.clearDirectoryAsync(importDirectory);
      await FileHelpers.copyFileAsync(docPickerResult.uri, importFilepath);

      const data = await FileHelpers.getJSONfromFileAsync(importFilepath);
      if (!data || data.length <= 0)
        throw new Error('Looks like the file is empty');

      this.data = data;

      await this.loadImportDataIntoStorageAsync();
      await FileHelpers.clearDirectoryAsync(FileHelpers.ImportDirectory);

    } catch (err) {
      ToastAndroid.show('Import Error: ' + err.message, ToastAndroid.LONG);
      console.log('\r\nImport Error: ' + err.message + '\r\n' + err.stack + '\r\n');
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

      console.log('\r\nappPassword ' + appPassword + ' filePassword ' + filePassword + '\r\n');  //TODO: remove
      console.log('\r\ndata ' + this.data + '\r\n');  //TODO: remove

      /* has the user already setup the password in the app */
      const appPasswordProtected = await SecurityHelpers.isPasswordSet();

      if (appPasswordProtected) {
        if (appPassword == '') {
          this.setState({ ...this.state, needAppPassword: true }); /* ask user to enter password */
          return;
        }

        const isPasswordValid = await SecurityHelpers.isPasswordMatchingExisting(appPassword);
        if (isPasswordValid !== true) {
          ToastAndroid.show('Invalid password, please try again', ToastAndroid.LONG);
          return;
        }
      }

      const dataEncryptionKeyValuePair = this.data.find(item => item.length == 2 && item[0] == DataEncryptionStoreKey);
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
            ToastAndroid.show('Invalid password for this file, please try again', ToastAndroid.LONG);
            return;
          }
        }

        filePassword = filePassword || appPassword;
        itemsToBeSaved = await SecurityHelpers.decryptAllItems(this.data, dataEncryptionKey, filePassword);
      }

      if (!itemsToBeSaved || itemsToBeSaved.length <= 0) {
        ToastAndroid.show('Nothing to import', ToastAndroid.LONG);
      }
      else {
        this.props.importItemsIntoStorage(itemsToBeSaved);
      }
      this.setState({ ...this.state, needAppPassword: false, needFilePassword: false });

    } catch (err) {
      ToastAndroid.show('Import Error: ' + err.message, ToastAndroid.LONG);
      console.log('\r\nImport Error: ' + err.message + '\r\n' + err.stack + '\r\n');
    }
  }

  render() {
    if (this.props.operation.errMess)
      ToastAndroid.show(this.props.operation.errMess, ToastAndroid.LONG);
    if (this.props.operation.successMess)
      ToastAndroid.show(this.props.operation.successMess, ToastAndroid.LONG);

    return (
      <ScreenBackground imageBackgroundSource={require('../assets/images/home.jpg')}>
        <ScreenContent isKeyboardAvoidingView={true} style={{ padding: 20 }} >
          { this.props.operation.isLoading ? <ActivityIndicator /> : <View />}
          <ParagraphText style={{ marginTop: 30 }}>Export data to file</ParagraphText>
          <Button
            containerStyle={{ marginTop: 20 }}
            title='Export'
            onPress={() => { this.export() }}
            icon={<Icon
              containerStyle={{ marginRight: 20 }}
              name='arrow-downward'
              size={20}
              color='white'
            />}
          />
          <ParagraphText style={{ marginTop: 30 }}>Import data from file</ParagraphText>
          <Button
            containerStyle={{ marginTop: 20 }}
            title='Import'
            onPress={() => { this.import() }}
            icon={<Icon
              containerStyle={{ marginRight: 20 }}
              name='arrow-upward'
              size={20}
              color='white'
            />}
          />
          <KeyboardAvoidingView
            style={{ display: this.state.needAppPassword ? 'flex' : 'none' }}
            behavior="padding"
            keyboardVerticalOffset={40}
            enabled
          >
            <ParagraphText style={{ marginTop: 30 }}>Please enter your password:</ParagraphText>
            <PasswordInput
              placeholder='Enter password'
              value={this.state.appPassword}
              leftIconName='lock-outline'
              onChangeText={(value) => { this.setState({ ...this.state, appPassword: value }) }}
            />
            <Button
              containerStyle={{ marginTop: 20 }}
              title='Proceed with import'
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
          <KeyboardAvoidingView
            style={{ display: this.state.needFilePassword ? 'flex' : 'none' }}
            behavior="padding"
            keyboardVerticalOffset={40}
            enabled
          >
            <ParagraphText style={{ marginTop: 30 }}>Please enter the password that was used to encrypt the file:</ParagraphText>
            <PasswordInput
              placeholder='Enter file password'
              value={this.state.filePassword}
              leftIconName='lock-outline'
              onChangeText={(value) => { this.setState({ ...this.state, filePassword: value }) }}
            />
            <Button
              containerStyle={{ marginTop: 20 }}
              title='Proceed with import'
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
        </ScreenContent>
      </ScreenBackground>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackupRestoreScreen);


