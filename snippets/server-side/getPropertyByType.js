// In this example we are getting the property as an integer
var sess = gs.getSession();
var prop = sess.getIntProperty('change.conflict.next_available.choice_limit');
gs.print(typeof prop + ": " + prop); 
