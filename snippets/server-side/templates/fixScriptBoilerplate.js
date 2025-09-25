(function fixScript(nLimit, doIt, bSkipEngines) {
    var SCRIPT_NAME = "Fix Script"; // Set this to help with the log output
    // Set the table and query for the GlideRecord lookup 
    var sTable = "",
        sQuery = "";

    log(((!doIt) ? "***DRY RUN" : "***RUN"));

    var nCount = 0,
        nFixCount = 0,
        grTemplate = new GlideRecord(sTable);

    grTemplate.addEncodedQuery(sQuery); // Set any other queries as needed
	
    if (nLimit > 0) {
        // '0' means no limit to apply
        grTemplate.setLimit(nLimit);
    }
    grTemplate.query();

    nCount = parseInt(grTemplate.getRowCount());
    log("Found " + nCount + " record" + (nCount > 1 ? "s" : ""));

    while (grTemplate._next()) {
        // If we can, try to catch potential errors during the update/insert so the code can carry on merrily
        try {
            // do your processing/querying with the GlideRecord in this block

            if (doIt) {
                if (bSkipEngines) {
                    // Make sure any engines do not kick off
                    grTemplate.setWorkflow(false);
                    grTemplate.setUseEngines(false);
                    grTemplate.autoSysFields(false);
                }

				        // Update what you need with the GlideRecord here
				        // Example:
                // grTemplate.setValue('template', sTemplate);

                grTemplate.update();
                nFixCount++;
            }
        } catch (e) {
            log("Could not update " + grTemplate.getDisplayValue());
        }
    }

    log("***END: Removed from " + nFixCount + " out of " + nCount + "  records");

    // Garbage collection
    nCount = 0;
    nFixCount = 0;
    grTemplate = null;

    function log(msg) {
        gs.log(msg, SCRIPT_NAME);
    }
})(0, false, true);
