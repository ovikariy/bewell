import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styles } from '../assets/styles/style';
import { text, stateConstants, Errors } from '../modules/Constants';
import {
  ActivityIndicator, ParagraphText, Toast, showMessages,
  PasswordInputWithButton, Spacer, HorizontalLine, PINInputWithButton, ButtonPrimary, IconForButton, LinkButton
} from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { isNullOrEmpty, formatDate, consoleLogWithColor, consoleColors } from '../modules/helpers';
import { startRestore, verifyPasswordForRestore, tryDecryptFileData, importData } from '../redux/backupRestoreActionCreators';
import * as FileHelpers from '../modules/FileHelpers';
import { getDocumentAsync } from 'expo-document-picker';
import { StackActions } from '@react-navigation/native';

const mapStateToProps = state => {
  return {
    [stateConstants.OPERATION]: state[stateConstants.OPERATION],
    [stateConstants.BACKUPRESTORE]: state[stateConstants.BACKUPRESTORE]
  };
}

const mapDispatchToProps = dispatch => ({
  verifyPasswordForRestore: (password) => dispatch(verifyPasswordForRestore(password)),
  startRestore: () => dispatch(startRestore()),
  tryDecryptFileData: (data, password) => dispatch(tryDecryptFileData(data, password)),
  importData: (data, password) => dispatch(importData(data, password))
});

class RestoreScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: null,
      filePassword: null,
      data: null,
      importFilename: null//'test.txt'
    }
  }

  componentDidMount() {
    this.props.startRestore();
  }

  reset() {
    this.setState({
      ...this.state,
      password: null,
      filePassword: null,
      data: null,
      importFilename: null
    });
  }

  verifyPassword() {
    if (isNullOrEmpty(this.state.password)) {
      Toast.show(text.restoreScreen.message1);
      return;
    }
    this.props.verifyPasswordForRestore(this.state.password);
  }

  verifyFilePassword() {
    if (isNullOrEmpty(this.state.filePassword)) {
      Toast.show(text.restoreScreen.message1);
      return;
    }
    this.props.tryDecryptFileData(this.state.data, this.state.filePassword);
  }

  browseForFile() {
    this.browseForFileAsync()
      .then(() => { })
      .catch(err => {
        alert(err.message); //TODO: better handling, maybe log
      });
  }

  browseForFileAsync = async () => {
    const docPickerResult = await getDocumentAsync({ copyToCacheDirectory: false });
    if (docPickerResult.type !== 'success')
      return; /* the user cancelled */

    this.setState({ ...this.state, importFilename: docPickerResult.name });

    await this.tryGetDataFromFileAsync(docPickerResult.uri);
  }

  tryGetDataFromFileAsync = async (importFileUri) => {
    try {
      const importDirectory = await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.ImportDirectory);
      const tempFilename = 'morning-app-import-' + formatDate(new Date(), 'YYMMMDD-hhmmss') + '.txt';
      const tempFilepath = importDirectory + '/' + tempFilename;

      /* copy to cache directory otherwise error when reading from its original location  */
      await FileHelpers.clearDirectoryAsync(importDirectory);
      await FileHelpers.copyFileAsync(importFileUri, tempFilepath);

      const data = await FileHelpers.getJSONfromFileAsync(tempFilepath);
      await FileHelpers.clearDirectoryAsync(FileHelpers.ImportDirectory);

      if (!data || data.length <= 0)
        throw new Error(text.restoreScreen.messageEmptyFile);

      this.props.tryDecryptFileData(data, this.state.password);
      this.setState({ ...this.state, data: data });
    }
    catch (err) {
      console.log('\r\n' + Errors.ImportError + err.message + '\r\n' + err.stack + '\r\n'); //TODO: remove stack trace before going to prod
      Toast.show(Errors.ImportError + err.message);
      FileHelpers.clearDirectoryAsync(FileHelpers.ImportDirectory);
    }
  }

  clearSelectedFile() {
    this.setState({ ...this.state, importFileUri: null, importFilename: null });
  }

  import() {
    const password = this.state.filePassword ? this.state.filePassword : this.state.password;
    this.props.importData(this.state.data, password);
  }

  renderPasswordField() {
    /* re-prompt for password even if logged in; if verified then allow setting PIN */
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.restoreScreen.textPassword}</ParagraphText>
      <Spacer height={70} />
      <PasswordInputWithButton value={this.state.password}
        containerStyle={styles.bottomPositioned}
        placeholder={text.restoreScreen.placeholder1}
        onPress={() => this.verifyPassword()}
        onChangeText={(value) => { this.setState({ ...this.state, password: value }) }}
      />
    </View>;
  }

  renderFilePasswordFields() {
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.restoreScreen.textFilePassword}</ParagraphText>
      <Spacer height={40} />
      {this.renderFileField()}
      <View style={[styles.flex, styles.bottomPositioned]}>
        <ButtonPrimary
          title={text.restoreScreen.buttonClear}
          onPress={() => { this.clearSelectedFile(); }}
        />
        <Spacer height={20} />
        <PasswordInputWithButton value={this.state.filePassword}
          placeholder={text.restoreScreen.placeholder2}
          onPress={() => this.verifyFilePassword()}
          onChangeText={(value) => { this.setState({ ...this.state, filePassword: value }) }}
        />
      </View>
    </View>;
  }

  renderBrowseForFile() {
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.restoreScreen.textBrowse}</ParagraphText>
      <Spacer height={70} />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: 280 }]}
        buttonStyle={styles.buttonSecondary}
        title={text.restoreScreen.buttonBrowse}
        onPress={() => { this.browseForFile(); }}
      />
    </View>;
  }

  renderSelectedFile() {
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.restoreScreen.textImport}</ParagraphText>
      <Spacer height={40} />
      {this.renderFileField()}
      <View style={[styles.flex, styles.bottomPositioned]}>
        <ButtonPrimary
          title={text.restoreScreen.buttonClear}
          onPress={() => { this.clearSelectedFile(); }}
        />
        <Spacer height={20} />
        <ButtonPrimary
          buttonStyle={styles.buttonSecondary}
          title={text.restoreScreen.buttonImport}
          onPress={() => { this.import(); }}
        />
      </View>
    </View>;
  }

  renderFileField() {
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge, styles.brightColor, { marginBottom: 15 }]}>{text.restoreScreen.labelSelectedFile}</ParagraphText>
      <ParagraphText style={[styles.bodyTextLarge]}>{this.state.importFilename}</ParagraphText>

    </View>;
  }

  renderImportComplete() {
    return <View style={styles.flex}>
      <ParagraphText style={[styles.bodyTextLarge]}>{text.restoreScreen.textComplete}</ParagraphText>
      <Spacer height={70} />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: 180 }]}
        title={text.restoreScreen.buttonDone}
        onPress={() => { this.props.navigation.dispatch(StackActions.popToTop()) }}
      />
    </View>;
  }

  renderFields() {
    if (this.props[stateConstants.BACKUPRESTORE].isComplete === true) {
      return this.renderImportComplete();
    }
    if (this.props[stateConstants.BACKUPRESTORE].isPasswordVerified !== true) {
      return this.renderPasswordField();
    }
    if (!this.state.importFilename) {
      return this.renderBrowseForFile();
    }
    if (this.props[stateConstants.BACKUPRESTORE].isFilePasswordVerified !== true) {
      return this.renderFilePasswordFields();
    }
    return this.renderSelectedFile();
  }

  render() {
    showMessages(this.props[stateConstants.OPERATION]);




/**
 * TODO:
 * 
 * better toast design
 * export shouldn't have empty months, only export ones with data
 */










    return (
      <ScreenBackground>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}  /** @see devnotes.md#region 1.1 */>
          <ScreenContent style={{ paddingHorizontal: 40, marginTop: 100 }} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{text.restoreScreen.importExplanation}</ParagraphText>
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

export default connect(mapStateToProps, mapDispatchToProps)(RestoreScreen);