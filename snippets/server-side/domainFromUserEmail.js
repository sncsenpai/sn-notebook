// Extract domain name from user email addresses
var reDomain = /@(.+)/g,
    aEmailDomain = [],
    grSysUser = new GlideRecord('sys_user');
grSysUser.addEncodedQuery("emailISNOTEMPTY^nameISNOTEMPTY");
grSysUser.orderBy('name');
grSysUser.setLimit(10);
grSysUser.query();
while (grSysUser.next()) {
    var sEmail = grSysUser.getValue('email');
    var match;
    if ((match = reDomain.exec(sEmail)) !== null) {
        if (aEmailDomain.indexOf(match[1]) == -1) {
            aEmailDomain.push(match[1]);
        }
    }
}

gs.print(aEmailDomain.join("\n"));
