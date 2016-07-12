# MOOC UCC Mobile app (iOS/Android)

## Instructions for running on dev environment

### Install NodeJS

#### Linux

**Ubuntu/Debian**

`sudo apt-get install nodejs`

**Archlinux**

`sudo pacman -S nodejs`

#### Windows

Download the "Current" release (option)

[NodeJS](https://nodejs.org/en/download/)

#### MacOSX

Download from "Macintosh Installer"

[NodeJS](https://nodejs.org/en/download/)

### Installing Ionic and Apache Cordova

Launch your Terminal and install cordova and ionic with npm:
#### Linux and MacOSX
`sudo npm install -g cordova`

`sudo npm install -g ionic`

#### Windows
`npm install cordova`

`npm install ionic`

### Clone repo and run app

#### Clone this repo

`git clone https://github.com/informaticaeducativa/mooc_ionic.git`

`cd mooc_ionic`

#### Run the ionic server

`ionic serve`

### IMPORTANT:
**For login and derivate purposes is necessary to use the emulator or device debugging mode.**

## Emulate on Device (virtual or real)

### Android

#### First, you need to add the android platform with

`ionic platform add android`

#### Running on the emulator

`ionic emulate android`

It emulates the MOOC app for android on the default emulator image (usually, declared on the AVD manager - Android Studio)

#### Running on device or GenyMotion

`ionic run android`

It runs the app on the USB Debugging device (mobile phone with android OS) connected to the PC/Mac.
If you want to use GenyMotion instead of AVD, you need to be running the preferred image and run the previous command (notice: disconnect all the USB devices in debugging mode in order to use de GenyMotion emulator.)

### iOS (iPhone/iPad)

#### First, you need to add the iOS platform with

`ionic platform add ios`

#### Running on the emulator

You need to open the Xcode app on your Mac and open the project by entering to

`/path/to/ionic/project/platforms/ios`

and select the file

`MOOC UCC.xcodeproject`

From there, you may run the app on the emulator (iPhone 4s-6s, iPad) or on your device using

`Command + R`

## Backend Routes (API REST)

[MOOC UCC Backend repository](https://github.com/informaticaeducativa/moocucc)

## Last release (binaries included)

[APK version 1.9.3](https://github.com/informaticaeducativa/mooc_ionic/releases/tag/v1.9.3)
