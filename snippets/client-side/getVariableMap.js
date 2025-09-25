/* This only seems to work on the Service Catalog Form
 * not on a form with a variable editor, as not all
 * the variables are pumped out to the variable_map
 */

$j('#variable_map > item').each(function() {
  var varElm = $j(this).attr("qname");
  var varVal = g_form.getValue(varElm).trim();

  if (varVal === '') {
    g_form.setReadOnly(varElm, true);
  }
});
