import { AsyncStorage } from "react-native";

export function getItem(key: string) {
    return AsyncStorage.getItem(key);
}

export function multiGet(keys: string[]) {
    return AsyncStorage.multiGet(keys);
}

export function multiSet(items: string[][]) {
    return AsyncStorage.multiSet(items);
}

export function multiRemove(keys: string[]) {
    return AsyncStorage.multiRemove(keys);
}

export function getAllKeys() {
    return AsyncStorage.getAllKeys();
}




