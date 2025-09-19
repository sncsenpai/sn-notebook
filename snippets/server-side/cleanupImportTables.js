// Array containing only top level tables - all children will be truncated
 var tableNames = new Array();
 tableNames.push("sys_import_set");
 tableNames.push("sys_import_set_row");
 tableNames.push("sys_import_set_row_error");
 tableNames.push("sys_import_set_run");
 
 // values: mysql|oracle
 var dbtype = "mysql";
 
 trunkTables(tableNames);
 
 function trunkTables(tableNames) {
     for (var i = 0; i &lt; tableNames.length; i++)
         truncTree(tableNames[i]);
 }
 
 function getTableExtensions(/*String*/ table) {
   // Ask the DBObjectManager what tables extend the given table
   return Packages.com.glide.db.DBObjectManager.get().getTableExtensions(table);
 }
 
 function truncTree(table) {
     var classes_to_scan = getTableExtensions(table);
     
     for(var inc=0;inc&lt;classes_to_scan.size();inc++) {
         child= classes_to_scan.get(inc).toString(); 
         truncThis(child);
     }
     truncThis(table);
 }
 
 function truncThis(x) {
     var dbi = Packages.com.glide.db.DBConfiguration.getDBI('sys_dictionary');
     x = dbi.getAcceptableNameForDB(x);
     dbi.close();
     var tructext = "truncate table " + x;
     gs.log(tructext);
     gs.sql(tructext);
     
     if (dbtype == "mysql") {
         var opttext = "optimize table " + x; 
         gs.log(opttext);
         gs.sql(opttext);
     }
