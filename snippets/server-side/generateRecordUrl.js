/* Example 1:
 * Create a relative URL from the existing GlideRecord variable with/without navigation stacking
 * Set `noStack` to `false` to append `&sysparm_stack=[tablename]_list.do` to the generated URL
 */

var noStack = false; 
var url = grRecord.getLink(noStack);
gs.print(url)

/* Example 2:
 * Create a relative URL using parameters with a view in the URL
 * Set the desired view in the last parameter. Leave empty for default view
 */
var sTableName = grRecord.getTableName(),
    sRecordId = grRecord.getUniqueValue(),
    sView = "ess";

var url = gs.generateURL(sTableName, sRecordId, sView)
