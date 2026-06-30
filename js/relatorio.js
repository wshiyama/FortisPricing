/* Sprint 16 — Relatório / Impressão
   Funções movidas de js/fortis.js sem alteração de lógica.
*/

function renderRel(){
  var v=propAtual||getVals();
  var aps=v._status||'novo';
  var sl=aps==='aprovado'?'APROVADO':aps==='reprovado'?'REPROVADO':v.mpct>=.10?'APROVADO':v.mpct>=0?'EM ANÁLISE':'REPROVADO';
  var sc=sl==='APROVADO'?'#059669':sl==='REPROVADO'?'#DC2626':'#D97706';
  var sbg=sl==='APROVADO'?'#F0FDF4':sl==='REPROVADO'?'#FEF2F2':'#FFFBEB';
  var mp100=(v.mg*100).toFixed(0);
  var today=new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'long',year:'numeric'});
  S('r-date',today);S('r-ftdate','Gerado em '+today);
  S('r-stline',sl);document.getElementById('r-stline').style.color=sc;
  S('r-cli',v.cli||'—');S('r-prod',v.prodLabel);S('r-qtd',fmt(v.qtd,0)+' kg');
  var ft=v.ft==='fob'?'FOB (por conta do cliente)':v.ft==='total'?'CIF — '+fR(v.fv,0):'CIF — '+fR(v.fkg)+'/kg';
  S('r-frete',ft);S('r-vv',fR(v.vv));S('r-tot',fR(v.vv*v.qtd,0));
  var c1r=document.getElementById('r-c1r'),c2r=document.getElementById('r-c2r');
  if(v.rep1||v.c1>0){c1r.style.display='flex';S('r-c1l',v.rep1||'Rep 1');S('r-c1v',fp(v.c1));}else c1r.style.display='none';
  if(v.rep2||v.c2>0){c2r.style.display='flex';S('r-c2l',v.rep2||'Rep 2');S('r-c2v',fp(v.c2));}else c2r.style.display='none';
  /* Prazos */
  var pz=v.prazosAtivos||[];
  document.getElementById('r-pg').innerHTML=pz.length===0
    ?'<div style="color:#7a8a9e;font-size:12px">À vista</div>'
    :pz.map(function(p,i){return'<div class="wpzit"><div class="wpzn">'+(i+1)+'ª parcela</div><div class="wpzd">'+p.data+'</div><div class="wpzs">'+p.d+' dias</div></div>';}).join('');
  /* Engineering table in report */
  var engRows='';
  if(v.engComps&&v.engComps.length){
    engRows='<table class="w-eng-table"><thead><tr><th>Cód.</th><th>Insumo</th><th>Qtd/kg</th><th>R$ unit.</th><th>Custo/kg</th><th>%VV</th></tr></thead><tbody>';
    v.engComps.forEach(function(c){
      engRows+='<tr><td>'+c.code+'</td><td class="nm">'+c.name+'</td><td>'+fmt(c.qty,6)+'</td><td>'+fR(c.preco)+'</td><td>'+fR(c.custo)+'</td><td>'+fp(v.vv>0?c.custo/v.vv:0)+'</td></tr>';
    });
    engRows+='<tr class="tfoot"><td colspan="4">CUSTO MP TOTAL</td><td>'+fR(v.cmp)+'</td><td>'+fp(v.vv>0?v.cmp/v.vv:0)+'</td></tr></tbody></table>';
  } else {
    engRows='<div style="color:#9a8;font-size:12px">Custo manual: '+fR(v.cmp)+'</div>';
  }
  document.getElementById('r-eng-table').innerHTML=engRows;
  /* Result boxes */
  var mch=v.mpct>=.10?'#059669':v.mpct>=0?'#D97706':'#DC2626';
  var mcbg=v.mpct>=.10?'#F0FDF4':v.mpct>=0?'#FFFBEB':'#FEF2F2';
  document.getElementById('r-res4').innerHTML=
    '<div class="wc4" style="background:'+mcbg+';border:1px solid '+mch+'33"><div class="wc4-l" style="color:'+mch+'">Margem R$/kg</div><div class="wc4-v" style="color:'+mch+'">'+fR(v.mrs)+'</div><div class="wc4-s" style="color:'+mch+'">'+fp(v.mpct)+'</div></div>'
    +'<div class="wc4" style="background:'+mcbg+';border:1px solid '+mch+'33"><div class="wc4-l" style="color:'+mch+'">Resultado Total</div><div class="wc4-v" style="color:'+mch+'">'+fR(v.mrs*v.qtd,0)+'</div><div class="wc4-s" style="color:'+mch+'">'+fmt(v.qtd,0)+' kg</div></div>'
    +'<div class="wc4" style="background:#F8FAFF;border:1px solid #E0E8F4"><div class="wc4-l" style="color:#4a6fa5">Custo Total/kg</div><div class="wc4-v" style="color:#1a1a2e">'+fR(v.cb)+'</div><div class="wc4-s" style="color:#4a6fa5">all-in</div></div>'
    +'<div class="wc4" style="background:#F8FAFF;border:1px solid #E0E8F4"><div class="wc4-l" style="color:#4a6fa5">V.V. Mín. ('+mp100+'%)</div><div class="wc4-v" style="color:#1a1a2e">'+fR(v.vvmin)+'</div><div class="wc4-s" style="color:#4a6fa5">equilíbrio</div></div>';
  S('r-vvlbl','V.V. Mínimo — margem '+mp100+'%');
  S('r-vvform',fR(v.cb)+' ÷ (1 − '+mp100+'%)');
  S('r-vvmin',fR(v.vvmin));
  var stb=document.getElementById('r-stb');
  stb.style.background=sbg;stb.style.border='1px solid '+sc+'30';
  document.getElementById('r-dot').style.background=sc;
  S('r-stxt',sl);document.getElementById('r-stxt').style.color=sc;
  var stamp=document.getElementById('wstamp');
  if(aps==='aprovado'&&v._aprovNome){stamp.classList.add('show');S('st-nome',v._aprovNome);S('st-dt',v._aprovDt||'—');S('st-id',v._id||'—');}
  else stamp.classList.remove('show');
  renderAbar(v);
}

