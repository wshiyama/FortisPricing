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
var MP = {
  "1000": {name:"POLIPROPILENO",       preco:13.88},
  "1100": {name:"ÓLEO DE ENCIMAGEM",   preco:7.59},
  "4100": {name:"EMBALAGENS 600g",     preco:0.2068},
  "4201": {name:"EMBALAGEM 9kg",       preco:2.167562},
  "4003": {name:"COLA",                preco:10.87975},
  "9000": {name:"PALETE",              preco:18.0},
  "9001": {name:"CHAPA DE PAPELÃO",    preco:3.0},
  "4002": {name:"STRECHT",             preco:14.9},
  "4004": {name:"CAIXA DE RÁFIA",      preco:9.9},
  "4405": {name:"PALETE PLÁSTICO",     preco:86.0}
};

/* ─── ENGENHARIA DOS PRODUTOS (qty por kg de produto final, da planilha) ─── */
var ENG = {
  "MICROFIBRA 12mm SM": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013},
      {code:"4100", qty:1.6667},
      {code:"4201", qty:0.111111},
      {code:"4003", qty:0.0005},
      {code:"9000", qty:0.00277778},
      {code:"4002", qty:0.00069444}
    ]
  },
  "DRAMIX": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013},
      {code:"4100", qty:1.6667},
      {code:"4201", qty:0.111111},
      {code:"4003", qty:0.0005},
      {code:"9000", qty:0.00277778},
      {code:"9001", qty:0.00173611},
      {code:"4002", qty:0.00069444}
    ]
  },
  "MICROFIBRA 12mm R&R": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013}
    ]
  },
  "GCP": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013},
      {code:"4100", qty:1.6667},
      {code:"4201", qty:0.1111},
      {code:"4003", qty:0.0005},
      {code:"9000", qty:0.0035},
      {code:"4002", qty:0.0007}
    ]
  },
  "TECH4": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013},
      {code:"4100", qty:1.6667},
      {code:"4003", qty:0.0005},
      {code:"9000", qty:0.0028},
      {code:"4002", qty:0.0007}
    ]
  },
  "MICROFIBRA 12mm BAG": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013}
    ]
  },
  "NEOMATEX": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013}
    ]
  },
  "FLINCO": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013}
    ]
  },
  "MICROFIBRA 06mm BAG": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013}
    ]
  },
  "MICROFIBRA 06mm SM": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013},
      {code:"4100", qty:1.6667},
      {code:"4201", qty:0.1111},
      {code:"4003", qty:0.0005},
      {code:"9000", qty:0.00277778},
      {code:"4002", qty:0.0007}
    ]
  },
  "FIBRA CONTINUA 3.3 DTEX": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013}
    ]
  },
  "Fibra Têxtil Branca 80 mm - 2,0 dtex": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013},
      {code:"4004", qty:0.01}
    ]
  },
  "GCPI": {
    comps:[
      {code:"1000", qty:0.987},
      {code:"1100", qty:0.013},
      {code:"4100", qty:1.6667},
      {code:"4201", qty:0.1111},
      {code:"4003", qty:0.0005},
      {code:"4002", qty:0.0007},
      {code:"4405", qty:0.0035}
    ]
  },
  "OUTRO": {comps:[]}
};

/* ─── CUSTO MP DA ENGENHARIA ─── */
function calcEngCusto(prodKey){
  var eng = ENG[prodKey];
  if(!eng) return 0;
  var total = 0;
  eng.comps.forEach(function(c){
    var mp = MP[c.code];
    if(mp) total += mp.preco * c.qty;
  });
  return total;
}

/* ─── RENDER PREÇOS MP EDITOR ─── */
function renderMPEditor(){
  var html = '';
  Object.keys(MP).forEach(function(code){
    var m = MP[code];
    html += '<div class="field-row">'
      +'<div class="fl"><span>'+m.name+'</span><small>Cód. '+code+'</small></div>'
      +'<div class="fc"><input type="number" class="fi w90" step="0.001" value="'+m.preco+'" '
      +'oninput="MP[\''+code+'\'].preco=parseFloat(this.value)||0;calc()" />'
      +'<span class="funit">R$/un</span></div>'
      +'</div>';
  });
  document.getElementById('mp-prices-editor').innerHTML = html;
}

/* ─── INIT MODE/TAB ─── */
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

/* ─── PRAZOS ─── */
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

/* ─── GETVALS ─── */
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

/* ─── MAIN CALC ─── */
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

/* ─── RELATÓRIO ─── */
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

/* ─── PRINT ─── */
function doPrint(){
  propAtual=propAtual||getVals();
  renderRel();
  document.querySelectorAll('.panel').forEach(function(p){p.style.display='none';});
  document.getElementById('panel-rel').style.display='block';
  document.querySelectorAll('.tab').forEach(function(b,i){b.classList.toggle('on',i===2);});
  setTimeout(function(){window.print();},300);
}

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
