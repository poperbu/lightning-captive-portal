# lightning-captive-portal
 Wi-Fi access through a nodogsplash captive portal where payments with LightningNetwork serve as an authorization method.

## Description

This project only aims to be a PROOF Of CONCEPT. The idea is to implement Wi-Fi access through a captive portal where payments with LightningNetwork serve as an authorization method. The system can be very improved and surely has some errors, I am not an expert programmer. I wanted to use open source technologies, and raspberry-pi hardware in such a way that anyone can try and improve this system at home. I repeat, the goal is not to develop a definitive system, but a very simple proof of concept.

## Elements used

-Hardware: [Raspberry Pi v3](https://www.raspberrypi.org) (or v2 with external wifi device)

-Operating System: [Raspbian](https://www.raspberrypi.org/downloads/).

-Captive Portal: [Nodogsplash](https://github.com/nodogsplash/nodogsplash). 

-Forwarding Authentication Service (FAS) developed with [Node Js](https://nodejs.org/en/)

-Lightning Network: [c-lightning](https://github.com/ElementsProject/lightning) node + [lightning-charge](https://github.com/ElementsProject/lightning-charge) (it can be done with [lnd](https://github.com/lightningnetwork/lnd), of course)

NOTE: Any device that can run OpenWrt can run nodogsplash, so if the FAS is runing on external server it should be easy to adapt this solution for OpenWrt devices.

## Instructions




