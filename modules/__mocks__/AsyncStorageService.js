const testData = {
    // 'key1': 'value1',
    // 'key2': 'value2'
};

export default function mockAsyncStorageService() {
    return {
        getItem: jest.fn((key) => { return testData[key]; }),
        multiGet: jest.fn((keys) => {
            const result = [];
            for(var i=0; i < keys.length; i++) {
                result.push([keys[i], testData[keys[i]]]);
            }
            return result;
        }),
        multiSet: jest.fn((items) => {
            items.forEach((item) => {
                testData[item[0]] = item[1];
            });
        }),
        multiRemove: jest.fn((keys) => {
            keys.forEach((key) => {
                delete testData[key];
            })
        }),
        getAllKeys: jest.fn(() => { return Object.keys(testData); })
    };
}