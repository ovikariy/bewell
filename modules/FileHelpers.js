import *  as FileSystem from 'expo-file-system';

export const ExportDirectory = FileSystem.cacheDirectory + 'exports';
export const ImportDirectory = FileSystem.cacheDirectory + 'imports';

export const readFile = async () => {

}

export const writeFileAsync = async (filepath, text, options = null) => {

  /* TODO: FileSystem.getFreeDiskStorageAsync() and show error if no space avail
    FileSystem.getFreeDiskStorageAsync().then(freeDiskStorage => {
      Android: 17179869184
      iOS: 17179869184
    });  */
  await FileSystem.writeAsStringAsync(filepath, text, options ? options : {});
}

export const deleteFilesAsync = async (directory, filenames) => {
  if (!directory || !filenames)
    return;
  for (var i = 0; i < filenames.length; i++) {
    const fileInfo = await FileSystem.getInfoAsync(directory + '/' + filenames[i]);
    if (fileInfo.exists === true && fileInfo.isDirectory === false)
      await FileSystem.deleteAsync(fileInfo.uri);
  }
}

export const readDirectoryAsync = async (directory) => {
  return await FileSystem.readDirectoryAsync(directory);
}

export const clearDirectoryAsync = async (directory) => {
  const filesToDelete = await FileSystem.readDirectoryAsync(directory);
  await deleteFilesAsync(directory, filesToDelete);
}

export const getOrCreateDirectoryAsync = async (path) => {
  const pathExists = await existsAsync(path);
  if (pathExists !== true)
    await FileSystem.makeDirectoryAsync(path, { 'intermediates': true });
  return path;
}

export const existsAsync = async (path) => {
  const pathInfo = await FileSystem.getInfoAsync(path);
  if (pathInfo && pathInfo.exists === true)
    return true;
  return false;
}

export const getJSONfromFileAsync = async (filePath) => {
  const fileContent = await FileSystem.readAsStringAsync(filePath);
  if (!fileContent)
    return null;
  return JSON.parse(fileContent);
}

export const copyFileAsync = async (from, to) => {
  const fromPathInfo = await FileSystem.getInfoAsync(from);
  if (!fromPathInfo.exists || fromPathInfo.size <= 0)
    throw new Error('Invalid file to copy');
  await FileSystem.copyAsync({ from: from, to: to });
}

