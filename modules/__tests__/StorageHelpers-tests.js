import 'react-native';
import mockAsyncStorageService from '../__mocks__/AsyncStorageService';

/* module factory function passed to jest.mock(path, moduleFactory) can be a HOF that returns a function. This will allow calling new on the mock https://jestjs.io/docs/en/es6-class-mocks */
jest.mock('../AsyncStorageService', () => mockAsyncStorageService());

/* import the code that uses the mocks after calling jest.mock */
import * as StorageHelpers from '../StorageHelpers';
import { ItemTypes } from '../../modules/Constants';

it('getItemsAsync tests', async () => {
  expect.assertions(3);

  await expect(StorageHelpers.getItemsAsync()).rejects.toThrow();
  await expect(StorageHelpers.getItemsAsync('randokeythatdoesntexist')).resolves.toBe(undefined);
  await StorageHelpers.setItemsAsync('key1', 'value1');
  await expect(StorageHelpers.getItemsAsync('key1')).resolves.toEqual('value1');
});

it('getMultiItemsAsync tests', async () => {
  expect.assertions(7);

  await expect(StorageHelpers.getItemsAsync()).rejects.toThrow();
  await expect(StorageHelpers.getItemsAsync([])).rejects.toThrow();
  await expect(StorageHelpers.getItemsAsync('notanarray')).rejects.toThrow();
  await expect(StorageHelpers.getItemsAsync()).rejects.toThrow();

  StorageHelpers.getItemsAsync(['key5', 'key6']).then(data => expect(data).toEqual([['key5', null], ['key6', null]]))
  StorageHelpers.getItemsAsync(['key1']).then(data => expect(data).toEqual([['key1', 'value1']]))
  StorageHelpers.getItemsAsync(['key1', 'key2']).then(data => expect(data).toEqual([['key1', 'value1'], ['key2', null]]))

  await StorageHelpers.logStorageDataAsync();
});

it('setItemsAsync tests', async () => {
  expect.assertions(7);

  await expect(StorageHelpers.setItemsAsync()).rejects.toThrow();
  await expect(StorageHelpers.setItemsAsync(null, 'keyNull')).rejects.toThrow();
  await expect(StorageHelpers.setItemsAsync('', 'keyBlank')).rejects.toThrow();
  await expect(StorageHelpers.setItemsAsync('key1')).resolves.toBeUndefined();

  await expect(StorageHelpers.setItemsAsync('key3', 'value3')).resolves.toBeUndefined();
  await expect(StorageHelpers.getItemsAsync('key3')).resolves.toEqual('value3');
  await expect(StorageHelpers.setItemsAsync({ someprop1: 'somevalue1' }, { someprop2: 'somevalue2' })).rejects.toThrow();

  await StorageHelpers.logStorageDataAsync();
});

it('setMultiItemsAsync tests', async () => {
  expect.assertions(9);

  await expect(StorageHelpers.setMultiItemsAsync()).rejects.toThrow();
  await expect(StorageHelpers.setMultiItemsAsync('somestring')).rejects.toThrow();
  await expect(StorageHelpers.setMultiItemsAsync([])).rejects.toThrow();
  await expect(StorageHelpers.setMultiItemsAsync([[]])).rejects.toThrow();

  await expect(StorageHelpers.setMultiItemsAsync([['key1']])).rejects.toThrow();
  await expect(StorageHelpers.setMultiItemsAsync([[{ keyasobject: 'shouldthrow' }, 'value1']])).rejects.toThrow();
  await expect(StorageHelpers.setMultiItemsAsync([['key1', 'value1']])).resolves.toBeUndefined();
  await expect(StorageHelpers.setMultiItemsAsync([['key4', 'value4'], ['key5', 'value5']])).resolves.toBeUndefined();

  await expect(StorageHelpers.getItemsAsync('key4')).resolves.toEqual('value4');

  await StorageHelpers.logStorageDataAsync();
});

