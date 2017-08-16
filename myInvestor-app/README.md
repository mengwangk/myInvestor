# myInvestor mobile app.

For React Native
- Upgrade Gradle Plugin to 2.3.1
- Upgrade SDK build tool to 25.0.0
- Upgrade to Gradle 3.3

create-native-app using Expo. Run "npm run eject" to go native.

keytool -genkey -v -keystore myinvestor.keystore -alias myinvestor -keyalg RSA -keysize 2048 -validity 10000

- cd android && ./gradlew assembleRelease
- gradlew clean assembleRelease
- delete build folder if there is an error generating apk
- react-native run-android --variant=release
- clean build cache - https://developer.android.com/studio/build/build-cache.html

# Reference
http://makeitopen.com/ 
https://www.codementor.io/mz026/getting-started-with-react-redux-an-intro-8r6kurcxf
https://github.com/react-community/react-navigation/issues/131
https://github.com/kyaroru/ReactNavDrawer
https://stackoverflow.com/questions/35924721/how-to-update-version-number-of-react-native-app


# Libraries
https://github.com/visionmedia/superagent
https://github.com/redux-observable/redux-observable
https://github.com/reactjs/redux/examples

