/* Sprint 17 — Aprovação / modais
   Movido de fortis.js sem alteração de lógica. */

function openSend(){propAtual=getVals();propAtual._id=uid();document.getElementById('m-vend').value='';document.getElementById('err-vend').style.display='none';document.getElementById('ov-send').classList.add('show');}

function doSend(){var n=document.getElementById('m-vend').value.trim();if(!n){document.getElementById('err-vend').style.display='block';return;}propAtual._status='pendente';propAtual._vendedor=n;propAtual._enviadoEm=new Date().toLocaleString('pt-BR');closeOv('ov-send');renderRel();}

function openAprov(){document.getElementById('m-senha').value='';document.getElementById('m-anome').value='';document.getElementById('err-senha').style.display='none';S('ov-aprov-sub',(propAtual?propAtual.cli||'':'')+' · '+(propAtual?propAtual.prodLabel:''));document.getElementById('ov-aprov').classList.add('show');}

function doAprov(){
  var s=document.getElementById('m-senha').value;
  var perfil=autenticar(s);
  if(!perfil){document.getElementById('err-senha').style.display='block';return;}
  document.getElementById('err-senha').style.display='none';
  var nInput=document.getElementById('m-anome').value.trim();
  var n=nInput||perfil.nome;
  propAtual._status='aprovado';
  propAtual._aprovNome=n+' ('+perfil.role+')';
  propAtual._aprovDt=new Date().toLocaleString('pt-BR');
  propAtual._aprovPerfil=perfil.role;
  saveDB(propAtual);closeOv('ov-aprov');renderRel();
}

function openRepr(){document.getElementById('m-rsenha').value='';document.getElementById('m-motivo').value='';document.getElementById('err-rsenha').style.display='none';document.getElementById('ov-repr').classList.add('show');}

function doRepr(){
  var s=document.getElementById('m-rsenha').value;
  var perfil=autenticar(s);
  if(!perfil){document.getElementById('err-rsenha').style.display='block';return;}
  document.getElementById('err-rsenha').style.display='none';
  propAtual._status='reprovado';
  propAtual._reprMotivo=document.getElementById('m-motivo').value.trim();
  propAtual._reprDt=new Date().toLocaleString('pt-BR');
  propAtual._reprPor=perfil.nome;
  saveDB(propAtual);closeOv('ov-repr');renderRel();
}

function closeOv(id){document.getElementById(id).classList.remove('show');}

function autoNome(s){
  var p=autenticar(s);
  var el=document.getElementById('m-anome');
  if(el)el.value=p?p.nome:'';
}

function autenticar(senha){ return PERFIS[senha]||null; }
