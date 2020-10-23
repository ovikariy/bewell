import *  as FileSystem from 'expo-file-system';
import { AppError } from './types';
import { ErrorMessage } from './constants';

export const FileSystemConstants = {
  ExportDirectory: FileSystem.cacheDirectory + 'exports',
  ImportDirectory: FileSystem.cacheDirectory + 'imports',
  ImagesSubDirectory: FileSystem.documentDirectory + 'images'
};

export async function writeFileAsync(filepath: string, text: string, options: FileSystem.WritingOptions) {

  /* TODO: FileSystem.getFreeDiskStorageAsync() and show error if no space avail
    FileSystem.getFreeDiskStorageAsync().then(freeDiskStorage => {
      Android: 17179869184
      iOS: 17179869184
    });  */
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