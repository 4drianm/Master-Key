var db = null;
LoadDB();

function LoadDB () {
  db = openDatabase('DB', '0.1', 'no descrption', 5 * 1024 * 1024);
  if(!db){
    console.log('error al crear db')
  }else{
    db.transaction(function (tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Datos (usuario, sitio, contraseña)');
    });
  }
}

function add () {
  db.transaction(function (tx) {
    var Usuario = document.getElementById('usuario').value
    var Sitio = document.getElementById('sitio').value
    var Contraseña = document.getElementById('contraseña').value
    tx.executeSql('INSERT INTO Datos(usuario, sitio, contraseña) VALUES(?,?,?)',[Usuario,Sitio,Contraseña])
    added();
  })
}
function added () {
  location.href = "concentrado.html";
}

function read () {
  db.readTransaction( function(tx) {
    tx.executeSql('Select * from Datos;', [], function(transaction, result){
    
      for (var i=0; i < result.rows.length; i++) { 
        var row = result.rows.item(i);
        var msg =  '<tr><td>' + row.sitio + "</td>" + "<td>" + row.usuario + "</td>" +
                   "<td>" + row.contraseña + "</td>" +
                   `<td><label><input type="checkbox" class="del-check"</label></td></tr>` ;
        document.getElementById('tb-status').innerHTML += msg;
      /*console.log(row.sitio); 
        console.log(row.usuario); 
        console.log(row.contraseña);*/ 
      } 
    }); 
  });
}
function clean () {
  db.transaction( function(tx) {
  tx.executeSql("DELETE FROM Datos", []);
  });
}
function sup () {
  db.transaction( function(tx) {
  tx.executeSql('DELETE FROM Datos WHERE usuario=?', ["Adrian"], function (tx, error) {
    console.log('error borrar: ' + error.message)    
  });
  });
}
function s () {
  
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