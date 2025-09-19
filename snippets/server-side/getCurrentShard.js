findIt();

function findIt() {
  var theTable =
    "syslog"; /* DO NOT CHANGE THE LINES BELOW UNLESS YOU KNOW WHAT YOU ARE DOING */ // What table are you after

  var tableRotation = new GlideRecord("sys_table_rotation");
  tableRotation.addQuery("name", theTable);
  tableRotation.query();

  if (tableRotation._next()) {
    gs.print("So '" + theTable + "' is rotated. Getting the current shard...");
    getCurrentShard(tableRotation.getValue("sys_id"));
  } else {
    gs.print("Erm... " + theTable + " is not rotated!");
  }
}

function getCurrentShard(groupSid) {
  var currentTime = new GlideDateTime().getValue();
  var strOutput = "";

  if (groupSid != "") {
    var rotationSchedule = new GlideRecord("sys_table_rotation_schedule");
    rotationSchedule.addEncodedQuery(
      "name=" +
        groupSid +
        "^offline=false^valid_from<" +
        currentTime +
        "^valid_to>" +
        currentTime
    );
    rotationSchedule.query(); //gs.print(rotationSchedule.getEncodedQuery()); // for debug
    while (rotationSchedule._next()) {
      strOutput +=
        "Current shard: " + rotationSchedule.getValue("table_name") + "\n";
      strOutput +=
        "Valid from: " + rotationSchedule.getValue("valid_from") + "\n";
      strOutput += "Valid to: " + rotationSchedule.getValue("valid_to") + "\n";
    }
  } else {
    strOutput +=
      "Oops. Something went wrong with getting the table rotation group. The query that got us here:\n";
    strOutput += rotationSchedule.getEncodedQuery();
  }
  gs.print("\n" + strOutput);
}
