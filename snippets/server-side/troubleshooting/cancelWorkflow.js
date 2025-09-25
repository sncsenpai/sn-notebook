(function(){
    var table = "table_name",
        sys_id = "",
        workflow_name = "WORKFLOW_NAME";

    var grGlideRecord = new GlideRecord (table);
    grGlideRecord.get(sys_id);

    var oldWorkflow = new Workflow();
    oldWorkflow.cancel(grGlideRecord);
    new WorkflowApprovalUtils().cancelAll(grGlideRecord, "");
    var newWorkflow = new Workflow();
    newWorkflow.startFlow(new Workflow().getWorkflowFromName(workflow_name), grGlideRecord, '');
})();