export const mergeByIdAsync = async (itemTypeName, newItems) => {
  if (!newItems || newItems.length <= 0)
    throw new Error(Errors.UnableToSave + ErrorCodes.Storage5);

  const oldItems = await getItemsAndDecryptAsync(itemTypeName);

  /* if item has ID then overwrite, otherwise add */
  (newItems).forEach(newItem => {
    if (!newItem.id)
      throw new Error(Errors.UnableToSave + ErrorCodes.Storage6);
    const oldItemIndex = oldItems.findIndex(oldItem => oldItem.id === newItem.id);
    if (oldItemIndex > -1)
      oldItems[oldItemIndex] = newItem;
    else
      oldItems.push(newItem);
  });

  await setItemsAndEncryptAsync(itemTypeName, oldItems);
}

it('mergeByIdAsync tests', async () => {
  expect.assertions(8);

  await expect(StorageHelpers.mergeByIdAsync()).rejects.toThrow();
  await expect(StorageHelpers.mergeByIdAsync('invalidTypeName', [{ id: 'id1', value: 'value1' }])).rejects.toThrow();
  await expect(StorageHelpers.mergeByIdAsync({ typenameasobject: 'shouldthrow' })).rejects.toThrow();
  await expect(StorageHelpers.mergeByIdAsync(ItemTypes.MOOD, [{ objectWithoutId: 'shouldThrow' }])).rejects.toThrow();
  
  await expect(StorageHelpers.mergeByIdAsync(ItemTypes.MOOD, [{ id: 'id1', value: 'value1' }])).resolves.toBeUndefined();
  StorageHelpers.getItemsAndDecryptAsync(ItemTypes.MOOD).then(data => expect(data).toEqual([{ id: 'id1', value: 'value1' }]));
  await expect(StorageHelpers.mergeByIdAsync(ItemTypes.MOOD, [{ id: 'id1', value: 'value2' }])).resolves.toBeUndefined();
  StorageHelpers.getItemsAndDecryptAsync(ItemTypes.MOOD).then(data => expect(data).toEqual([{ id: 'id1', value: 'value2' }]));
  
  await StorageHelpers.logStorageDataAsync();
});

it('mergeByIdAsync tests', async () => {
  expect.assertions(8);

  await expect(StorageHelpers.mergeByIdAsync()).rejects.toThrow();
  await expect(StorageHelpers.mergeByIdAsync('invalidTypeName', [{ id: 'id1', value: 'value1' }])).rejects.toThrow();
  await expect(StorageHelpers.mergeByIdAsync({ typenameasobject: 'shouldthrow' })).rejects.toThrow();
  await expect(StorageHelpers.mergeByIdAsync(ItemTypes.MOOD, [{ objectWithoutId: 'shouldThrow' }])).rejects.toThrow();
  
  await expect(StorageHelpers.mergeByIdAsync(ItemTypes.MOOD, [{ id: 'id1', value: 'value1' }])).resolves.toBeUndefined();
  StorageHelpers.getItemsAndDecryptAsync(ItemTypes.MOOD).then(data => expect(data).toEqual([{ id: 'id1', value: 'value1' }]));
  await expect(StorageHelpers.mergeByIdAsync(ItemTypes.MOOD, [{ id: 'id1', value: 'value2' }])).resolves.toBeUndefined();
  StorageHelpers.getItemsAndDecryptAsync(ItemTypes.MOOD).then(data => expect(data).toEqual([{ id: 'id1', value: 'value2' }]));
  
  await StorageHelpers.logStorageDataAsync();
});

export const removeByIdAsync = async (itemTypeName, id) => {
  if (!itemTypeName)
      throw new Error(Errors.General + ErrorCodes.MissingItemType1);

  const oldItems = await getItemsAndDecryptAsync(itemTypeName);
  const itemsWithoutDeleted = oldItems.filter(item => item.id !== id);

  await setItemsAndEncryptAsync(itemTypeName, itemsWithoutDeleted);
}


