const data: { [key: string]: string } = {};

export function createMockAsyncStorageService() {
    return {
        getItem: jest.fn((key: string) => data[key]),
        multiGet: jest.fn((keys: string[]) => keys.map(key => data[key])),
        multiSet: jest.fn((items: [string, string][]) => {
            items.forEach(item => {
                data[item[0]] = item[1];
            });
        }),
        multiRemove: jest.fn((keys: string[]) => {
            keys.forEach(key => {
                delete data[key];
            });
        }),
        getAllKeys: jest.fn(() => Object.keys(data))
    };
}