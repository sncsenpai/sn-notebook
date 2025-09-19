// Thanks to Dan Bye for this

var tableName = "", 
  sysId = "", 
  grTarget = new GlideRecord(tableName);

if (grTarget.get(sysId)) {
  new Workflow().restartWorkflow(grTarget,true); //true retains the state of approvals, false changes the state back to requested
  grTarget.comments='true wf restart';
  grTarget.update();
}
