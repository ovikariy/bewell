import { isNullOrEmpty } from "../utils";

interface FSInterface {
  freeDiskSpace: number,
  files: { [key: string]: string | null },
  directories: { [key: string]: string | null }
}

export const fs: FSInterface = {
  freeDiskSpace: 999999999999999,
  files: {
    file1: '{ key1: \'value1\' }',
    file2: '{ key2: \'value2\' }',
  },
  directories: {
    cacheDirectory: 'cache/',
    documentDirectory: 'documents/'
  }
};

export function createFileSystemMock() {
  return {
    EncodingType: {
      UTF8: "utf8",
      Base64: "base64"
    },
    WritingOptions: {
      encoding: {
        UTF8: "utf8",
        Base64: "base64"
      }
    },
    cacheDirectory: fs.directories.cacheDirectory,
    documentDirectory: fs.directories.documentDirectory,
    readAsStringAsync: jest.fn((fileUri: string, options?: any) => fs.files[fileUri] ? fs.files[fileUri] + '' : undefined),
    getFreeDiskStorageAsync: jest.fn(() => fs.freeDiskSpace),
    writeAsStringAsync: jest.fn((fileUri: string, contents: string, options?: any) => {
      fs.files[fileUri] = contents;
    }),
    getInfoAsync: jest.fn((fileUri: string, options?: { md5?: boolean, size?: boolean }) => {
      return {
        exists: (fs.files[fileUri] !== undefined || fs.directories[fileUri] !== undefined),
        size: (fs.files[fileUri] !== undefined || fs.directories[fileUri] !== undefined) ? 100 : 0,
        isDirectory: (fs.directories[fileUri] !== undefined) ? true : false,
        uri: fileUri
      };
    }),
    deleteAsync: jest.fn((fileUri: string) => {
      if (fs.files[fileUri])
        delete fs.files[fileUri];
    }),
    makeDirectoryAsync: jest.fn((fileUri: string, options?: { intermediates?: boolean }) => {
      fs.directories[fileUri] = fileUri;
    }),
    readDirectoryAsync: jest.fn((directoryUri: string) => {
      if (isNullOrEmpty(directoryUri))
        return [];
      const result = [];
      if (!directoryUri.endsWith('/') && !directoryUri.endsWith('\\'))
        directoryUri = directoryUri + '/';
      for (const key in fs.files) {
        if (key.startsWith(directoryUri))
          result.push(key.replace(directoryUri, '')); //we want only file names not full paths
      }
      return result;
    }),
    copyAsync: jest.fn((options: { from: string, to: string }) => {
      fs.files[options.to] = fs.files[options.from];
    })
  };
}