/*
 * Check how long the incident was open from creation to closure
 */
var grIncident = new GlideRecord('incident');
grIncident.addQuery('sys_id', '194e4a633b33e250df96ab9a04e45a21');
grIncident.query();

if (grIncident.next()) {
   gs.log('Opened: ' + grIncident.opened_at);
   gs.log('Closed: ' + grIncident.closed_at);
   gs.log(
      'Difference: ' + 
      gs.calDateDiff(
         grIncident.opened_at,
         grIncident.closed_at,
         false
      )
   );
}
