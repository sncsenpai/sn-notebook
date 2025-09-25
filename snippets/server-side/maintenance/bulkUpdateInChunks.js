// Example method of breaking down a bulk update into chunks

var nibbleAmount = 1000;
var nibbled = 0;

var gr = new GlideRecord('task'); 
gr.addQuery('state', 'IN', '3,6'); 
gr.query(); 

while((gr.next()) && (nibbled <= nibbleAmount)) {
        gr.active=0; 
        gr.setWorkflow(false); 
        gr.setUseEngines(false); // do not allow approval engines to execute
        gr.update(); 
        nibbled++; 
}
