#Bookie ionic client (POC)

##Installation
Tested on nodejs 6.9.5

` npm install -g cordova ionic yarn `

` yarn install `

Create 'app.config.ts' (copy from 'app.config.ts.example')  and edit apiEndpoint, if required

##Running the app
Getting the plugins and platforms installed:

`ionic state restore`

Starting the local environment for dev/testing:

`ionic serve`

Running on iOS emulator:

`ionic run ios --emulator`

Running on iOS device:
Before running on the device for the first time, project should be opened in xCode, having the **Development Team** set in project configuration.

`ionic run ios --device`
