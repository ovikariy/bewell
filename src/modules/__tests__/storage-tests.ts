import 'react-native';
import { createMockAsyncStorageService } from '../__mocks__/AsyncStorageService';
import 'misc'; /* special mocks */

/* import the code that uses the mocks after calling jest.mock */
import * as storage from '../storage';

// Dirty hack to override AsyncStorageService
// TODO: find a more elegant way to provide this override
Object.assign(storage.asyncStorageService, createMockAsyncStorageService());

it('getItemAsync', async () => {
  expect.assertions(3);
  await expect(storage.getItemAsync(undefined!)).rejects.toThrow();
  await expect(storage.getItemAsync('randokeythatdoesntexist')).resolves.toBe(undefined);
  await storage.setItemAsync('key1', 'value1');
  await expect(storage.getItemAsync('key1')).resolves.toEqual('value1');
});

it('getItemsAsync', async () => {
  expect.assertions(6);

  await expect(storage.getItemsAsync(undefined!)).rejects.toThrow();
  await expect(storage.getItemsAsync([])).rejects.toThrow();
  await expect(storage.getItemsAsync('notanarray' as any)).rejects.toThrow();

  storage.getItemsAsync(['key5', 'key6']).then(data => expect(data).toEqual([['key5', null], ['key6', null]]));
  storage.getItemsAsync(['key1']).then(data => expect(data).toEqual([['key1', 'value1']]));
  storage.getItemsAsync(['key1', 'key2']).then(data => expect(data).toEqual([['key1', 'value1'], ['key2', null]]));
});

it('setItemAsync', async () => {
  expect.assertions(7);

  await expect(storage.setItemAsync(undefined!, undefined!)).rejects.toThrow();
  await expect(storage.setItemAsync(undefined!, 'keyNull')).rejects.toThrow();
  await expect(storage.setItemAsync('', 'keyBlank')).rejects.toThrow();
  await expect(storage.setItemAsync('key1', undefined!)).resolves.toBeUndefined();

  await expect(storage.setItemAsync('key3', 'value3')).resolves.toBeUndefined();
  await expect(storage.getItemAsync('key3')).resolves.toEqual('value3');
  await expect(storage.setItemAsync({ someprop1: 'somevalue1' } as any, { someprop2: 'somevalue2' } as any)).rejects.toThrow();
});

it('setMultiItemsAsync', async () => {
  expect.assertions(10);

  await expect(storage.setMultiItemsAsync(undefined!)).rejects.toThrow();
  await expect(storage.setMultiItemsAsync('somestring' as any)).rejects.toThrow();
  await expect(storage.setMultiItemsAsync([])).rejects.toThrow();
  await expect(storage.setMultiItemsAsync([[] as any])).rejects.toThrow();

  await expect(storage.setMultiItemsAsync([['key1'] as any])).rejects.toThrow();
  await expect(storage.setMultiItemsAsync([[{ keyasobject: 'shouldthrow' } as any, 'value1']])).rejects.toThrow();
  await expect(storage.setMultiItemsAsync([['key1', 'value1']])).resolves.toBeUndefined();
  await expect(storage.setMultiItemsAsync([['key4', 'value4'], ['key5', 'value5']])).resolves.toBeUndefined();

  await expect(storage.getItemAsync('key4')).resolves.toEqual('value4');
  await expect(storage.getItemsAsync(['key4'])).resolves.toEqual(['value4']);
});
