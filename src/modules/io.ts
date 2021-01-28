import *  as FileSystem from 'expo-file-system';
import { AppError, ImageInfoAssocArray, ImportInfo } from './types';
import { ErrorMessage } from './constants';
import JSZip from 'jszip';
import { formatDate } from './utils';
global.Buffer = global.Buffer || require('buffer').Buffer;

export const FileSystemConstants = {
  ExportFilePrefix: 'bewellapp-export-',
  ExportFileExtension: '.bewellappdata',
  ExportZipExtension: '.zip',
  ExportDirectory: FileSystem.cacheDirectory + 'exports',
  ImportDirectory: FileSystem.cacheDirectory + 'imports',
  ImagesPrefix: 'images',
  ImagesSubDirectory: FileSystem.documentDirectory + 'images'
};

/**
 * Creates a zip archive in app cache directory using JSZip with user data file and images subfolder:
 *    bewellapp-export-Jan282021-073252.bewellappdata
 *    images\3bf5420f-7620-4ccc-a154-2882bc795032
 *    images\88914134-25aa-4922-ab91-303e8b7155da
 */
export async function createUserDataZip(data: [string, string][]) {
  const exportDirectory = await getOrCreateDirectoryAsync(FileSystemConstants.ExportDirectory);

  /** delete old files from export directory */
  const oldExportFiles = await readDirectoryAsync(exportDirectory);
  deleteFilesAsync(exportDirectory, oldExportFiles);

  const fileName = FileSystemConstants.ExportFilePrefix + formatDate(new Date(), 'MMMDDYYYY-hhmmss');
  const exportDataFilename = fileName + FileSystemConstants.ExportFileExtension;
  const exportZipFilePath = exportDirectory + '/' + fileName + FileSystemConstants.ExportZipExtension;

  /** add user data as file to zip, no need to write to disk first */
  const jsZip = new JSZip();
  jsZip.file(exportDataFilename, JSON.stringify(data));

  /** add images data to zip */
  const images = await getImages();
  for (const imagePath of Object.keys(images))
    jsZip.file(imagePath, images[imagePath]);

  /** generate zip */
  const zipContent = await jsZip.generateAsync({ type: "base64" });
  /** write zip to cache */
  await writeFileAsync(exportZipFilePath, zipContent, { encoding: FileSystem.EncodingType.Base64 });
  return exportZipFilePath;
}

/**
 * Gets images saved by the user to be written into a zip archive
 */
async function getImages() {
  const imagesDirectory = await getOrCreateDirectoryAsync(FileSystemConstants.ImagesSubDirectory);
  const imageFileNames = await readDirectoryAsync(imagesDirectory); /** file names are just names not full paths */
  const result = {} as ImageInfoAssocArray;
  for (const imageFileName of imageFileNames) {
    const imageFileContent = await getStringfromFileAsync(imagesDirectory + '/' + imageFileName);
    if (imageFileContent) {
      const imagePath = FileSystemConstants.ImagesPrefix + '/' + imageFileName;
      result[imagePath] = imageFileContent;
    }
  };
  return result;
}

/**
 * Reads a previously exported zip archive and loads user data from a file
 * with extension 'bewellappdata' and loads images from 'images' subdirectory:
 *    bewellapp-export-Jan282021-073252.bewellappdata
 *    images\3bf5420f-7620-4ccc-a154-2882bc795032
 *    images\88914134-25aa-4922-ab91-303e8b7155da
 */
