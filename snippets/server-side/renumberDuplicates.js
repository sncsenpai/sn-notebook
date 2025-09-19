(function(){
  var sTable = "rm_story",
      sField = "number",
      sHavingCount = 1,
      bDoIt = false;

  var gaRecord = new GlideAggregate(sTable);
  gaRecord.addAggregate('COUNT', sField);
  gaRecord.addHaving('COUNT', sField, '>', sHavingCount);
  gaRecord.query();

  var sOutput = "";
  while (gaRecord.next()) {
    var nCount = gaRecord.getAggregate('COUNT',sField);
    var sValue = gaRecord.getDisplayValue(sField);

    var sFound = gs.getMessage("\nFound {0} records with the same {1} of {2}\n", [nCount, sField, sValue])
    sOutput += sFound;

    var grRecord = new GlideRecord(sTable);
    grRecord.addQuery(sField, gaRecord.getDisplayValue(sField));
    grRecord.orderByDesc("sys_updated_on")
    grRecord.query();
    if (grRecord.next()) {
      var sUpdatedOn = grRecord.getValue("sys_updated_on"),
          sUpdatedBy = grRecord.getValue("sys_updated_by"),
          sCreatedOn = grRecord.getValue("sys_created_on"),
          sCreatedBy = grRecord.getValue("sys_created_by");

      sOutput += gs.getMessage(" > Created on {0} by {1} | Updated on {2} by {3}\n", [
        sCreatedOn, sCreatedBy, sUpdatedOn, sUpdatedBy
      ]);

      if (bDoIt) {
        grRecord.setValue("number", myGetNextObjNumberPadded(sTable));
        grRecord.update();
      }
    }
  }

  if (sOutput != "") {
    if (!bDoIt)
      sOutput += "DRY RUN: Re-run script with bDoIt=true to renumber the records";
    gs.print(sOutput);
  }


  function myGetNextObjNumberPadded(sTable) {
    var nm = new NumberManager(sTable);
    return nm.getNextObjNumberPadded(); 
  }
})();
