searchIt('sys_id');

function searchIt(sys_id) {
	gs.print('Searching for ' + sys_id);

	var baseTables 	= new GlideRecord('sys_db_object');
	baseTables.addEncodedQuery('super_classISEMPTY^nameNOT LIKEts_c_^nameNOT LIKEsysx_^nameNOT LIKEv_');
	baseTables.addEncodedQuery('sys_scope=global^NQaccess=public^read_access=true'); // avoid the scope issue trap
	baseTables.query();

	while (baseTables._next()) {
		var sTableName = baseTables.getValue('name');
		
		// Does the table have a sys_id field
		var sd = new GlideRecord('sys_dictionary');
		sd.addQuery('name', sTableName);
		sd.addQuery('element', 'sys_id');
		sd.queryNoDomain();
		if(!sd.isValid()) continue;
		if(!sd._next()) continue;
		
		// Search the table
		var grFound = new GlideRecord(sTableName);
		grFound.addQuery('sys_id', sys_id);
		grFound.queryNoDomain();
		
		if(grFound._next()) {
			gs.print('Found it in ' + grFound.getClassDisplayValue() + ' [' + grFound.getRecordClassName() + '] /' + grFound.getRecordClassName() + '.do?sys_id=' + sys_id);
			break;
		}
	}
	
	gs.print('End of Search');
}