export async function importUserDataZip(docPickerFileUri: string): Promise<ImportInfo | null> {
  //TODO: test with large files
  const importDirectory = await getOrCreateDirectoryAsync(FileSystemConstants.ImportDirectory);
  const tempFilename = 'bewellapp-import-' + formatDate(new Date(), 'YYMMMDD-hhmmss') + FileSystemConstants.ExportZipExtension;
  const tempFilepath = importDirectory + '/' + tempFilename;

  /** copy to cache directory otherwise error when reading from its original location */
  await clearDirectoryAsync(importDirectory);
  await copyFileAsync(docPickerFileUri, tempFilepath);

  /** read zip file from cache directory */
  const zipContent = await FileSystem.readAsStringAsync(tempFilepath, { encoding: 'base64' });
  if (!zipContent)
    throw new AppError(ErrorMessage.InvalidFile);

  /** unzip the archive */
  const jsZip = new JSZip();
  const upzippedContent = await jsZip.loadAsync(zipContent, { base64: true });

  /** find the data file and images in the zip */
  const result = { images: {} } as ImportInfo;
  for (const filename in upzippedContent.files) {
    const fileContent = await jsZip.files[filename].async("string");
    if (filename.endsWith(FileSystemConstants.ExportFileExtension))
      result.data = fileContent;
    else if (filename.startsWith(FileSystemConstants.ImagesPrefix)) {
      const imageFileName = filename.replace(FileSystemConstants.ImagesPrefix + '/', '');
      if (imageFileName && fileContent)
        result.images[imageFileName] = fileContent;
    }
  }

  /** zip data is in memory, can wipe the temp file */
  await clearDirectoryAsync(FileSystemConstants.ImportDirectory);

  if (!result.data)
    return null;
  result.data = JSON.parse(result.data);
  return result;
}

/**
 * Writes image content to file under FileSystemConstants.ImagesSubDirectory
 * @param imageFileName e.g. '3bf5420f-7620-4ccc-a154-2882bc795032'
 * @param imageContent encrypted base64 image string
 */
export async function writeImageToDisk(imageFileName: string, imageContent: string) {
  if (!imageFileName || !imageContent)
    return;
  const imagePath = FileSystemConstants.ImagesSubDirectory + '/' + imageFileName;
  return writeFileAsync(imagePath, imageContent, {});
}

export async function writeFileAsync(filepath: string, text: string, options: FileSystem.WritingOptions) {
  const diskSpaceNeeded = Buffer.byteLength(text);
  const diskSpaceAvailable = await FileSystem.getFreeDiskStorageAsync();
  if (diskSpaceNeeded > diskSpaceAvailable)
    throw new AppError(ErrorMessage.NotEnoughSpace);
  await FileSystem.writeAsStringAsync(filepath, text, options ? options : {});
}

export async function deleteFilesAsync(directory: string, filenames: string[]) {
  if (!directory || !filenames)
    return;
  for (const filename of filenames) {
    const fileInfo = await FileSystem.getInfoAsync(directory + '/' + filename);
    if (fileInfo.exists === true && fileInfo.isDirectory === false)
      await FileSystem.deleteAsync(fileInfo.uri);
  }
}

export async function deleteFileAsync(filepath: string) {
  if (!filepath)
    return;
  await FileSystem.deleteAsync(filepath);
}

export async function readDirectoryAsync(directory: string) {
  return FileSystem.readDirectoryAsync(directory);
}

export async function clearDirectoryAsync(directory: string) {
  const filesToDelete = await FileSystem.readDirectoryAsync(directory);
  return deleteFilesAsync(directory, filesToDelete);
}

export async function getOrCreateDirectoryAsync(path: string) {
  const pathExists = await existsAsync(path);
  if (pathExists !== true)
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  return path;
}

export async function existsAsync(path: string) {
  const pathInfo = await FileSystem.getInfoAsync(path);
  if (pathInfo && pathInfo.exists === true)
    return true;
  return false;
}

export async function getStringfromFileAsync(filePath: string) {
  const fileContent = await FileSystem.readAsStringAsync(filePath);
  if (!fileContent)
    return null;
  return fileContent;
}

export async function getJSONfromFileAsync(filePath: string) {
  const fileContent = await FileSystem.readAsStringAsync(filePath);
  if (!fileContent)
    return null;
  return JSON.parse(fileContent);
}

export async function copyFileAsync(from: string, to: string) {
  const fromPathInfo = await FileSystem.getInfoAsync(from);
  if (!fromPathInfo.exists || fromPathInfo.size <= 0)
    throw new AppError(ErrorMessage.InvalidFile);
  await FileSystem.copyAsync({ from, to });
}

export async function deleteImageFromDiskAsync(filename: string) {
  const filepath = getFullImagePath(filename);
  if (await existsAsync(filepath))
    await deleteFileAsync(filepath);
}

export function getFullImagePath(imageFileName: string) {
  return FileSystemConstants.ImagesSubDirectory + '/' + imageFileName;
}