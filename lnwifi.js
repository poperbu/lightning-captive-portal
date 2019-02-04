
var http = require("http");
var express = require('express');
var fs = require('fs');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var path    = require("path");
const { exec } = require('child_process');

const charged_server_url='http://YOUR_CHARGED_SERVER:9112' //EX: http://1.2.3.4:9112
const charged_token='your_charged_token'
const listen_port=8888

const charge = require('lightning-charge-client')(charged_server_url, charged_token)


app.use(require('cookie-parser')())
app.use(require('body-parser').json())
app.use(require('body-parser').urlencoded({ extended: true }))

var clientId = 0;
var clients = {}; // <- Keep a map of attached clients
var users = {};

lpoppay=require("./lib_poppay.js")

var server = app.listen(listen_port, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("listening at %s:%s Port", host, port)
});

app.use(require('morgan')('dev'))
app.use(require('csurf')({ cookie: true }))

app.use(express.static('public'))


//main page
app.get('/', urlencodedParser, function (req, res){
	var client_ip=req.query.clientip
	var client_redir=req.query.redir
	console.log('clientIP:'+client_ip)
	console.log('url_redirect:'+client_redir)
	var csrf= req.csrfToken()
	nodog_get_client(client_ip).then(function(client_info){
		console.log(client_info)
		var jclient=JSON.parse(client_info)
		console.log(jclient.token)
		lpoppay.show_index(csrf,jclient.token,client_redir).then(function(data){
			res.send(data)
		})

	})


});

app.post('/invoice', urlencodedParser, function (req, res){
	console.log(req.body._csrf)
	console.log(req.body._token)	
	console.log(req.body._redir)
	console.log(req.body._amt)
	new_invoice(req.body._amt,req.body._csrf,req.body._token).then(function(invoice){
		lpoppay.show_invoice(invoice.payreq,req.body._csrf,req.body._token,req.body._amt,req.body._redir,invoice.id).then(function(invoice1){
			console.log("Invoice:"+invoice)
			console.log(`invoice ${ invoice.id } created with rhash=${ invoice.rhash }, payreq=${ invoice.payreq }`)

			res.send(invoice1)
			pay_wait(invoice,req.body._csrf,req.body._token,req.body._redir)
		})



	})
});

app.post('/check_invoice', urlencodedParser, function (req, res){
	console.log(req.body._csrf)
	console.log(req.body._token)
	console.log(req.body._redir)
	console.log(req.body._amt)
	console.log(req.body._id)
	check_invoice(req.body._id).then(function(invoice){
			
			console.log("Invoice:"+invoice)
			if(invoice.status=="unpaid"){
				lpoppay.show_notpayed().then(function(reply){
					res.send(reply)
				})
			}else{
				//ALLOW ACCESS AND REDIRECT.
				console.log("success")
				nodog_allow_client(req.body._token).then(function(auth){
					console.log(auth)
        			if (auth.indexOf(" authenticated.")!=-1){
        				for (clientId in clients) {
							console.log(clientId)
							if(users[clientId]==csrf_in){

								//you can redirect to the original url request using redir_in
								clients[clientId].write("data: https://duckduckgo.com/\n\n"); // <- Push a message to a single attached client
							}
						}
        			}else{
        				console.log("error")
        				for (clientId in clients) {
							console.log(clientId)
							if(users[clientId]==csrf_in){
								clients[clientId].write("data: /\n\n"); // <- Push a message to a single attached client
							}
						}
        			}
				})



			}
			console.log(`invoice ${ invoice.id } created with rhash=${ invoice.rhash }, payreq=${ invoice.payreq }`)

	})
});



// Called once for each new client. Note, this response is left open!
app.get('/inv_event/:csrf', function (req, res) {
	req.socket.setTimeout(Number.MAX_VALUE);
	console.log(req.params.csrf)
	//users[clientId] = req.csrf;
	res.writeHead(200, {
		'Content-Type': 'text/event-stream', // <- Important headers
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	res.write('\n');
	(function (clientId) {
		clients[clientId] = res; // <- Add this client to those we consider "attached"
		users[clientId] = req.params.csrf;
		//console.log(tmp_csrf)
		req.on("close", function () {
			delete clients[clientId]
			delete users[clientId]
		}); // <- Remove this client when he disconnects
	})(++clientId)
});



setInterval(function () {
	console.log(users.length)
	if(clientId==0){
		console.log("No connected clients")
	}else{
		console.log(users)
	}
}, 30000);


//new invoice
function new_invoice(amount_in,description_in,token_in){
	return new Promise(function(resolve,reject){
		const inv =charge.invoice({
    		amount: amount_in
  			, currency: 'BTC'
  			, description: description_in
  			, metadata: { source: 'poppay', product: token_in }
  		}).then(inv => resolve(inv))

	})
}


//check if invoice is payed
function check_invoice(hash_in){
	return new Promise(function(resolve,reject){
		const inv =charge.fetch(hash_in).then(function(inv){
				resolve(inv)
			
		})

	})
}


//this.pay_wait=async function(inv){
async function pay_wait(inv,csrf_in,token_in,redir_in){
	var paid=null
	do {
  		paid = await charge.wait(inv.id, /* timeout: */ 2 /* seconds */)
	
		if (paid){
			console.log(`invoice ${ paid.id } of ${ paid.msatoshi } paid, updated invoice:`, paid)
			//create temp folder with file.
			//AUTHENTICATE AND REDIRECT
			console.log("ok")
			nodog_allow_client(token_in).then(function(auth){
				console.log(auth)
        		if (auth.indexOf(" authenticated.")!=-1){
        			for (clientId in clients) {
						console.log(clientId)
						if(users[clientId]==csrf_in){

							//you can redirect to the original url request using redir_in
							clients[clientId].write("data: https://duckduckgo.com/\n\n"); // <- Push a message to a single attached client
						}
					}
        		}else{
        			console.log("error")
        			for (clientId in clients) {
						console.log(clientId)
						if(users[clientId]==csrf_in){
							clients[clientId].write("data: /\n\n"); // <- Push a message to a single attached client
						}
					}
        		}
			})
			
		} else if (paid === false) {
			console.log('invoice expired and can no longer be paid')
		}
	} while (paid === null)
	
}

//get nodogsplash client info.
function nodog_get_client(clientip){
    return new Promise(function(resolve, reject) {
      //var client_info=''

      var command='sudo ndsctl json '+clientip
      console.log(command)
      //resolve(command)
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          resolve(null)
          return;
        }

        resolve(stdout)
    });
    }); 
}

//allow access (nodogsplash) authenticated device
function nodog_allow_client(token){
    return new Promise(function(resolve, reject) {
      //var client_info=''

      var command='sudo ndsctl auth '+token
      console.log(command)
      //resolve(command)
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          resolve(null)
          return;
        }
        //console.log(stdout)
        resolve(stdout)
    });
    }); 
}
