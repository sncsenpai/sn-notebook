/* Name: Hex Checker
 * Version: 1.5
 * Author: sncsenpai
 * Date: 2015-05-04
 *
 * Description:
 * 1. Determines if there are any bad hex characters and reports the 
 * affected record.
 * 2. For the affected records, show the entire Hex for the string.
 *
 * @param theTable   - this is the affected table to check.
 * @param theField   - which field should we inspect.
 * @param theFilter  - to filter the records for the lookup, the 
                       script will run quicker this way. Leave empty
                       if no filter is required.
 * @param showHex    - when found, do you want to get the Hex values
                       for all the characters in theField.
 * @param showDebug  - more verbose information while the script 
                       runs, in case an issue crops up using this.
 *
 * Example usage:
 * theTable = "sc_category",
 * theField = "title",
 * theFilter = "sc_catalog=e0d08b13c3330100c8b837659bba8fb4^active=true^parentISNOTEMPTY",
 */

doIt();

function doIt() {
  // Set the parameters for our checks
  var theTable = "sc_category",
    theField = "title",
    theFilter = "",
    showHex = false,
    showDebug = false;

  /*
   *  The Script
   *  DO NOT change the lines below unless you know what you are doing
   */

  if (theTable === "") {
    gs.log("Please specify a table name!");
    return;
  }
  if (theField === "") {
    gs.log("Please indicate a target field");
    return;
  }

  var recordReader = new GlideRecord(theTable);

  // Filter is optional, so don't use it if none provided
  if (theFilter.length > 0) {
    recordReader.addEncodedQuery(theFilter);
  }
  recordReader.query();

  if (recordReader.hasNext()) {
    if (theFilter.length > 0) {
      debug("Checking table '" + theTable + "'", showDebug);
    } else {
      debug("Checking table '" + theTable + "' without filter", showDebug);
    }
  }

  var displayValue = ""; // The target field
  var theWarning = "";   // Building warning for affected record
  var recordUrl = "";    // Building the URL for affected record

  while (recordReader._next()) {
    displayValue = recordReader.getValue(theField);
    debug("Checking record '" + cleanValue(displayValue) + "'", showDebug); // not using showDebug in cleanValue call on purpose
    if (hasControl(displayValue, showDebug)) {
      recordUrl = gs.getProperty('glide.servlet.uri') + theTable + '.do?sys_id=' + recordReader.getValue('sys_id');
      theWarning = "WARNING: ASCII Control Character(s) Found in: '" + cleanValue(displayValue, showDebug) + "'";
      debug("\n" + theWarning + "\nLink: " + recordUrl + "\n", true); // We need this output
      if (showHex) {
        getHex(displayValue, showDebug);
      }
    }
  }
}

/*************************
 *  SUPPORTING FUNCTIONS *
 *************************/

function hasControl(strToCheck, showDebug) {
  // The main controller
  // This function starts looking for a control character in the displayValue.
  // As soon as we find out, we bail out here and return true.
  var i = 0,
    t,
    isControl = false,
    theStr = strToCheck.toString();

  debug("'" + cleanValue(strToCheck) + "' passed to hasControl() function", showDebug);

  for (i; i < theStr.length; i++) {
    t = theStr.charCodeAt(i).toString(16); // get the Hex Value
    debug("Hex value at " + theStr.charCodeAt(i) + " is " + t);
    if (t.length < 2) {
      // if it's less than 2 characters then we have a control (non-printing) character
      // 0x00 (NUL), 0x01 (SOH), 0x02 (STX) ... 0x09 (TAB) then 0x0A (LF), 0x0B (VT) ... 0x0F (SI)
      debug("Hex (0x0" + t + ") is a control character", showDebug);
      isControl = true;
      break;
    }
  }
  return isControl;
}

function getHex(test, showDebug) {
  // Only done when requested.
  // showHex = true
  // When we hit an affected record, go through the string and output the respective HEX values
  var i = 0,
    r = "",
    t,
    str = test.toString();

  debug("Getting Hex values for " + cleanValue(test), showDebug);

  for (i = 0; i < str.length; i++) {
    t = str.charCodeAt(i).toString(16);
    r += str[i];
    r += t.length < 2 ? "[0" + t + "] " : "[" + t + "] ";
  }

  if (r.length > 0) {
    debug("Here's your Hex:\n" + r, tue);
  }
}

function cleanValue(strToClean, showDebug) {
  // If we encounter any records with a bad Hex, then we want to clean it for output only.
  // Just to keep it presentable.
  //debug("Checking if '" + strToClean + "' needs to be cleaned", showDebug);

  var strCleaned = "";
  strCleaned = strToClean.replace(new RegExp("\n", "mg"), "");
  if (strCleaned !== strToClean) {
    debug("'" + strToClean + "' has been cleaned to '" + strCleaned + "' to look good here.", showDebug);
  }
  return strCleaned;
}

function debug(theStatement, showDebug) {
  // Only done when requested.
  // showDebug = true
  // Avoid spamming when running to get records. Only when the TSE wants it.
  if (showDebug) {
    gs.print(theStatement);
  }
}
