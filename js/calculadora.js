/* ══════════════════════════════════════════
   FORTIS — Calculadora
   Sprint 14: getVals() e calc() movidos de fortis.js
   Lógica preservada.
══════════════════════════════════════════ */

function getVals(){
  var prod=document.getElementById('i-prod').value;
  var custprod=document.getElementById('i-custprod').value.trim();
  var cli=document.getElementById('i-cli').value.trim();
  var vv=parseFloat(document.getElementById('i-vv').value)||0;
  var cmpOverride=parseFloat(document.getElementById('i-cmp-override').value)||0;
  var qtd=parseFloat(document.getElementById('i-qtd').value)||0;
  var c1=(parseFloat(document.getElementById('i-c1').value)||0)/100;
  var c2=(parseFloat(document.getElementById('i-c2').value)||0)/100;
  var rep1=document.getElementById('i-rep1').value.trim();
  var rep2=document.getElementById('i-rep2').value.trim();
  var tm=(parseFloat(document.getElementById('i-taxa').value)||0)/100;
  var adm=parseFloat(document.getElementById('i-adm').value)||0;
  var qp=parseFloat(document.getElementById('i-qprod').value)||0;
  var fv=parseFloat(document.getElementById('i-frete').value)||0;
  var mg=(parseFloat(document.getElementById('i-mg').value)||0)/100;
  var dte=document.getElementById('i-dte').value;

  /* Engenharia */
  var engKey=(prod==='OUTRO'?'OUTRO':prod);
  var engData=ENG[engKey]||{comps:[]};
  var engComps=engData.comps.map(function(c){
    var mp=MP[c.code]||{name:c.code,preco:0};
    var custo=mp.preco*c.qty;
    return{code:c.code,name:mp.name,preco:mp.preco,qty:c.qty,custo:custo};
  });
  var cmpEng=engComps.reduce(function(a,b){return a+b.custo;},0);
  var cmp=cmpOverride>0?cmpOverride:cmpEng;

  /* Frete */
  var fkg=FT==='fob'?0:FT==='total'?(qtd>0?fv/qtd:0):fv;
  /* Prazo / financeiro */
  var at=PZ.filter(function(p){return p.a&&p.d>0;});
  var med=at.length?at.reduce(function(a,b){return a+b.d;},0)/at.length:0;
  var tf=(tm/30)*med;
  /* Comissões e custos */
  var c1v=vv*c1, c2v=vv*c2, cfin=vv*tf;
  var cadm=qp>0?adm/qp:0;
  var cb=cmp+fkg+c1v+c2v+cfin+cadm;
  var mrs=vv-cb, mpct=vv>0?mrs/vv:0;
  var vvmin=(1-mg)>0?cb/(1-mg):0;
  var over=cmp>0?(vv/cmp-1)*100:0;
  var prazosAtivos=at.map(function(p){return{d:p.d,data:dstr(addD(dte,p.d))};});
  var prodLabel=prod==='OUTRO'?custprod:prod;

  return{prod:prod,prodLabel:prodLabel,custprod:custprod,cli:cli,
    vv:vv,cmp:cmp,cmpEng:cmpEng,cmpOverride:cmpOverride,qtd:qtd,
    c1:c1,c2:c2,rep1:rep1,rep2:rep2,tm:tm,adm:adm,qp:qp,fv:fv,mg:mg,ft:FT,
    engComps:engComps,fkg:fkg,med:med,tf:tf,
    c1v:c1v,c2v:c2v,cfin:cfin,cadm:cadm,
    cb:cb,mrs:mrs,mpct:mpct,vvmin:vvmin,over:over,
    prazosAtivos:prazosAtivos,dte:dte};
}

