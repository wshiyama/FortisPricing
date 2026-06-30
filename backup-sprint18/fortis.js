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
/* ─── AUTONOME: preenche nome ao digitar senha ─── */
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
