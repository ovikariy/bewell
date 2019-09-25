import 'react-native';
import mockAsyncStorageService from '../__mocks__/AsyncStorageService';

/* module factory function passed to jest.mock(path, moduleFactory) can be a HOF that returns a function. This will allow calling new on the mock https://jestjs.io/docs/en/es6-class-mocks */
jest.mock('../modules/AsyncStorageService', () => mockAsyncStorageService());

/* import the code that uses the mocks after calling jest.mock */
import * as StorageHelpers from '../modules/StorageHelpers';

it('1 equals 1', () => {
  expect(1).toBe(1);
});

it('getItemsAsync key1 equals value1', () => {
  expect.assertions(1);
  return StorageHelpers.getItemsAsync('key1').then(data => expect(data).toEqual('value1'));
});

it('getMultiItemsAsync [key1] equals [["key1","value1"]]', () => {
  expect.assertions(1);
  return StorageHelpers.getMultiItemsAsync(['key1']).then(data => expect(data).toEqual([['key1','value1']]));
});

it('setItemsAsync key3 value3', () => {
  expect.assertions(1);
  return StorageHelpers.setItemsAsync('key3', 'value3').then(() => {
    return StorageHelpers.getItemsAsync('key3').then(data => expect(data).toEqual('value3'));
  })
});