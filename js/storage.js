/* ─── BANCO ─── */
function loadDB(){try{return JSON.parse(localStorage.getItem('fortis_db2')||'[]');}catch(e){return[];}}
function saveDB(p){var db=loadDB();var idx=db.findIndex(function(x){return x._id===p._id;});if(idx>=0)db[idx]=p;else db.unshift(p);localStorage.setItem('fortis_db2',JSON.stringify(db));}
function deleteDB(id){var db=loadDB().filter(function(p){return p._id!==id;});localStorage.setItem('fortis_db2',JSON.stringify(db));renderDB();}
function clearDB(){if(!confirm('Apagar todas as propostas?'))return;localStorage.removeItem('fortis_db2');renderDB();}
function renderDB(){
  var db=loadDB();
  var na=db.filter(function(p){return p._status==='aprovado';}).length;
  var nr=db.filter(function(p){return p._status==='reprovado';}).length;
  S('db-cnt',db.length+' propostas — '+na+' aprovada'+(na===1?'':'s')+', '+nr+' reprovada'+(nr===1?'':'s'));
  var body=document.getElementById('db-body');
  if(!db.length){body.innerHTML='<div class="db-empty">Nenhuma proposta registrada.<br>Propostas aprovadas e reprovadas aparecem aqui.</div>';return;}
  var rows=db.map(function(p){
    var st=p._status||'aprovado';
    var tag=st==='aprovado'?'<span class="tag ok">Aprovado</span>':st==='reprovado'?'<span class="tag danger">Reprovado</span>':'<span class="tag pend">Pendente</span>';
    var mc=p.mpct>=.10?'ok':p.mpct>=0?'warn':'danger';
    return'<tr>'
      +'<td style="color:var(--txt3)">'+(p._id||'—')+'</td>'
      +'<td class="nm">'+(p.cli||'—')+'</td>'
      +'<td>'+(p.prodLabel||p.prod)+'</td>'
      +'<td>'+fmt(p.qtd,0)+' kg</td>'
      +'<td>'+fR(p.vv)+'</td>'
      +'<td>'+fR(p.vv*p.qtd,0)+'</td>'
      +'<td><span class="tag '+mc+'">'+fp(p.mpct)+'</span></td>'
      +'<td>'+fR(p.mrs)+'</td>'
      +'<td>'+fR(p.cmp)+'</td>'
      +'<td>'+fR(p.vvmin)+'</td>'
      +'<td>'+tag+'</td>'
      +'<td style="color:var(--acc2)">'+(p._aprovNome||'—')+'</td>'
      +'<td style="color:var(--txt3)">'+(p._aprovDt||'—')+'</td>'
      +'<td><button class="delr" onclick="deleteDB(\''+p._id+'\')" title="Remover">✕</button></td>'
      +'</tr>';
  }).join('');
  body.innerHTML='<div class="dbtw"><table>'
    +'<thead><tr><th>Nº</th><th>Cliente</th><th>Produto</th><th>Qtd</th><th>V.V.</th><th>Total</th><th>Margem%</th><th>Margem R$</th><th>Custo MP</th><th>V.V. Mín.</th><th>Status</th><th>Aprovado por</th><th>Data</th><th></th></tr></thead>'
    +'<tbody>'+rows+'</tbody></table></div>';
}
function exportCSV(){
  var db=loadDB();if(!db.length){alert('Nenhuma proposta.');return;}
  var cols=['Nº','Cliente','Produto','Qtd kg','V.V.','Total','Margem%','Margem R$','Custo MP','V.V. Mínimo','Status','Aprovado por','Data','Vendedor'];
  var rows=db.map(function(p){
    return[p._id,p.cli,p.prodLabel||p.prod,p.qtd,p.vv,(p.vv*p.qtd).toFixed(2),(p.mpct*100).toFixed(2),p.mrs.toFixed(2),p.cmp.toFixed(2),p.vvmin.toFixed(2),p._status,p._aprovNome,p._aprovDt,p._vendedor]
      .map(function(v){return'"'+String(v||'').replace(/"/g,'""')+'"';}).join(';');
  });
  var csv='\uFEFF'+[cols.join(';')].concat(rows).join('\n');
  var a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
  a.download='fortis_propostas_'+new Date().toISOString().slice(0,10)+'.csv';a.click();
}
