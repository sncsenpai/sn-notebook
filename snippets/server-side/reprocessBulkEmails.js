gs.log("*** START REPROCESS SCRIPT ***");
var emails = new GlideRecord("sys_email");
emails.addEncodedQuery("mailbox=inbox^type=received-ignored");
email.query();

while (emails._next()) {
	var evt = new GlideRecord('sysevent');
	evt.initialize();
	evt.process_on = gs.nowDateTime();
	evt.name = "email.read";
	evt.parm1 = emails.sys_id;
	evt.insert();
	gs.log('event created to reprocess email "' + emails.subject + '"');	
}
gs.log("*** END REPROCESS SCRIPT ***");
