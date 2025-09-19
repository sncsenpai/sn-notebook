// Check if a catalogue item has virtual agent support (so can be included as part of topic flow and not popup)
var itemId = "8310be193b7eea90df96ab9a04e45a35", vaVars = {};
var itemJSON = new sn_sc.CatalogConversationHelper().getItem();
vaVars.itemJSON = JSON.stringify(itemJSON);
gs.print(JSON.parse(vaVars.itemJSON).va_support);
