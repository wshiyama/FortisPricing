/* FORTIS — Engenharia e matérias-primas
   Extraído com segurança do js/fortis.js na Sprint 13.
   Mantém variáveis e funções globais para preservar compatibilidade. */

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
