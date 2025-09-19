// A quick way to iterate through all the fields on the form to get values or perform some other logic
// Use it in the browser console
g_form.elements.forEach(function(element) { 
  console.log(element.fieldName, "=", g_form.getValue(element.getID()), ", isVisible=", g_form.isVisible(element, element.getElement()));
});
