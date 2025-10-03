 /**
 * Get Quick Table Stats
 * 
 * @description A javascript snippet to quickly and easily gather record counts
 * 
 * @author Shahed Ali Shah
 * @date 2017-07-03
 * @version 1.3
 * 
 * @param {string} start_time - start range of records to count from. Format: "yyyy-MM-dd hh:mm:ss"
 * @param {string} [end_time] - end range of records to count to. Format: "yyyy-MM-dd hh:mm:ss" (optional)
 * @param {string[]} tasks - list of tables to get count from
 * @param {boolean} allTasks - set to true if you want to get stats for all tables that extend the task 
 *   table. Also, will override the "tasks" array.
 * @returns {void} - outputs results to system log
 * 
 * @todo Add option to get stats for closed records only
 * @todo Change from gs.log to scope friendly alternatives
 * @todo Change from gs.logWarning to throw new Error
 * @todo Return results as object or JSON
 * @todo Turn into self-contained scoped application or script include
 * @todo Paremeterise properly
 *
 */

getStats();

function getStats() {
    var start_time = "2017-01-01 16:59:50",
        end_time = "2017-03-01 23:59:59",
        allTasks = false,
        tasks = ['incident', 'problem', 'change_request', 'sc_request'];

    // VALIDATION
    if (start_time === "") {
        gs.logWarning("You must provide a start time", "LTgetStats");
        return;
    }

    var now = new GlideDateTime();
    if (new GlideDateTime(start_time).after(now)) {
        gs.logWarning("You can't select a start date after today", "LTgetStats")
        return;
    }

    if (end_time !== "" && new GlideDateTime(end_time).after(now)) {
        gs.logWarning("You can't select an end date after today. Resetting to now (" + now + ")", "LTgetStats");
        end_time = now.getValue();
    }

    if ((!tasks.length || tasks.length === 0) && (allTasks == false)) {
        gs.logWarning("You need to specify a task table to get stats for", "LTgetStats");
        return;
    }

    if (allTasks) {
        tasks = getTaskTables();
    }

    // If we got here we passed basic input validation
    var dateRange = start_time + " > DATE";
    if (end_time) {
        dateRange += " < " + end_time;
    }
    gs.info(dateRange, "LTgetStats");

    // Get stats for each table in the array
    tasks.forEach(function(task_table) {
        if (isValidTable(task_table)) {
            var stats = getTableAggregate(task_table, start_time, end_time);
            gs.log(gs.getMessage("For {0}, records created: {1}, records updated: {2}", [stats.table, stats.created, stats.updated]), "LTgetStats");
            //gs.log("For {0}, records created: {1}, records updated: {2}", [stats.table, stats.created, stats.updated], "LTgetStats");
        }
        else {
            gs.logWarning(task_table + " is not a valid table", "LTgetStats");
        }
    });


}

/*************************************************************
 * SUPPORTING FUNCTIONS
 *************************************************************/
 
function getTableAggregate(task_table, start_time, end_time) {
    var startTime = gs.dateGenerate(start_time),
        tableStats = {}; // Use this object to return a tidy response

    // STATS FOR RECORD CREATION
    var target = new GlideAggregate(task_table);
    if (end_time) {
        var endTime = gs.dateGenerate(end_time);
    }
    target.addQuery('sys_created_on', '>', startTime);
    if (end_time) {
        target.addQuery('sys_created_on', '<', endTime);
    }
    target.addAggregate('COUNT');
    target.query();
    tableStats.table = target.getClassDisplayValue(); // While we're here so we don't need another GR lookup
    tableStats.created = 0;
    if (target.next()) {
        tableStats.created = target.getAggregate('COUNT');
    }

    target.dispose();

    // STATS FOR RECORD UPDATES
    target = new GlideAggregate(task_table);
    target.addQuery('sys_updated_on', '>', startTime );
    if (end_time) {
        target.addQuery('sys_updated_on', '<', endTime);
    }
    target.addAggregate('COUNT');
    target.query();
    tableStats.updated = 0;
    if (target.next()) {
        tableStats.updated = target.getAggregate('COUNT');
    }

    return tableStats;
}

function isValidTable(task_table) {
    return gs.tableExists("task_table");
}

function getTaskTables() {
    var tableList = [];

    var taskTables = new GlideRecord("sys_db_object");
    taskTables.addEncodedQuery("super_class.name=task");
    taskTables.orderBy("name");
    taskTables.query();
    while (taskTables.next()) {
        tableList.push(taskTables.getValue("name"));
    }

    return tableList;
}
