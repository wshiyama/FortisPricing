/* ══════════════════════════════════════════
   FORTIS — Calculadora de Precificação v2.0
   Engenharia de Produto real — planilha Mai/2026
══════════════════════════════════════════ */

/* ─── PERFIS COM SENHA ─── */
var PERFIS = {
  "fortis2024":   {nome:"Gestor",             role:"gestor"},
  "dir1@fortis":  {nome:"Diretor 1",           role:"diretor"},
  "dir2@fortis":  {nome:"Diretor 2",           role:"diretor"},
  "dir3@fortis":  {nome:"Diretor 3",           role:"diretor"},
  "tc@fortis":    {nome:"Técnico Comercial",   role:"tecnico"}
};
function autenticar(senha){ return PERFIS[senha]||null; }
// Mantém compatibilidade com código existente
var SENHA="fortis2024";
var FT = "total";
var PZ = [{d:28,a:true},{d:60,a:true},{d:35,a:false},{d:42,a:false},{d:49,a:false},{d:0,a:false}];
var propAtual = null;

/* ─── PREÇOS UNITÁRIOS (editáveis em runtime) ─── */
/* ─── ENGENHARIA DOS PRODUTOS (qty por kg de produto final, da planilha) ─── */
/* ─── CUSTO MP DA ENGENHARIA ─── */
/* ─── RENDER PREÇOS MP EDITOR ─── */
/* ─── INIT MODE/TAB ─── */
/* ─── PRAZOS ─── */
/* ─── GETVALS ─── */
/* ─── MAIN CALC ─── */
/* ─── RELATÓRIO ─── */

/* ─── PRINT ─── */

/* ─── APROVAÇÃO ─── */
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

/* ─── AUTONOME: preenche nome ao digitar senha ─── */
function autoNome(s){
  var p=autenticar(s);
  var el=document.getElementById('m-anome');
  if(el)el.value=p?p.nome:'';
}

/* ─── BACKUP / RESTORE ─── */
function backupDB(){
  var db=loadDB();
  var data={version:'fortis_v2',date:new Date().toISOString(),propostas:db};
  var json=JSON.stringify(data,null,2);
  var a=document.createElement('a');
  a.href='data:application/json;charset=utf-8,'+encodeURIComponent(json);
  a.download='fortis_backup_'+new Date().toISOString().slice(0,10)+'.json';
  a.click();
}
function restoreDB(){
  var input=document.createElement('input');
  input.type='file';input.accept='.json';
  input.onchange=function(e){
    var file=e.target.files[0];if(!file)return;
    var reader=new FileReader();
    reader.onload=function(ev){
      try{
        var data=JSON.parse(ev.target.result);
        var props=data.propostas||data;
        if(!Array.isArray(props)){alert('Arquivo inválido.');return;}
        var cur=loadDB();
        var merged=props.slice();
        cur.forEach(function(p){if(!merged.find(function(x){return x._id===p._id;}))merged.push(p);});
        merged.sort(function(a,b){return(b._id||'').localeCompare(a._id||'');});
        localStorage.setItem('fortis_db2',JSON.stringify(merged));
        renderDB();
        alert('Backup importado! '+props.length+' propostas carregadas.');
      }catch(err){alert('Erro ao ler arquivo: '+err.message);}
    };
    reader.readAsText(file);
  };
  input.click();
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded',function(){
  S('top-date',new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'}));
  document.getElementById('i-dte').value=new Date().toISOString().split('T')[0];
  renderMPEditor();
  renderPZ();
  updMg();
  calc();
  ['ov-send','ov-aprov','ov-repr'].forEach(function(id){
    document.getElementById(id).addEventListener('click',function(e){if(e.target===this)closeOv(id);});
  });
});
