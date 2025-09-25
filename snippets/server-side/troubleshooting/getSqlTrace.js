// Useful for troubleshooting - dump SQL trace to transaction logs

(function sqlTrace(tableName, sysId) {
	try {   
		gs.trace(true); 
		var grTarget = new GlideRecord(tableName);  
		if (grTarget.get(sysId)) {    
			gs.print(grTarget.getDisplayValue());
		}
	} 
	finally {   
		gs.trace(false); // Turn off sql tracing
	}
})("sc_cat_item", "8310be193b7eea90df96ab9a04e45a35");
