// For testing change request start/end dates
var grCR = new GlideRecord('change_request');
if (grCR.get('fab220441be265509633fee5d34bcb7d')) {
    applyDateTemplate(grCR);
}

function applyDateTemplate(grChange) {
    var nHowOld = -5,
        nWindow = 1;
    var gdtStartDate = new GlideDateTime();
    gdtStartDate.addDaysUTC(nHowOld);
    var gdtEndDate = new GlideDateTime(gdtStartDate);
    gdtEndDatea.addDaysUTC(nWindow);
    grChange.setValue('start_date', gdtStartDate.getValue());
    grChange.setValue('end_date', gdtEndDate.getValue());
    grChange.update();
}
