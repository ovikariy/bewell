import 'react-native';
import '../../__mocks__/misc'; /** special mocks */
import *  as FileSystem from 'expo-file-system';
import * as io from '../io';
import { fs, createFileSystemMock } from '../__mocks__/FileSystemMock';
import { consoleColors, consoleLogWithColor } from '../utils';

Object.assign(FileSystem, createFileSystemMock());

/** overwrite constants after Object.assign(FileSystem, createFileSystemMock()) otherwise FileSystem.cacheDirectory etc will be undefined */
io.FileSystemConstants.ExportDirectory = FileSystem.cacheDirectory + 'exports';
io.FileSystemConstants.ImportDirectory = FileSystem.cacheDirectory + 'imports';
io.FileSystemConstants.ImagesSubDirectory = FileSystem.documentDirectory + 'images';

it('createUserDataZip tests', async () => {
  expect.assertions(3);
  await expect(io.createUserDataZip('')).resolves.toBeDefined();
  await expect(io.createUserDataZip(null)).resolves.toBeDefined();
  const zipPath = await io.createUserDataZip([['key1', 'value1']]);
  expect(zipPath).toContain('.zip');
  delete fs.files[zipPath]; /** cleanup temp object prop */
});

it('importUserDataZip tests', async () => {
  expect.assertions(6);

  const tempFilePaths = {
    dockpickerPath: 'doc/Picker/Path',
    imagefilePath1: io.FileSystemConstants.ImagesSubDirectory + '/' + 'imagefilename1',
    imagefilePath2: io.FileSystemConstants.ImagesSubDirectory + '/' + 'imagefilename2',
    imagefilePath3: io.FileSystemConstants.ImagesSubDirectory + '/' + 'imagefilename3',
    zipOutput1: undefined,
    zipOutput2: undefined
  };

  /** blank import file path should throw */
  await expect(io.importUserDataZip('')).rejects.toThrow();

  /** file path valid but invalid zip content should throw */
  fs.files[tempFilePaths.dockpickerPath] = 'something';
  await expect(io.importUserDataZip(tempFilePaths.dockpickerPath)).rejects.toThrow();

  /** file path valid but blank zip content should throw */
  fs.files[tempFilePaths.dockpickerPath] = null;
  await expect(io.importUserDataZip(tempFilePaths.dockpickerPath)).rejects.toThrow();

  /** export data and pass path to import, should work */
  tempFilePaths.zipOutput1 = await io.createUserDataZip([['key1', 'value1']]);
  fs.files[tempFilePaths.dockpickerPath] = fs.files[tempFilePaths.zipOutput1];

  const importInfo = await io.importUserDataZip(tempFilePaths.dockpickerPath);
  expect(importInfo?.data && importInfo?.data.length > 0).toBeTruthy();

  /** export data with images, should work */
  fs.files[tempFilePaths.imagefilePath1] = 'something1';
  fs.files[tempFilePaths.imagefilePath2] = 'something2';
  fs.files[tempFilePaths.imagefilePath3] = 'something3';
  tempFilePaths.zipOutput2 = await io.createUserDataZip([['key1', 'value1']]);
  fs.files[tempFilePaths.dockpickerPath] = fs.files[tempFilePaths.zipOutput2];

  const importInfo2 = await io.importUserDataZip(tempFilePaths.dockpickerPath);
  expect(importInfo2?.data.length > 0).toBeTruthy();
  expect(importInfo2?.images['imagefilename1']).toEqual('something1');

  /** cleanup temp object props */
  Object.keys(tempFilePaths).forEach(key => {
    delete fs.files[tempFilePaths[key]];
  });
});

it('writeImageToDisk tests', async () => {
  expect.assertions(3);

  /** blank file name or content should return nothing */
  await expect(io.writeImageToDisk('something', '')).resolves.toBeUndefined();
  await expect(io.writeImageToDisk('', 'something')).resolves.toBeUndefined();

  /** any random file name or content should work, it's not checked for specific format as it is encrypted base64 image string */
  const imageFilePath = await io.writeImageToDisk('shfsahf-sjfjs-sfjasfh', 'something');
  expect(imageFilePath !== undefined && fs.files[imageFilePath] !== undefined).toBeTruthy();
  if (imageFilePath)
    delete fs.files[imageFilePath]; /** cleanup temp object prop */
});

