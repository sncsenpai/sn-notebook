(function() {
  var createCount = 10, created = 0, incident = new GlideRecord('incident');

  while (created < createCount) {
    incident.initialize();
    incident.setValue('short_description', 'Will be child: ' + (created+1));
    incident.setDisplayValue('caller_id', 'Abel Tuter');
    incident.setDisplayValue('assignment_group', 'Software');
    incident.setValue('state', '1');
    incident.insert();
    created++;
  }
})();