function renderAbar(v){
  var bar=document.getElementById('rel-abar'),btns=document.getElementById('rel-abar-btns');
  var st=v._status||'novo';
  bar.className='rel-bar';if(st==='novo')return;
  bar.classList.add('show');
  if(st==='pendente'){bar.classList.add('pend');S('rel-abar-ttl','⏳ Aguardando aprovação do gestor');S('rel-abar-sub','Enviado por '+v._vendedor+' · '+v._enviadoEm);
    btns.innerHTML='<button class="relbtn" style="background:rgba(46,204,113,.1);border:1px solid rgba(46,204,113,.3);color:var(--ok)" onclick="openAprov()">✓ Aprovar</button><button class="relbtn" style="background:rgba(255,76,76,.1);border:1px solid rgba(255,76,76,.3);color:var(--danger)" onclick="openRepr()">✗ Reprovar</button>';
  }else if(st==='aprovado'){bar.classList.add('aprov');S('rel-abar-ttl','✓ Aprovado por '+v._aprovNome);S('rel-abar-sub',v._aprovDt);btns.innerHTML='';}
  else if(st==='reprovado'){bar.classList.add('repr');S('rel-abar-ttl','✗ Proposta reprovada');S('rel-abar-sub',v._reprMotivo?'Motivo: '+v._reprMotivo:'—');btns.innerHTML='';}
}

function doPrint(){
  propAtual=propAtual||getVals();
  renderRel();
  document.querySelectorAll('.panel').forEach(function(p){p.style.display='none';});
  document.getElementById('panel-rel').style.display='block';
  document.querySelectorAll('.tab').forEach(function(b,i){b.classList.toggle('on',i===2);});
  setTimeout(function(){window.print();},300);
}
