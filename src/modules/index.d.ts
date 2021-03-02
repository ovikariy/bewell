
/**  react-native-wheel-scrollview-picker doesn't have types specification so we patch it here */
declare module 'react-native-wheel-scrollview-picker' {
    declare let ScrollPicker: any;
    export = ScrollPicker;
};