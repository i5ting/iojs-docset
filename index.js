var fs = require('fs');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();

require('shelljs/global');

var pwd = process.cwd();

var docset_name = "template.docset";

/**
 * http://kapeli.com/docsets
 
  1. Create the Docset Folder
  The docset folder structure can be created using this Terminal command:

  mkdir -p <docset name>.docset/Contents/Resources/Documents/
  You can also manually create the docset structure if you want, they're just folders.
 *
 */ 
function create_the_docset_folder(callback){
  console.log('create_the_docset_folder');
  // Copy files to release dir
  mkdir('-p', 'vendor/' + docset_name + '/Contents/Resources/Documents/');
  callback(null, 'create_the_docset_folder');
}


/**
 *
  2. Copy the HTML Documentation
  Copy the HTML documentation you already have in the <docset name>.docset/Contents/Resources/Documents/ folder.
 *
 */ 
function copy_the_html_documentation(callback){
  console.log('copy_the_html_documentation');
  var src = "/Users/sang/workspace/github/io.js/out/doc/api/";
  var desc = 'vendor/' + docset_name + '/Contents/Resources/Documents/'
  _copy(src, desc);
  callback(null, 'copy_the_html_documentation');
}


/**
 *
  3. Create the Info.plist File
  Download and edit this sample Info.plist and place it in the <docset name>.docset/Contents/ folder. 
  Editing should be straightforward, just set the values to whatever name you want for your docset.
*
*
*/ 

function create_the_info_plist_file(callback){
   console.log('create_the_info_plist_file');
   var src = "vendor/Info.plist"
   var desc = 'vendor/' + docset_name + '/Contents/'
  _copy(src, desc);
  callback(null, 'create_the_info_plist_file');
}


/**
 *
  4. Create the SQLite Index
  Create a SQLite database in the file <docset name>.docset/Contents/Resources/docSet.dsidx with the following query:

  CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);
  Recommended: you can easily prevent adding duplicate entries in the index by also using this query:

  CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);
 *
 *
5. Populate the SQLite Index
You need to create a script (or application or whatever) that will go through your HTML documentation and add appropriate rows into the SQLite database. Rows can be added using this query:

INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES ('name', 'type', 'path');
The values are:

name is the name of the entry. For example, if you are adding a class, it would be the name of the class. This is the column that Dash searches.
type is the type of the entry. For example, if you are adding a class, it would be “Class”. For a list of types that Dash recognises, see below.
path is the relative path towards the documentation file you want Dash to display for this entry. It can contain an anchor (#). Alternatively, Dash also supports http:// URL entries.
 *
 *
 */ 

function populate_the_sqlite_index(callback){
  
  // var sql = [
 //    "drop TABLE  if exists searchIndex",
 //    "CREATE TABLE searchIndex(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT, type TEXT, path TEXT);",
 //    "CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);"
 //  ]
 //  _exec_sql(sql);
  
  
  var sql =[
    "drop TABLE  if exists searchIndex",
    "CREATE TABLE searchIndex(id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name TEXT, type TEXT, path TEXT);",
    "CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('About these Docs','File','documentation.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Synopsis','File','synopsis.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Assertion Testing','File','assert.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Buffer','File','buffer.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('C/C++ Addons','File','addons.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Child Processes','File','child_process.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Cluster','File','cluster.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Console','File','console.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Crypto','File','crypto.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Debugger','File','debugger.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('DNS','File','dns.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Domain','File','domain.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Events','File','events.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('File System','File','fs.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Globals','File','globals.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('HTTP','File','http.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('HTTPS','File','https.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Modules','File','modules.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Net','File','net.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('OS','File','os.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Path','File','path.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Process','File','process.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Punycode','File','punycode.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Query Strings','File','querystring.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Readline','File','readline.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('REPL','File','repl.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Smalloc','File','smalloc.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Stream','File','stream.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('String Decoder','File','string_decoder.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Timers','File','timers.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('TLS/SSL','File','tls.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('TTY','File','tty.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('UDP/Datagram','File','dgram.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('URL','File','url.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('Utilities','File','util.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('V8','File','v8.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('VM','File','vm.html')",
    "INSERT INTO searchIndex ( name, type , path) VALUES ('ZLIB','File','zlib.html')"
  ];
  
  _exec_sql(sql);
  
  callback(null, 'populate_the_sqlite_index');
}


/**
 *
6. Table of Contents Support (optional)
To allow easy navigation inside a large page, Dash is able to show a table of contents at the bottom left. This feature is described in the user guide.

Please note that adding table of contents support is a bit tricky (and optional).

When Dash displays a documentation page, it also looks for special anchors inside the HTML and generates a table of contents. To add table of contents support, you need to go through all the HTML pages and insert anchors in a format that Dash understands. The anchors need to be inserted in the HTML pages themselves.

The format for the anchors is:

<a name="//apple_ref/cpp/Entry Type/Entry Name" class="dashAnchor"></a>
The only things that you need to change in the format above are:

Entry type, which should be one of the supported entry types.
Entry name, which is the name that should be shown by Dash in the table of contents. Preferably, this should be percent escaped.
You can see an example of how to insert anchors at https://github.com/jkozera/zeal/blob/master/gendocsets/extjs/parse.py (in Python).

You'll also need to add a entry in the docset's Info.plist:

<key>DashDocSetFamily</key>
<string>dashtoc</string>
Some notes:

You should URL encode (percent escape) the "Entry Name" if it contains symbols.
After changing the Info.plist, you should remove the docset from Preferences > Docsets and re-add it.
Do not hesitate to contact me if you are having problems with this. The process is a bit confusing.
 *
 */ 
function table_of_contents_support(callback){
  callback(null, 'table_of_contents_support');
}

// To archive your docset, use the following command:
function archive_your_docset(callback){
  // Run external tool synchronously

  if (exec("tar --exclude='.DS_Store' -cvzf iojs-v1.1.1.tgz vendor/template.docset").code !== 0) {
    echo('Error: Archive failed');
    exit(1);
  }else{
    echo('Sucess: Archive finished!');
  }
  
  callback(null, 'archive_your_docset');
}
/**
 * main function
 * http://kapeli.com/docsets
 */ 
function main(){
  clean();
  
  // an example using an object instead of an array
  async.series({
    create_the_docset_folder    : create_the_docset_folder,
    copy_the_html_documentation : copy_the_html_documentation,
    create_the_info_plist_file  : create_the_info_plist_file,
    populate_the_sqlite_index   : populate_the_sqlite_index,
    table_of_contents_support   : table_of_contents_support
  },
  function(err, results) {
      // results is now equal to: {one: 1, two: 2}
      if(err){
        console.log(err);
        throw err;
      }
      
      console.log(results);
  });
  
  
  
}

function clean(){
  rm('-rf', 'vendor/' + docset_name + '');
}


function _copy(source_path, dest_path){
  cp('-Rf', source_path, dest_path);
}

function _exec_sql(sql_array){
  var db = new sqlite3.Database('vendor/' + docset_name + '/Contents/Resources/docSet.dsidx');

  db.serialize(function() {
    sql_array.forEach(function(sql){
      console.log('SQL=' + sql);
      db.run(sql);
    });
  });

  db.close();
}
// mkdir('-p', 'vendor/' + docset_name + '/Contents/Resources/Documents/');
// var src = "vendor/Info.plist"
// var desc = "vendor/' + docset_name + '/Contents/"
// _copy(src, desc);


main();
