var tableName = g_form.getTableName();
var sysID = g_form.getUniqueValue();
	
var gdw = new GlideDialogWindow('close_change', false, 400, 200); 
gdw.setTitle('Close Change'); 
gdw.setPreference('table', tableName); 
gdw.setPreference('sysparm_view', 'close_change'); 
gdw.setPreference('sysparm_form_only', 'true');

//Set the query to display the record 
var query = 'sys_id=' + sysID; 
gdw.setPreference('sysparm_query', query); 

//Open the dialog window 
gdw.render(); 
