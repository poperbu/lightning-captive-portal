# lightning-captive-portal
 Wi-Fi access through a nodogsplash captive portal where payments with LightningNetwork serve as an authorization method.

## Description

This project only aims to be a PROOF Of CONCEPT. The idea is to implement Wi-Fi access through a captive portal where payments with LightningNetwork serve as an authorization method. The system can be very improved and surely has some errors, I am not an expert programmer. I wanted to use open source technologies, and raspberry-pi hardware in such a way that anyone can try and improve this system at home. I repeat, the goal is not to develop a definitive system, but a very simple proof of concept.

## Elements used

-Hardware: [Raspberry Pi v3](https://www.raspberrypi.org) (or v2 with external wifi device)

-Operating System: [Raspbian](https://www.raspberrypi.org/downloads/).

-Captive Portal: [Nodogsplash](https://github.com/nodogsplash/nodogsplash). 

-Forwarding Authentication Service (FAS) developed with [Node.js](https://nodejs.org/en/)

-Lightning Network: [c-lightning](https://github.com/ElementsProject/lightning) node + [lightning-charge](https://github.com/ElementsProject/lightning-charge) (it can be done with [lnd](https://github.com/lightningnetwork/lnd), of course)

NOTE: Any device that can run OpenWrt can run nodogsplash, so if the FAS is runing on external server it should be easy to adapt this solution for OpenWrt devices.

## Instructions

1-Install and configure nodogsplash captive portal for raspberry-pi: [instructions](https://pimylifeup.com/raspberry-pi-captive-portal/)

2-Install Node.js:
```
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3-Download or clone this project
```
git clone https://github.com/poperbu/lightning-captive-portal.git
```

4-Install dependencies:
```
cd lightning-captive-portal
npm install
```

5-Edit lnwifi.js and change it with your data.
```
const charged_server_url='http://YOUR_CHARGED_SERVER_ADDRESS:PORT' //EX: http://1.2.3.4:9112
const charged_token='your_charged_token'
const listen_port=8888
```

(optional)-You can edit html responses and price of connection by editing poppay.js.

6-Run the script:
```
node lnwifi.js
```

7-Configure nodogsplash:

Nodogsplash is a simple but powerfull tool:

"Nodogspash (NDS) is a high performance, small footprint Captive Portal, offering by default a simple splash page restricted Internet connection, yet incorporates an API that allows the creation of sophisticated authentication applications."


We need to edit /etc/nodogsplash/nodogsplash.conf . There are a lot of parameters that we can configure to adapt nodogsplash to our needs. In my case the FAS runs in the same machine where nodogsplash runs. But you can run it in an external server.  In the same file, there is a very clear explanation of each parameter.  More info: https://nodogsplashdocs.readthedocs.io/en/stable/fas.html


Some changes I have done:







