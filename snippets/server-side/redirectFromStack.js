// Reference the navigation stack and redirect the user back to the last page they were on
// Normally used in UI Pages in Modals
var urlOnStack = GlideSession.get().getStack().bottom();  
response.sendRedirect(urlOnStack);
