// Quick GlideAggregate Template to get count

(function(){
  var sTable = "rm_story",
      sField = "number",
      sHavingCount = 1;

  var gaRecord = new GlideAggregate(sTable);
  gaRecord.addAggregate('COUNT', sField);
  gaRecord.addHaving('COUNT', sField, '>', sHavingCount);
  gaRecord.query();

  while (gaRecord.next()) {
    gs.print(gaRecord.getDisplayValue(sField) + " >> " + gaRecord.getAggregate('COUNT',sField));
  }
})();
