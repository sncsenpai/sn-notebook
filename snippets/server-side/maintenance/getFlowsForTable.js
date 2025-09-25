(function getFlows(sTableName) {
  // Works in global scope
  var grActionInstance = new GlideAggregate('sys_hub_action_instance');
  grActionInstance
    .addJoinQuery('sys_variable_value', 'sys_id', 'document_key')
    .addCondition('value', sTableName);
  grActionInstance.addAggregate('GROUP_CONCAT_DISTINCT', 'flow');
  grActionInstance.groupBy('flow');
  grActionInstance.addQuery('flow.sys_class_name', 'sys_hub_flow')
  grActionInstance.query();
  
  while (grActionInstance.next()) {
    gs.print(grActionInstance.flow.name + ": " + (grActionInstance.flow.active ? 'active' : 'inactive'));
  }
})('table_name');
