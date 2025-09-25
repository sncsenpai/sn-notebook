if(g_scratchpad._action_confirmed) {
  return true;
}

var dialog = new GlideModal('glide_modal_confirm', false, 300);
dialog.setTitle(new GwtMessage().getMessage('Confirmation'));
dialog.setPreference('body', new GwtMessage().format("Are you sure to save?"));
dialog.setPreference('focusTrap', true);
dialog.setPreference('onPromptComplete', doComplete);
dialog.setPreference('onPromptCancel', doCancel);

dialog.render();

return false;

function doComplete() {
  g_scratchpad._action_confirmed =  true;
  gsftSubmit(null, g_form.getFormElement(), g_form.getActionName());
}

function doCancel() {
}
