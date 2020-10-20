import React from 'react';
import { ButtonPrimary, Toast, StyledImage, ActivityIndicator, RoundButton, ImageProps } from './MiscComponents';
import { Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { AppContext } from '../modules/AppContext';
import * as FileHelpers from '../modules/FileHelpers';
import { friendlyTime, getNewUuid, isNullOrEmpty } from '../modules/helpers';
import { ErrorMessage, brokenImageURI } from '../modules/Constants';
import { encryptDataAsync, decryptDataAsync } from '../modules/SecurityHelpers';
import { WidgetBase, WidgetComponentPropsBase, WidgetConfig } from '../modules/WidgetFactory';
import { AppError } from '../modules/AppError';


export interface ImagePickerWidgetType extends WidgetBase {
  imageProps?: ImageProps;
}

export interface ImagePickerComponentProps extends WidgetComponentPropsBase {
  value: ImagePickerWidgetType;
  readonly: boolean;
  isSelected?: boolean;
  onChange: (value: ImagePickerWidgetType) => void;
}

interface ImagePickerWidgetState { image?: string }
export class ImagePickerComponent extends React.Component<ImagePickerComponentProps, ImagePickerWidgetState> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  constructor(props: ImagePickerComponentProps) {
    super(props);
    this.state = {
      image: undefined
    };
  }

  reset() {
    this.setState({
      ...this.state,
      image: undefined
    });
  }

  componentDidMount() {
    this.getPermissionAsync();
    /* when images has been saved in the past, process it async from disk and update state when ready with new image data */
    if (this.props.value.imageProps)
      this.getImageFromFile();
  }

  componentDidUpdate(prevProps: ImagePickerComponentProps) {
    if (!this.props.value || !this.props.value.imageProps)
      return;
    /* when user selects a new image, process it async from disk and update state when ready with new image data */
    if (!prevProps.value.imageProps || prevProps.value.imageProps.filename !== this.props.value.imageProps.filename)
      this.getImageFromFile();

  }

  render() {
    const language = this.context.language;
    const styles = this.context.styles;

    const image = this.state.image;

    if (!image) {
      if (this.props.value && this.props.value.imageProps && this.props.value.imageProps.filename) {
        /* we have a filename but haven't finished loading it from disk yet */
        return <View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
          <ActivityIndicator />
        </View>;
      }
      else {
        /* it's a blank widget and user hasn't picked an image yet */
        return <View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
          <ButtonPrimary
            title={language.pickImage}
            onPress={() => this.pickImage()}
          />
        </View>;
      }
    }

    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        {this.props.readonly !== true && this.props.isSelected
          && <RoundButton name="close" onPress={() => this.clearImage()} containerStyle={styles.imageComponentClearButtonContainer} />}
        {this.props.value.imageProps
          && <StyledImage image={image} imageProps={this.props.value.imageProps} />}
      </View >
    );
  }

  getImageFromFile() {
    this.getImageFromFileAsync()
      .then((image) => {
        this.setState({ ...this.state, image });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ ...this.state, image: brokenImageURI });
        (error instanceof AppError !== true) ?
          Toast.showTranslated(error.message, this.context) :
          Toast.showError(error, this.context);
      });
  }

  getImageFromFileAsync = async () => {
    if (!this.props.value.imageProps)
      throw new AppError(ErrorMessage.InvalidParameter);

    const imageFullPath = FileHelpers.getFullImagePath(this.props.value.imageProps.filename);
    if (await FileHelpers.existsAsync(imageFullPath) !== true)
      throw new AppError(ErrorMessage.InvalidFile);

    const fileContent = await FileHelpers.getStringfromFileAsync(imageFullPath);
    if (!fileContent)
      throw new AppError(ErrorMessage.InvalidFormat);

    const fileContentDecrypted = await decryptDataAsync(fileContent);
    if (!fileContentDecrypted)
      throw new AppError(ErrorMessage.UnableToDecrypt);

    return fileContentDecrypted;
  };

  pickImage() {
    this.pickImageAsync()
      .then(() => { })
      .catch((error) => {
        console.log(error);
        (error instanceof AppError !== true) ?
          Toast.showTranslated(error.message, this.context) :
          Toast.showError(error, this.context);
      });
  }

  pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      exif: true,
      allowsEditing: false,
      quality: 0.5
    });
    this.onImagePicked(result);
  };

  onImagePicked(result: ImagePicker.ImagePickerResult) {
    if (result.cancelled) /* this check is needed inside this funtion otherwise ImageInfo props will not be available if cancelled == false */
      return;

    this.saveImageToFileAsync(result.base64)
      .then((filename) => {
        this.props.onChange({
          ...this.props.value,
          imageProps: {
            imageType: result.type,
            exif: result.exif,
            filename,
            width: result.width,
            height: result.height
          } as ImageProps
        });
        this.reset();
      })
      .catch((error) => {
        console.log(error);
        (error instanceof AppError !== true) ?
          Toast.showTranslated(error.message, this.context) :
          Toast.showError(error, this.context);
      });

  }

  saveImageToFileAsync = async (fileContent: string | undefined) => {
    //get image base64 string, encrypt, store in document directory so can be zipped up during export
    //get the URI to the file and store as property of widget record by calling onChange from props
    if (!fileContent || isNullOrEmpty(fileContent))
      throw new AppError(ErrorMessage.InvalidFormat);

    const fileContentEncrypted = await encryptDataAsync(fileContent);
    if (!fileContentEncrypted)
      throw new AppError(ErrorMessage.UnableToEncrypt);

    await FileHelpers.getOrCreateDirectoryAsync(FileHelpers.FileSystemConstants.ImagesSubDirectory);

    const filename = getNewUuid();
    const filepath = FileHelpers.getFullImagePath(filename);
    await FileHelpers.writeFileAsync(filepath, fileContentEncrypted, {});
    return filename;
  };

  getPermissionAsync = async () => {
    const language = this.context.language;

    if (Constants.platform && Constants.platform.ios) {
      const status = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status.granted)
        alert(language.cameroRollPermissions);

    }
  };

  clearImage() {
    if (!this.props.value || !this.props.value.imageProps || !this.props.value.imageProps.filename)
      return;

    if (this.state.image === brokenImageURI) {
      this.props.onChange({ ...this.props.value, imageProps: undefined });
      this.reset();
      return;
    }

    FileHelpers.deleteImageFromDiskAsync(this.props.value.imageProps.filename)
      .then(() => {
        this.props.onChange({ ...this.props.value, imageProps: undefined });
        this.reset();
      })
      .catch((error) => {
        console.log(error);
        (error instanceof AppError !== true) ?
          Toast.showTranslated(error.message, this.context) :
          Toast.showError(error, this.context);
      });
  }
}

interface ImagePickerHistoryComponentProps {
  item: ImagePickerWidgetType;
  isSelectedItem: boolean;
  config: WidgetConfig;
}
export const ImagePickerHistoryComponent = (props: ImagePickerHistoryComponentProps) => {
  const context = React.useContext(AppContext);
  const styles = context.styles;
  return (
    <View style={styles.row}>
      <View style={[styles.flex]}>
        <Text style={[styles.bodyText, { marginBottom: 10 }, props.isSelectedItem ? styles.highlightColor : null]}>
          {friendlyTime(props.item.date)}</Text>
        <ImagePickerComponent value={props.item} config={props.config} readonly={true} onChange={() => { }} selectedDate={new Date()} />
      </View>
    </View>
  );
};
