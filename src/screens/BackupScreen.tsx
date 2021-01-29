import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  ParagraphText, Toast, PasswordInputWithButton,
  Spacer, HorizontalLine, ButtonPrimary, ButtonSecondary, LoadingScreeenOverlay
} from '../components/MiscComponents';
import { View, ScrollView } from 'react-native';
import { ScreenBackground, ScreenContent } from '../components/ScreenComponents';
import { isNullOrEmpty, formatDate, consoleLogWithColor } from '../modules/utils';
import { startBackup, getExportData, finishBackup } from '../redux/backupRestoreActionCreators';
import * as FileHelpers from '../modules/io';
import { StackActions } from '@react-navigation/native';
import { shareAsync } from 'expo-sharing';
import { AppContext } from '../modules/appContext';
import { RootState } from '../redux/store';
import { AppError, AppNavigationProp } from '../modules/types';
import { sizes } from '../assets/styles/style';

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
  loading: boolean;
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
      password: undefined,
      loading: false
    };
  }

  componentDidMount() {
    this.props.startBackup();
  }

  reset() {
    this.setState({
      ...this.state,
      password: undefined,
      loading: false
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
      2. Write the data and images to a temp zip in a cache directory. Files stored here may be automatically deleted by the system when low on storage.
      3. Share the zip file e.g. to Google Drive
    */
    try {
      this.setState({ ...this.state, loading: true });
      const exportZipFilePath = await FileHelpers.createUserDataZip(data);
      this.setState({ ...this.state, loading: false });
      shareAsync(exportZipFilePath);
      this.props.finishBackup();
    }
    catch (error) {
      consoleLogWithColor(error);
      this.setState({ ...this.state, loading: false });
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
      <Spacer />
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
      <Spacer />
      <ButtonSecondary
        containerStyle={[styles.bottomPositioned, { width: sizes[255] }]}
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
      <Spacer />
      <ButtonPrimary
        containerStyle={[styles.bottomPositioned, { width: sizes[180] }]}
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}  /** @see devnotes.md#scrollView-and-keyboard*/>
          <ScreenContent style={styles.screenBodyContainerLargeMargin} >
            <ParagraphText style={[styles.titleText, styles.hugeText]}>{language.exportExplanation}</ParagraphText>
            <HorizontalLine />
            {this.state.loading && <LoadingScreeenOverlay text={language.fileGenerating} />}
            {this.renderFields()}
          </ScreenContent>
        </ScrollView>
      </ScreenBackground>
    );
  }
}

export default connector(BackupScreen);