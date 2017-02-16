#Bookie ionic client (POC)

##Installation
Tested on nodejs 6.9.5

` npm install -g cordova ionic yarn `

` yarn install `

##Running the app
Starting the local environment for dev/testing:
`ionic serve`

Adding platforms:
iOS: `ionic platform add ios`
Android: `ionic platform add android`

Running on iOS emulator:
`ionic run ios --emulator`

Running on iOS device:
Before running on the device for the first time, project should be opened in xCode, having the **Development Team** set in project configuration.

`ionic run ios --device`
