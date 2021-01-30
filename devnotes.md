<h2>Building and Publishing the App</h2>

To run locally:

npm start

To publish a prod update to the app stores:

***Increment version number in app.json and if needed release channel in scripts

bewell\scripts\expo-build-prod-android.bat 
bewell\scripts\expo-build-prod-ios.bat

To publish a prod JS only update OTA:

bewell\scripts\expo-publish-prod.bat 

For staging, use corresponding bat files in the scripts directory.

By default, the app uses Expo's [Over The Air (OTA)](https://docs.expo.io/guides/configuring-ota-updates/) service which fetches and applies the updates to the JavaScript code and assets without building a new version of the app and re-submitting to app stores.

We turned off automatic OTA updates by setting "checkAutomatically" to "ON_ERROR_RECOVERY" in app.json which means it will only automatically fetch an update if the last run of the cached bundle produced a fatal JS error.

<pre>
"expo": {
   "updates": {
      "checkAutomatically": "ON_ERROR_RECOVERY"
</pre>

Instead we control the updates in the updates.ts fetchOverTheAirUpdate function since we want to fetch OTA updates when the device is connected to WiFi only as a courtesy to the user. A newly fetched update will be launched next time the user reopens the app.

However, OTA updates only download JS code updates and NOT the full bundle with native modules and binaries. This means that if the app fetches an update that uses a newly added native module or another [incompatible change](https://docs.expo.io/workflow/publishing/#limitations) without the user downloading the update through the app store, the app will produce an error. To prevent this [incompatibility](https://docs.expo.io/bare/updating-your-app/#update-compatibility), we use [Release Channels](https://docs.expo.io/bare/updating-your-app/#release-channels).

Each time we publish or build the app, we must use include a release channel, for example:
<pre> expo build:android --release-channel prod-v1-0-0</pre>
<pre> expo publish --release-channel prod-v1-0-0</pre>

Each time we are releasing an update that might break the app, run the build command with the new release channel to publish the new update to the app store:

<pre> expo build:android --release-channel prod-<b>v2</b>-0-0</pre>

Then can use expo publish for the subsequest updates until the next potentially incompatible release. 

</br>

<h2>ScrollView and Keyboard</h2>

ScrollView is used as a view wrapper because it handles keyboard dismiss properly, otherwise keyboard remains visible even after leaving the text input and pressing buttons on the screen. If cannot use a ScrollView, use [another approach](https://stackoverflow.com/questions/29685421/hide-keyboard-in-react-native). And use contentContainerStyle to stretch the content vertically:


<pre>contentContainerStyle={{ flexGrow: 1 }}</pre>

## Update translation files

The translations JSON files (i.e. en.json) are created by the script *scripts/import-translations*.
This scripts uses a TSV (tab-delimited) source (either a file or a public URL) and
generates one JSON file per language. The input source can be specified as commandline argument:

node import-translations.js input.tsv

The output files can be found in the directory *src/asset/translations*.

```txt
src/assets/translations/
├── en.json
├── fr.json
└── ru.json
```

The opposite of this process, to generate a combined TSV (tab delimited) file from these language JSON files, 
there is a script *scripts/export-translations.js*. The output filename can be specified as commandline argument:

node export-translations.js output.tsv

**Note that these files should not be modified by hand.** 
