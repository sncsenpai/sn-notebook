var dialogText = "Apparently, this dialogue box is important";
if (typeof spModal != 'undefined') 
{
  spModal.alert(dialogText);
} 
else 
{
  var gm = new GlideModal();
  gm.setTitle("⚠️");
  gm.renderWithContent(dialogText);
}