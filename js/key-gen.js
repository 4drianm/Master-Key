const crypto = require('crypto')

function generar(longitud){

	long=parseInt(longitud);
	var caracteres = "abcdefghijkmnpqrtuvwxyz12346789!@%#$'&/(”)=-_‚+ABCDEFGHIJKLMNPQRTUVWXYZ"
	var contraseña = "";
	for (i=0; i<long; i++) 
		contraseña += caracteres.charAt(Math.floor(Math.random()*caracteres.length));	
	var pass = `<label>Contraseña:</label> ` +
							`<input type="text" class="form-control" id="contraseña" value="`+contraseña+`" readonly>`;
	document.getElementById("pass").innerHTML=pass;

}

function timeout () {
	location.href = "index.html";
}

function encrypt(text, password){
  var cipher = crypto.createCipher('aes-256-cbc', password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
function decrypt(text, password){
  var decipher = crypto.createDecipher('aes-256-cbc', password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = {
	encrypt,
	decrypt
}