/*
 * Example script to demonstrate using the impersonation API to update an Incident's
 * comments as an ITIL user.
 */

var old_user = gs.getSession().onlineImpersonate("itil"); // Start
gs.print("old_user: " + old_user);
if (old_user!=null) {
 gs.print("impersonating");
  var incRec = new GlideRecord("incident");
  if (incRec.get("number","INC0012384")) {
    incRec.comments.setJournalEntry("this is fakery");
    incRec.update();
  }
}
gs.getSession().onlineUnimpersonate(); // Stop
