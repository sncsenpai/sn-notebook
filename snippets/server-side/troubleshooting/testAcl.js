(function(tableName, sys_id) {
  var theACL = "record/" + tableName + "/delete"; // enter the ACL name in the format of type/table_name/operation

var theRecord = new GlideRecord(tableName);
if (theRecord.get(sys_id)) {
     var sm2 = GlideSecurityManager.get();
     var isSuccessful = (sm2.hasRightsTo(theACL, theRecord));
 
     gs.print("ACL evaluates to: " + isSuccessful);
})('incident', '70d83da16fc111008ba142dbea3ee49c');
