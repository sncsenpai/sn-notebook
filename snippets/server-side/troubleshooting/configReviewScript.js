/**
 * Usage: Inside the *process* function, uncomment the function for the intended review 
 * Warning: Do not run all the functions.
 */
var reviewScript = {
    WHITELIST    : ['sys_script_fix', 'clone_cleanup_script'], // of tables when running performMatch or findMatch

    process: function() {
        // WARNING - Try to reduce how many heavy scripts you run at once

        //this.hardCodedSysIDs();           // HEAVY: Hard-coded Sys IDs in Server-Side Scripts
        // this.ohardCodedSysIDs([
        //     {
        //         table: 'sys_script',
        //         field: 'script',
        //         query: 'active=true'
        //     },
        //     {
        //         table: 'sys_script_include',
        //         field: 'script',
        //         query: 'active=true'
        //     },
        //     {
        //         table: 'sys_ui_action',
        //         field: 'script',
        //         query: 'active=true'
        //     }
        // ]);
        //this.logsInClient();              // HEAVY: console.log in Client-side scripts
        //this.logsInServer();              // HEAVY: gs.log in Server-side scripts
        //this.queryAudit();                // HEAVY: DO NOT query audit log in your custom code
        //this.queryJournal();              // HEAVY: DO NOT query journal table in your custom code
        //this.grInScript();                // HEAVY: 'var gr' usage in server-side scripts
        // this.getRowCountInScript();       // HEAVY: Usage of 'getRowCount' in server-side scripts
        // this.oGetRowCountInScript([
        //     {
        //         table: 'sys_script',
        //         field: 'script',
        //         query: 'active=true'
        //     },
        //     {
        //         table: 'sys_script_include',
        //         field: 'script',
        //         query: 'active=true'
        //     },
        //     {
        //         table: 'sys_ui_action',
        //         field: 'script',
        //         query: 'active=true'
        //     }
        // ]);
        //this.scriptsUsingEval();          // HEAVY: Scripts should not use the eval() method
        //this.scriptsUsingJavaPackages();  // HEAVY: Scripts do not directly call Java packages
        //this.hardcodedUrls();             // HEAVY: Hard coded instance URL
        // this.hardcodedUrls_table('', 
        // [
        //     {
        //         table: 'sys_script',
        //         field: 'script',
        //         query: 'active=true'
        //     },
        //     {
        //         table: 'sys_script_include',
        //         field: 'script',
        //         query: 'active=true'
        //     },
        //     {
        //         table: 'sys_ui_action',
        //         field: 'script',
        //         query: 'active=true'
        //     }
        // ]);
        //this.glideRecordInClient();       // Usage of 'GlideRecord' in client-side scripts
        //this.globalBusinessRules();       // Global Business Rules
        //this.checkProperties();           // Check key properties are set to best practice values
        //this.beforeBRUpdateInsert();      // Before Business Rules should not update/insert on other tables
        //this.complexWorkflows();          // Complex Workflows, with many steps
        //this.workflowValidation();        // All workflows should pass validation
        //this.coalesceIndexed();           // Verifying that transform map fields are being indexed
        //this.transformMapBR();            // Transform maps generally don't need "Run Business Rules" enabled
        //this.dataSourceLastRun();         // JDBC Data Sources should have the "Use last run datetime" option checked
        //this.domManipulation();           // Client-side code should not use DOM manipulation technique
        //this.highSecurityPlugin();        // Making sure that the High Security Plugin is enabled.
        // this.tooManyFieldsOnForm();       // Too many fields on forms impact UX (>30 check)
        //this.minimiseErrors();            // Minimise on the number of errors per day (>10,000 check)
        //this.calculateDictWithGr();       // GlideRecord in calculated fields
        //this.isLoadingCheck();            // Client Scripts should check for isLoading and return
        //this.moduleLargeTable();          // Looking for modules linking to large tables without a filter
        //this.modifiedBusinessRules();     // Business Rule: Modified from Baseline
        //this.modifiedScriptIncludes();    // Script Includes: Modified from Baseline
        //this.modifiedClient();            // Client and UI Scripts: Modified from Baseline
        //this.modifiedJelly();             // UI Macros and UI Pages: Modified from Baseline
        //this.setValueClient();            // Client-side scripts not using setValue(field,value,display_value)
        //this.currentUpdateWorkflow();     // Look for workflows that contain current.update() in it's script
        //this.currentUpdateBR();           // Before Business Rules using curent.update()
        //this.numberOfWorkflows();         // STATS: Number of workflows
        //this.rowCountPreference();        // STATS: Checking the value of rowcount
        //this.numberOfUpdateSets();        // STATS: Number of update sets
        //this.numberOfPlugins();           // STATS: Number of active plugins
        //this.skippedUpgradeItems();       // STATS: Number of skipped items in last upgrade
        //this.choiceCount();               // STATS: Number of choice fields with more than 10 choices
        //this.adminRoleCheck();            // STATS: Number of users with admin role
        //this.publicReports(); // TODO
    },

    publicReports: function() {
        //https://mojprod.service-now.com/sys_report_list.do?sysparm_query=is_published%3Dtrue%5Eroles%3Dpublic
        //https://mojprod.service-now.com/sys_report_list.do?sysparm_query=roles%3Dpublic
        var findings = [];

        var reportGr = new GlideRecord('sys_report');
        reportGr.addQuery('is_published', 'true');
        reportGr.addEncodedQuery('rolesLIKEpublic');
        reportGr.query();
        while (reportGr.next()) {
            if (this.version._isOOB(reportGr)) {
                continue;
            }
            findings.push(this._addFinding(reportGr));
        }

        if (findings && findings.length > 0) {
            this._showFindings("Public reports", findings);
        }
    },

    currentUpdateBR:function() {
        var searchTerm = "current\\.update()\\";
        var searchTable = {
            table : "sys_script",
            field : "script",
            query : "active=true^when=before"
        };

        this._performMatch(searchTerm, searchTable);
    },

    currentUpdateWorkflow: function() {
        var findings = [];

        //Assemble list of Activities that run scripts
        var activitiesGr = new GlideRecord('wf_activity');
        activitiesGr.addQuery('workflow_version.published','true');
        activitiesGr.addQuery('activity_definition.name','Run script');
        activitiesGr.query();
        while (activitiesGr._next()) {
            if (this.version._isOOB(activitiesGr)) {
                continue;
            }

            //Isolate the workflow variables that contains the script
            var table = activitiesGr.getRecordClassName();
            var sys_id = activitiesGr.getUniqueValue();

            // Speed up checks using GlideAggregate
            var scriptGa = new GlideAggregate('sys_variable_value');
            scriptGa.addAggregate('COUNT', 'sys_id');
            scriptGa.addQuery('document', table);
            scriptGa.addQuery('document_key', sys_id);
            scriptGa.addQuery('valueLIKEcurrent.update()'); // Works as an encoded query. Maybe better to use regex
            scriptGa.query();
            if (scriptGa.next()) {
                var count = scriptGa.getAggregate('COUNT', 'sys_id');                
                if (count > 0) {
                    // // Attempt to check if this is OOB and skip - not sure if it will work here
                    // var scriptGr = new GlideRecord('sys_variable_value');
                    // if (scriptGr.get(scriptGa.getValue('sys_id'))) {
                    //     if (this.version._isOOB(scriptGr)) {
                    //         continue;
                    //     }
                    // }

                    // Add some helpful stuff to the finding
                    var override = {
                        Workflow: activitiesGr.workflow_version.getDisplayValue()
                    }
                    findings.push(this._addFinding(activitiesGr, override));
                }
            }
        }

        if (findings && findings.length > 0) {
            this._showFindings("current.update in Workflows", findings);
        }

    },

    setValueClient: function() {
        var findings = [];

        var clientGr = new GlideRecord('sys_script_client');
        clientGr.addActiveQuery();
        //clientGr.addQuery('sys_class_name','sys_script_client');
        clientGr.addQuery('script','LIKE','%g_form.setValue%');
        clientGr.query();
        while (clientGr._next()) {
            if (this.version._isOOB(clientGr))
                continue;

            // This regex has a capture group to get what's inside the brackets
            var search = "g_form.setValue\\((.*)\\)";
            var match, regex = new RegExp(search, 'g');
            //var match, regex = /g_form.setValue\((.*)\)/g;
            var script = clientGr.getValue('script');
            script = this.scriptUtils._removeComments(script);

            if ((match = regex.exec(script))!= null) { 
                var paramStr = match[1]; // parameters inside the setValue() function
                var paramArr = paramStr.split(','); // Turn it into an array and count
                var msg = [], override = {};

                // Two params: field name, value
                // Three params: field name, value, display value

                if (paramArr) {
                    var isReference = false;

                    var fieldName = paramArr[0];
                    if (!fieldName || fieldName == "") {
                        gs.print("Non-existant field")
                        continue;
                    }

                    fieldName = fieldName.replace(/\'|\"/g, "");

                    // this._print(
                    //     "Script type: {1}, name: {2}, field name: {0}", 
                    //     [
                    //         fieldName,
                    //         clientGr.getValue('sys_class_name'),
                    //         clientGr.getDisplayValue()
                    //     ],
                    //     true);
                    // gs.print("field name: " + fieldName);
                    // gs.print(clientGr.getValue('sys_class_name'));

                    if (clientGr.getValue('sys_class_name') == 'sys_script_client') {
                        var tableName = clientGr.getValue('table');
                        var dictGr = new GlideRecord('sys_dictionary')
                        dictGr.addQuery('name', tableName);
                        dictGr.addQuery('element', fieldName);
                        dictGr.query();
                        if (dictGr._next()) {
                            if (dictGr.getValue('internal_type') == 'reference') {
                                isReference = true;
                            }
                        }
                    }
                    else {
                        // must a variable in the catalog

                        // gr doesn't expand to child so here goes...
                        var catScriptGr = new GlideRecord('catalog_script_client');
                        if (!catScriptGr.get(clientGr.getUniqueValue())) {
                            // can't do anything so let the loop move on
                            continue;
                        }

                        var variableSet = catScriptGr.getValue('variable_set') || null;
                        var catItem =  catScriptGr.getValue('cat_item') || null;

                        var varGr = new GlideRecord('item_option_new');
                        varGr.addQuery('name', fieldName);
                        varGr.addQuery('type', '8') // 8 is the value of type=reference
                        if (variableSet) {
                            varGr.addQuery("variable_set", variableSet);
                        }
                        if (catItem) {
                            varGr.addQuery("cat_item", catItem);
                        }
                        varGr.query();
                        if (varGr._next()) {
                            isReference = true;
                        }
                    }

                    if (isReference && paramArr.length < 3) {
                        //override.value = "Reference: " + fieldName; // track it in the finding
                        findings.push(this._addFinding(clientGr, override));
                    }
                }
            }
        }

        if (findings && findings.length > 0) {
            this._showFindings("g_form.setValue on a reference field without displayValue", findings)
        }
    },

    modifiedClient: function() {
        this.modifiedScripts('sys_script_client');
        this.modifiedScripts('sys_ui_script');
    },

    modifiedScripts: function(table) {
        var findings = [],
            clientGr = new GlideRecord(table);
            clientGr.addActiveQuery();
            clientGr.query();
        while (clientGr._next()) {
            var updateName = clientGr.getValue('sys_update_name');
            var wasOOB = this.version._wasOOB(updateName);

            if (wasOOB) {
                findings.push(this._addFinding(clientGr));

            }
        }

        if (findings && findings.length > 0) {
            var tableLabel = this._getTableLabel(table);
            this._showFindings(tableLabel + ": Modified from Baseline", findings)
        }
    },

    modifiedJelly: function() {
        this.modifiedScripts('sys_ui_macro');
        this.modifiedScripts('sys_ui_page');
    },

    modifiedBusinessRules: function() {
        var findings = [],
            bRules = new GlideRecord('sys_script');
        bRules.addActiveQuery();
        bRules.query();
        while (bRules._next()) {
            var updateName = bRules.getValue('sys_update_name');
            var wasOOB = this.version._wasOOB(updateName);

            if (wasOOB) {
                findings.push(this._addFinding(bRules));

            }
        }

        if (findings && findings.length > 0) {
            this._showFindings("Business Rule: Modified from Baseline", findings)
        }
    },

    modifiedScriptIncludes: function() {
        var findings = [],
            includeGr = new GlideRecord('sys_script_include');
            includeGr.addActiveQuery();
            includeGr.query();
        while (includeGr._next()) {
            // Safety check, it might an extension of 'name'SNC, e.g. KBCommon >> KBCommonSNC
            var dupIncludeGr = new GlideRecord('sys_script_include');
            var snName = includeGr.getValue('name') + "SNC";
            if (dupIncludeGr.get('name', snName)) {
                // Script Include intended to be modified so skip
                continue;
            }

            var updateName = includeGr.getValue('sys_update_name');
            var wasOOB = this.version._wasOOB(updateName);

            if (wasOOB) {
                findings.push(this._addFinding(includeGr));
            }
        }

        if (findings && findings.length > 0) {
            this._showFindings("Script Include: Modified from Baseline", findings)
        }
    },

    queryJournal: function() {
        var scriptFieldArr = this.scriptUtils._scriptFieldArr();
        var searchTerm = "new GlideRecord\([\"|\']sys_audit[\"|\']\)";
        this._findMatch(searchTerm, scriptFieldArr); 
    },

    queryAudit: function() {
        var scriptFieldArr = this.scriptUtils._scriptFieldArr();
        var searchTerm = "new GlideRecord\([\"|\']sys_audit[\"|\']\)";
        this._findMatch(searchTerm, scriptFieldArr); 
    },

    adminRoleCheck: function() {
        var table = 'sys_user_has_role',
            query = "user.active=true^role.name=admin";

        var count = this._getCount(table, query);
        
        var s = this._genHeader('Number of users with admin role')
        s += this._print("Recorded {0} users with the 'admin' role", [count]);
        s += "Recommendation: Limit the number of admin users on a prod instance to 5 or below."
        gs.print(s);
    },

    choiceCount: function() {
        var findings = [];
        var threshold = 10; // SN Best Practice: More than 10 options in a choice often results in a poor user experience
        var table = 'sys_choice';

        var choiceGr = new GlideAggregate(table);
        choiceGr.addQuery('name', '!=', '');
        choiceGr.addQuery('inactive', false);
        choiceGr.addQuery('name', 'NOT LIKE', 'v_%');
        choiceGr.addAggregate('COUNT', 'element');
        choiceGr.groupBy('name');
        choiceGr.groupBy('element');
        choiceGr.addHaving('COUNT', 'element', '>', threshold);
        choiceGr.query();
        while (choiceGr.next()) {
            //Trying to build the sys_update_name in the format of sys_choice_{table}_{column}
            var updateName = "sys_choice_" + choiceGr.getValue('name') + "_" + choiceGr.getValue('element');
            if (this.version._isOOB_updateName(updateName))
                continue;

            var finding = {
                name: updateName,
                table: table,
                target_table: choiceGr.getValue('name'),
                link: gs.getProperty('glide.servlet.uri') + table + '_list.do?sysparm_query=name=' + choiceGr.getValue('name') + "^element=" + choiceGr.getValue('element'),
                value: "Counted " + choiceGr.getAggregate('COUNT', 'element')
            }
            findings.push(finding);
        }

        if (findings && findings.length > 0) {
            this._showFindings("Too many options in a choice field", findings)
        }
    },

    logsInServer: function() {
        var scriptFieldArr = this.scriptUtils._scriptFieldArr();
        var searchTerm = "gs\\.log\\(";
        this._findMatch(searchTerm, scriptFieldArr); 
    },

    isLoadingCheck: function() {
        var findings = [], 
            regex = /onChange\(.*isLoading\) {([.\w\W]*)}/g,
            m,
            clientScriptGr = new GlideRecord('sys_script_client');
        clientScriptGr.addActiveQuery();
        clientScriptGr.addQuery('type', 'onChange');
        clientScriptGr.query();
        while (clientScriptGr.next()) {
            if (this.version._isOOB(clientScriptGr)) {
                continue;
            }

            var str = clientScriptGr.getValue('script');
            if ((m = regex.exec(str)) != null) {
                var subScript = m[m.length-1];
                if (subScript.indexOf("isLoading") == -1) {
                    findings.push(this._addFinding(clientScriptGr));
                }
            }
        }

        if (findings && findings.length > 0) {
            this._showFindings("Scripts without isLoading check", findings)
        }
    },

    numberOfWorkflows: function() {
        // Customers most likley will not do a *full* clone so it's best to get this statistic from prod
        var table = 'wf_workflow_version';
        var query = 'published=true';
        var count = this._getCount(table, query);

        var s = this._genHeader("Number of Workflows");
        s+= "There are {0} workflows. A large number is difficult to manage\n".replace(/\{0\}/g, count);
        s+= "Try to use baseline functionality wherever possible. " +
            "A large number of workflows is not bad; just more to manage.\n";
        gs.print(s);
    },

    skippedUpgradeItems: function() {
        var version = gs.getProperty('glide.war');
        var upgradeGr = new GlideRecord('sys_upgrade_history');
        if (upgradeGr.get('to_version', version)) {
            var table = 'sys_upgrade_history_log';
            var query = 'upgrade_history=' + upgradeGr.getUniqueValue();
            query += '^dispositionIN4,104,9,10^changed=true^ORdisposition=9^resolution_status=not_reviewed^ORresolution_status=';
            var count = this._getCount(table, query);
            var s = this._genHeader("Number of skipped items in last upgrade");
            s+= "There are {0} 'skipped' (that item was not upgraded) items in the last upgrade\n".replace(/\{0\}/g, count);
            gs.print(s);
        }
    },

    numberOfPlugins: function() {
        var plugins = this._getPluginList();
        var s = this._genHeader("Number of active plugins");
        s+= "There are {0} active\n".replace(/\{0\}/g, plugins.length);
        s+= "The more plugins that you activate, the more there is to manage.";
        gs.print(s);
    },

    calculateDictWithGr: function() {
        var findings = [];
        var dictGr = new GlideRecord('sys_dictionary');
        dictGr.addQuery('virtual', 'true');
        dictGr.addQuery('calculation', 'LIKE', '%new GlideRecord%');
        dictGr.query();
        while (dictGr.next()) {
            if (this.version._isOOB(dictGr))
                continue;

            findings.push(this._addFinding(dictGr));
        }

        if (findings && findings.length > 0) {
            this._showFindings("GlideRecord in calculated fields", findings)
        }
    },

    minimiseErrors: function() {
        // Customers most likley will not do a *full* clone so it's best to get this statistic from prod
        var table = 'syslog';
        var query = 'level=2';
        var count = this._getCount(table, query);
        if (count > 10000) {
            // The number of errors in the system log should be under 10,000
            var s = this._genHeader("Minimise the number of errors per day");
            s+= "There are {0} errors in the logs, which need to be under 10,000\n".replace(/\{0\}/g, count);
            s+= "Have a System Admin check the Error log continually during development" +
                " and regularly in production. Act on any errors to reduce future issues\n";
            gs.print(s);
        }
    },

    tooManyFieldsOnForm: function() {
        var findings = [];
        var formGr = new GlideRecord('sys_ui_section');
        formGr.addQuery('view','Default view');
        formGr.addQuery('sys_updated_by', '!=', 'glide.maint');
        formGr.query();
        while (formGr.next()) {
            if (this.version._isOOB(formGr)) {
                continue;
            }

            var table = 'sys_ui_element',
                query = 'sys_ui_section=' + formGr.getUniqueValue() + '^typeISEMPTY';
            // ISEMPTY is needed to make sure we don't pick up splits and formatters
            var count = this._getCount(table, query);
            if (count > 30) {
                var updateLink = "{0}name={1}^update_set!=NULL";
                updateLink = updateLink.replace("{0}", "sys_update_xml_list.do?sysparm_query=")
                updateLink = updateLink.replace("{1}", formGr.getValue('sys_update_name'));
                updateLink = gs.getProperty('glide.servlet.uri') + updateLink;

                var override = {
                    field_count: count,
                    update_link: updateLink
                }
                findings.push(this._addFinding(formGr, override));
            }
        }

        if (findings && findings.length > 0) {
            this._showFindings("Too many fields on a form", findings)
        }

    },


    numberOfUpdateSets: function() {
        var count = this._getCount('sys_update_set', 'state=in progress^name!=Default^ORname=NULL');
        if (count > 0) {
            var s = this._genHeader("Update Set Check");
            s+= "There are {0} in progress update sets\n".replace(/\{0\}/g, count);
            gs.print(s);
        }
    },

    moduleLargeTable: function() {
        var LARGE_TABLES = [
            'sys_audit',
            'sys_audit_delete',
            'sys_journal_field',
            'syslog',
            'syslog_transaction',
            'task',
            'cmdb_ci',
            'sys_email',
            'sys_email_log'
        ];

        var findings = [],
            moduleGr = new GlideRecord('sys_app_module');
        moduleGr.addActiveQuery();
        moduleGr.addEncodedQuery('nameIN' + LARGE_TABLES.join(','));
        moduleGr.addQuery('filter', 'NULL');
        moduleGr.query();
        while (moduleGr.next()) {
            if (this._isOOB(moduleGr)) {
                findings.push(this._addFinding(moduleGr));
            }
        }

        if (findings && findings.length > 0) {
            this._showFindings("Modules with Large Tables and no filter", findings)
        }
    },

    hardcodedUrls: function() {
        var instance_name = gs.getProperty("instance_name");
        var search = "http:\/\/" + instance_name + "|https:\/\/" + instance_name;

        var scriptFieldArr = this.scriptUtils._scriptFieldArr();
        this._findMatch(search, scriptFieldArr); 
    },

    hardcodedUrls_table: function(instance, oDict) {
        var instance_name = instance != '' ? instance : gs.getProperty("instance_name");
        var search = "http:\/\/" + instance_name + "|https:\/\/" + instance_name;
        this._findMatch(search, oDict); 
    },

    highSecurityPlugin: function() {
        var s = this._genHeader("Plugin Check");
        s+="Is High Security plugin enabled: " + this._isPluginActive('com.glide.high_security');
        s+="Is Client Transaction Timing plugin enabled: " + this._isPluginActive('com.glide.client_transaction');
        gs.print(s);
    },

    domManipulation: function() {
        // Ignore portal and UI Pages as DOM manipulation is expected
        var whitelist = ['sp_widget','sp_angular_provider', 'sys_ui_page'];

        // Look for references to $(), $j(), window., document.
        var search = "\\$\\(.*\\)|\\$j\\(.*\\)|window\\.|document\\..*\\(";

        var scriptFieldArr = this.scriptUtils._clientScriptArr();
        scriptFieldArr = this._filterTableList(scriptFieldArr, whitelist);
        this._findMatch(search, scriptFieldArr); 
    },

    transformMapBR: function() {
        var table = 'sys_transform_map';
        var query = 'run_business_rules=true^active=true';
        var brCount = this._getCount(table, query);
        if (brCount) {
            var s = this._genHeader("Transform Maps running Business Rules");
            s+= "There are {0} transform maps with 'Run Business Rules' enabled\n".replace(/\{0\}/g, brCount);
            s+= this._generateQueryUrl(table, query, true);
            gs.print(s);
        }
    },

    dataSourceLastRun: function() {
        var table = 'sys_data_source';
        var query = 'type=JDBC^use_last_run_datetime=false';
        var brCount = this._getCount(table, query);
        if (brCount) {
            var s = this._genHeader("Transform Maps last run datetime");
            s+= "There are {0} JDBC data sources without 'Use last run datetime' enabled\n".replace(/\{0\}/g, brCount);
            s+= this._generateQueryUrl(table, query, true);
            gs.print(s);
        }
    },

    coalesceIndexed: function() {
        var findings = [];

        var transformMapGr = new GlideRecord('sys_transform_map');
        transformMapGr.addActiveQuery();
        transformMapGr.query();
        while (transformMapGr.next()) {
            if (this.version._isOOB(transformMapGr))
                continue;

            var fieldMapGr = new GlideRecord('sys_transform_entry');
            fieldMapGr.addQuery('map', transformMapGr.getUniqueValue());
            fieldMapGr.addQuery('coalesce', 'true');
            fieldMapGr.query();
            if (fieldMapGr.next()) { // Get first field. Don't need to iterate
                var table = transformMapGr.getValue('target_table');
                var field = fieldMapGr.getValue('target_field');
                if (!this._isIndexed(table, field)) {
                    findings.push(this._addFinding(transformMapGr));
                }
            }
        }

        if (findings && findings.length > 0) {
            this._showFindings("Fields used to coalesce in a Table Transform Maps should be indexed", findings)
        }
    },

    workflowValidation: function() {
        var s = "";

        var wfVersionGr = new GlideRecord('wf_workflow_version');
        wfVersionGr.addQuery('published', 'true');
        wfVersionGr.query();
        while (wfVersionGr.next()) {
            if (this.version._isOOB(wfVersionGr))
                continue;
            
            var validationResult = new WorkflowValidateUtil().validateWorkflow(wfVersionGr);
            if (validationResult.result != 'valid') {
                s+= "Workflow: " + wfVersionGr.getDisplayValue() + "\n";
                s+= "Level: " + getLevelText(validationResult.level) + "\n";
                s+= "Validation results: " + validationResult.msg + "\n\n";
            }
        }

        if (s != "") {
            gs.print(this._genHeader("All workflows should pass validation") + s);
        }

        function getLevelText(level /*number*/) {
            var levelText = "";
            switch(level) {
                case 0:
                    levelText = "Info";
                    break;
                case 1:
                    levelText = "Warning";
                    break;
                case -1:
                    levelText = "Critical";
                    break;
                default:
                    levelText = "Unknown";
            }
            return levelText;
        }
    },

    hardCodedSysIDs: function() {
        var scriptFieldArr = this.scriptUtils._scriptFieldArr();
        var search = "[0-9a-f]{32}";
        var findings = this._findMatch(search, scriptFieldArr);
        if (findings && findings.length > 0) {
            this._showFindings("Hard-coded Sys IDs found", findings)
        }
    },
    ohardCodedSysIDs: function(scriptFieldArr) {
        var search = "[0-9a-f]{32}";
        var findings = this._findMatch(search, scriptFieldArr);
        if (findings && findings.length > 0) {
            this._showFindings("Hard-coded Sys IDs found", findings)
        }
    },

    globalBusinessRules: function() {
        var s=null, countEntries=0, findings = [];
        var brGr = new GlideRecord('sys_script');
        brGr.addActiveQuery();
        brGr.addQuery('collection', 'global');
        brGr.orderBy('name');
        brGr.query();
        while (brGr.next()) {
            if (!this.version._isOOB(brGr)) {
                findings.push(this._addFinding(brGr));
            }
        }
        
        if (findings && findings.length > 0) {
            this._showFindings("Global Business Rules found", findings)
        }
        
        brGr = null;
    },

    logsInClient: function() {
        var scriptFieldArr = this.scriptUtils._clientScriptArr();
        var search = "\\bconsole\\..*\\(";
        var findings = this._findMatch(search, scriptFieldArr);
        if (findings && findings.length > 0) {
            this._showFindings("Client Scripts with Logging found", findings)
        }
    },

    grInScript: function() {
        var scriptFieldArr = this.scriptUtils._scriptFieldArr();
        var search = "\\bvar gr\\b";
        var findings = this._findMatch(search, scriptFieldArr);
    },

    glideRecordInClient: function() {
        // Findings that are up for discussion. Using async with GlideRecord is safe,
        // so this is looking for any usage of query() instead of query(callback).
        // Not using findMatch or performMatch for this additional check
        var regex = /\.query\(\)/g, 
            match, 
            findings = [];
        var scriptFieldArr = this.scriptUtils._clientScriptArr();
        
        for (var i=0;i<scriptFieldArr.length;i++) {
            var dict = scriptFieldArr[i];
            var clientGr = new GlideRecord(dict.table);
            clientGr.addActiveQuery();
            clientGr.addQuery(dict.field,'LIKE','%new GlideRecord(%')
            clientGr.query();
            while (clientGr.next()) {
                if (this.version._isOOB(clientGr))
                    continue;
                
                var script = clientGr.getValue('script');
                if ((match= regex.exec(script))!=null) {
                    findings.push(this._addFinding(clientGr));
                }
            }
        }
        if (findings && findings.length > 0) {
            this._showFindings("GlideRecord Usage in Client-side", findings)
        }
    },

    getRowCountInScript: function() {
        var scriptFieldArr = this.scriptUtils._scriptFieldArr();
        var search = ".getRowCount\\(\\)";
        var findings = this._findMatch(search, scriptFieldArr);
    },

    oGetRowCountInScript: function(scriptFieldArr) {
        var search = "[0-9a-f]{32}";
        var findings = this._findMatch(search, scriptFieldArr);
        if (findings && findings.length > 0) {
            this._showFindings("Hard-coded Sys IDs found", findings)
        }
    },

    checkProperties: function() {
        var properties = this._propertiesArray();
        var s = "";

        for (var i = 0; i < properties.length; i++) {
            property = properties[i];

            var currentValue = gs.getProperty(property.property_name);
            defaultValue = property.default_value;

            if (defaultValue != currentValue) {
                s += "(" + property.rating + ") Description: " + property.description + "\n";
                s += property.product + " | " + property.category + "\n";
                s += "Value: " + defaultValue + " >> " + currentValue + "\n\n";
                
            }
        }

        if (s != "") {
            gs.print(this._genHeader("Overall property check") + s);
        }
    },

    rowCountPreference: function() {
        var count = this._getCount('sys_user_preference', 'name=rowcount^value=100');
        if (count > 0) {
            var s = this._genHeader("Rowcount preferences check")
            s += count + ' preference(s) found with "rowcount" set to "100"';
            gs.print(s);
        }
    },

    beforeBRUpdateInsert:function() {
        var searchTerm = "\.update\(\)\|\.insert\(\)";
        var searchTable = {
            table: 'sys_script',
            field: 'script',
            query: 'active=true^when=before'
        }
        this._performMatch(searchTerm, searchTable);
    },

    complexWorkflows: function() {
        // Looking at workflows with more than 30 activities
        var table = "wf_activity",
            field = "workflow_version",
            query = "workflow_version.published=true",
            threshold = 30;
        this._getFieldCount(table, field, query, threshold);
    },

    scriptsUsingEval: function() {
        var search = "\beval\(.*\)";
        var scriptFieldArr = this.scriptUtils._scriptFieldArr();
        var findings = this._findMatch(search, scriptFieldArr);
    },

    scriptsUsingJavaPackages: function() {
        var search = "Packages\.java";
        var scriptFieldArr = this.scriptUtils._scriptFieldArr();
        var findings = this._findMatch(search, scriptFieldArr);
    },
    

    /******************************
     * 
     * Supporting functions 
     * 
     ******************************/

    _generateUrl: function (gr /* GlideRecord */) {
        // Reduce the mess of generating links into a reusable function
        if (!gr)
            return null;
            
        var t = gr.getRecordClassName(); // extract table name
        var id = gr.getUniqueValue(); // get the sys_id
        return gs.getProperty('glide.servlet.uri') + gs.generateURL(t, id);
    },
    _generateQueryUrl: function(table, query, isList) {
        var s = gs.getProperty('glide.servlet.uri');
        s += (isList==true) ? table + "_list.do" : table + ".do";
        s+= "?sysparm_query=" + query;
        return s;
    },
    _getCount: function(table /* String */, query /* String */) {
        // GlideAggregate boilerplate for normal count
        var count = 0;
        var ga = new GlideAggregate(table);
        if (query) {
          ga.addEncodedQuery(query)
        }
        ga.addAggregate('COUNT');
        ga.query();

        //gs.print(ga.getEncodedQuery());
  
        if (ga.next()) {
            count = ga.getAggregate('COUNT');
        }
        return count;
    },
    _getFieldCount: function(table /* String */, field /* String */, query /* String */, threshold /* Number */) {
        var count = 0;
        var ga = new GlideAggregate(table);
        if (query) {
            ga.addEncodedQuery(query);
        }
        ga.addAggregate('COUNT', field);
        ga.addHaving('COUNT', field, '>', threshold);
        ga.query();

        while (ga.next()) {
            gs.print("(" + ga.getAggregate('COUNT', field) +") " + ga.getDisplayValue(field));
        }
    },
    _addFinding: function(findingGr /* GlideRecord */, override /* Object */) {
        var s = "";
        var findingObject = {};

        if (!findingGr) {
            return s;
        }
        //var targetRec = (this._getTableLabel(findingGr.getValue('collection'))) ? this._getTableLabel(findingGr.getValue('collection')) : findingGr.getValue('collection');
        
        // Try to find which product table this object belongs to
        var targetRec = findingGr.getValue('collection');
        if (!targetRec || targetRec == '') {
            targetRec = findingGr.getValue('table');
        }
        if (!targetRec || targetRec == '') {
            // catalog
            targetRec = findingGr.getValue('cat_item');
        }
        if (!targetRec || targetRec == '') {
            // catalog
            targetRec = findingGr.getValue('variable_set');
        }
        if (!targetRec || targetRec == '') {
            targetRec = findingGr.getValue('target_table');
        }
        if (!targetRec || targetRec == '') {
            // Some objects have the table name in the 'name' field
            targetRec = findingGr.getValue('name');
        }

        // Try to get a nice display for the product table
        if (targetRec || targetRec != '') {
            targetRec = this._getTableLabel(targetRec) ? this._getTableLabel(targetRec) : targetRec;
        }

        if (override) {
            for (var property in override) {
                findingObject[property] = override[property];
            }
        }

        findingObject.name = findingGr.getDisplayValue() || "(empty)";
        findingObject.table = (this._getTableLabel(findingGr.getRecordClassName()) != null) ? this._getTableLabel(findingGr.getRecordClassName()) : findingGr.getTableName;
        if (targetRec && targetRec != '') {
            findingObject.target_table = targetRec;
        }
        findingObject.link = this._generateUrl(findingGr);
        findingObject.updated_on = findingGr.getDisplayValue('sys_updated_on');
        findingObject.updated_by = findingGr.getValue('sys_updated_by');

        return findingObject;
    },
    _showFindings: function(review /* String */, findings /* Array */) {
        var s = "";
        if (review != "") {
            s = "\n\n----------\n\nReview: " + review + " (" + findings.length +")\n\n----------\n\n";
        }
        else {
            "\n\n----------\n\nReview: " + findings.length +" findings\n\n----------\n\n";
        }
        for (var i=0;i<findings.length;i++) {
            var finding = findings[i];
            // s += "Name: " + finding.name + "\n";
            // s += "Table: " + finding.table + "\n";
            // if (finding.target_table) {
            //     s+= "Target table: " + finding.target_table + "\n";
            // }
            // s += "Updated On: " + finding.updated_on + "\n";
            // s += "Updated By: " + finding.updated_by + "\n";
            // s += "Link: " + finding.link + "\n\n";

            // Try to walk through the properties of the finding object and output it
            for (var findingProperty in finding) {
                if (finding[findingProperty] == "")
                    continue;
                s+= this.scriptUtils._clean(findingProperty) + ": " +  finding[findingProperty] + "\n";
            }
            s+="\n";
        }
        gs.print(s);
    },
    _getTableLabel: function(table_name /* String */) {
        if (!table_name) {
            return;
        }

        var dbObjectGr = new GlideRecord('sys_db_object');
        if (dbObjectGr.get('name', table_name)) {
            return dbObjectGr.getValue('label') + " [" + table_name+ "]";
        }
        return table_name; // If we got here... good luck
    },
    _showFinding: function(record /* GlideRecord */) {
        var s = "";

        if (!record)
            return;

        var finding = this._addFinding(record);
        s += "Name: " + finding.name + "\n";
        s += "Table: " + finding.table + "\n";
        if (finding.target_table) {
            s+= "Target table: " + finding.target_table + "\n";
        }
        s += "Updated On: " + finding.updated_on + "\n";
        s += "Updated By: " + finding.updated_by + "\n";
        s += "Link: " + finding.link + "\n\n";
        gs.print(s);
    },
    _genHeader: function(headerText) {
        return "\n\n----------\n\n{0}\n\n----------\n\n".replace(/\{0\}/g, headerText);
    },
    _isIndexed: function(table, field) {

        var answer = false; // assume false
    
        if (!table || !field) {
            return false;
        }
    
        var td = GlideTableDescriptor(table);
    
        var ed;
        if (td) {
            ed = td.getElementDescriptor(field);
        }
    
        if (ed) {
            var source = ed.getTableName();
            
            var i;
            try {
                i = GlideTableDescriptor(source).getIndexDescriptors().values().iterator();
            } catch (e) {
                return false;
            }
            
            while (i.hasNext()) {
                if (i.next().getFields().get(0) == field) {
                    answer = true;
                    break;
                }
            }
        }
    
        return answer;
    },
    
    version : {
        _isOOB: function(gr) {
            // Safety check
            if (!gr)
                return false;
            
            var update_name = gr.getValue('sys_update_name');
            if (!update_name || update_name == "") {
                // Can't check so assume it's not OOB
                return false;
            }

            return this._isOOB_updateName(update_name);

            // // Close enough estimation of this being OOB
            // var update_name = gr.getValue('sys_update_name'),
            //     hasVersion = false,
            //     versionGr = new GlideAggregate('sys_update_version');
            
            // // Safety check
            // if (!update_name || update_name == "") {
            //     // Can't check so assume it's not OOB
            //     return false;
            // }
            // versionGr.addQuery('name', update_name);
            // versionGr.addQuery('source_table', '=', 'sys_upgrade_history');
            // versionGr.addAggregate('COUNT');
            // versionGr.query();
            // if (versionGr.next()) {
            //     if (versionGr.getAggregate('COUNT') > 0)
            //         hasVersion = true;
            // }
            
            // var hasUpdate = false,
            //     updateGr = new GlideAggregate('sys_update_xml');
            // updateGr.addQuery('name', update_name);
            // updateGr.addAggregate('COUNT');
            // updateGr.query();
            // if (updateGr.next()) {
            //     if (updateGr.getAggregate('COUNT') > 0)
            //         hasUpdate = true;
            // }
            
            // versionGr = null;
            // updateGr = null;
            
            // // If there is no version record and there's no sys_update_xml record then it's gotta be OOB, right?
            // if (!hasVersion && !hasUpdate)
            //     return true;
            // else
            //     return false;
        },
        _isOOB_updateName: function(update_name) {
            var hasVersion = false,
                versionGr = new GlideAggregate('sys_update_version');
            
            // Safety check
            if (!update_name || update_name == "") {
                // Can't check so assume it's not OOB
                return false;
            }
            versionGr.addQuery('name', update_name);
            versionGr.addQuery('source_table', '=', 'sys_upgrade_history');
            versionGr.addAggregate('COUNT');
            versionGr.query();
            if (versionGr.next()) {
                if (versionGr.getAggregate('COUNT') > 0)
                    hasVersion = true;
            }
            
            var hasUpdate = false,
                updateGr = new GlideAggregate('sys_update_xml');
            updateGr.addQuery('name', update_name);
            updateGr.addAggregate('COUNT');
            updateGr.query();
            if (updateGr.next()) {
                if (updateGr.getAggregate('COUNT') > 0)
                    hasUpdate = true;
            }
            
            versionGr = null;
            updateGr = null;
            
            // If there is no version record and there's no sys_update_xml record then it's gotta be OOB, right?
            if (!hasVersion && !hasUpdate)
                return true;
            else
                return false;
        },
        _wasOOB: function(update_name) {
            var table = "sys_update_version";
            var query = "name=" + update_name + "^source_table=sys_upgrade_history";
            return (reviewScript._getCount(table, query) > 0); // using 'reviewScript' instead of 'this'
        },
        _isSystem: function(gr) {
            var answer = false;
            var updated_by = gr.getValue('sys_updated_by');
            if (updated_by == 'system' || updated_by == 'system@snc') {
                answer = true;
            }
            return answer;
        }
    },

    scriptUtils: {
        _clean: function(term) {
            term = term.replace("_", " ");
            term = term.capitalize();
            return term;
        },
        _clientScriptArr: function() {
            // Similar to _scriptFieldArr but this will return tables for client-side scripting
            var result = [];
            var tableName, fieldName;

            var dictGR = new GlideRecord('sys_dictionary');
            dictGR.addQuery('internal_type', 'script')
            .addOrCondition('internal_type', 'script_plain');
            dictGR.addEncodedQuery('attributesLIKEclient_script=true'); // needs encoding for some reason
            dictGR.addQuery('name', '!=','NULL');
            dictGR.orderBy('name');
            dictGR.orderBy('element');
            dictGR.queryNoDomain();
            while (dictGR.next()) {
                tableName = dictGR.getValue('name');

                if (tableName.match('^var_')) {
                    continue;
                }
                
                var tblGR = new GlideRecord(tableName);
                if (tblGR.instanceOf('sys_metadata') == false) {
                    // This table is not an application file, skip
                    continue;
                }
                
                fieldName = dictGR.getValue('element');

                if ((tableName == 'sp_portal' && fieldName == 'quick_start_config') ||
                    (tableName == 'diagrammer_action' && fieldName == 'script') ||
                    (tableName == 'sys_ui_action' && fieldName == 'client_script_v2')) {
                    // these are niche
                    continue;
                }

                // Assume that if this field is on the table, it is a reference field to the product table
                var productTableField = '';
                if (tblGR.isValidField('table')) productTableField = 'table';
                    if (tblGR.isValidField('collection')) productTableField = 'collection';
                    
                result.push({
                    'table': tableName,
                    'field': fieldName,
                    'product_table_field': productTableField
                });
            }

            return result;
        },
        _scriptFieldArr: function() {
            var result = [];
            var tableName, fieldName;
            
            var dictGR = new GlideRecord('sys_dictionary');
            dictGR.addQuery('internal_type', 'script')
            .addOrCondition('internal_type', 'script_plain')
            .addOrCondition('internal_type', 'email_script');
            dictGR.addEncodedQuery('attributesISEMPTY^ORattributesNOT LIKEclient_script=true'); // Must be encoded for some reason
            dictGR.addQuery('name', '!=', 'NULL');
            dictGR.orderBy('name');
            dictGR.orderBy('element');
            dictGR.queryNoDomain();
            while (dictGR.next()) {
                
                tableName = dictGR.getValue('name');
                
                if (tableName.match('^var_')) {
                    continue;
                }
                
                var tblGR = new GlideRecord(tableName);
                if (tblGR.instanceOf('sys_metadata') == false) {
                    // This table is not an application file, skip
                    continue;
                }
                
                fieldName = dictGR.getValue('element');
                
                if ((tableName == 'sys_script_client' && fieldName == 'script') ||
                    (tableName == 'sys_ui_policy' && fieldName == 'script_false') ||
                (tableName == 'sys_ui_policy' && fieldName == 'script_true') ||
                (tableName == 'sys_ui_script' && fieldName == 'script') ||
                (tableName == 'sys_ui_page' && fieldName == 'client_script')) {
                    // these are client scripts
                    continue;
                }
                
                // Assume that if this field is on the table, it is a reference field to the product table
                var productTableField = '';
                if (tblGR.isValidField('table')) productTableField = 'table';
                    if (tblGR.isValidField('collection')) productTableField = 'collection';
                    
                result.push({
                    'table': tableName,
                    'field': fieldName,
                    'product_table_field': productTableField
                });
            }
            
            // for (var i = 0; i < result.length; i++) {
            //     var field = result[i];
            //     gs.print(field['table'] + "." + field['field'] + " (" + field['product_table_field'] + ")");
            // }
            
            return result;
        },
        _lineMatches: function(str, search) {
            var regex = RegExp(search,'g');

            var lines = [];

            while ((results = regex.exec(str)) !== null) {

                // Search the str and count all the new lines.
                // Could be made more efficent by not counting from 0, but from the first match.
                var newLines = str.substr(0, results.index).match(new RegExp('\r\n|\r|\n', 'g'));

                lines.push(newLines ? newLines.length + 1 : 1);
                
                // 10 matches? Bail out now. No point in returning more
                if (lines.length >= 10) return lines;

            }

            return lines;
        },
        _removeComments: function(a) {
            a = ("__" + a + "__").split("");
            for(var c = !1, d = !1, e = !1, f = !1, g = !1, h = !1, b = 0, k = a.length;b < k;b++) {
                if(e) {
                    "/" === a[b] && "\\" !== a[b - 1] && (e = !1)
                }else {
                    if(c) {
                        "'" === a[b] && "\\" !== a[b - 1] && (c = !1)
                    }else {
                        if(d) {
                            '"' === a[b] && "\\" !== a[b - 1] && (d = !1)
                        }else {
                            if(f) {
                                "*" === a[b] && "/" === a[b + 1] && (a[b + 1] = "", f = !1), "\n" != a[b] && (a[b] = "")
                            }else {
                                if(g) {
                                    if("\n" === a[b + 1] || "\r" === a[b + 1]) {
                                        g = !1
                                    }
                                    a[b] = ""
                                }else {
                                    h ? "@" === a[b - 2] && "*" === a[b - 1] && "/" === a[b] && (h = !1) : (d = '"' === a[b], c = "'" === a[b], "/" === a[b] && ("*" === a[b + 1] && "@" === a[b + 2] ? h = !0 : "*" === a[b + 1] ? (a[b] = "", f = !0) : "/" === a[b + 1] ? (a[b] = "", g = !0) : e = !0))
                                }
                            }
                        }
                    }
                }
            }
            return a.join("").slice(2, -2)
        }
    },

    _filterTableList : function(all, whitelist) {
        var filtered = [];
        
        for (var i = 0; i < all.length; i++) {
            var shouldScan = true; // Assuming we want to copy across
    
            for (var j = 0; j < whitelist.length; j++) {
    
                if (whitelist[j] == all[i].table) {
                    shouldScan = false; // This table is in the whitelist - don't copy it across (and therefore don't scan)
                    break;
                }
            }
            if (shouldScan)
                filtered.push(all[i]);
        }
        return filtered;
    },
    _findMatch: function(search, scriptFieldArr) {
        scriptFieldArr = this._filterTableList(scriptFieldArr, this.WHITELIST);
        var findingsArray = [];
        
        for (var i = 0; i < scriptFieldArr.length; i++) {
            var dict = scriptFieldArr[i];
            this._performMatch(search, dict, findingsArray);
        }
    },
    _performMatch: function(search, dict, findingsArray) {
        var findingsArray = [];
        var table = dict.table;
        var field = dict.field;
        var query = dict.query;
        var negative = dict.negative === true ? dict.negative : false;
        
        var filter = '';
            
        if (typeof search != 'string') {
            // input search must be an array;
            for (var i = 0; i < search.length; i++) {
                if (filter != '') {
                    filter += '^OR';
                }
                filter += field+'MATCH_RGX.*'+search[i]+'.*';
            }
            filter += '^EQ';
        } else {
            filter = field+'MATCH_RGX.*'+search+'.*^EQ';
            search = [search]; // Turn it into an array for line numbers
        }
            
        // Using GlideFilter is significantly faster than using RegExp in a loop (x8)
        // instantiate a filter using the MATCH_RGX condition string operator
        var gf = new GlideFilter(filter, '');
        gf.setCaseSensitive(false);
            
        // check to see if GlideRecord matches condition
        var current = new GlideRecord(table);
        if (current.isValid() == false) {
            // table must be invalid so skip to next
            return;
        }

        current.addActiveQuery();
        
        if (query) {
            //optional query
            current.addEncodedQuery(query);
        }

        current.query();

        current.setEngines(false);
        current.setWorkflow(false);
            
        var theRecord;
        while (current.next()) {
                
            theRecord = current;
            if (theRecord.getRecordClassName() != table) {
                // Reget the record in its proper class
                try {
                    theRecord = new GlideRecord(current.getRecordClassName());
                    theRecord.get(current.getUniqueValue());
                } catch (e) {
                    // Do nothing at the moment.
                }
            }

            // Skip if this is an OOB object
            if (this.version._isOOB(theRecord)) {
                continue;
            }

            // Skip if this is updated by 'system' - most likely an OOB or automatically generated object
            if (this.version._isSystem(theRecord)) {
                continue;
            }

            // this is ok as long as we don't do anything stupid like update the record
            var script = theRecord.getValue(field);

            // Dealing with scripts that are super huge
            try {
                var commentLess = this.scriptUtils._removeComments(script);
                theRecord.setValue(field, commentLess);
            } catch (e) {
                //
            }
                
            // Check each record, but do it FAST
            var match = gf.match(theRecord, true);
            if (match == negative)
                continue;
            
            var override = {};
            
            // Lets look for line numbers
            var msg = [];
            for (var x = 0; x < search.length; x++) {
                var lines = this.scriptUtils._lineMatches(script, search[x]);
                
                if (lines.length == 10)
                    msg.push("There are lots of matches.  Showing the first 10: lines " + lines.join(', '));
                else if (lines.length > 1)
                    msg.push("Found on lines " + lines.slice(0, lines.length - 1).join(', ') + " and " + lines.slice(-1));
                else if (lines.length == 1)
                    msg.push("Found on line " + lines[0]);
            }
            
            if (!override.value) override.value = msg.join('.\n');

            //gs.print(msg.join('.\n'));
                    
            //pie.addFinding(theRecord, override);
            //addFinding(theRecord);
            //gs.print(theRecord.getDisplayValue())
            
            //findings.push(this._addFinding(theRecord));
            //if (findingsArray || findingsArray.length > 0)
                findingsArray.push(this._addFinding(theRecord, override));
            //else 
            //    this._showFinding(theRecord);
        }
        this._showFindings("", findingsArray);
    },
    _getPluginList: function() {
        var plugins = [];
        var pluginGr = new GlideRecord('sys_plugins');
        pluginGr.query();
        while (pluginGr.next()) {
            var pluginId = pluginGr.getValue('source');
            if (this._isPluginActive(pluginId))
                plugins.push(pluginId);
        }
        return pluginId;
    },
    _isPluginActive: function(name) {
        var pm = new GlidePluginManager();
        if(pm.isActive(name) == true){
            return true;
        } else {
            return false;
        }    
    },
    _print: function(s /* String */, keys /* Array */, verbose /* Boolean */) {
        // Similar to gs.log() but will return a string accordingly

        var regex = /\{([0-9]+)\}/g; // Using () for capture groups
        var str = s.replace(regex, function($0, $1) {
            // $1 is the value captured in the group
            return keys[$1]; // replace it with the respective array element
        });
        if (verbose)
            gs.print(str + "\n");

        return str + "\n";
    },
    _propertiesArray: function() {
        var properties = [];

        // Using constants to minimise on typos
        var RATING = {
            ACT:'Act',
            RECOMMEND:'Recommend',
            DISCUSS:'Discuss'
        };
        var CATEGORY = {
            SECURITY:'Security',
            MANAGEABILITY:'Manageability',
            PERFORMANCE:'Performance',
            UX:'User Experience'
        };

        properties.push({
            property_name: 'glide.ui.session_timeout',
            description: 'Session timeout changed',
            default_value: '30',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'change.conflict.relatedservices',
            description: 'Change Conflict Checker on related CIs',
            default_value: 'true',
            category: CATEGORY.MANAGEABILITY,
            product: 'Change',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.basicauth.required.xsd',
            description: 'XSD Request Authorization should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.login.autocomplete',
            description: 'Password Field Autocomplete should be disabled',
            default_value: 'false',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.soap.strict_security',
            description: 'SOAP Request Strict Security should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.basicauth.required.xml',
            description: 'XML Request Authorization should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.db.clone.allow_clone_target',
            description: 'Clone target should not be enabled in production',
            default_value: 'true',
            category: CATEGORY.MANAGEABILITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.script.use.sandbox',
            description: 'Client Generated Scripts Sandbox should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.cookies.http_only',
            description: 'Cookies – HTTP Only should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.sm.default_mode',
            description: 'High Security default mode should be set to "deny"',
            default_value: 'deny',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.client.track_transaction_timings',
            description: 'Client Transaction Timings is not activated',
            default_value: 'true',
            category: CATEGORY.MANAGEABILITY,
            product: 'Platform',
            rating: RATING.DISCUSS
        });
        properties.push({
            property_name: 'glide.ui.escape_html_list_field',
            description: 'Escape HTML should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.basicauth.required.csv',
            description: 'CSV Request Authorization should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.basicauth.required.pdf',
            description: 'PDF Request Authorization should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.outbound.sslv3.disabled',
            description: 'SSLv2/SSLv3 should be disabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.DISCUSS
        });
        properties.push({
            property_name: 'glide.script.secure.ajaxgliderecord',
            description: 'AJAXGlideRecord ACL Checking should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'com.snc.sla.task_sla.log',
            description: 'SLA logging level should be set to "notice"',
            default_value: 'notice',
            category: CATEGORY.MANAGEABILITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.basicauth.required.soap',
            description: 'Basic Auth SOAP Requests setting should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.ui.forgetme',
            description: '"Remove Remember Me" setting should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.basicauth.required.scriptedprocessor',
            description: 'Script Request Authorization should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.ui.escape_all_script',
            description: 'Escape Jelly should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.ui.update_on_iterate',
            description: 'The "update on iterate" system property should be disabled',
            default_value: 'false',
            category: CATEGORY.UX,
            product: 'Platform',
            rating: RATING.DISCUSS
        });
        properties.push({
            property_name: 'glide.ui.security.codetag.allow_script',
            description: '"Allow Javascript tags in Embedded HTML" property should be disabled',
            default_value: 'false',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.script.allow.ajaxevaluate',
            description: 'Enable AJAXEvaluate should be disabled',
            default_value: 'false',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.ui.per_page',
            description: 'The default "system" user preference for "rows per page" should be set to 50 or less',
            default_value: '10,15,20,50',
            category: CATEGORY.PERFORMANCE,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.security.use_csrf_token',
            description: 'Anti-CSRF Token setting should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.ui.goto_use_contains',
            description: 'The "Go To" search should not default to using the "contains" operator',
            default_value: 'false',
            category: CATEGORY.PERFORMANCE,
            product: 'Platform',
            rating: RATING.RECOMMEND
        });
        properties.push({
            property_name: 'glide.ui.escape_text',
            description: 'Escape XML should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.html.sanitize_all_fields',
            description: 'HTML Sanitizer property should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        properties.push({
            property_name: 'glide.ui.security.allow_codetag',
            description: 'Disable Embedded HTML Code property',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.DISCUSS
        });
        properties.push({
            property_name: 'glide.security.strict.actions',
            description: '"Check UI Action Conditions check before Execution" should be enabled',
            default_value: 'true',
            category: CATEGORY.SECURITY,
            product: 'Platform',
            rating: RATING.ACT
        });
        return properties;
    },
    
    type: 'reviewScript'
};

// Adding to the String prototype to capitalize the first character of a word
// Used by the _clean function
String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

// DO NOT DELETE - this is used to run the script
reviewScript.process();
