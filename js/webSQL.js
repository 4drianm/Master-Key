var db = null;
var secret = 'contraseña-segura';
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
  let newk = localStorage.getItem('key')
  console.log(oldk)
  console.log(newk)

  db.transaction( function(tx) {
// Falta arreglar la actualización de BD ////
  async.waterfall([
    function(callback){          
      tx.executeSql('Select * from Datos;', [], function(trans, result){
        for (var i=0; i < result.rows.length; i++) {        
          var row = result.rows.item(i)
          var U = row.unico
          var dec = decrypt(row.contraseña, oldk)
          var cif = encrypt(dec, newk)
          callback(null, U, cif)              
        }          
      })
    }, 
    function(U,cif, callback){
      tx.executeSql('UPDATE Datos SET contraseña=? WHERE unico=?', [cif , U]);        
    }  
  ])
  })
/////////////////////////////////////////////  
}

function errorHandler(transaction, error)
{
    // error.message is a human-readable string.
    // error.code is a numeric error code
    alert('Oops.  Error was '+error.message+' (Code '+error.code+')');
 
    // Handle errors here
    var we_think_this_error_is_fatal = true;
    if (we_think_this_error_is_fatal) return true;
    return false;
}
 

function verif_usr() {

  db.readTransaction(function (tx){
    var U = document.getElementById('usuario').value
    var P = document.getElementById('pass').value
    var H = require('crypto').createHash('sha256').update(P).digest('hex')
    tx.executeSql('Select * from User where usr=? AND pass=?',[U,H], function(transaction, result, errorHandler){

        // Each row is a standard JavaScript array indexed by
        // column names.
        var row = result.rows.item(0);
        if (row.pass == H){
        var pass = localStorage.setItem("key", P)
        added()
      }
      else{
        alert('hola')
      }
    })
  })
}

function ck_time(){
  db.readTransaction( function(tx) {
    tx.executeSql('Select * from Up;', [], function(transaction, result){
      const d = result.rows.item(0)     
      if (d.fecha < moment().unix()){
        console.log('expirado')
        var f = moment().add(2, 'm').unix()
        db.transaction(function (tx) {
        tx.executeSql('UPDATE Up SET fecha=? WHERE id=?', [f , '1']);
        })
        //setTimeout(function(){ re_cif() }, 1000);        
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
        var Fecha = moment().add(2, 'm').unix()
        tx.executeSql('INSERT INTO Up(fecha, id) VALUES(?,?)',[Fecha, '1'])        
        })
      }
    }) 
  })
}

function added () {
  location.href = "concentrado.html";
}
function Uadded () {
  location.href = "index.html";
}
function hide(){
  document.getElementById('tooltiptext').style.visibility = "hidden";
}
function valPass (v1, v2) {
  if (v1.value != v2.value ){
    document.getElementById('tooltiptext').style.visibility = "visible";
  } else{
    add_usr();
  }
}
function add () {
  db.transaction(function (tx) {
    var Usuario = document.getElementById('usuario').value
    var Sitio = document.getElementById('sitio').value
    var Contraseña = document.getElementById('contraseña').value
    var identificador = Usuario.substr(0,3) + Sitio.substr(0,3) + Contraseña.substr(0,10);
    cif = encrypt(Contraseña, secret);
    console.log(cif)
    tx.executeSql('INSERT INTO Datos(usuario, sitio, contraseña, unico) VALUES(?,?,?,?)',[Usuario,Sitio,cif,identificador])
    added();
  })
}

function read () {
  db.readTransaction( function(tx) {
    tx.executeSql('Select * from Datos;', [], function(transaction, result){
    
      for (var i=0; i < result.rows.length; i++) { 
        var row = result.rows.item(i);
        var dec = decrypt(row.contraseña, secret)
        console.log(dec)
        var msg =  '<tr><td>' + row.sitio + "</td>" + `<td>` + row.usuario + "</td>" +
                   `<td class="t-p"> <img src='css/dot.png'> <div class="overlay"><span class="text">`+dec+"</span></div></td>" +
                   `<td>` +
                    `<button onclick="sup(this)" type"submit" id="`+row.unico+`" class="btn btn-danger btn-T">` +
                    `<span class="glyphicon glyphicon-trash"></span></button></td></tr>` ;
        document.getElementById('tb-status').innerHTML += msg;      
      } 
    }); 
  });
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