it('writeFileAsync tests', async () => {
  expect.assertions(5);

  /** blank file name should throw, blank content is ok */
  await expect(io.writeFileAsync('', '', {})).rejects.toThrow();

  /** simulate not enough disk space, should throw */
  const freeDiskSpace = fs.freeDiskSpace;
  fs.freeDiskSpace = 0;
  await expect(io.writeFileAsync(io.FileSystemConstants.ExportDirectory, 'something', {})).rejects.toThrow();
  fs.freeDiskSpace = freeDiskSpace;

  /** path should be with a valid and existing directory not just file name and should throw otherwise */
  await expect(io.writeFileAsync('ffhfsajfsahasfhafs', '', undefined)).rejects.toThrow();

  const outputPath = await io.writeFileAsync(io.FileSystemConstants.ExportDirectory + '/ffhfsajfsahasfhafs', '', undefined);
  expect(outputPath !== undefined && fs.files[outputPath] === '').toBeTruthy();

  await io.writeFileAsync(outputPath, 'something', undefined);
  expect(outputPath !== undefined && fs.files[outputPath] === 'something').toBeTruthy();

  if (outputPath)
    delete fs.files[outputPath]; /** cleanup temp object prop */
});

it('deleteFilesAsync tests', async () => {
  expect.assertions(10);

  const fileCount = Object.keys(fs.files).length;
  const tempFilename = 'dddddddddddddddd';
  /** invalid directory or file list should do nothing */
  await expect(io.deleteFilesAsync(null, null)).resolves.toBeUndefined();
  expect(fileCount).toEqual(Object.keys(fs.files).length);

  /** invalid directory or file list should do nothing */
  await expect(io.deleteFilesAsync('something', [])).resolves.toBeUndefined();
  expect(fileCount).toEqual(Object.keys(fs.files).length);

  /** invalid directory or file list should do nothing */
  await expect(io.deleteFilesAsync('something', [tempFilename])).resolves.toBeUndefined();
  expect(fileCount).toEqual(Object.keys(fs.files).length);

  /** create a valid directory and file, check it exists, then delete it and check it doesn't exist */
  const outputPath = await io.writeFileAsync(io.FileSystemConstants.ExportDirectory + '/' + tempFilename, 'something', {});
  const newFileCount = Object.keys(fs.files).length;
  expect(fs.files[outputPath]).toBeDefined();
  await expect(io.deleteFilesAsync(io.FileSystemConstants.ExportDirectory, [tempFilename])).resolves.toBeUndefined();
  expect(newFileCount - 1).toEqual(fileCount);
  expect(fs.files[outputPath]).toBeUndefined();
});

it('deleteFileAsync tests', async () => {
  expect.assertions(7);

  const fileCount = Object.keys(fs.files).length;

  /** invalid filepath should do nothing */
  await expect(io.deleteFileAsync('')).resolves.toBeUndefined();
  await expect(io.deleteFileAsync(null)).resolves.toBeUndefined();
  expect(fileCount).toEqual(Object.keys(fs.files).length);

  /** create a valid file, check it exists, then delete it and check it doesn't exist */
  const outputPath = await io.writeFileAsync(io.FileSystemConstants.ExportDirectory + '/ffffffff', 'something', {});
  const newFileCount = Object.keys(fs.files).length;
  expect(fs.files[outputPath]).toBeDefined();
  await expect(io.deleteFileAsync(outputPath)).resolves.toBeUndefined();
  expect(newFileCount - 1).toEqual(fileCount);
  expect(fs.files[outputPath]).toBeUndefined();
});


it('readDirectoryAsync tests', async () => {
  expect.assertions(6);

  const tempDir = 'cache/readDirectoryAsyncDir';

  /** invalid or empty directory should return empty array*/
  await expect(io.readDirectoryAsync('')).resolves.toHaveLength(0);
  await expect(io.readDirectoryAsync(null)).resolves.toHaveLength(0);
  await expect(io.readDirectoryAsync('invalid/dir/')).resolves.toHaveLength(0);

  await io.getOrCreateDirectoryAsync(tempDir);
  await expect(io.readDirectoryAsync(tempDir)).resolves.toHaveLength(0);

  /** add files, check directory listing, then delete it and check directory again */
  await io.writeFileAsync(tempDir + '/ffffffff', 'something', {});
  await io.writeFileAsync(tempDir + '/ffffffff2', 'something2', {});

  await expect(io.readDirectoryAsync(tempDir)).resolves.toHaveLength(2);
  await io.clearDirectoryAsync(tempDir);
  await expect(io.readDirectoryAsync(tempDir)).resolves.toHaveLength(0);

  if (fs.directories[tempDir])
    delete fs.directories[tempDir]; /** cleanup temp object prop */
});

