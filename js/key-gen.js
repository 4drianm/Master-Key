function generar(longitud){

	long=parseInt(longitud);
	var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789!@#$¬&/(”)=-?‚¿¡^+"
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