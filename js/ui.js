/* ══════════════════════════════════════════
   FORTIS — UI e navegação
   Extraído do fortis.js sem alterar lógica
══════════════════════════════════════════ */

function setMode(m,btn){
  ['calc','rel','db'].forEach(function(p){var el=document.getElementById('panel-'+p);if(el)el.style.display=p===m?'block':'none';});
  document.querySelectorAll('.tm-btn').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  if(m==='rel'){propAtual=propAtual||getVals();renderRel();}
  if(m==='db')renderDB();
}

function setSTab(t,btn){
  document.querySelectorAll('.stab-panel').forEach(function(p){p.style.display='none';});
  document.querySelectorAll('.stab').forEach(function(b){b.classList.remove('on');});
  document.getElementById('st-'+t).style.display='block';
  btn.classList.add('on');
}

function onProdChange(){
  var v=document.getElementById('i-prod').value;
  document.getElementById('r-custprod').style.display=(v==='OUTRO')?'flex':'none';
  calc();
}

function setF(t){
  FT=t;
  ['fob','total','kg'].forEach(function(x){document.getElementById('f-'+x).classList.remove('on');});
  document.getElementById('f-'+t).classList.add('on');
  document.getElementById('f-wrap').style.display=t==='fob'?'none':'flex';
  document.getElementById('f-unit').textContent=t==='total'?'R$':'R$/KG';
  calc();
}

function updMg(){
  var v=parseFloat(document.getElementById('i-mg').value);
  document.getElementById('mg-dsp').textContent=v.toFixed(1)+'%';
  document.getElementById('rn').style.left=(v/50*100)+'%';
}

function renderPZ(){
  var dte=document.getElementById('i-dte').value;
  var c=document.getElementById('pz-editor');
  var html='';
  for(var i=0;i<PZ.length;i++){
    var p=PZ[i];
    var ds=(p.a&&p.d>0)?dstr(addD(dte,p.d)):'—';
    html+='<div class="pz-row">'
      +'<input type="checkbox" class="pz-chk" '+(p.a?'checked':'')
      +' onchange="PZ['+i+'].a=this.checked;renderPZ();calc()">'
      +'<input type="number" class="fi" step="1" value="'+p.d
      +'" style="width:64px;opacity:'+(p.a?1:.35)+'"'+(p.a?'':'disabled')
      +' oninput="PZ['+i+'].d=parseInt(this.value)||0;renderPZ();calc()">'
      +'<span class="funit">d</span>'
      +'<span class="pz-date">'+ds+'</span></div>';
  }
  c.innerHTML=html;
}