it('clearDirectoryAsync tests', async () => {
  expect.assertions(8);

  const tempDir = 'cache/clearDirectoryAsyncDir';

  /** invalid or empty directory should return void */
  await expect(io.clearDirectoryAsync('')).resolves.toBeUndefined();
  await expect(io.clearDirectoryAsync(null)).resolves.toBeUndefined();
  await expect(io.clearDirectoryAsync([])).resolves.toBeUndefined();
  await expect(io.clearDirectoryAsync('invalid/dir/')).resolves.toBeUndefined();

  await io.getOrCreateDirectoryAsync(tempDir);

  /** add a file, check directory listing, then delete it and check directory again */
  await io.writeFileAsync(tempDir + '/ffffffff', 'something', {});
  await expect(io.readDirectoryAsync(tempDir)).resolves.toHaveLength(1);
  await io.clearDirectoryAsync(tempDir);
  await expect(io.readDirectoryAsync(tempDir)).resolves.toHaveLength(0);

  /** repeat with a few files */
  await io.writeFileAsync(tempDir + '/ffffffff', 'something', {});
  await io.writeFileAsync(tempDir + '/ffffffff2', 'something2', {});
  await expect(io.readDirectoryAsync(tempDir)).resolves.toHaveLength(2);
  await io.clearDirectoryAsync(tempDir);
  await expect(io.readDirectoryAsync(tempDir)).resolves.toHaveLength(0);

  if (fs.directories[tempDir])
    delete fs.directories[tempDir]; /** cleanup temp object prop */
});

it('getStringfromFileAsync tests', async () => {
  expect.assertions(6);

  const tempFilePath = io.FileSystemConstants.ExportDirectory + '/getStringfromFileAsyncTemp';

  /** invalid or empty path should return null */
  await expect(io.getStringfromFileAsync('')).resolves.toBeNull();
  await expect(io.getStringfromFileAsync(null)).resolves.toBeNull();
  await expect(io.getStringfromFileAsync([])).resolves.toBeNull();
  await expect(io.getStringfromFileAsync('invalid/dir/file')).resolves.toBeNull();

  /** add a file and read its content */
  await io.writeFileAsync(tempFilePath, 'something', {});
  await expect(io.getStringfromFileAsync(tempFilePath)).resolves.toEqual('something');
  await io.writeFileAsync(tempFilePath, '', {});
  await expect(io.getStringfromFileAsync(tempFilePath)).resolves.toBeNull();

  if (fs.files[tempFilePath])
    delete fs.files[tempFilePath]; /** cleanup temp object prop */
});

it('getJSONfromFileAsync tests', async () => {
  expect.assertions(4);

  const tempFilePath = io.FileSystemConstants.ExportDirectory + '/getJSONfromFileAsyncTemp';

  /** invalid or empty path we tested in getStringfromFileAsync should return null */
  await expect(io.getJSONfromFileAsync('')).resolves.toBeNull();

  /** add a file and read its content, invalid JSON should throw */
  await io.writeFileAsync(tempFilePath, 'something', {});
  await expect(io.getJSONfromFileAsync(tempFilePath)).rejects.toThrow();
  await io.writeFileAsync(tempFilePath, '{ key: va"lue }', {});
  await expect(io.getJSONfromFileAsync(tempFilePath)).rejects.toThrow();
  await io.writeFileAsync(tempFilePath, JSON.stringify({ key1: 'value1' }), {});
  await expect(io.getJSONfromFileAsync(tempFilePath)).resolves.toHaveProperty('key1');

  if (fs.files[tempFilePath])
    delete fs.files[tempFilePath]; /** cleanup temp object prop */
});

it('deleteImageFromDiskAsync tests', async () => {
  expect.assertions(8);

  const fileCount = Object.keys(fs.files).length;

  /** invalid filepath should do nothing */
  await expect(io.deleteImageFromDiskAsync('')).resolves.toBeUndefined();
  await expect(io.deleteImageFromDiskAsync(null)).resolves.toBeUndefined();
  await expect(io.deleteImageFromDiskAsync('invalid/path')).resolves.toBeUndefined();
  expect(fileCount).toEqual(Object.keys(fs.files).length);

  /** create a file, check it exists, then delete it and check it doesn't exist */
  const outputPath = await io.writeFileAsync(io.FileSystemConstants.ImagesSubDirectory + '/ffffffff', 'something', {});
  const newFileCount = Object.keys(fs.files).length;
  expect(fs.files[outputPath]).toBeDefined();
  await expect(io.deleteImageFromDiskAsync('ffffffff')).resolves.toBeUndefined();
  expect(newFileCount - 1).toEqual(fileCount);
  expect(fs.files[outputPath]).toBeUndefined();
});