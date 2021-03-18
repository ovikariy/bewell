/*
  special mock for react-native-get-random-values otherwise gives:
  TypeError: Cannot read property 'getRandomBase64' of undefined
  at Object.<anonymous> (node_modules/react-native-get-random-values/getRandomBase64.js:1:18)
 */
jest.mock('react-native-get-random-values', () => ({
  getRandomBase64: jest.fn(),
}));

/* always keep date now the same because it would change in the test each time it runs and fail */
Date.now = jest.fn(() => 1482363367071);

export const StableDate = new Date(Date.now());