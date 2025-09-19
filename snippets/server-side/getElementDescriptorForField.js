/*
 * Get the GlideElement for a field while inspecting a GlideRecord
 */
var grIncident = new GlideRecord('incident');
if (grIncident.get('7872d7b13bcc3e90df96ab9a04e45a0e')) { 
	gs.print(grIncident.watch_list);
	var watchList = grIncident.watch_list.getED(); // Returns GlideElement
	gs.print(watchList.getLength());
}
