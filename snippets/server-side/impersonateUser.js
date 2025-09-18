(function() {
  // Impersonate user
  var userSysId = "sys_id_of_user_record"; 

  var myId = gs.getSession().impersonate(userSysId);

  // Everything from here to "De-impersonate" will be executed in the context of the user
  gs.print("Running as " + gs.getUserName() + "...");
  gs.print( gs.getSession().getEncryptionContext().getSysIds() );

  // De-impersonate
  gs.getSession().impersonate(myId);
  gs.print("...running as " + gs.getUserName());
})();