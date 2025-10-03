 /**
 * @name GlideRecord to JSON/CSV/Markdown
 * @description Code to convert a GlideRecord object into a JSON object or formatted into CSV/Markdown table format.
 * 		There is no need for XML as you're likely to be on the record and can view XML from there.
 * 
 * @author Shahed Ali Shah
 * @date 2024-06-10
 * @version 1.0.0
 * 
 * @param {string} tableName - name of the table to get record from
 * @param {string} sysId - sys_id of the record to get
 * @param {string} format - output format. Options: json (object), csv, md (markdown).
 * 					 Default: json (string)
 * @param {string=} delimiter - delimiter to use for CSV output. Default: " | "
 * 
 * @returns {void} - outputs to system logs
 * 
 * @example
 * 	("sn_devops_import_request","d602f076c358f210b71ef44c050131c2", "md")
 * 
 * @todo Add option to include/exclude specific fields
 * @todo Add option to include related lists
 * @todo Add option to output to file attachment
 * @todo Turn into Script Include to return the output instead of logging it
 * @todo Add option to format date fields 
 *
 */

(function(tableName, sysId, format) {
	format = format.toLowerCase();
	delimiter = " | "; // For CSV (optional)

	if (!tableName)
		throw new Error("No table name provided");
	
	if (!sysId)
		throw new Error("No sys id provided")
	
	if (!gs.tableExists(tableName)) {
		throw new Error("The '" + tableName + "' table does not exist");
	}

	var grTargetTable = new GlideRecord(tableName);
	grTargetTable.get(sysId);

	if (!grTargetTable.isValid())
		throw new Error("Unable to locate record");

	// Assemble
	var schema = [];
	for (field in grTargetTable) {
		var fieldRef = grTargetTable[field];
		var ed = grTargetTable[field].getED();
		var type = ed.getInternalType().toString() || null;

		if (!ed.getInternalType())
			continue;

		element = {
			"name": fieldRef.getName(),
			"label": fieldRef.getLabel(),
			"type": type,
			"data": {
				"value": fieldRef.getValue()
			}
		};

		if (type != "string") {
			// Handling for reference, choice, date, and other non-string fields to get display value
			element.data.display_value = fieldRef.getDisplayValue();
		}

		schema.push(element);
	}
	
	// Output
	switch (format) {
		case 'json':
			gs.info(schema);
			break;
		case 'csv':
			var headerRow = "Name{delimiter}Label{delimiter}Type{delimiter}Value{delimiter}Display Value\n".replaceAll("{delimiter}", delimiter);
			var flatSchema = headerRow;
			for (var element = 0; element < schema.length; element++) {
				var prop = schema[element];
				flatSchema += prop.name + delimiter
					+ prop.label + delimiter
					+ prop.type + delimiter
					+ (prop.data.value || "") + delimiter
					+ (prop.data.display_value || "") + "\n";
			}
			gs.info(flatSchema);
			break;
		case 'md':
			var mdHeaderRow = "| Name | Label | Type | Value | Display Value | \n";
				mdHeaderRow += "| ---- | ----- | ---- | ----- | ------------- | \n";
			var flatSchema = "\n" + mdHeaderRow;
			for (var element = 0; element < schema.length; element++) {
				var prop = schema[element];
				flatSchema += "| " + prop.name + " | "
					+ prop.label + " | "
					+ prop.type + " | "
					+ (prop.data.value || "") + " | "
					+ (prop.data.display_value || "") + "\n";
			}
			gs.info(flatSchema);
			break;
		default:
			gs.info(JSON.stringify(schema));
	}
	
})("","", "");
