function onLoad() {
    var control = g_form.getControl('priority');
    control.onblur = myOnBlur;
}

function myOnBlur() {
    alert(getMessage('I blurred'));
}
