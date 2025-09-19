/* Name: Hex Checker
 * Version: 2
 * Author: sncsenpai
 * Date: 2015-05-01
 *
 * Updates: 
 * 2015-05-04 Improved the debugging presentation and showing the actual display value of the record.
 *
 * Description:
 * Determines if there are any bad hex characters and reports the 
 * affected record. Option to show the entire Hex for the string.
 *
 * Example usage:
 * theTable = "sc_category",
 * theField = "title",
 * theFilter = "sc_catalog=e0d08b13c3330100c8b837659bba8fb4^active=true^parentISNOTEMPTY",
 */

var strDebug = ""; // GLOBAL for debug string

doIt();

function doIt() {
  // Set the parameters for our checks
  var theTable = "",
    theField = "",
    theFilter = "",
    showHex = true,
    showDebug = false;

    /*
     * @param theTable   - this is the affected table to check.
     * @param theField   - which field should we inspect.
     * @param theFilter  - to filter the records for the lookup, the 
                           script will run quicker this way. Leave empty
                           if no filter is required.
     * @param showHex    - when found, do you want to get the Hex values
                           for all the characters in theField.
     * @param showDebug  - more verbose information while the script 
                           runs, in case an issue crops up using this.
     */

  /**************
   * The Script
   * DO NOT change the lines below unless you know what you are doing
   **************/

  if (theTable === "") {
    debug("Please specify a table name!", true);
    return;
  }
  if (theField === "") {
    debug("Please indicate a target field!", true);
    return;
  }

  var sd = new GlideRecord("sys_dictionary");
  sd.addQuery("name", theTable);
  sd.addQuery("element", theField);
  sd.queryNoDomain();
  if (!sd.next()) {
    debug("'" + theField + "' is not a valid field for the '" + theTable + "' table!", true);
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
      strDebug += "\nChecking table '" + theTable + "'";
    } else {
      strDebug += "\nChecking table '" + theTable + "' without filter";
    }
  }

  var displayValue = ""; // The target field
  var theWarning = "";   // Building warning for affected record
  var recordUrl = "";    // Building the URL for affected record
  var strOutput = "";    // For cleaner non-debug output

  while (recordReader._next()) {
    displayValue = recordReader.getValue(theField);
    strDebug += "\n\nChecking record " + cleanValue(recordReader.getDisplayValue()) + "\nValue to check for '" + theField + "' field is '" + cleanValue(displayValue) + "'";
    if (hasControl(displayValue)) {
      recordUrl = gs.getProperty('glide.servlet.uri') + theTable + '.do?sys_id=' + recordReader.getValue('sys_id');
      theWarning = "WARNING: ASCII Control Character(s) Found in: '" + cleanValue(displayValue) + "'";
      if (showDebug) {
        strDebug += "\n" + theWarning + "\nLink: " + recordUrl;
      } else {
        strOutput += "\n" + theWarning + "\nLink: " + recordUrl;
      }
      if (showHex) {
        if (showDebug) {
          strDebug += "\nHex values requested:\n" + getHex(displayValue);
        } else {
          strOutput += "\nHere's your Hex values:\n" + getHex(displayValue);
        }
      }
    }
  }
  // Debug versus Normal output
  showDebug === true ? debug(strDebug, showDebug) : debug(strOutput, true);
}

/*************************
 *  SUPPORTING FUNCTIONS *
 *************************/

function hasControl(strToCheck) {
  // The main controller
  // This function starts looking for a control character in the displayValue.
  // As soon as we find out, we bail out here and return true.
  var i = 0,
    t,
    isControl = false,
    theStr = strToCheck.toString();

  strDebug += "\n'" + cleanValue(strToCheck) + "' passed to hasControl() function";

  for (i; i < theStr.length; i++) {
    t = theStr.charCodeAt(i).toString(16); // get the Hex Value
    strDebug += "\nHex value (so far) for " + theStr.charCodeAt(i) + " at position [" + i + "] is " + t;
    if (t.length < 2) {
      // if it's less than 2 characters then we have a control (non-printing) character
      // 0x00 (NUL), 0x01 (SOH), 0x02 (STX) ... 0x09 (TAB) then 0x0A (LF), 0x0B (VT) ... 0x0F (SI)
      strDebug += "\nHex (0x0" + t + ") is a control character. Getting out.";
      isControl = true;
      break;
    }
  }
  return isControl;
}

function getHex(test) {
  // Only done when requested.
  // showHex = true
  // When we hit an affected record, go through the string and output the respective HEX values
  var i = 0,
    r = "",
    t,
    str = test.toString();

  strDebug += "\nGetting Hex values for " + cleanValue(test);

  for (i = 0; i < str.length; i++) {
    t = str.charCodeAt(i).toString(16);
    r += str[i];
    r += t.length < 2 ? "[0" + t + "] " : "[" + t + "] ";
  }

  if (r.length > 0) {
    return r;
  }
}

function cleanValue(strToClean) {
  // If we encounter any records with a bad Hex, then we want to clean it for output only.
  // Just to keep it presentable.

  var strCleaned = "";
  strCleaned = strToClean.replace(new RegExp("\n", "mg"), "");
  if (strCleaned !== strToClean) {
    strDebug += "\n'" + strCleaned + "' was cleaned to look good here.";
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
