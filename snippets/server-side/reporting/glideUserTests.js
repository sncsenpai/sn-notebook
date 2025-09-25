var user = new GlideUser().getUser('acme.itil');
gs.print(user.getFullName());
gs.print(user.getEmail());
gs.print(user.getManagerName());
gs.print(user.getCompanyRecord().cmn_location)
