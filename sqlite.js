var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database(':memory:');
var db = new sqlite3.Database('registry.sqlite3');

db.serialize(function() {  
  db.run("drop TABLE  if exists lorem");
  db.run("CREATE TABLE lorem (info TEXT)");

  var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  // db.each("SELECT rowid AS id, info FROM lorem WHERE info MATCH 'p'", function(err, row) {
  //     console.log(row.id + ": " + row.info);
  // });
  
});

db.close();