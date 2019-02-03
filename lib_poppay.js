

this.show_index=function(csrf,token,redir){
	return new Promise(function(resolve,reject){
		var reply = '<!DOCTYPE html><html class="h-100">'
		reply +='<title>LIGHTNING CAPTIVE PORTAL</title>'
		reply +='<meta charset="utf-8">'
		reply +='<meta name="viewport" content="width=device-width, initial-scale=1">'
		reply +='<link rel="stylesheet" href="css/bootstrap.min.css">'
  		reply +='<script src="code/jquery.min.js"></script>'
  		reply +='<script src="code/bootstrap.min.js"></script>'
  		reply +='  <link rel="icon" href="/favicon.ico" type="image/x-icon">'
		reply +='<body class="h-100">'
		reply +='<br>'
		reply +='<div class="container d-flex h-90">'
		reply +='	<div class="justify-content-center align-self-center text-center mx-auto">'
		reply +='	<h1 class="mb-4">LIGHTNING CAPTIVE PORTAL</h1>'
		reply +='Pay 100 sats to get wifi-access.<br><br>'


		reply +='<form action="/invoice" method="post">'
		reply +='<input type="hidden" name="_csrf" value='+csrf+'>'
		reply +='<input type="hidden" name="_token" value='+token+'>'
		reply +='<input type="hidden" name="_redir" value='+redir+'>'

		reply +='<input type="hidden" name="_amt" value=0.000001>'
		reply +='<button class="btn  btn-info mt-4" type="submit">Connect for 100 sats</button>'
		reply +='</form>'





		reply +='</div>'
		reply +='</div>'
		reply +='</body>'
		reply +='</html>'
		resolve(reply);



	})		
}


this.show_notpayed=function(){
	return new Promise(function(resolve,reject){
		var reply = '<!DOCTYPE html><html class="h-100">'
		reply +='<title>LIGHTNING CAPTIVE PORTAL</title>'
		reply +='<meta charset="utf-8">'
		reply +='<meta name="viewport" content="width=device-width, initial-scale=1">'
		reply +='<link rel="stylesheet" href="css/bootstrap.min.css">'
  		reply +='<script src="code/jquery.min.js"></script>'
  		reply +='<script src="code/bootstrap.min.js"></script>'
  		reply +='  <link rel="icon" href="/favicon.ico" type="image/x-icon">'
		reply +='<body class="h-100">'
		reply +='<br>'
		reply +='<div class="container d-flex h-95">'
		reply +='	<div class="justify-content-center align-self-center text-center mx-auto">'
		reply +='	<h1 class="mb-4">Invoice not payed</h1>'
		


		reply +='<form action="/" method="get">'
		reply +='<button class="btn  btn-info mt-4" type="submit">cancel</button>'
		reply +='</form>'






		reply +='	</div>'
		reply +='</div>'
		reply +='</body>'
		reply +='</html>'
		resolve(reply);



	})		
}



this.show_invoice=function(invoice,csrf,token_in,amt_in,redir_in,id_in,req){
	return new Promise(function(resolve,reject){
		var reply = '<!DOCTYPE html><html class="h-100">'
		reply +='<title>LIGHTNING CAPTIVE PORTAL</title>'
		reply +='<meta charset="utf-8">'
		reply +='<meta name="viewport" content="width=device-width, initial-scale=1">'
		reply +='  <link rel="icon" href="/favicon.ico" type="image/x-icon">'

		reply +='<link rel="stylesheet" href="css/bootstrap.min.css">'
  		reply +='<script src="code/jquery.min.js"></script>'
  		reply +='<script src="code/bootstrap.min.js"></script>'

  		//QR
  		reply +='<script type="text/javascript" src="../code/qrcode.min.js"></script>'

  		//copy button
  		reply +='  		 	<script> '
  		reply +='				function myFunction() {'
  		reply +='  					var copyText = document.getElementById("invoiceID");'
  		reply +='  					copyText.select();'
   		reply +=' 					document.execCommand("copy");'
  		reply +='  					alert("Copied the text: " + copyText.value);'
  		reply +='				}'
  		reply +='			</script>'

  		//sse
  		reply+='<script type="text/javascript"> \
		    var source = new EventSource("/inv_event/'+csrf+'"); \
		    source.onmessage = function(e) { \
		    	window.location.replace(e.data); \
		        document.body.innerHTML += e.data + "<br>"; \
		    }; \
			</script>';


		reply +='<body class="h-100">'
		reply +='<br>'
		reply +='<div class="container">'
		reply +='	<div class="justify-content-center align-self-center text-center mx-auto">'
		reply +='	<h1 class="mb-4">Invoice</h1>'
		reply += "pay "+Number(amt_in) * 100000000 +" sats to get wifi access"




		reply += '<textarea class="form-control" rows="3" id="invoiceID" value="'+invoice+'" readonly>'
		reply += invoice
		reply += '</textarea>'
		reply += '		<div class="input-group-btn">'
		reply += '             <button onclick="myFunction()" class="btn btn-primary">copy</button>'
		reply += '            </div>'
		//QR
		reply += '<br>'

		reply+='<div id="qrcode" style="width:240px; height:240px; margin: 0 auto; margin-top:20px;"></div>'

		reply +='You will be redirect when the invoice is paid. If the invoice is paid and you are not redirected in a few seconds, click check button.'




		//acabar.
		reply +='<form action="/check_invoice" method="post">'
		reply +='<input type="hidden" name="_csrf" value='+csrf+'>'
		reply +='<input type="hidden" name="_token" value='+token_in+'>'
		reply +='<input type="hidden" name="_redir" value='+redir_in+'>'
		reply +='<input type="hidden" name="_amt" value='+amt_in+'>'
		reply +='<input type="hidden" name="_id" value='+id_in+'>'
		reply +='<button class="btn  btn-info mt-4" type="submit">Check</button>'
		reply +='</form>'



		reply +='<form action="/" method="get">'
		reply +='<button class="btn  btn-info mt-4" type="submit">cancel</button>'
		reply +='</form>'


		reply +='	</div>'



		reply += '<script type="text/javascript">'
		reply += '			var qrcode = new QRCode(document.getElementById("qrcode"), { '
		reply += '						width : 200, '
		reply += '						height : 200 '
		reply += '					}); '
		reply += '					function makeCode () {'	
		reply += '						var elText = document.getElementById("invoiceID");'
		reply += '						if (!elText.value) { '
		reply += '							alert("Input a text"); '
		reply += '							elText.focus(); '
		reply += '							return; '
		reply += '						} '
		reply += '						qrcode.makeCode(elText.value); '
		reply += '					} '
		reply += '					makeCode(); '
		reply += '					$("#text"). '
		reply += '					on("blur", function () { '
		reply += '						makeCode(); '
		reply += '					}). '
		reply += '					on("keydown", function (e) { '
		reply += '						if (e.keyCode == 13) { '
		reply += '							makeCode(); '
		reply += '						} '
		reply += '					}); '
		reply += '				</script>'


		reply +='</body>'
		reply +='</html>'
		resolve(reply);



	})		
}
