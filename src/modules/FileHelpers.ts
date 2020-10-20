import *  as FileSystem from 'expo-file-system';
import { AppError } from './AppError';
import { ErrorMessage } from './Constants';

export const FileSystemConstants = {
  ExportDirectory: FileSystem.cacheDirectory + 'exports',
  ImportDirectory: FileSystem.cacheDirectory + 'imports',
  ImagesSubDirectory: FileSystem.documentDirectory + 'images'
};

export const writeFileAsync = async (filepath: string, text: string, options: FileSystem.WritingOptions) => {

  /* TODO: FileSystem.getFreeDiskStorageAsync() and show error if no space avail
    FileSystem.getFreeDiskStorageAsync().then(freeDiskStorage => {
      Android: 17179869184
      iOS: 17179869184
    });  */
  await FileSystem.writeAsStringAsync(filepath, text, options ? options : {});
};

export const deleteFilesAsync = async (directory: string, filenames: string[]) => {
  if (!directory || !filenames)
    return;
  for (const filename of filenames) {
    const fileInfo = await FileSystem.getInfoAsync(directory + '/' + filename);
    if (fileInfo.exists === true && fileInfo.isDirectory === false)
      await FileSystem.deleteAsync(fileInfo.uri);
  }
};

export const deleteFileAsync = async (filepath: string) => {
  if (!filepath)
    return;
  await FileSystem.deleteAsync(filepath);
};

export const readDirectoryAsync =  (directory: string) => {
  return  FileSystem.readDirectoryAsync(directory);
};

export const clearDirectoryAsync = async (directory: string) => {
  const filesToDelete = await FileSystem.readDirectoryAsync(directory);
  return deleteFilesAsync(directory, filesToDelete);
};

export const getOrCreateDirectoryAsync = async (path: string) => {
  const pathExists = await existsAsync(path);
  if (pathExists !== true)
    await FileSystem.makeDirectoryAsync(path, { intermediates: true });
  return path;
};

export const existsAsync = async (path: string) => {
  const pathInfo = await FileSystem.getInfoAsync(path);
  if (pathInfo && pathInfo.exists === true)
    return true;
  return false;
};

export const getStringfromFileAsync = async (filePath: string) => {
  const fileContent = await FileSystem.readAsStringAsync(filePath);
  if (!fileContent)
    return null;
  return fileContent;
};

export const getJSONfromFileAsync = async (filePath: string) => {
  const fileContent = await FileSystem.readAsStringAsync(filePath);
  if (!fileContent)
    return null;
  return JSON.parse(fileContent);
};

export const copyFileAsync = async (from: string, to: string) => {
  const fromPathInfo = await FileSystem.getInfoAsync(from);
  if (!fromPathInfo.exists || fromPathInfo.size <= 0)
    throw new AppError(ErrorMessage.InvalidFile);
  await FileSystem.copyAsync({ from, to });
};

export const deleteImageFromDiskAsync = async (filename: string) => {
  const filepath = getFullImagePath(filename);
  if (await existsAsync(filepath))
    await deleteFileAsync(filepath);
};

export function getFullImagePath(imageFileName: string) {
  return FileSystemConstants.ImagesSubDirectory + '/' + imageFileName;
}