var db = null;
var profile = JSON.parse(localStorage.getItem('profile')) || null;
var secret = 'contraseña-segura';
LoadDB();

function LoadDB () {
  db = openDatabase('DBS', '0.1', 'no descrption', 5 * 1024 * 1024);
  if(!db){
    console.log('error al crear db')
  }else{
    db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Datos (usuario, sitio, contraseña, unico)');
    });
  }
}
function added () {
  location.href = "concentrado.html";
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
        var msg =  '<tr><td>' + row.sitio + "</td>" + "<td>" + row.usuario + "</td>" +
                   `<td class="t-p"> <img src='css/dot.png'> <div class="overlay"><span class="text">`+ dec +"</span></div></td>" +
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