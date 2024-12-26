// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
const { withNativeWind } = require("nativewind/metro");
/** @type {import('expo/metro-config').MetroConfig} */

const config = getDefaultConfig(__dirname);

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: "./globals.css" })
);
