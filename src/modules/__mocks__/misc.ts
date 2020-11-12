/*
  special mock for react-native-get-random-values otherwise gives:
  TypeError: Cannot read property 'getRandomBase64' of undefined
  at Object.<anonymous> (node_modules/react-native-get-random-values/getRandomBase64.js:1:18)
 */
jest.mock('react-native-get-random-values', () => ({
  getRandomBase64: jest.fn(),
}));