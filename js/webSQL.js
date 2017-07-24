var db = null;
var secret = localStorage.getItem('key');
LoadDB();

function LoadDB () {
  db = openDatabase('MK', '0.1', 'no descrption', 5 * 1024 * 1024);
  if(!db){
    console.log('error al crear db')
  }else{
    db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Datos (usuario, sitio, contraseña, unico)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS User (usr, pass)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Up (fecha,id)');
    });
  }
}

function re_cif(){
  const async = require('async')
  const waterfall = require('async/waterfall')
  let oldk = localStorage.getItem('key')  
  localStorage.removeItem('key')  
  let newk = localStorage.getItem('key2')
  localStorage.setItem('key', newk)

  db.transaction( function(tx) {         
    tx.executeSql('Select * from Datos;', [], function(trans, result){
      for (var i=0; i < result.rows.length; i++) {
        async.waterfall([
          function(callback){         
            var row = result.rows.item(i)
            var U = row.unico
            var dec = decrypt(row.contraseña, oldk)
            var cif = encrypt(dec, newk)
            callback(null, U, cif)              
          },         
          function(U,cif, callback){
            tx.executeSql('UPDATE Datos SET contraseña=? WHERE unico=?', [cif , U])        
          }  
        ])
      }
    })
    added()
  })
}

function ck_time(){
  db.readTransaction( function(tx) {
    tx.executeSql('Select * from Up;', [], function(transaction, result){
      const d = result.rows.item(0)     
      if (d.fecha < moment().unix()){
        console.log('expirado')
        document.getElementById('nuevac').style.visibility = "visible";
      }
    }) 
  })
}

function reg_time () {
  db.readTransaction( function(tx) {
    tx.executeSql('Select * from Up;', [], function(transaction, result){
      var d = result.rows.length
      if (d == 0){      
        db.transaction(function (tx) {
        var Fecha = moment().add(3, 'M').unix()
        tx.executeSql('INSERT INTO Up(fecha, id) VALUES(?,?)',[Fecha, '1'])        
        })
      }
    }) 
  })
}

function added () {
  location.href = "concentrado.html"
}
function Uadded () {
  location.href = "index.html"
}
function hide(){
  document.getElementById('tooltiptext').style.visibility = "hidden"
  document.getElementById('tooltiptext2').style.visibility = "hidden"
}
function valPass (v1, v2) {
  if (v1.value != v2.value){
    document.getElementById('tooltiptext2').style.visibility = "visible"
  } else{
    add_usr();
  }
}
function valnewPass (v, v1, v2) {
  if(v.value != localStorage.getItem('key')){
    document.getElementById('tooltiptext').style.visibility = "visible"
  }else if (v1.value != v2.value){
    document.getElementById('tooltiptext2').style.visibility = "visible"
  } else{
    add_contraseña();
  }
}
function login (vU, vP) {
const crypto = require('crypto')
const hash = crypto.createHash('sha256')

  db.readTransaction( function(tx) {
    tx.executeSql('Select * from User;', [], function(transaction, result){
      var l = result.rows.length
      var r = result.rows.item(0)
      var User = r.usr
      var Pass = r.pass
      hash.update (vP.value)
      var H = hash.digest('hex')

      if (l == 0){      
      console.log('No existe el usuario')
      }else if (User != vU.value || Pass != H){
        document.getElementById('tooltiptext').style.visibility = "visible";
      }else{
        localStorage.setItem('key', vP.value)
        added();
      }
    })
  })
}

function add () {  
var Usuario = document.getElementById('usuario').value
var Sitio = document.getElementById('sitio').value
var Contraseña = document.getElementById('contraseña').value
var identificador = Usuario.substr(0,3) + Sitio.substr(0,3) + Contraseña.substr(0,4);
cif = encrypt(Contraseña, secret);
  
  if(Usuario == ""){
    document.getElementById('tooltiptext').style.visibility = "visible";
  }else{
    db.transaction(function (tx) {
      tx.executeSql('INSERT INTO Datos(usuario, sitio, contraseña, unico) VALUES(?,?,?,?)',[Usuario,Sitio,cif,identificador])
      added();
    })
  }
}

function read () {
  db.readTransaction( function(tx) {
    tx.executeSql('Select * from Datos;', [], function(transaction, result){
    
      for (var i=0; i < result.rows.length; i++) { 
        var row = result.rows.item(i)
        console.log(row.contraseña)
        var dec = decrypt(row.contraseña, secret)
        console.log(dec)
        var msg =  '<tr><td>' + row.sitio + "</td>" + `<td>` + row.usuario + "</td>" +
                   `<td class="t-p"> <img src='css/dot.png'> <div class="overlay"><span class="text">`+dec+"</span></div></td>" +
                   `<td>` +
                    `<button onclick="sup(this)" type"submit" id="`+row.unico+`" class="btn btn-danger btn-T">` +
                    `<span class="glyphicon glyphicon-trash"></span></button></td></tr>` 
        document.getElementById('tb-status').innerHTML += msg;      
      } 
    }) 
  })
}

function sup (element) {
  var e = element.id
  db.transaction( function(tx) {
  tx.executeSql("DELETE FROM Datos WHERE unico=?", [e])
  });
}
function buscar(){
  var tableReg = document.getElementById('tb-status')
  var searchText = document.getElementById('search').value.toLowerCase()
  var cellsOfRow=""
  var found=false
  var compareWith=""

  for (var i = 1; i < tableReg.rows.length; i++){
    cellsOfRow = tableReg.rows[i].getElementsByTagName('td')
    found = false;

    for (var j = 0; j < cellsOfRow.length && !found; j++){
      compareWith = cellsOfRow[j].innerHTML.toLowerCase()

      if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1)){
       found = true;
      }
    }
    if(found){
      tableReg.rows[i].style.display = ''
    } else {
      tableReg.rows[i].style.display = 'none'
    }
  }
}

module.exports = {
  re_cif
}