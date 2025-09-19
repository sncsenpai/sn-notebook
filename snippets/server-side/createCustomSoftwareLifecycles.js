/*
 * This script was really designed for a specific use case where the customer wanted to baseline the 
 * GA date for Software Lifecycle data.
 */

// Populate the aModels array, an example given
var aModels = [
	"Microsoft Visual Studio Tools for Applications 2019 x64 Hosting Support 16.0.31110"
];

var oDate = new GlideDate();
oDate.setValue("2024-09-01"); // Set the desired date
var customDate = oDate;

for (var m = 0; m < aModels.length; m++) {
	var grDiscoModel = new GlideRecord('cmdb_sam_sw_discovery_model');
	grDiscoModel.addQuery('primary_display_name', aModels[m]);
	grDiscoModel.orderBy('sys_created_on');
	grDiscoModel.setLimit(1);
	grDiscoModel.query();

	while (grDiscoModel.next()) {
		var sInstallDate = "";
        var grInstall = new GlideRecord('cmdb_sam_sw_install');
        grInstall.addEncodedQuery('active=true^install_date!=NULL');
        grInstall.addQuery('discovery_model', grDiscoModel.getUniqueValue());
        grInstall.orderBy('install_date');
        grInstall.setLimit(1);
        grInstall.query();
        this._debug("Looking for install date: " + grInstall.getEncodedQuery());
        if (grInstall.next()) {
            sInstallDate = grInstall.getValue('install_date');
        } else {
			sInstallDate = customDate;
		}

		try {
		var grCustomLC = new GlideRecord('sam_custom_sw_product_lifecycle');
        grCustomLC.initialize();

        grCustomLC.norm_version = grDiscoModel.getValue('norm_version');
        grCustomLC.norm_full_version = grDiscoModel.getValue('norm_full_version');
        grCustomLC.lifecycle_phase = 'availability';
        grCustomLC.norm_product = grDiscoModel.getValue('norm_product');
        grCustomLC.edition = grDiscoModel.getValue('norm_edition');
        grCustomLC.lifecycle_type = 'internal';
        grCustomLC.source = 'internal';
        grCustomLC.start_date = sInstallDate;

        var sSysId = grCustomLC.insert();
		gs.print(aModels[m] + ", created");
		}
		catch (e) {
			gs.print(aModels[m] + ", not created");
		}
	}
}

