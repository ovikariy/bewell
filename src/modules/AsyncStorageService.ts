import { AsyncStorage } from "react-native";

export const getItem = async (key: string) => {
    return await AsyncStorage.getItem(key);
}

export const multiGet = async (keys: string[]) => {
    return await AsyncStorage.multiGet(keys);
}

export const multiSet = async (items: string[][]) => {
    await AsyncStorage.multiSet(items);
}

export const multiRemove = async (keys: string[]) => {
    await AsyncStorage.multiRemove(keys);
}

export const getAllKeys = async () => {
    return await AsyncStorage.getAllKeys();
}




