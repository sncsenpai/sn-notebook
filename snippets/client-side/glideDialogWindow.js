var tableName = g_form.getTableName(); 
var sysID = g_form.getUniqueValue(); 

var gdw = new GlideDialogWindow('close_record'); 
gdw.setTitle('Close Record'); 
gdw.setSize(500,400); 
gdw.setPreference('table', tableName); // Don't use _list so we get a form
gdw.setPreference('sysparm_view', 'ess'); 
gdw.setPreference('sysparm_form_only', 'true'); // don't show related lists
gdw.setPreference('sys_id', sysID);

//Open the dialog window 
gdw.render(); 
