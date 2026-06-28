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
