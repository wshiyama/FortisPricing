/* ══════════════════════════════════════════
   FORTIS — Bootstrap principal
   Sprint 18
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function(){
S('top-date',new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}));
  document.getElementById('i-dte').value=new Date().toISOString().split('T')[0];
  renderMPEditor();
  renderPZ();
  updMg();
  calc();
  ['ov-send','ov-aprov','ov-repr'].forEach(function(id){
    document.getElementById(id).addEventListener('click',function(e){if(e.target===this)closeOv(id);
});
