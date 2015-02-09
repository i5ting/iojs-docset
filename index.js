var fs = require('fs');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();

require('shelljs/global');

var pwd = process.cwd();

var docset_name = "template";



if (!which('git')) {
  echo('Sorry, this script requires git');
  exit(1);
}

/**
 *
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
 */ 

function create_the_sqlite_index(callback){
  console.log('create_the_sqlite_index');
  var db = new sqlite3.Database('vendor/' + docset_name + '/Contents/Resources/docSet.dsidx');

  db.serialize(function() {
    db.run("drop TABLE  if exists searchIndex");
    db.run("CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT);");
    db.run("CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);");
  });

  db.close();
  callback(null, 'create_the_sqlite_index');
}


/**
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

/**
 * main function
 * http://kapeli.com/docsets
 */ 
function main(){
  rm('-rf', 'vendor/' + docset_name + '');
  // an example using an object instead of an array
  async.series({
    create_the_docset_folder    : create_the_docset_folder,
    copy_the_html_documentation : copy_the_html_documentation,
    create_the_info_plist_file  : create_the_info_plist_file,
    create_the_sqlite_index     : create_the_sqlite_index,
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
  // rm('-rf', 'vendor/' + docset_name + '');
}


function _copy(source_path, dest_path){
  // fs.createReadStream(source_path).pipe(fs.createWriteStream(dest_path));
  cp('-Rf', source_path, dest_path);
}

// mkdir('-p', 'vendor/' + docset_name + '/Contents/Resources/Documents/');
// var src = "vendor/Info.plist"
// var desc = "vendor/' + docset_name + '/Contents/"
// _copy(src, desc);


main();