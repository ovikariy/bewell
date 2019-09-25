import { AsyncStorage } from "react-native";

export const getItem = async (key) => {
    return await AsyncStorage.getItem(key);
}

export const multiGet = async (keys) => {
    return await AsyncStorage.multiGet(keys);
}

export const multiSet = async (items) => {
    await AsyncStorage.multiSet(items);
}

export const multiRemove = async (keys) => {
    await AsyncStorage.multiRemove(keys);
}

export const getAllKeys = async () => {
    return await AsyncStorage.getAllKeys();
}




