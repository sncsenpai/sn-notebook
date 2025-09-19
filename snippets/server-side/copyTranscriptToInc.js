/* 
 * Was created as a BR on the interaction_related_record table to only run 
 * for Incidents. So script will get the Sys ID and verify record being 
 * updated is an Incident
 */
   
var sDocId = current.getValue('document_id') || "";
var grIncident = new GlideRecord('incident');
if (grIncident.get(sDocId)) {
  // We have an Incident, so let's get the respective interaction record
  var grInteraction = current.interaction.getRefRecord(); // Returns a GlideRecord
	
  // Update the related Incident
  grIncident.work_notes = "Transcript from Live Chat:\n\n" + grInteraction.getValue('transcript');
  grIncident.update();
}