function calc(){
  var v=getVals();
  var mc=v.mpct>=.10?'var(--ok)':v.mpct>=0?'var(--gold)':'var(--danger)';
  var mcH=v.mpct>=.10?'#2ECC71':v.mpct>=0?'#FFD166':'#FF4C4C';
  var sl=v.mpct>=.10?'APROVADO':v.mpct>=0?'ATENÇÃO — MARGEM BAIXA':'REPROVADO — PREJUÍZO';

  /* Top metrics */
  S('mc-mrs-v',fR(v.mrs));SC('mc-mrs-v',mc);S('mc-mrs-s',fp(v.mpct)+' s/ VV');
  document.getElementById('mc-mrs').style.setProperty('--mc',mc);
  S('mc-mpct-v',fp(v.mpct));SC('mc-mpct-v',mc);
  document.getElementById('mc-mpct').style.setProperty('--mc',mc);
  S('mc-tot-v',fR(v.mrs*v.qtd,0));SC('mc-tot-v',v.mrs*v.qtd>=0?'var(--ok)':'var(--danger)');
  S('mc-tot-s',fmt(v.qtd,0)+' kg');
  document.getElementById('mc-tot').style.setProperty('--mc',v.mrs*v.qtd>=0?'var(--ok)':'var(--danger)');

  /* Gauge */
  var gPct=Math.max(0,Math.min(100,v.mpct*100));
  var circ=414.69;
  document.getElementById('gauge-fill').style.strokeDashoffset=circ-(gPct/100)*circ;
  document.getElementById('gauge-fill').style.stroke=mcH;
  S('gauge-pct',fp(v.mpct));SC('gauge-pct',mc);

  /* VV min */
  var mp100=(v.mg*100).toFixed(0);
  S('vvmin-lbl','V.V. Mínimo (margem '+mp100+'%)');
  S('vvmin-form',fR(v.cb)+' ÷ (1 − '+mp100+'%)');
  S('vvmin-val',fR(v.vvmin));

  /* Status */
  var sts=document.getElementById('sts');
  sts.style.background=v.mpct>=.10?'rgba(46,204,113,.08)':v.mpct>=0?'rgba(255,209,102,.08)':'rgba(255,76,76,.08)';
  sts.style.border='1px solid '+(v.mpct>=.10?'rgba(46,204,113,.3)':v.mpct>=0?'rgba(255,209,102,.3)':'rgba(255,76,76,.3)');
  document.getElementById('sts-dot').style.background=mc;
  S('sts-txt',sl);SC('sts-txt',mc);
  S('sts-sub',fR(v.vv)+'/kg → mín. '+fR(v.vvmin)+'/kg');

  /* Engineering breakdown rows (content panel) */
  S('eng-total-badge',fR(v.cmp)+(v.cmpOverride>0?' (manual)':' (engenharia)'));
  var engRows='';
  if(v.engComps.length){
    v.engComps.forEach(function(c){
      var barW=v.cmp>0?Math.min(100,c.custo/v.cmp*100):0;
      var pctTot=v.vv>0?fp(c.custo/v.vv):'—';
      engRows+='<div class="eng-row">'
        +'<span class="eng-code">'+c.code+'</span>'
        +'<span class="eng-name">'+c.name+'</span>'
        +'<span class="eng-qty">'+fmt(c.qty,6)+' un</span>'
        +'<div class="eng-bar-wrap"><div class="eng-bar" style="width:'+barW+'%"></div></div>'
        +'<span class="eng-cost" style="color:var(--txt2)">'+fR(c.custo)+'</span>'
        +'</div>';
    });
    engRows+='<div class="eng-row total-row">'
      +'<span class="eng-code"></span>'
      +'<span class="eng-name" style="font-weight:700;color:var(--warm)">TOTAL CUSTO MP</span>'
      +'<span class="eng-qty"></span>'
      +'<div class="eng-bar-wrap"></div>'
      +'<span class="eng-cost" style="color:var(--warm);font-size:14px">'+fR(v.cmp)+'</span>'
      +'</div>';
  } else {
    engRows='<div style="padding:16px;font-family:var(--mono);font-size:11px;color:var(--txt3);text-align:center">Selecione um produto para ver a engenharia</div>';
  }
  document.getElementById('eng-rows').innerHTML=engRows;

  /* Sidebar eng detail */
  var sideEngRows='';
  v.engComps.forEach(function(c){
    sideEngRows+='<div class="cr"><span class="crl">'+c.name+' <span class="crs">'+fmt(c.qty,6)+' un</span></span><span class="crv">'+fR(c.custo)+'</span></div>';
  });
  document.getElementById('eng-detail-rows').innerHTML=sideEngRows||'<div style="font-family:var(--mono);font-size:10px;color:var(--txt3)">Nenhum componente</div>';
  S('ep-total',fR(v.cmp)+(v.cmpOverride>0?' ★manual':' ★eng'));

  /* Main breakdown bars */
  S('bkd-vv',fR(v.vv));
  S('bkd-mp',fR(v.cmp));S('bkd-mps',v.cmpOverride>0?'manual':'engenharia');
  setBar('bkd-mpb',v.vv>0?v.cmp/v.vv*100:0);S('bkd-mppct',v.vv>0?fp(v.cmp/v.vv):'—');
  var frs=FT==='fob'?'FOB':FT==='total'?'R$'+fmt(v.fv,0)+'÷'+fmt(v.qtd,0)+'kg':'R$/kg';
  S('bkd-fr',fR(v.fkg));S('bkd-frs',frs);
  setBar('bkd-frb',v.vv>0?v.fkg/v.vv*100:0);S('bkd-frpct',v.vv>0?fp(v.fkg/v.vv):'—');
  var cms=(v.rep1||'')+(v.rep1&&v.rep2?' + ':'')+(v.rep2||'')||fp(v.c1+v.c2);
  S('bkd-cm',fR(v.c1v+v.c2v));S('bkd-cms',cms);
  setBar('bkd-cmb',v.vv>0?(v.c1v+v.c2v)/v.vv*100:0);S('bkd-cmpct',v.vv>0?fp((v.c1v+v.c2v)/v.vv):'—');
  S('bkd-fin',fR(v.cfin));S('bkd-fins',fmt(v.med,0)+'d×taxa');
  setBar('bkd-finb',v.vv>0?v.cfin/v.vv*100:0);S('bkd-finpct',v.vv>0?fp(v.cfin/v.vv):'—');
  S('bkd-adm',fR(v.cadm));S('bkd-adms',fR(v.adm,0)+'÷'+fmt(v.qp,0)+'kg');
  setBar('bkd-admb',v.vv>0?v.cadm/v.vv*100:0);S('bkd-admpct',v.vv>0?fp(v.cadm/v.vv):'—');
  S('bkd-ct',fR(v.cb));S('bkd-ctpct',v.vv>0?fp(v.cb/v.vv):'—');
  S('bkd-mg',fR(v.mrs));SC('bkd-mg',mc);
  S('bkd-mgpct',fp(v.mpct));SC('bkd-mgpct',mc);
  setBar('bkd-mgb',v.vv>0?Math.max(0,v.mpct*100):0);

  /* Extra */
  S('mc-mpfr',fR(v.cmp+v.fkg));
  S('mc-over',v.over.toFixed(2)+'%');

  /* Sidebar fixo */
  S('cf-admt',fR(v.adm,0));S('cf-vol',fmt(v.qp,0)+' kg');S('cf-adm',fR(v.cadm));
  /* Sidebar prazo */
  S('dt-med',fmt(v.med,1)+' dias');S('dt-tm',fp(v.tm));S('dt-td',fp(v.tm/30));S('dt-tf',fp(v.tf));S('dt-fv',fR(v.cfin));
}
