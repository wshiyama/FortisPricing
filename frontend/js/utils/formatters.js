/* ─── UTILS ─── */
function fmt(v,n){n=n===undefined?2:n;if(v==null||isNaN(v))return'—';return v.toLocaleString('pt-BR',{minimumFractionDigits:n,maximumFractionDigits:n});}
function fp(v){return isNaN(v)?'—':(v*100).toFixed(2)+'%';}
function fR(v,n){n=n===undefined?2:n;return'R$ '+fmt(v,n);}
function S(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
function SC(id,c){var e=document.getElementById(id);if(e)e.style.color=c;}
function uid(){return'FT'+Date.now().toString(36).toUpperCase();}
function addD(ds,days){if(!ds||!days)return null;var d=new Date(ds+'T12:00:00');d.setDate(d.getDate()+parseInt(days));return d;}
function dstr(d){return d?d.toLocaleDateString('pt-BR'):'—';}
function setBar(id,pct){var el=document.getElementById(id);if(el)el.style.width=Math.min(100,Math.max(0,pct))+'%';}
