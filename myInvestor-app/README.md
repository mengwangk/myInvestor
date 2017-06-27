# myInvestor mobile app.

For React Native
- Upgrade Gradle Plugin to 2.3.1
- Upgrade SDK build tool to 25.0.0
- Upgrade to Gradle 3.3

create-native-app using Expo. Run "npm run eject" to go native.

keytool -genkey -v -keystore myinvestor.keystore -alias myinvestor -keyalg RSA -keysize 2048 -validity 10000

- cd android && ./gradlew assembleRelease
- gradlew clean assembleRelease -d
- delete build folder if there is an error generating apk
- react-native run-android --variant=release

# Reference
http://makeitopen.com/ 