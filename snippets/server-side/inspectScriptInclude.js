(function(fullInspect) {
  // See readme at https://gist.github.com/sncsenpai/d50b71423769300d81c18620d9f18f23
  
	// Config
	var sProperty = "setUpParallelJob", // Change to the necessary prop/function
		oUtil = new SamDeduplicationEngine(); // Change to the necessary script include
	
	// Script
	var _sLogProperty = 'The Script\n';

	if (fullInspect) {
		listProperties();
	} else {
		showProperty(sProperty);
	}

	function showProperty(sProperty) {
		_sLogProperty += sProperty + ": " + oUtil[sProperty] + "\n";
		gs.print(_sLogProperty);
	}

	function listProperties() {
		for (var oProp in oUtil) {
			try {
				_sLogProperty += oProp + ": " + oUtil[oProp] + "\n";
			} catch(e) {
				// do nothing
			}
		}
		gs.print(_sLogProperty);
	}
})(false);
