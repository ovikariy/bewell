import { AsyncStorage } from "react-native";

export const getItem = (key: string) => {
    return AsyncStorage.getItem(key);
};

export const multiGet = (keys: string[]) => {
    return AsyncStorage.multiGet(keys);
};

export const multiSet = (items: string[][]) => {
    return AsyncStorage.multiSet(items);
};

export const multiRemove = (keys: string[]) => {
    return AsyncStorage.multiRemove(keys);
};

export const getAllKeys = () => {
    return AsyncStorage.getAllKeys();
};




