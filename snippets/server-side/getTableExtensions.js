// Find out which tables extends this one
var parentTableName = "cmdb_ci_server";
var aExtensions = GlideDBObjectManager.get().getTableExtensions(parentTableName);
gs.print(aExtensions);
