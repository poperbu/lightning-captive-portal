# lightning-captive-portal
 Wi-Fi access through a nodogsplash captive portal where payments with LightningNetwork serve as an authorization method.

## Description

This project only aims to be a PROOF Of CONCEPT. The idea is to implement Wi-Fi access through a captive portal where payments with LightningNetwork serve as an authorization method. The system can be very improved and surely has some errors, I am NOT an expert programmer. All tools used are open source technologies, and raspberry-pi hardware in such a way that anyone can try and improve this system at home. I repeat, the goal is not to develop a definitive solution, but a very simple proof of concept.

## Elements used

-Hardware: [Raspberry Pi v3](https://www.raspberrypi.org) (or v2 with external wifi device)

-Operating System: [Raspbian](https://www.raspberrypi.org/downloads/).

-Captive Portal: [Nodogsplash](https://github.com/nodogsplash/nodogsplash). 

-Forwarding Authentication Service (FAS) developed with [Node.js](https://nodejs.org/en/)

-Lightning Network: [c-lightning](https://github.com/ElementsProject/lightning) node + [lightning-charge](https://github.com/ElementsProject/lightning-charge) (it can be done with [lnd](https://github.com/lightningnetwork/lnd), [BTCPAY Server](https://btcpayserver.org/), etc..)

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

(optional)-You can edit html responses and price of connection by editing lib_poppay.js.

6-Run the script:
```
node lnwifi.js
```

7-Configure nodogsplash:

Nodogsplash is a simple but powerfull tool:

"Nodogspash (NDS) is a high performance, small footprint Captive Portal, offering by default a simple splash page restricted Internet connection, yet incorporates an API that allows the creation of sophisticated authentication applications."


We need to edit /etc/nodogsplash/nodogsplash.conf . There are a lot of parameters that we can configure to adapt nodogsplash to our needs. In my case the FAS runs in the same machine where nodogsplash runs. But you can run it in an external server.  In the same file, there is a very clear explanation of each parameter.  More info: https://nodogsplashdocs.readthedocs.io/en/stable/fas.html


Some changes I have done:

-preauthenticated-users: In this section we need to allow traffic (specific wallet ports , ip's, etc..) to allow the users to pay LN invoice. As I use a telegram bot as a wallet, I opened telegram traffic for preauthenticated users. An other solution can be opening all traffic for a limited period of time, so the user has enough time to pay it.

```
FirewallRuleSet preauthenticated-users {

#example: if we want allow lnd gRPC on port 10009 
FirewallRule allow tcp port 10009 

#example: if we want allow lnd RTC on port 3000 
FirewallRule allow tcp port 3000 

#example: if we want allow telegram ip's (my case)
FirewallRule allow to 91.108.4.0/22
FirewallRule allow to 91.108.56.0/22
FirewallRule allow to 149.154.160.0/22
FirewallRule allow to 149.154.164.0/22
FirewallRule allow to 149.154.168.0/22
FirewallRule allow to 149.154.172.0/22
}
```
-Fas server port (lnwifi.js listen_port):
```
fasport 8888
```
-Fas remote ip: if you run fas in a external server, you need to uncomment it and indicate the fas remote ip (as I run it in the same machine, don't need to uncomment):
```
#fasremoteip X.X.X.X
```
-FAS secure: If you run de FAS in a remote machine, maybe will be easier to pass the nodogsplash token in clear text disabling this feature. My script manage the nodogsplash tokens with nodog_get_client and nodog_allow_client functions.
```
# Parameter: fas_secure_enabled
# Default: 1
#
# If set to "1", authaction and the client token are not revealed and it is the responsibility
# of the FAS to request the token from NDSCTL.
# If set to "0", the client token is sent to the FAS in clear text in the query string of the
# redirect along with authaction and redir.
#
#fas_secure_enabled 0
```
8-Once you have done your changes, you can restart nodogsplash and check if you can get wifi access by paying LN invoice.

[Video Demo1](https://twitter.com/poperbu/status/1091875913573322752)

## tippin.me

https://tippin.me/@poperbu





