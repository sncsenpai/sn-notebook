// Useful for troubleshooting text search issues

(function(table, sys_id) {
  var grRecord = new GlideRecord(table);
  if (grRecord.get(sys_id)) {
    gs.print(grRecord.getDisplayValue() + "\n");
    new GlideTSUtil().dumpDocument(table, sys_id);
  }
})('sc_cat_item', '8310be193b7eea90df96ab9a04e45a35');
