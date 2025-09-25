// Find out which tables extends this one
var parentTableName = "cmdb_ci_server";
var aExtensions = GlideDBObjectManager.get().getTableExtensions(parentTableName);
gs.print(aExtensions);

// or 

var tableName = "cmdb_ci_server",
  jlist = GlideDBObjectManager.get().getAllExtensions(),
  list = j2js(jlist);
for (var c = list.length; c > 0;) {
  gs.print(list[--c])
} 
