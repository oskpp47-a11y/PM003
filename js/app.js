if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('sw.js')
      .then(reg=>{
        reg.addEventListener('updatefound',()=>{
          const nw=reg.installing;
          nw.addEventListener('statechange',()=>{
            if(nw.state==='installed'&&navigator.serviceWorker.controller){
              const b=document.getElementById('sw-update-bar');
              if(b)b.style.display='flex';
            }
          });
        });
        document.addEventListener('visibilitychange',()=>{
          if(document.visibilityState==='visible')reg.update();
        });
      }).catch(()=>{});
    // Recargar SOLO UNA VEZ al cambiar de SW (evita loop infinito)
    let _reloaded=false;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(!_reloaded){_reloaded=true;location.reload();}
    });
  });
}

/* ═══════════════════════════════════════
   v23 NEW FEATURES
   ═══════════════════════════════════════ */

/* ── Imprimir ficha ── */
function printRecord(id){
  if(typeof requirePerm==='function'&&!requirePerm('printRecord','Imprimir registros requiere una cuenta')) return;
  const r=R.find(x=>x.id===id);if(!r)return;
  const p=P[r.tipo]||{ico:'📋',lbl:r.tipo,clr:'#6b85ad'};
  const win=window.open('','_blank','width=440,height=640');
  if(!win){snack('⚠️ Permite popups para imprimir','⚠️');return;}
  win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"/>
  <title>Ficha - ${r.nombre}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#111;padding:20px;font-size:13px;background:#fff;}
    .hd{background:linear-gradient(135deg,#1d4ed8,#6366f1);color:#fff;border-radius:12px;padding:16px;margin-bottom:14px;display:flex;align-items:center;gap:12px;}
    .av{width:52px;height:52px;border-radius:12px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0;}
    .nm{font-size:16px;font-weight:800;}.fo{font-size:11px;opacity:.7;font-family:monospace;margin-top:2px;}
    .pg{display:inline-block;background:rgba(255,255,255,.2);padding:2px 10px;border-radius:10px;font-size:10px;font-weight:700;margin-top:4px;}
    .g{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:10px;}
    .c{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 10px;}
    .l{font-size:9px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;}
    .v{font-size:12px;font-weight:600;}
    .full{grid-column:1/-1;}
    .st{display:flex;gap:7px;margin-bottom:10px;flex-wrap:wrap;}
    .b{padding:3px 10px;border-radius:7px;font-size:11px;font-weight:700;}
    .ft{border-top:1px solid #e2e8f0;padding-top:8px;font-size:9px;color:#94a3b8;text-align:center;}
    @media print{body{padding:6px;}}
  </style></head><body>
  <div class="hd">
    <div class="av">${r.photo?`<img src="${r.photo}" style="width:52px;height:52px;border-radius:12px;object-fit:cover"/>`:`${p.ico}`}</div>
    <div><div class="nm">${r.nombre}</div><div class="fo">#${r.id} · ${r.folio}</div><div class="pg">${p.ico} ${p.lbl}</div></div>
  </div>
  <div class="st">
    <div class="b" style="background:${r.estatus==='Activo'?'#dcfce7':r.estatus==='Baja'?'#fee2e2':'#fef9c3'};color:${r.estatus==='Activo'?'#166534':r.estatus==='Baja'?'#991b1b':'#713f12'}">${r.estatus}</div>
    <div class="b" style="background:#dbeafe;color:#1e40af">${r.visita==='Si'?'✅ Visitado':r.visita==='Pendiente'?'⏳ Pendiente':'❌ Sin visita'}</div>
    <div class="b" style="background:#f3f4f6;color:#374151">${r.uso==='Mexico'?'🇲🇽 México':r.uso==='Estados Unidos'?'✈️ USA':r.uso}</div>
  </div>
  <div class="g">
    <div class="c"><div class="l">📞 Teléfono</div><div class="v">${maskPhone(r.tel)}</div></div>
    <div class="c"><div class="l">📅 Nacimiento</div><div class="v">${r.fnac||'—'}</div></div>
    <div class="c full"><div class="l">🏠 Domicilio</div><div class="v">${[r.dom,r.num,r.col].filter(Boolean).join(', ')||'—'}</div></div>
    <div class="c"><div class="l">📍 Sección</div><div class="v">${r.seccion||'—'}</div></div>
    <div class="c"><div class="l">🏘️ Área</div><div class="v">${r.area||'—'}</div></div>
    <div class="c"><div class="l">🗺️ Ruta</div><div class="v">${r.ruta||'—'}</div></div>
    <div class="c full"><div class="l">🆔 CURP</div><div class="v" style="font-family:monospace;font-size:10px">${maskCurp(r.curp)}</div></div>
    ${r.obs?`<div class="c full"><div class="l">📝 Observaciones</div><div class="v">${r.obs}</div></div>`:''}
  </div>
  <div class="ft">Pensionados MX · ${new Date().toLocaleString('es-MX')} · Folio ${r.folio}</div>
  <` + `script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();};<` + `/script>
  
<!-- SHEET: USER MENU -->
<div class="sheet" id="sh-user">
  <div class="hdl"></div>
  <div class="sh-title" id="user-menu-title">Mi cuenta</div>
  <div style="padding:4px 0">
    <div class="user-menu-row" onclick="showSlide('as-creator');closeSheet('sh-user');document.getElementById('auth-screen').style.display='flex'">
      <span class="user-menu-ico">🔑</span>
      <div><div class="user-menu-lbl">Cambiar usuario / contraseña</div><div class="user-menu-sub">Actualizar credenciales de acceso</div></div>
    </div>
    <div class="user-menu-row" id="guest-upgrade-row" style="display:none" onclick="doLogout()">
      <span class="user-menu-ico">🔓</span>
      <div><div class="user-menu-lbl">Iniciar sesión con usuario</div><div class="user-menu-sub">Salir del modo invitado</div></div>
    </div>
    <div class="user-menu-row" onclick="doLogout()">
      <span class="user-menu-ico">🚪</span>
      <div><div class="user-menu-lbl" style="color:var(--red)">Cerrar sesión</div><div class="user-menu-sub">Volver a la pantalla de login</div></div>
    </div>
  </div>
</div>
</div><!-- /app-shell -->
</body></html>`);
  win.document.close();
}

/* ── Compartir registro ── */
function shareRecord(id){
  if(typeof requirePerm==='function'&&!requirePerm('shareRecord','Compartir registros requiere una cuenta')) return;
  const r=R.find(x=>x.id===id);if(!r)return;
  const p=P[r.tipo]||{lbl:r.tipo};
  const txt=`📋 *${r.nombre}*\n🆔 ${r.folio} | ${p.lbl} | ${r.estatus}\n📞 ${r.tel||'Sin tel.'}\n🏠 ${[r.dom,r.num,r.col].filter(Boolean).join(', ')||'Sin domicilio'}${r.seccion?'\n📍 Sec: '+r.seccion:''}${r.area?' · Área: '+r.area:''}${r.ruta?' · Ruta: '+r.ruta:''}`;
  if(navigator.share){navigator.share({title:'Ficha beneficiario',text:txt}).catch(()=>{});}
  else if(navigator.clipboard){navigator.clipboard.writeText(txt).then(()=>snack('📋 Copiado al portapapeles','📋'));}
  else snack('📋 Comparte manualmente','📋');
}

/* ── Plantilla CSV ── */
/* ══ v37: QR del beneficiario ══ */
function showBenefQR(id){
  const r=R.find(x=>x.id===id);if(!r)return;
  const data=`PENSIONADOS MX
Nombre: ${r.nombre}
Folio: ${r.folio}
Programa: ${r.tipo}
Sección: ${r.seccion||'—'}
Estatus: ${r.estatus}`;
  conf2(
    `📱 QR de ${r.nombre.split(' ')[0]}`,
    `<div style="text-align:center;padding:8px 0">
      <div id="benef-qr-box" style="display:inline-block;background:#fff;padding:12px;border-radius:12px;margin-bottom:12px"></div>
      <div style="font-size:11px;color:var(--sft);font-weight:700">Escanea para ver datos del beneficiario</div>
      <div style="font-size:10px;color:var(--mut);margin-top:4px">${r.folio} · ${r.tipo} · Sec.${r.seccion||'—'}</div>
    </div>`,
    null,null
  );
  setTimeout(()=>{
    const box=document.getElementById('benef-qr-box');
    if(!box)return;
    box.innerHTML='';
    if(typeof QRCode!=='undefined'){
      new QRCode(box,{text:data,width:180,height:180,colorDark:'#000',colorLight:'#fff',correctLevel:QRCode.CorrectLevel.M});
    }else{
      box.innerHTML='<div style="color:#666;font-size:12px;padding:20px">QR no disponible<br>sin internet</div>';
    }
  },200);
}

function dlCSVTemplate(){
  const hdr='Folio,Nombre,Programa,Telefono,Domicilio,Numero,Colonia,Seccion,Area,Ruta,CURP,FechaNacimiento,Estatus,Observaciones';
  const ex='F-0001,GARCIA LOPEZ JUAN,PAM,492-000-0000,Calle Juarez,123,Centro,617,Norte,Ruta 1,GALJ800101HZSMRN05,1980-01-01,Activo,Ejemplo';
  const blob=new Blob([hdr+'\n'+ex+'\n'],{type:'text/csv;charset=utf-8;'});
  dlFile('Plantilla_PensionadosMX.csv',URL.createObjectURL(blob),true);
  snack('📥 Plantilla descargada','📥');
}

/* ── Streak (racha diaria) ── */
function _getStreak(){return JSON.parse(localStorage.getItem('px_streak')||'{"last":"","count":0,"best":0}');}
function _updateStreak(){
  const t=today(),s=_getStreak();
  if(s.last===t)return s;
  const yd=new Date();yd.setDate(yd.getDate()-1);
  const ys=yd.toISOString().slice(0,10);
  s.count=s.last===ys?s.count+1:1;
  s.last=t;s.best=Math.max(s.best,s.count);
  localStorage.setItem('px_streak',JSON.stringify(s));
  return s;
}

/* ── Meta del día ── */
function _getMeta(){
  const t=today(),m=JSON.parse(localStorage.getItem('px_meta')||'{"goal":10}');
  m.done=V.filter(v=>v.date===t).reduce((s,v)=>s+(v.people?.length||1),0);
  return m;
}
function setMetaGoal(n){
  const m=_getMeta();m.goal=n;
  localStorage.setItem('px_meta',JSON.stringify({goal:n}));
  renderInicio();snack(`🎯 Meta: ${n} visitas hoy`,'🎯');
  closeConf();
}
function openMetaDialog(){
  const m=_getMeta();
  const btns=[5,10,15,20,25,30].map(n=>`<button onclick="setMetaGoal(${n})" style="flex:1;min-width:40px;padding:10px 4px;background:${m.goal===n?'var(--a)':'var(--s2)'};color:${m.goal===n?'#fff':'var(--txt)'};border:1.5px solid ${m.goal===n?'var(--a)':'var(--b2)'};border-radius:10px;font-size:14px;font-weight:800;cursor:pointer;font-family:var(--fnt)">${n}</button>`).join('');
  conf2('🎯 Meta de visitas hoy',`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:10px">${btns}</div>`,()=>{},'Cerrar');
}

/* ── Nota del día ── */
function openNota(){
  const nota=localStorage.getItem('px_nota')||'';
  conf2('📝 Nota del día',`<textarea id="nota-ta" style="width:100%;height:110px;margin-top:10px;background:var(--s2);border:1.5px solid var(--b2);border-radius:10px;color:var(--txt);font-family:var(--fnt);font-size:13px;padding:10px;resize:none;outline:none" placeholder="Anota lo que necesitas recordar hoy…">${nota}</textarea>`,
    ()=>{const v=document.getElementById('nota-ta')?.value||'';localStorage.setItem('px_nota',v);localStorage.setItem('px_nota_d',today());renderInicio();snack('📝 Nota guardada','📝');},'Guardar');
  setTimeout(()=>document.getElementById('nota-ta')?.focus(),120);
}

/* ── Render widgets inicio ── */
function renderMetaWidgets(){
  const wrap=document.getElementById('meta-wrap');if(!wrap)return;
  const m=_getMeta(),s=_getStreak();
  const pct=m.goal?Math.min(100,Math.round(m.done/m.goal*100)):0;
  const nota=localStorage.getItem('px_nota')||'';
  const notaD=localStorage.getItem('px_nota_d')||'';
  wrap.innerHTML=`
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
    <div style="background:var(--card);border:1px solid var(--b1);border-radius:var(--r);padding:13px 12px;cursor:pointer" onclick="openMetaDialog()">
      <div style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">🎯 Meta del día</div>
      <div style="font-size:26px;font-weight:800;font-family:'JetBrains Mono',monospace;color:${pct>=100?'var(--grn)':'var(--a2)'};line-height:1">${m.done}<span style="font-size:13px;color:var(--mut)">/${m.goal}</span></div>
      <div style="height:5px;background:var(--b2);border-radius:3px;margin-top:8px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${pct>=100?'var(--grn)':'var(--a)'};border-radius:3px;transition:.5s ease"></div>
      </div>
      <div style="font-size:9px;color:var(--mut);margin-top:4px">${pct>=100?'✅ ¡Meta cumplida!':pct+'% completado'}</div>
    </div>
    <div style="background:var(--card);border:1px solid var(--b1);border-radius:var(--r);padding:13px 12px">
      <div style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">🔥 Racha</div>
      <div style="font-size:26px;font-weight:800;font-family:'JetBrains Mono',monospace;color:var(--org);line-height:1">${s.count}<span style="font-size:12px;color:var(--mut)"> días</span></div>
      <div style="font-size:9px;color:var(--mut);margin-top:8px">🏆 Récord personal: ${s.best} días</div>
      <div style="font-size:9px;color:var(--mut);margin-top:3px">${s.count>=7?'🌟 ¡Semana completa!':s.count>=3?'💪 ¡Sigue así!':s.count>=1?'✨ Buen comienzo':'🚀 Empieza hoy'}</div>
    </div>
  </div>
  <div style="background:var(--card);border:1px solid var(--b1);border-left:3px solid var(--amb);border-radius:var(--r);padding:11px 13px;margin-bottom:12px;cursor:pointer" onclick="openNota()">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:${nota&&notaD===today()?'5px':'0'}">
      <span style="font-size:10px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.5px">📝 Nota del día</span>
      <span style="font-size:10px;color:var(--a2);font-weight:700">${nota&&notaD===today()?'Editar':'+ Agregar'}</span>
    </div>
    ${nota&&notaD===today()?`<div style="font-size:12px;color:var(--t2);line-height:1.5">${nota.slice(0,140)}${nota.length>140?'…':''}</div>`:'<div style="font-size:11px;color:var(--mut)">Toca para anotar algo importante…</div>'}
  </div>`;
}

/* ── Render cumpleaños ── */
function renderBdAlert(){
  const wrap=document.getElementById('bd-alert-wrap');if(!wrap)return;
  const hoy=new Date(),mm=hoy.getMonth(),dd=hoy.getDate();
  const cumples=R.filter(r=>{
    if(!r.fnac||r.estatus==='Baja')return false;
    try{
      const[y,m,d]=r.fnac.split('-').map(Number);if(!m||!d)return false;
      let next=new Date(hoy.getFullYear(),m-1,d);
      if(next<hoy)next=new Date(hoy.getFullYear()+1,m-1,d);
      r._bdd=Math.ceil((next-hoy)/(864e5));
      return r._bdd<=7;
    }catch{return false;}
  }).sort((a,b)=>a._bdd-b._bdd);
  if(!cumples.length){wrap.innerHTML='';return;}
  wrap.innerHTML=`<div style="background:linear-gradient(135deg,#1a0a2e,#0d1220);border:1.5px solid #a78bfa;border-radius:var(--r);padding:13px 14px;margin-bottom:12px;cursor:pointer" onclick="openQF('cumples','🎂 Cumpleaños próximos')">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:7px">
      <div style="width:36px;height:36px;border-radius:10px;background:#2d1b69;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🎂</div>
      <div style="flex:1"><div style="font-size:13px;font-weight:800;color:#a78bfa">Cumpleaños próximos</div>
      <div style="font-size:10px;color:var(--sft);margin-top:1px">${cumples.length} en los próximos 7 días</div></div>
      <div style="font-size:26px;font-weight:800;font-family:'JetBrains Mono',monospace;color:#a78bfa">${cumples.length}</div>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:4px">${cumples.map(r=>`<span style="background:#2d1b69;color:#c4b5fd;padding:2px 8px;border-radius:5px;font-size:10px;font-weight:700">${r.nombre.split(' ')[0]} <b style="color:#a78bfa">+${r._bdd}d</b></span>`).join('')}</div>
  </div>`;
}


/* ===== DATA ===== */
const K={r:'px_v10_r',h:'px_v10_h',v:'px_v10_v',e:'px_v10_e'};
let R=JSON.parse(localStorage.getItem(K.r)||'[]');
let H=JSON.parse(localStorage.getItem(K.h)||'[]');
let V=JSON.parse(localStorage.getItem(K.v)||'[]');
let E=JSON.parse(localStorage.getItem(K.e)||'[]');
const _svRBase=()=>localStorage.setItem(K.r,JSON.stringify(R));
function svR(){
  _svRBase();
  // Auto-refresh SIGE chips whenever records change
  if(document.getElementById('sige-chips')&&document.getElementById('p-mapa')?.classList.contains('on')){
    initSigeChips();
  }
}
const svH=()=>localStorage.setItem(K.h,JSON.stringify(H));
const svV=()=>localStorage.setItem(K.v,JSON.stringify(V));
const svE=()=>localStorage.setItem(K.e,JSON.stringify(E));

// ── Section visibility toggle state ──
let seccionesVisible = localStorage.getItem('px_sec_visible') !== 'false'; // default true

// ── Programs ──
const P={
  PAM:{ico:'👴',lbl:'Adulto Mayor',clr:'#60a5fa',bg:'#1e3a5f',cls:'pam'},
  PCD:{ico:'♿',lbl:'Discapacidad',clr:'#4ade80',bg:'#1a3a1a',cls:'pcd'},
  JCF:{ico:'🎓',lbl:'Jovenes',     clr:'#fb923c',bg:'#3d2a08',cls:'jcf'},
  MT: {ico:'👩',lbl:'Madres',      clr:'#f472b6',bg:'#3d1535',cls:'mt'},
  BBJ:{ico:'📚',lbl:'Becas B.J.',  clr:'#a78bfa',bg:'#2a1a50',cls:'bbj'},
};
const pg=t=>P[t]||{ico:'📋',lbl:t,clr:'#6b85ad',bg:'#1a2b48',cls:''};
const USO={
  'Mexico':         {cls:'uso-mx', ico:'🇲🇽',lbl:'Mexico'},
  'Estados Unidos': {cls:'uso-usa',ico:'✈️', lbl:'Migrante USA'},
  'Baja':           {cls:'uso-baja',ico:'🚫',lbl:'Baja'},
  'En revision':    {cls:'uso-rev', ico:'🔍',lbl:'En revision'},
};
const VIS={
  'Si':       {cls:'vis-si',ico:'✅',lbl:'Visitado'},
  'No':       {cls:'vis-no',ico:'❌',lbl:'Sin visita'},
  'Pendiente':{cls:'vis-pe',ico:'⏳',lbl:'Pendiente'},
};
const VSC=['Si','No','Pendiente'];
const USC=['Mexico','Estados Unidos','Baja','En revision'];
const SC={Activo:'bdg-a',Inactivo:'bdg-i',Pendiente:'bdg-p',Baja:'bdg-b'};

/* ===== HELPERS ===== */
const ini=n=>{const p=n.split(' ').filter(Boolean);return p.length>=2?p[0][0]+p[1][0]:n.slice(0,2);};
const today=()=>new Date().toISOString().slice(0,10);
const nowStr=()=>new Date().toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
const fmtD=d=>{if(!d)return'—';try{return new Date(d+'T00:00:00').toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'});}catch{return d;}};
const nxtId=()=>R.length?Math.max(...R.map(r=>r.id))+1:1;
function detectDups(){const fc={};R.forEach(r=>{fc[r.folio]=(fc[r.folio]||0)+1;});R.forEach(r=>{r.dup=fc[r.folio]>1;});}

/* ===== SNACK ===== */
let snkT;
function snack(msg,ico='✓'){
  const el=document.getElementById('snack');
  document.getElementById('snack-ico').textContent=ico;
  document.getElementById('snack-txt').textContent=msg;
  el.classList.add('on');clearTimeout(snkT);
  snkT=setTimeout(()=>el.classList.remove('on'),2400);
}

/* ===== THEMES ===== */
const THEMES=[
  {id:'auto',    nm:'Automático 🌗',bg:'#080c14',bar:'#6366f1',dots:['#60a5fa','#6366f1','#22c55e']},
  {id:'cosmos',  nm:'Cosmos',     bg:'#04080f',bar:'#4d9eff',dots:['#60a5fa','#6366f1','#22c55e']},
  {id:'sige',    nm:'SIGE 🗺',    bg:'#06101e',bar:'#e63946',dots:['#ff6b75','#f4a261','#2a9d8f']},
  {id:'aurora',  nm:'Aurora',     bg:'#03100a',bar:'#10b981',dots:['#34d399','#0d9488','#22c55e']},
  {id:'solar',   nm:'Solar',      bg:'#0f0900',bar:'#f59e0b',dots:['#fbbf24','#f97316','#ef4444']},
  {id:'rose',    nm:'Rosa',       bg:'#0f0409',bar:'#ec4899',dots:['#f472b6','#e879f9','#f43f5e']},
  {id:'arctic',  nm:'Ártico ☀️', bg:'#f4f7fb',bar:'#1558d4',dots:['#1d4ed8','#4f46e5','#15803d']},
  {id:'midnight',nm:'Noche',      bg:'#060610',bar:'#8c94ff',dots:['#b0b8ff','#9c5cff','#28d464']},
  {id:'carbon', nm:'Carbón 🌑',  bg:'#0a0a0a', bar:'#e2e8f0',dots:['#94a3b8','#64748b','#3b82f6']},
  {id:'campo',   nm:'Día Campo ☀️',bg:'#f2f7f0',bar:'#1a7820',dots:['#1a7820','#166030','#0e6824']},
];
let curTheme=localStorage.getItem('px_theme')||'auto';
(()=>{
  // Auto mode: follow iPhone system dark/light
  function resolveTheme(raw){
    if(raw==='auto'||!raw){
      const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
      return dark?'cosmos':'arctic';
    }
    return raw;
  }
  const resolved=resolveTheme(curTheme);
  document.documentElement.setAttribute('data-theme',resolved);
  const t=THEMES.find(x=>x.id===resolved);
  if(t){const el=document.getElementById('meta-tc');if(el)el.content=t.bg;}
  // Listen for system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e=>{
    if(curTheme==='auto') applyTheme('auto');
  });
})();
function applyTheme(id){
  curTheme=id;
  let resolved=id;
  if(id==='auto'){
    const dark=window.matchMedia('(prefers-color-scheme: dark)').matches;
    resolved=dark?'cosmos':'arctic';
  }
  document.documentElement.setAttribute('data-theme',resolved);
  const t=THEMES.find(x=>x.id===resolved);
  const el=document.getElementById('meta-tc');if(el&&t)el.content=t.bg;
  localStorage.setItem('px_theme',id);
  renderThemeG();
  if(id==='auto')snack('🌗 Tema automático (sigue tu iPhone)','🌗');
  else snack('🎨 Tema: '+(t?.nm||id),'🎨');
}
function renderThemeG(){
  const el=document.getElementById('theme-g');if(!el)return;
  el.innerHTML=THEMES.map(t=>`
    <div class="theme-c${curTheme===t.id?' on':''}" onclick="applyTheme('${t.id}')">
      <div class="tc-pre" style="background:${t.bg}">
        <div class="tc-bar" style="background:${t.bar}"></div>
        <div class="tc-dots">${t.dots.map(c=>`<div class="tc-dot" style="background:${c}"></div>`).join('')}</div>
      </div>
      <div class="tc-nm">${t.nm}${curTheme===t.id?' ✓':''}</div>
    </div>`).join('');
}

/* ===== HEADER ===== */
function upHdr(){
  document.getElementById('hdr-n').textContent=R.length;
  const sub=document.getElementById('hdr-sub');if(sub)sub.textContent=new Date().toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'});
}

/* ===== SHEET SYSTEM ===== */
let openSheets=[];
function openSheet(id){
  document.getElementById('modal-bg').classList.add('on');
  document.getElementById(id).classList.add('on');
  if(!openSheets.includes(id))openSheets.push(id);
}
function closeSheet(id){
  document.getElementById(id).classList.remove('on');
  openSheets=openSheets.filter(x=>x!==id);
  if(!openSheets.length)document.getElementById('modal-bg').classList.remove('on');
}
function closeAllSheets(){
  openSheets.forEach(id=>{const el=document.getElementById(id);if(el)el.classList.remove('on');});
  openSheets=[];
  document.getElementById('modal-bg').classList.remove('on');
  document.querySelectorAll('.da-menu').forEach(m=>m.classList.remove('on'));
}
document.getElementById('modal-bg').addEventListener('click',function(e){
  if(e.target===this&&openSheets.length)closeSheet(openSheets[openSheets.length-1]);
});
document.getElementById('theme-btn').addEventListener('click',function(e){
  e.stopPropagation();renderThemeG();openSheet('sh-theme');
});
document.getElementById('appear-btn').addEventListener('click',function(e){
  e.stopPropagation();renderAppearSheet();openSheet('sh-appear');
});

/* ===== NAVIGATION ===== */
const TABS=['inicio','registros','buscar','visitas','estadisticas','descargar','importar','secciones','mapa','historial','accesos','general','admin'];
let curTab='inicio';
function go(tab){
  // Permission check for restricted tabs
  if(typeof can==='function'){
    const _tabPerms={'accesos':'viewAccessLog','importar':'importData','descargar':'exportData','historial':'editRecord','admin':'viewAccessLog'};
    const _perm=_tabPerms[tab];
    if(_perm&&!can(_perm)){
      const _msgs={'accesos':'La bitácora es solo para el administrador','importar':'Importar requiere una cuenta','descargar':'Exportar requiere una cuenta','historial':'El historial requiere una cuenta','admin':'El panel de administración es exclusivo del Creador'};
      if(typeof _showGuestUpgrade==='function')_showGuestUpgrade(_msgs[tab]||'Esta sección requiere una cuenta');
      return;
    }
  }
  curTab=tab;
  // v36: actualizar subtítulo del header según tab
  const _tabNames={inicio:'Panel principal',registros:'Lista de beneficiarios',buscar:'Búsqueda avanzada',visitas:'Control de visitas',estadisticas:'Estadísticas',descargar:'Exportar datos',importar:'Importar datos',secciones:'Secciones electorales',mapa:'Mapa de beneficiarios',historial:'Historial de cambios',accesos:'Bitácora de accesos',general:'Configuración general',admin:'Panel de administrador'};
  const _hdrSub=document.getElementById('hdr-sub-txt');
  if(_hdrSub)_hdrSub.textContent=_tabNames[tab]||tab;
  // Update presence with current tab
  if(typeof presenceUpdateTab==='function') presenceUpdateTab(tab);
  // Update tab position dots
  if(typeof updateTabDots==='function') updateTabDots();
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.getAttribute('onclick')==="go('"+tab+"')"));
  document.querySelectorAll('.pg').forEach(p=>p.classList.remove('on'));
  document.getElementById('p-'+tab).classList.add('on');
  document.querySelectorAll('.nb').forEach(b=>b.classList.remove('on'));
  const nb=document.getElementById('nb-'+tab);if(nb)nb.classList.add('on');
  document.getElementById('main').scrollTop=0;
  const noFab=['estadisticas','descargar','historial','secciones','mapa','importar','accesos','general','admin'].includes(tab);
  document.getElementById('fab').style.display=noFab?'none':'flex';
  render(tab);
}
function render(t){
  if(t==='inicio')        renderInicio();
  if(t==='registros')     {renderList();setTimeout(_wrapRecsForSwipe,100);}
  if(t==='buscar')        initSrch();
  if(t==='visitas')       renderVis();
  if(t==='estadisticas')  renderStats();
  if(t==='descargar')     renderDL();
  if(t==='importar')      renderImportarPg();
  if(t==='secciones')     renderSecPg();
  if(t==='mapa')          {initMapPg();setTimeout(()=>{if(_leafMap)_leafMap.invalidateSize();},350);}
  if(t==='historial')     renderHist();
  if(t==='accesos')       renderAccessLog();
  if(t==='general')       renderGeneral();
  if(t==='admin')         renderAdminPanel();
}

/* ===== RECORD CARD ===== */
function daysSince(dateStr){
  if(!dateStr)return null;
  const d=new Date(dateStr+'T00:00:00'),now=new Date();
  return Math.floor((now-d)/(1000*60*60*24));
}
function recCard(r){
  const p=pg(r.tipo);
  const sc=SC[r.estatus]||'bdg-def';
  const vc=VIS[r.visita]||VIS['Pendiente'];
  const uc=USO[r.uso]||USO['Mexico'];
  const estCls={'Activo':'est-activo','Inactivo':'est-inactivo','Pendiente':'est-pendiente','Baja':'est-baja'}[r.estatus]||'';
  let daysBadge='';
  if(r.visita==='Pendiente'){
    const ds=r.fecha?daysSince(r.fecha):null;
    if(ds!==null){
      const cls=ds>30?'warn':ds>14?'hot':'';
      daysBadge=`<span class="days-badge ${cls}">hace ${ds}d</span>`;
    }
  }
  const avatarHtml=r.photo
    ?`<img class="av-photo" src="${r.photo}" alt="${r.nombre}" style="border:2px solid ${p.clr}50"/>`
    :`<div class="av av-grad" style="--av-clr:${p.clr};--av-bg:${p.bg}">${ini(r.nombre)}</div>`;
  const visIcons={'Si':'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>','No':'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>','Pendiente':'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>'};
  const visIcon=visIcons[r.visita]||'';
  const waIcon='<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.78-.88-2.06-.98s-.47-.15-.67.15-.77.98-.94 1.18-.35.22-.65.07a8.16 8.16 0 01-2.4-1.48 9 9 0 01-1.66-2.07c-.17-.3 0-.46.13-.61s.3-.35.44-.52a2 2 0 00.3-.5.55.55 0 000-.52c-.07-.15-.67-1.62-.92-2.22s-.49-.5-.67-.51h-.57a1.1 1.1 0 00-.8.37A3.35 3.35 0 007 9.38a5.83 5.83 0 001.22 3.08A13.35 13.35 0 0013.35 17a15 15 0 002.05.76 4.93 4.93 0 002.27.14 3.07 3.07 0 002.02-1.42 2.5 2.5 0 00.17-1.42c-.07-.12-.27-.19-.57-.34zM12 2A10 10 0 002.46 16.35L2 22l5.8-.5A10 10 0 1012 2z"/></svg>';
  return `<div class="rec${r.dup?' dup':''} ${estCls}">
    <div class="rec-body" data-id="${r.id}" onclick="batchMode?toggleBatchRec(${r.id}):_toggleRecTray(${r.id})" oncontextmenu="if(!batchMode){enterBatch();toggleBatchRec(${r.id});}return false;">
      <div class="rec-top">
        ${avatarHtml}
        <div class="rec-meta">
          <div class="rec-name" style="${r.txtColor?'color:'+r.txtColor:''}">${r.nombre}</div>
          <div class="rec-folio">${r.folio} · <span style="color:${p.clr}">${p.ico} ${r.tipo}</span>${r.seccion?' · Sec.'+r.seccion:''}${(()=>{if(!r.fnac)return'';try{const a=Math.floor((new Date()-new Date(r.fnac+'T00:00:00'))/(365.25*24*3600*1000));return a>0&&a<120?' · <span class="age-chip">'+a+'a</span>':''}catch{return''}})()}</div>
          <div class="rec-badges-row">
            <span class="bdg ${sc}">${r.estatus}</span>
            ${r.dup?'<span class="dup-tag">DUP</span>':''}
            ${daysBadge}
          </div>
        </div>
      </div>
    </div>
    <div class="rec-acts">
      <button class="ra ${vc.cls}" onclick="cycleVis(${r.id},event)"><span class="ra-ico">${visIcon}</span>${vc.lbl}</button>
      ${r.tel?`<a class="rec-wa-btn" href="https://wa.me/52${r.tel.replace(/[^0-9]/g,'')}" target="_blank" onclick="event.stopPropagation()">${waIcon}</a>`:''}
      <button class="ra ${uc.cls}" onclick="cycleUso(${r.id},event)"><span class="ra-ico">${uc.ico}</span>${uc.lbl}</button>
    </div>
  </div>`;
}
function cycleVis(id,e){
  e.stopPropagation();
  const r=R.find(x=>x.id===id);if(!r)return;
  const prev=r.visita;
  r.visita=VSC[(VSC.indexOf(r.visita)+1)%VSC.length];r.ult=nowStr();
  logCh(r,'VISITA',prev,r.visita,'Cambio rápido');
  svR();svH();
  if(curTab==='inicio')renderInicio();else render(curTab);
  if(navigator.vibrate)navigator.vibrate(r.visita==='Si'?[30,10,30]:25);
  snack(`🚗 Visita: ${r.visita}`,'🚗');
}
function cycleUso(id,e){
  e.stopPropagation();
  const r=R.find(x=>x.id===id);if(!r)return;
  const prev=r.uso;
  r.uso=USC[(USC.indexOf(r.uso)+1)%USC.length];r.ult=nowStr();
  logCh(r,'USO',prev,r.uso,'Cambio rápido');
  svR();svH();render(curTab);
  if(navigator.vibrate)navigator.vibrate(20);
  snack(`🌎 Uso: ${r.uso}`,'🌎');
}

/* ===== SECCIONES TOGGLE ===== */
function toggleSecciones(){
  seccionesVisible=!seccionesVisible;
  localStorage.setItem('px_sec_visible', seccionesVisible ? 'true' : 'false');
  // secciones toggle en inicio desactivado
}
function renderSeccionesToggle(){
  const area=document.getElementById('sec-toggle-area');
  if(!area)return;
  const secciones=[...new Set(R.map(r=>r.seccion).filter(Boolean))].sort();
  if(!secciones.length){area.innerHTML='';return;}
  const total=R.length;
  const btnLabel=seccionesVisible?'Ocultar secciones':'Mostrar secciones';
  const btnIco=seccionesVisible?'▲':'▼';
  let html=`
    <button class="sec-toggle-btn${seccionesVisible?' open':''}" onclick="toggleSecciones()">
      <span style="display:flex;align-items:center;gap:7px">
        <span>📍</span>
        <span>Secciones / Rutas</span>
        <span class="stbadge">${secciones.length}</span>
      </span>
      <span style="display:flex;align-items:center;gap:6px;color:var(--mut);font-size:10px">
        <span>${btnLabel}</span>
        <span class="sti">${btnIco}</span>
      </span>
    </button>
    <div class="sec-list-wrap${seccionesVisible?' open':''}" id="sec-list-inner">`;
  secciones.forEach(sec=>{
    const regs=R.filter(r=>r.seccion===sec);
    const cnt=regs.length;
    const vis=regs.filter(r=>r.visita==='Si'||r.visita==='Sí').length;
    const pend=regs.filter(r=>r.visita==='Pendiente').length;
    const noVis=regs.filter(r=>r.visita==='No').length;
    const usa=regs.filter(r=>r.uso==='Estados Unidos').length;
    const pct=cnt?Math.round(vis/cnt*100):0;
    html+=`<div class="sec-item" onclick="openQF('sec_${sec}','📍 Sección ${sec}')">
      <div class="sec-av">${sec}</div>
      <div style="flex:1;min-width:0">
        <div class="sec-name">Sección ${sec}</div>
        <div style="display:flex;gap:8px;font-size:9px;font-weight:700;margin:3px 0;flex-wrap:wrap">
          <span style="color:var(--grn)">✅ ${vis}</span>
          <span style="color:var(--amb)">⏳ ${pend}</span>
          <span style="color:var(--red)">❌ ${noVis}</span>
          ${usa?`<span style="color:var(--usa)">✈️ ${usa}</span>`:''}
        </div>
        <div class="sec-pbar" style="height:6px">
          <div style="display:flex;height:100%;border-radius:3px;overflow:hidden;gap:1px">
            <div style="width:${cnt?Math.round(vis/cnt*100):0}%;background:var(--grn);transition:width .5s"></div>
            <div style="width:${cnt?Math.round(pend/cnt*100):0}%;background:var(--amb);transition:width .5s"></div>
            <div style="flex:1;background:var(--b2)"></div>
          </div>
        </div>
        <div style="font-size:9px;color:var(--sft);margin-top:3px">${pct}% visitados</div>
      </div>
      <div class="sec-badge">${cnt}</div>
    </div>`;
  });
  html+=`</div>`;
  area.innerHTML=html;
}

/* ===== INICIO ===== */
function renderInicio(){requestAnimationFrame(()=>_renderInicioInner());}
function _renderInicioInner(){
  detectDups();
  const total=R.length,act=R.filter(r=>r.estatus==='Activo').length;
  // v36: actualizar subtítulo header con resumen
  const _sub=document.getElementById('hdr-sub-txt');
  if(_sub)_sub.textContent=total?`${total} beneficiarios · ${act} activos`:'Panel principal';
  const dups=R.filter(r=>r.dup).length,pend=R.filter(r=>r.estatus==='Pendiente').length;
  const usa=R.filter(r=>r.uso==='Estados Unidos').length;
  const visOk=R.filter(r=>r.visita==='Si').length;
  const visPe=R.filter(r=>r.visita==='Pendiente').length;
  const visNo=R.filter(r=>r.visita==='No').length;

  // HERO TOTAL
  document.getElementById('hero-n-total').textContent=total;

  // v17: ALERTA BENEFICIARIOS SIN VISITAR +30 DÍAS
  const sinVisitar30=R.filter(r=>{
    if(r.visita==='Si'||r.estatus==='Baja')return false;
    const ds=r.fecha?daysSince(r.fecha):null;
    return ds!==null&&ds>30;
  });
  const alertWrap=document.getElementById('alert-no-visit-wrap');
  if(alertWrap){
    if(sinVisitar30.length){
      const names=sinVisitar30.slice(0,4).map(r=>`<span>${r.nombre.split(' ')[0]}</span>`).join('');
      const extra=sinVisitar30.length>4?`<span>+${sinVisitar30.length-4} más</span>`:'';
      alertWrap.innerHTML=`<div class="alert-no-visit" onclick="openQF('sin_visita_30','⚠️ Sin visitar +30 días')">
        <div class="alert-header">
          <div class="alert-ico">🚨</div>
          <div style="flex:1"><div class="alert-title">Sin visitar más de 30 días</div><div class="alert-sub">Requieren atención urgente</div></div>
          <div class="alert-count">${sinVisitar30.length}</div>
        </div>
        <div class="alert-names">${names}${extra}</div>
      </div>`;
    }else{alertWrap.innerHTML='';}
  }

  // BARRA DE PROGRESO DE VISITAS
  const pct=total?Math.round(visOk/total*100):0;
  document.getElementById('vis-prog-wrap').innerHTML=`
    <div class="vis-prog-top">
      <span class="vis-prog-title">🚗 Progreso de visitas</span>
      <span class="vis-prog-pct">${pct}%</span>
    </div>
    <div class="vis-prog-bar"><div class="vis-prog-fill" style="width:${pct}%"></div></div>
    <div class="vis-prog-detail">
      <div class="vpd vpd-ok" onclick="openQF('vis_si','✅ Visitados')">✅ ${visOk} visitados</div>
      <div class="vpd vpd-pe" onclick="openQF('vis_pend','⏳ Pendientes')">⏳ ${visPe} pend.</div>
      <div class="vpd vpd-no" onclick="openQF('vis_no','❌ Sin visita')">❌ ${visNo} sin visita</div>
    </div>`;

  // 3 STAT CARDS
  document.getElementById('stats-row3').innerHTML=`
    <div class="scard" onclick="openDupMgr()">
      <div class="scard-ico" style="background:rgba(239,68,68,.15);color:var(--red)">⚠️</div>
      <div class="scard-n" style="color:var(--red)">${dups}</div>
      <div class="scard-l">Duplicados</div>
    </div>
    <div class="scard" onclick="openQF('usa','✈️ Migrantes USA')">
      <div class="scard-ico" style="background:rgba(245,158,11,.15);color:var(--amb)">✈️</div>
      <div class="scard-n" style="color:var(--amb)">${usa}</div>
      <div class="scard-l">Migrantes</div>
    </div>
    <div class="scard" onclick="openQF('pendientes','⏳ Pendientes')">
      <div class="scard-ico" style="background:rgba(249,115,22,.15);color:var(--org)">⏳</div>
      <div class="scard-n" style="color:var(--org)">${pend}</div>
      <div class="scard-l">Pendientes</div>
    </div>`;

  // DONUT removido

  // ACCESOS RÁPIDOS removidos v18
  if(document.getElementById('quick-bar'))document.getElementById('quick-bar').innerHTML='';
  window._qbFns=[];

  // PROGRAMS ROW
  document.getElementById('prog-row').innerHTML=Object.entries(P).map(([k,p])=>{
    const cnt=R.filter(r=>r.tipo===k).length;
    return `<div class="pp ${p.cls}" onclick="openQF('prog_${k}','${p.ico} ${k}')">
      <div class="pp-ico-wrap"><span class="pp-ico">${p.ico}</span></div>
      <div class="pp-code">${k}</div>
      <div class="pp-n">${cnt}</div>
    </div>`;
  }).join('');

  // PENDIENTES
  const pendList=R.filter(r=>r.estatus==='Pendiente').slice(0,3);
  const pw=document.getElementById('pend-wrap');
  if(pendList.length){
    pw.innerHTML=`<div class="sh2">⏳ Pendientes <span class="sh2-n">${pend}</span></div>`+
      pendList.map(r=>{const p=pg(r.tipo);return`<div class="pend-item" onclick="openDet(${r.id})">
        <div class="pend-av">${ini(r.nombre)}</div>
        <div style="flex:1;min-width:0">
          <div class="pend-name">${r.nombre}</div>
          <div class="pend-sub">${r.folio} · ${p.ico} ${r.tipo}</div>
        </div>
        <span class="pend-tag">⏳ Pend.</span>
      </div>`;}).join('')+
      `<button class="btn btn-s" style="font-size:11px;padding:8px;margin-bottom:14px" onclick="openQF('pendientes','⏳ Pendientes')">Ver todos →</button>`;
  }else{pw.innerHTML='';}

  // secciones toggle en inicio desactivado

  renderBdAlert();
  renderMetaWidgets();
  const rec=[...R].reverse().slice(0,4);
  document.getElementById('rc-n').textContent=rec.length;
  document.getElementById('rec-recent').innerHTML=rec.length
    ? rec.map(recCard).join('')
    : '<div class="empty"><div class="empty-ico">📋</div><h3>Sin registros</h3><p>Toca ＋ para agregar</p></div>';
}

function buildHomeDonut(segs,total){
  if(!total)return'<svg width="88" height="88" viewBox="0 0 88 88"><circle cx="44" cy="44" r="34" fill="none" stroke="var(--b2)" stroke-width="12"/></svg>';
  const R2=34,cx=44,cy=44,circ=2*Math.PI*R2;let off=0,paths='';
  segs.forEach(s=>{const dash=circ*s.n/total;paths+=`<circle cx="${cx}" cy="${cy}" r="${R2}" fill="none" stroke="${s.c}" stroke-width="12" stroke-dasharray="${dash} ${circ-dash}" stroke-dashoffset="${-off}" stroke-linecap="round"/>`;off+=dash;});
  return`<svg width="88" height="88" viewBox="0 0 88 88" style="flex-shrink:0"><circle cx="${cx}" cy="${cy}" r="${R2}" fill="none" stroke="var(--b2)" stroke-width="12"/>${paths}<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" fill="var(--txt)" font-size="13" font-weight="800" font-family="JetBrains Mono">${total}</text></svg>`;
}

// QB action helper
function qbAct(i){if(window._qbFns&&window._qbFns[i])window._qbFns[i]();}

/* ===== HOME SEARCH ===== */
let hsqDeb=null;
function onHSQ(){
  const q=(document.getElementById('hsq').value||'').trim();
  document.getElementById('hsq-clr').style.display=q?'flex':'none';
  clearTimeout(hsqDeb);
  if(!q){document.getElementById('hsq-res').style.display='none';return;}
  hsqDeb=setTimeout(()=>{
    const ql=q.toLowerCase();
    const hits=R.filter(r=>r.nombre.toLowerCase().includes(ql)||r.folio.toLowerCase().includes(ql)||(r.tel||'').includes(ql)||(r.seccion||'').includes(ql)||(r.col||'').toLowerCase().includes(ql)||(r.curp||'').toLowerCase().includes(ql)).slice(0,8);
    const el=document.getElementById('hsq-res');
    if(!hits.length){el.innerHTML='<div style="padding:12px;text-align:center;font-size:11px;color:var(--mut)">Sin resultados</div>';el.style.display='block';return;}
    el.innerHTML=hits.map(r=>{const p=pg(r.tipo);const av=r.photo?`<img class="hsr-av" src="${r.photo}" style="object-fit:cover" alt=""/>`:`<div class="hsr-av" style="background:${p.bg};color:${p.clr}">${ini(r.nombre)}</div>`;return`<div class="hsr-item" onclick="clrHSQ();openDet(${r.id})">${av}<div style="flex:1;min-width:0"><div class="hsr-name">${r.nombre}</div><div class="hsr-sub">${r.folio} · ${p.ico} ${r.tipo}</div></div></div>`;}).join('');
    el.style.display='block';
  },120);
}
function clrHSQ(){
  document.getElementById('hsq').value='';
  document.getElementById('hsq-clr').style.display='none';
  document.getElementById('hsq-res').style.display='none';
}
// Close dropdown when tapping outside
document.addEventListener('click',e=>{
  const drop=document.getElementById('hsq-res');
  if(drop&&!drop.contains(e.target)&&e.target.id!=='hsq')drop.style.display='none';
});

/* ===== QF SHEET ===== */
function openQF(filter,title){
  detectDups();
  const map={
    todos:     ()=>R.slice(),
    activos:   ()=>R.filter(r=>r.estatus==='Activo'),
    inactivos: ()=>R.filter(r=>r.estatus==='Inactivo'),
    pendientes:()=>R.filter(r=>r.estatus==='Pendiente'),
    usa:       ()=>R.filter(r=>r.uso==='Estados Unidos'),
    baja:      ()=>R.filter(r=>r.estatus==='Baja'),
    vis_pend:  ()=>R.filter(r=>r.visita==='Pendiente'),
    sin_visita_30: ()=>R.filter(r=>r.visita!=='Si'&&r.estatus!=='Baja'&&r.fecha&&daysSince(r.fecha)>30),
    vis_si:    ()=>R.filter(r=>r.visita==='Si'),
    vis_no:    ()=>R.filter(r=>r.visita==='No'),
    vis_pe:    ()=>R.filter(r=>r.visita==='Pendiente'),
    act:       ()=>R.filter(r=>r.estatus==='Activo'),
  };
  let filtered;
  if(filter.startsWith('prog_'))filtered=R.filter(r=>r.tipo===filter.slice(5));
  else if(filter.startsWith('sec_'))filtered=R.filter(r=>r.seccion===filter.slice(4));
  else filtered=(map[filter]||map.todos)();
  document.getElementById('qf-t').textContent=title||filter;
  document.getElementById('qf-n').textContent=filtered.length+' registros';
  document.getElementById('qf-list').innerHTML=filtered.length
    ? filtered.map(recCard).join('')
    : '<div class="empty"><div class="empty-ico">📋</div><h3>Sin registros</h3><p>No hay elementos en esta categoría</p></div>';
  openSheet('sh-qf');
}

/* ===== LIST ===== */
let fT='todos',fS='todos',fSort='az';
const SORTS=[['az','A–Z'],['za','Z–A'],['rec','Recientes'],['vis','✅ Visitados'],['pend','⏳ Pendiente'],['dsv','⏰ Sin visitar']];
function renderSortBar(){
  const el=document.getElementById('sort-bar');if(!el)return;
  el.innerHTML='<span style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.5px;align-self:center;flex-shrink:0">Orden:</span>'+
    SORTS.map(([v,l])=>`<button class="sort-chip${fSort===v?' on':''}" onclick="fSort='${v}';renderList()">${l}</button>`).join('');
}
function sortRecs(arr){
  const a=[...arr];
  if(fSort==='az')a.sort((x,y)=>x.nombre.localeCompare(y.nombre));
  else if(fSort==='za')a.sort((x,y)=>y.nombre.localeCompare(x.nombre));
  else if(fSort==='rec')a.sort((x,y)=>(y.id||0)-(x.id||0));
  else if(fSort==='vis')a.sort((x,y)=>(x.visita==='Si'?0:1)-(y.visita==='Si'?0:1));
  else if(fSort==='pend')a.sort((x,y)=>(x.visita==='Pendiente'?0:1)-(y.visita==='Pendiente'?0:1));
  else if(fSort==='dsv')a.sort((x,y)=>{
    const da=x.visita==='Si'&&x.ult?daysSince(x.ult.slice(0,10)):999;
    const db=y.visita==='Si'&&y.ult?daysSince(y.ult.slice(0,10)):999;
    return db-da;
  });
  return a;
}
function renderChips(){
  const basic=['todos','PAM','PCD','JCF','MT','BBJ'].map(t=>
    `<button class="chip${fT===t?' on':''}" onclick="fT='${t}';fS='todos';renderList()">${t==='todos'?'Todos':(P[t]?P[t].ico+' '+t:t)}</button>`
  ).join('');
  const secciones=[...new Set(R.map(r=>r.seccion).filter(Boolean))].sort();
  const secChips=secciones.map(s=>
    `<button class="chip${fS===('sec_'+s)?' on':''}" onclick="fS='sec_${s}';fT='todos';renderList()">Sec. ${s}</button>`
  ).join('');
  const extras=[
    ['✈️ USA','usa',fS==='usa'],
    ['⚠️ Dup','dup',fS==='dup'],
    ['✓ Activos','act',fS==='act'],
    ['⏳ Pendientes','vis_pe',fS==='vis_pe'],
    ['❌ Sin visita','vis_no',fS==='vis_no'],
  ].map(([l,v,on])=>`<button class="chip${on?' on':''}" onclick="fS=fS==='${v}'?'todos':'${v}';fT='todos';renderList()">${l}</button>`).join('');
  document.getElementById('chips').innerHTML=basic+extras+secChips;
}
function renderList(){
  detectDups();renderChips();renderSortBar();
  const fl=R.filter(r=>{
    const mt=fT==='todos'||r.tipo===fT;
    let ms=true;
    if(fS==='act')ms=r.estatus==='Activo';
    if(fS==='dup'){detectDups();ms=r.dup;}
    if(fS==='usa')ms=r.uso==='Estados Unidos';
    if(fS==='vis_pe')ms=r.visita==='Pendiente';
    if(fS==='vis_no')ms=r.visita==='No';
    if(fS&&fS.startsWith('sec_'))ms=r.seccion===fS.slice(4);
    return mt&&ms;
  });
  const sorted=sortRecs(fl);
  document.getElementById('list-sh').innerHTML=`Registros <span class="sh2-n">${sorted.length}</span>`;
  const PAGE=60;
  window._listPage=1;
  function renderListPage(){
    const visible=sorted.slice(0,PAGE*window._listPage);
    const hasMore=sorted.length>visible.length;
    document.getElementById('list-recs').innerHTML=visible.map(recCard).join('')+
      (hasMore?`<button class="btn btn-s" style="margin:12px 0;font-size:12px" onclick="window._listPage++;renderListPage()">⬇️ Ver más (${sorted.length-visible.length} restantes)</button>`:'');
  }
  renderListPage();
}

/* ===== TOGGLE GROUP ===== */
const TG={vis:'Pendiente',uso:'Mexico',est:'Activo'};
const TG_CLS={
  vis: {'Si':'on-g','No':'on-r','Pendiente':'on-y'},
  uso: {'Mexico':'on','Estados Unidos':'on-y','Baja':'on-r','En revision':'on-v'},
  est: {'Activo':'on-g','Inactivo':'on-r','Pendiente':'on-y','Baja':'on-r'},
};
function setTG(field,val,btn){
  TG[field]=val;
  btn.closest('.tg').querySelectorAll('.tg-o').forEach(b=>b.classList.remove('on','on-g','on-y','on-r','on-v'));
  btn.classList.add(TG_CLS[field]?.[val]||'on');
}
function setTGVal(field,val){
  TG[field]=val;
  document.querySelectorAll(`#tg-${field} .tg-o`).forEach(b=>{
    b.classList.remove('on','on-g','on-y','on-r','on-v');
    const txt=b.textContent.trim();
    let matches=false;
    if(field==='vis') matches=(val==='Si'&&(txt.includes('Sí')||txt.includes('Si')))||(val==='No'&&txt.includes('No'))||(val==='Pendiente'&&txt.includes('Pend'));
    if(field==='uso') matches=(val==='Mexico'&&txt.includes('MX'))||(val==='Estados Unidos'&&txt.includes('USA'))||(val==='Baja'&&txt.includes('🚫'))||(val==='En revision'&&txt.includes('🔍'));
    if(field==='est') matches=(val==='Activo'&&txt.includes('Activo'))||(val==='Inactivo'&&txt.includes('Inactivo'))||(val==='Pendiente'&&txt.includes('Pend'))||(val==='Baja'&&txt.includes('Baja'));
    if(matches)b.classList.add(TG_CLS[field]?.[val]||'on');
  });
}

/* ===== PHOTO HANDLING ===== */
let currentPhoto=null;
function handlePhotoSel(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    const img=new Image();
    img.onload=()=>{
      const canvas=document.getElementById('photo-canvas');
      const MAX=200;
      let w=img.width,h=img.height;
      if(w>h){if(w>MAX){h=h*MAX/w;w=MAX;}}else{if(h>MAX){w=w*MAX/h;h=MAX;}}
      canvas.width=w;canvas.height=h;
      canvas.getContext('2d').drawImage(img,0,0,w,h);
      currentPhoto=canvas.toDataURL('image/jpeg',0.7);
      const btn=document.getElementById('photo-btn');
      btn.innerHTML=`<img src="${currentPhoto}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0"/><span style="flex:1">Foto seleccionada · <span style="color:var(--red);cursor:pointer" onclick="removePhoto(event)">Quitar</span></span>`;
    };
    img.src=ev.target.result;
  };
  reader.readAsDataURL(file);
}
function removePhoto(e){
  e.stopPropagation();
  currentPhoto=null;
  document.getElementById('photo-btn').innerHTML='<span id="photo-preview-ico">📷</span><span id="photo-btn-lbl">Tomar foto o elegir de galería</span>';
  document.getElementById('e-photo-in').value='';
}

/* ===== BACKUP / RESTORE ===== */
function dlBackupJSON(){
  if(typeof requirePerm==='function'&&!requirePerm('backupData','Crear respaldo requiere una cuenta')) return;
  const backup={version:'v12',fecha:nowStr(),registros:R,historial:H,visitas:V,eventos:E};
  const json=JSON.stringify(backup,null,2);
  const blob=new Blob([json],{type:'application/json'});
  dlFile(`PensionadosMX_backup_${today()}.json`,URL.createObjectURL(blob),true);
  snack('🔒 Respaldo descargado','🔒');
}
function handleRestore(e){
  const file=e.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=ev=>{
    try{
      const bk=JSON.parse(ev.target.result);
      if(!bk.registros)throw new Error('Formato inválido');
      conf2('Restaurar respaldo',`¿Reemplazar todos los datos con el respaldo de ${bk.fecha||'fecha desconocida'}? (${bk.registros.length} registros)`,()=>{
        R=bk.registros||[];H=bk.historial||[];V=bk.visitas||[];E=bk.eventos||[];
        svR();svH();svV();svE();
        detectDups();upHdr();renderInicio();renderChips();renderSFPills();
        snack(`✅ Restaurado: ${R.length} registros`,'✅');
      },'Restaurar');
    }catch(err){snack('❌ Archivo inválido','❌');}
  };
  reader.readAsText(file);
  e.target.value='';
}
let editId=null;
function _autoGPS(){
  // Auto-suggest GPS if navigator available and fields empty
  const latEl=document.getElementById('e-lat');
  const lngEl=document.getElementById('e-lng');
  if(!latEl||!lngEl||latEl.value||lngEl.value)return;
  if(!navigator.geolocation)return;
  navigator.geolocation.getCurrentPosition(function(pos){
    latEl.value=pos.coords.latitude.toFixed(6);
    lngEl.value=pos.coords.longitude.toFixed(6);
    const hint=document.getElementById('gps-auto-hint');
    if(hint){hint.textContent='📍 GPS capturado automáticamente';hint.style.display='block';}
    snack('📍 GPS capturado automáticamente','📍');
  },function(){},{timeout:4000,maximumAge:10000});
}

function openShAdd(){
  if(typeof requirePerm==='function'&&!requirePerm('addRecord','Agregar registros requiere una cuenta')) return;
  editId=null;
  currentPhoto=null;
  document.getElementById('photo-btn').innerHTML='<span>📷</span><span>Tomar foto o elegir de galería</span>';
  document.getElementById('e-photo-in').value='';
  document.getElementById('sh-add-t').textContent='Nuevo Beneficiario';
  document.getElementById('sh-save-btn').textContent='💾 Guardar Beneficiario';
  const _snBtn=document.getElementById('sh-save-new-btn');if(_snBtn)_snBtn.style.display='block';
  document.getElementById('e-reason-wrap').style.display='none';
  ['folio','nombre','tel','dom','num','col','obs','reason','seccion','curp','fnac','area','ruta'].forEach(f=>{
    const el=document.getElementById('e-'+f);if(el)el.value='';
  });
  const _edDisp=document.getElementById('edad-display');if(_edDisp)_edDisp.style.display='none';
  const _latEl=document.getElementById('e-lat');if(_latEl)_latEl.value='';
  const _lngEl=document.getElementById('e-lng');if(_lngEl)_lngEl.value='';
  const _gpsD=document.getElementById('gps-display');if(_gpsD){_gpsD.style.display='none';_gpsD.textContent='';}
  const _gpsTxt=document.getElementById('gps-btn-txt');if(_gpsTxt)_gpsTxt.textContent='Capturar ubicación actual';
  document.getElementById('e-tipo').selectedIndex=0;
  TG.vis='Pendiente';TG.uso='Mexico';TG.est='Activo';
  setTGVal('vis','Pendiente');setTGVal('uso','Mexico');setTGVal('est','Activo');
  // v27: ID editable — nuevo registro
  const nextId = R.length ? Math.max(...R.map(r=>r.id))+1 : 1;
  const idBadge=document.getElementById('form-id-badge');
  if(idBadge) idBadge.style.display='block';
  const idInp=document.getElementById('e-id-manual');
  if(idInp){idInp.value='';idInp.placeholder='Automático ('+nextId+')';}
  const idSub=document.getElementById('form-id-sub');
  const idLbl=document.getElementById('form-id-mode-lbl');
  const idTag=document.getElementById('form-id-mode-tag');
  const idWarn=document.getElementById('form-id-warn');
  if(idSub) idSub.textContent='Deja vacío para asignar automáticamente (#'+nextId+')';
  if(idLbl) idLbl.textContent='🆔 ID DEL SISTEMA — NUEVO REGISTRO';
  if(idTag){ idTag.textContent='NUEVO'; idTag.style.color='rgba(255,255,255,.6)';}
  if(idWarn) idWarn.style.display='none';
  // v14: reset color + hide info panel
  currentTxtColor='';setTxtColor('',null,true);
  showEditInfoToggle(false);
  const eip=document.getElementById('edit-info-panel');if(eip){eip.classList.remove('show');eip.style.maxHeight='0';eip.style.opacity='0';}
  const sb=document.getElementById('save-bar');
  sb.className='save-bar';
  document.getElementById('save-txt').textContent='Los cambios se guardan al presionar Guardar';
  openSheet('sh-add');
  setTimeout(()=>{
    addFieldHints();
    attachAutocomplete('e-col',_coloniasCache);
    attachAutocomplete('e-seccion',_seccionesCache);
    attachAutocomplete('e-ruta',_rutasCache);
    initSheetPullClose('sh-add');
  },100);
}
function openEditSh(id){
  const r=R.find(x=>x.id===id);if(!r)return;
  editId=id;
  currentPhoto=r.photo||null;
  const btn=document.getElementById('photo-btn');
  if(r.photo){btn.innerHTML=`<img src="${r.photo}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0"/><span style="flex:1">Foto cargada · <span style="color:var(--red);cursor:pointer" onclick="removePhoto(event)">Quitar</span></span>`;}
  else{btn.innerHTML='<span>📷</span><span>Tomar foto o elegir de galería</span>';}
  document.getElementById('sh-add-t').textContent='Editar Beneficiario';
  document.getElementById('sh-save-btn').textContent='💾 Guardar Cambios';
  const _snBtnE=document.getElementById('sh-save-new-btn');if(_snBtnE)_snBtnE.style.display='none';
  document.getElementById('e-reason-wrap').style.display='block';
  document.getElementById('e-folio').value=r.folio||'';
  document.getElementById('e-tipo').value=r.tipo||'';
  document.getElementById('e-nombre').value=r.nombre||'';
  document.getElementById('e-tel').value=r.tel||'';
  document.getElementById('e-dom').value=r.dom||'';
  document.getElementById('e-num').value=r.num||'';
  document.getElementById('e-col').value=r.col||'';
  const eObs=document.getElementById('e-obs');if(eObs)eObs.value=r.obs||'';
  const eCurp=document.getElementById('e-curp');if(eCurp)eCurp.value=r.curp||'';
  const eFnac=document.getElementById('e-fnac');if(eFnac){eFnac.value=r.fnac||'';updEdad();}
  const eSecEl=document.getElementById('e-seccion');if(eSecEl)eSecEl.value=r.seccion||'';
  const eAreaEl=document.getElementById('e-area');if(eAreaEl)eAreaEl.value=r.area||'';
  const eRutaEl=document.getElementById('e-ruta');if(eRutaEl)eRutaEl.value=r.ruta||'';
  const eLatEl=document.getElementById('e-lat');if(eLatEl)eLatEl.value=r.lat||'';
  const eLngEl=document.getElementById('e-lng');if(eLngEl)eLngEl.value=r.lng||'';
  const gpsDisp=document.getElementById('gps-display');
  if(gpsDisp){if(r.lat&&r.lng){gpsDisp.style.display='block';gpsDisp.textContent='📍 '+r.lat.toFixed(6)+', '+r.lng.toFixed(6);}else{gpsDisp.style.display='none';gpsDisp.textContent='';}}
  const gpsTxt=document.getElementById('gps-btn-txt');if(gpsTxt)gpsTxt.textContent=r.lat?'Actualizar ubicación':'Capturar ubicación actual';
  document.getElementById('e-reason').value='';
  TG.vis=r.visita||'Pendiente';TG.uso=r.uso||'Mexico';TG.est=r.estatus||'Activo';
  setTGVal('vis',TG.vis);setTGVal('uso',TG.uso);setTGVal('est',TG.est);
  // v27: ID editable — edición
  const _idBadge=document.getElementById('form-id-badge');
  if(_idBadge) _idBadge.style.display='block';
  const _idInp=document.getElementById('e-id-manual');
  if(_idInp){_idInp.value=String(r.id);_idInp.placeholder=String(r.id);}
  const _idSub=document.getElementById('form-id-sub');
  const _idLbl=document.getElementById('form-id-mode-lbl');
  const _idTag=document.getElementById('form-id-mode-tag');
  const _idWarn=document.getElementById('form-id-warn');
  if(_idSub) _idSub.textContent='📂 '+r.folio+' · 📅 Registrado: '+(r.fecha||'—')+(r.ult?' · ✏️ '+r.ult:'');
  if(_idLbl) _idLbl.textContent='🆔 ID DEL SISTEMA — EDITANDO';
  if(_idTag){ _idTag.textContent='ID: #'+r.id; _idTag.style.color='rgba(255,255,255,.8)';}
  if(_idWarn) _idWarn.style.display='none';
  // v14: Color de texto
  currentTxtColor=r.txtColor||'';
  setTxtColor(currentTxtColor,null,true);
  // v16: Show info toggle + render
  showEditInfoToggle(true);
  renderEditInfoPanel(r);
  const sb=document.getElementById('save-bar');
  sb.className='save-bar';
  document.getElementById('save-txt').textContent='Los cambios se guardan al presionar Guardar';
  closeSheet('sh-det');
  setTimeout(()=>openSheet('sh-add'),200);
}
function doSaveRec(){
  if(typeof requirePerm==='function'&&!requirePerm('editRecord','Guardar registros requiere una cuenta')) return;
  const folio=document.getElementById('e-folio').value.trim().toUpperCase();
  const tipo=document.getElementById('e-tipo').value;
  const nombre=document.getElementById('e-nombre').value.trim().toUpperCase();
  if(!folio){snack('⚠️ El folio es requerido','⚠️');return;}
  if(!tipo){snack('⚠️ Selecciona un programa','⚠️');return;}
  if(!nombre){snack('⚠️ El nombre es requerido','⚠️');return;}
  // v36: Validación CURP
  const _curpRaw=(document.getElementById('e-curp')?.value||'').trim().toUpperCase();
  if(_curpRaw && !/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$/.test(_curpRaw)){
    snack('⚠️ CURP inválido — 18 caracteres (ej: GAEJ800101HZSMRN05)','⚠️');
    document.getElementById('e-curp')?.focus();return;
  }
  const sb=document.getElementById('save-bar');
  sb.className='save-bar saving';
  document.getElementById('save-txt').textContent='Guardando…';
  const nd={
    folio,tipo,nombre,
    tel:    (()=>{
    const t=document.getElementById('e-tel').value.trim().replace(/[^0-9]/g,'');
    if(t.length===10)return t.slice(0,3)+'-'+t.slice(3,6)+'-'+t.slice(6);
    if(t.length===12&&t.startsWith('52'))return t.slice(2,5)+'-'+t.slice(5,8)+'-'+t.slice(8);
    return t?document.getElementById('e-tel').value.trim().replace(/[^0-9\-\+\(\)\s]/g,''):'';
  })(),
    dom:    document.getElementById('e-dom').value.trim(),
    num:    document.getElementById('e-num').value.trim(),
    col:    document.getElementById('e-col').value.trim(),
    visita: TG.vis,
    uso:    TG.uso,
    estatus:TG.est,
    obs:    document.getElementById('e-obs')?.value?.trim()||'',
    seccion:document.getElementById('e-seccion')?.value?.trim()||'',
    area:   document.getElementById('e-area')?.value?.trim()||'',
    ruta:   document.getElementById('e-ruta')?.value?.trim()||'',
    idm:    document.getElementById('e-id-manual')?.value?.trim()||'',
    photo:  currentPhoto||null,
    txtColor: currentTxtColor||'',
    curp:   (document.getElementById('e-curp')?.value||'').trim().toUpperCase(),
    fnac:   document.getElementById('e-fnac')?.value||'',
    lat:    parseFloat(document.getElementById('e-lat')?.value||'')||null,
    lng:    parseFloat(document.getElementById('e-lng')?.value||'')||null,
  };
  if(editId){
    const r=R.find(x=>x.id===editId);
    if(!r){snack('Error: registro no encontrado','❌');return;}
    const old={...r};
    const reason=document.getElementById('e-reason').value.trim();
    // v27: handle manual ID change in edit mode
    const _newIdRaw=parseInt(nd.idm||'');
    let _idChanged=false;
    if(!isNaN(_newIdRaw)&&_newIdRaw>0&&_newIdRaw!==r.id){
      if(R.find(x=>x.id===_newIdRaw&&x.id!==r.id)){
        snack('⚠️ ID #'+_newIdRaw+' ya está en uso','⚠️');
        document.getElementById('form-id-warn').style.display='block';
        const sb2=document.getElementById('save-bar');
        sb2.className='save-bar';
        document.getElementById('save-txt').textContent='Los cambios se guardan al presionar Guardar';
        return;
      }
      r.id=_newIdRaw;
      _idChanged=true;
    }
    delete nd.idm;
    const changes=[];
    if(_idChanged)changes.push('ID: "'+old.id+'" → "'+r.id+'"');
    Object.keys(nd).forEach(c=>{if(old[c]!==nd[c])changes.push(`${c.toUpperCase()}: "${old[c]||'—'}" → "${nd[c]||'—'}"`);});
    if(changes.length){
      H.push({id:Date.now(),folio:nd.folio,nombre:nd.nombre,cambios:changes.join(' | '),motivo:reason||'Sin motivo',resp:'Usuario',fecha:nowStr(),tipo:'edit'});
      svH();
    }
    Object.assign(r,nd);r.ult=nowStr();
  }else{
    const _im=parseInt(nd.idm||'');
    const _useId=(!isNaN(_im)&&_im>0&&!R.find(x=>x.id===_im))?_im:nxtId();
    delete nd.idm;
    const rec={id:_useId,fecha:today(),ult:'',dup:false,...nd};
    R.push(rec);
    H.push({id:Date.now(),folio:nd.folio,nombre:nd.nombre,cambios:'Beneficiario registrado · ID #'+_useId,motivo:'Nuevo registro',resp:'Usuario',fecha:nowStr(),tipo:'new'});
    svH();
  }
  detectDups();svR();
  setTimeout(()=>{
    sb.className='save-bar saved';
    document.getElementById('save-txt').textContent='✓ Guardado correctamente';
    setTimeout(()=>closeSheet('sh-add'),600);
  },300);
  render(curTab);upHdr();
  snack(editId?`💾 ${nd.nombre.split(' ')[0]} actualizado`:`✅ ${nd.nombre.split(' ')[0]} registrado`,editId?'💾':'✅');
}
function logCh(r,campo,ant,nuevo,motivo){
  H.push({id:Date.now(),folio:r.folio,nombre:r.nombre,cambios:`${campo}: "${ant}" → "${nuevo}"`,motivo,resp:'Usuario',fecha:nowStr(),tipo:'edit'});
}

/* ===== DETAIL ===== */
// ── Navigation memory — tracks origin tab and scroll position ──
let _detOriginTab = 'inicio';
let _detOriginScroll = 0;
let _detOriginLabel = 'Inicio';

const TAB_LABELS = {
  inicio:       'Inicio',
  registros:    'Lista',
  buscar:       'Búsqueda',
  visitas:      'Visitas',
  estadisticas: 'Stats',
  descargar:    'Exportar',
  secciones:    'Secciones',
  historial:    'Historial',
  accesos:      'Accesos',
  general:      'General',
  admin:        'Admin',
};

function closeDet(){
  closeSheet('sh-det');
  // Restore scroll position after sheet closes
  setTimeout(()=>{
    const main=document.getElementById('main');
    if(main) main.scrollTop=_detOriginScroll;
  }, 320);
  if(navigator.vibrate) navigator.vibrate(8);
}

function openDet(id){
  // Capture where we came from
  _detOriginTab    = curTab;
  _detOriginLabel  = TAB_LABELS[curTab] || 'Volver';
  const main       = document.getElementById('main');
  _detOriginScroll = main ? main.scrollTop : 0;

  const r=R.find(x=>x.id===id);if(!r)return;
  detectDups();
  const p=pg(r.tipo),sc=SC[r.estatus]||'bdg-def';
  const vc=VIS[r.visita]||VIS['Pendiente'],uc=USO[r.uso]||USO['Mexico'];
  const rH=H.filter(h=>h.folio===r.folio).slice(-4).reverse();
  const histHtml=rH.length?`
    <div class="sh2" style="margin-bottom:8px">Últimos cambios</div>
    <div style="margin-bottom:12px">${rH.map(h=>`
      <div class="tl-item">
        <div class="tl-dot">${h.tipo==='new'?'✨':h.tipo==='del'?'🗑️':'✏️'}</div>
        <div><div class="tl-txt">${h.cambios}</div><div class="tl-date">${h.fecha} · ${h.motivo}</div></div>
      </div>`).join('')}</div>`:'';
  const avatarDetHtml=r.photo
    ?`<img class="det-av-photo" src="${r.photo}" alt="${r.nombre}"/>`
    :`<div class="det-av" style="background:${p.bg};color:${p.clr}">${ini(r.nombre)}</div>`;
  // Calcular edad
  const edadStr=r.fnac?(()=>{const n=new Date(r.fnac+'T00:00:00'),h=new Date();let a=h.getFullYear()-n.getFullYear();if(h.getMonth()-n.getMonth()<0||(h.getMonth()===n.getMonth()&&h.getDate()<n.getDate()))a--;return a+' años';})():'';
  document.getElementById('det-body').innerHTML=`
    <div class="det-hero" style="background:linear-gradient(135deg,${p.bg},#1a2440);border-color:${p.clr}30">
      ${avatarDetHtml}
      <div class="det-name" style="${r.txtColor?'color:'+r.txtColor:''}">${r.nombre}</div>
      <div class="det-folio">${r.folio} · ID ${r.id}${r.seccion?' · Sec. '+r.seccion:''}</div>
      <div class="det-prog" style="background:${p.bg};color:${p.clr};border:1px solid ${p.clr}40">${p.ico} ${p.lbl}</div>
      ${r.dup?'<div style="margin-top:9px;background:#ff000018;color:var(--red);padding:4px 12px;border-radius:7px;font-size:10px;font-weight:800;display:inline-block">⚠️ REGISTRO DUPLICADO</div>':''}
      ${(()=>{
        if(r.visita==='Si'&&r.ult){
          const ds=daysSince(r.ult.slice(0,10));
          const cls=ds>30?'det-days-hot':ds>14?'det-days-warn':'det-days-ok';
          return '<div class="det-days-badge '+cls+'">🕐 Visitado hace '+ds+' días</div>';
        } else if(r.visita==='Pendiente'){
          const ds=r.fecha?daysSince(r.fecha):null;
          if(ds!==null&&ds>14) return '<div class="det-days-badge det-days-hot">⚠️ '+ds+' días sin visitar</div>';
        }
        return '';
      })()}
    </div>

    <!-- Pills rápidas visita + ubicación -->
    <div class="det-quick-pills">
      ${can('markVisit')
        ? VSC.map(v=>{const cv=VIS[v];return`<div class="dqp ${cv.cls}${r.visita===v?' dqp-on':''}" onclick="detSetField(${r.id},'visita','${v}')">${cv.ico} ${cv.lbl}</div>`;}).join('')
        : `<div class="visit-locked-bar" onclick="_showGuestUpgrade('Marcar visitas requiere una cuenta')">🔒 Marcar visita — requiere cuenta · <span style="color:var(--a2)">Crear cuenta →</span></div>`
      }
    </div>
    <div class="det-quick-pills" style="margin-top:-6px">
      ${can('editRecord')
        ? USC.map(v=>{const cu=USO[v];return`<div class="dqp ${cu.cls}${r.uso===v?' dqp-on':''}" onclick="detSetField(${r.id},'uso','${v}')">${cu.ico} ${cu.lbl}</div>`;}).join('')
        : USC.map(v=>{const cu=USO[v];return`<div class="dqp ${cu.cls}${r.uso===v?' dqp-on':''} guest-locked">${cu.ico} ${cu.lbl}</div>`;}).join('')
      }
    </div>

    <!-- Guest upgrade CTA (only shown when guest) -->
    ${isGuest()?`<div class="guest-upgrade-cta" onclick="_showGuestUpgrade('Acceso completo a esta funcionalidad')">
      <div class="guc-ico">⬆️</div>
      <div style="flex:1"><div class="guc-title">Acceso limitado</div><div class="guc-sub">Crea una cuenta para editar, marcar y exportar</div></div>
      <div class="guc-arr">›</div>
    </div>`:''}
    <!-- v25: Contact Action Bar -->
    ${(()=>{
      const telClean=(r.tel||'').replace(/[^0-9+]/g,'');
      const addr=[r.dom,r.num?'#'+r.num:'',r.col].filter(Boolean).join(' ');
      const mapsQ=encodeURIComponent(addr+' '+r.col+' Mexico');
      return `<div class="contact-bar">
        ${r.tel?`<a class="cact cact-call" href="tel:${r.tel}"><span class="cact-ico">📞</span><span class="cact-lbl">Llamar</span></a>`:'<div class="cact cact-call cact-disabled"><span class="cact-ico">📞</span><span class="cact-lbl">Llamar</span></div>'}
        ${r.tel?`<a class="cact cact-wa" href="https://wa.me/52${telClean}?text=${encodeURIComponent('Hola '+r.nombre.split(' ')[0]+', le contactamos del programa '+r.tipo+' para confirmar su información.')}" target="_blank"><span class="cact-ico">💬</span><span class="cact-lbl">WhatsApp</span></a>`:'<div class="cact cact-wa cact-disabled"><span class="cact-ico">💬</span><span class="cact-lbl">WhatsApp</span></div>'}
        ${addr?`<a class="cact cact-maps" href="https://maps.google.com/?q=${mapsQ}" target="_blank"><span class="cact-ico">📍</span><span class="cact-lbl">Maps</span></a>`:'<div class="cact cact-maps cact-disabled"><span class="cact-ico">📍</span><span class="cact-lbl">Maps</span></div>'}
        ${addr?`<a class="cact cact-waze" href="https://waze.com/ul?q=${mapsQ}&navigate=yes" target="_blank"><span class="cact-ico">🚗</span><span class="cact-lbl">Waze</span></a>`:'<div class="cact cact-waze cact-disabled"><span class="cact-ico">🚗</span><span class="cact-lbl">Waze</span></div>'}
      </div>`;
    })()}

    <!-- Grid de campos — todos editables con tap -->
    <div class="det-grid" id="det-grid-${r.id}">
      <div class="df" onclick="inlineEdit(${r.id},'nombre','${r.nombre.replace(/'/g,"\\'")}','text','Nombre completo')">
        <div class="dl">👤 Nombre</div><div class="dv" id="dv-nombre-${r.id}">${r.nombre}</div>
      </div>
      <div class="df" onclick="inlineEdit(${r.id},'folio','${r.folio}','text','Folio')">
        <div class="dl">📂 Folio</div><div class="dv" id="dv-folio-${r.id}" style="font-family:'JetBrains Mono',monospace">${r.folio}</div>
      </div>
      <div class="df" onclick="inlineEdit(${r.id},'tel','${r.tel||''}','tel','Teléfono')">
        <div class="dl">📞 Teléfono</div><div class="dv" id="dv-tel-${r.id}">${r.tel||'—'}</div>
      </div>
      <div class="df" onclick="inlineEditSelect(${r.id},'estatus','${r.estatus}',['Activo','Inactivo','Pendiente','Baja'])">
        <div class="dl">📊 Estatus</div><div class="dv" id="dv-estatus-${r.id}"><span class="bdg ${sc}">${r.estatus}</span></div>
      </div>
      <div class="df" onclick="inlineEdit(${r.id},'curp','${r.curp||''}','text','CURP')">
        <div class="dl">🪪 CURP</div><div class="dv" id="dv-curp-${r.id}" style="font-family:'JetBrains Mono',monospace;font-size:11px">${r.curp||'—'}</div>
      </div>
      <div class="df" onclick="inlineEdit(${r.id},'fnac','${r.fnac||''}','date','Fecha nacimiento')">
        <div class="dl">🎂 Nacimiento</div><div class="dv" id="dv-fnac-${r.id}">${r.fnac?fmtD(r.fnac)+(edadStr?' · '+edadStr:''):'—'}</div>
      </div>
      <div class="df full" onclick="inlineEdit(${r.id},'dom','${(r.dom||'').replace(/'/g,"\\'")}','text','Calle / Av.')">
        <div class="dl">📍 Domicilio</div><div class="dv" id="dv-dom-${r.id}">${r.dom||'—'} ${r.num?'#'+r.num:''}</div>
      </div>
      <div class="df" onclick="inlineEdit(${r.id},'num','${r.num||''}','text','Número')">
        <div class="dl">🔢 Número</div><div class="dv" id="dv-num-${r.id}">${r.num||'—'}</div>
      </div>
      <div class="df" onclick="inlineEdit(${r.id},'col','${(r.col||'').replace(/'/g,"\\'")}','text','Colonia')">
        <div class="dl">🏘️ Colonia</div><div class="dv" id="dv-col-${r.id}">${r.col||'—'}</div>
      </div>
      <div class="df" onclick="inlineEdit(${r.id},'seccion','${r.seccion||''}','text','Sección')">
        <div class="dl">📍 Sección</div><div class="dv" id="dv-seccion-${r.id}" style="font-weight:800;color:var(--a2)">${r.seccion||'—'}</div>
      </div>
      <div class="df" onclick="inlineEdit(${r.id},'area','${r.area||''}','text','Área')">
        <div class="dl">🏘️ Área</div><div class="dv" id="dv-area-${r.id}">${r.area||'—'}</div>
      </div>
      <div class="df" onclick="inlineEdit(${r.id},'ruta','${r.ruta||''}','text','Ruta')">
        <div class="dl">🗺️ Ruta</div><div class="dv" id="dv-ruta-${r.id}">${r.ruta||'—'}</div>
      </div>
      <div class="df${r.lat&&r.lng?'':' cact-disabled'}" onclick="${r.lat&&r.lng?`viewOnMap(${r.id})`:'captureGPSForRecord('+r.id+')'}" style="cursor:pointer">
        <div class="dl">🛰️ GPS</div>
        <div class="dv" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:${r.lat&&r.lng?'var(--grn)':'var(--mut)'}">
          ${r.lat&&r.lng?r.lat.toFixed(5)+', '+r.lng.toFixed(5):'Sin coordenadas · Tap para capturar'}
        </div>
      </div>
      <div class="df full" onclick="inlineEditSelect(${r.id},'tipo','${r.tipo}',['PAM','PCD','JCF','MT','BBJ'])">
        <div class="dl">📋 Programa</div><div class="dv" id="dv-tipo-${r.id}"><span style="color:${p.clr}">${p.ico} ${p.lbl}</span></div>
      </div>
      <div class="df full" onclick="inlineEditObs(${r.id})">
        <div class="dl">📝 Observaciones</div><div class="dv" id="dv-obs-${r.id}" style="color:var(--sft)">${r.obs||'—'}</div>
      </div>
      <div class="df"><div class="dl">📅 Registro</div><div class="dv">${fmtD(r.fecha)}</div></div>
      <div class="df"><div class="dl">✏️ Última edición</div><div class="dv" style="font-size:10px;color:var(--sft)">${r.ult||'—'}</div></div>
    </div>
    ${histHtml}
    <div class="btn2" style="margin-top:12px">
      <button type="button" class="btn btn-s" onclick="openEditSh(${r.id})">✏️ Editar</button>
      <button type="button" class="btn btn-s" onclick="printRecord(${r.id})"${!can('printRecord')?' style="display:none"':''}>🖨️ Imprimir</button>
    </div>
    <div class="btn2" style="margin-top:6px">
      <button type="button" class="btn btn-s" onclick="shareRecord(${r.id})"${!can('shareRecord')?' style="display:none"':''}>📤 Compartir</button>
      ${r.tel?`<button type="button" class="btn btn-s" style="color:#22c55e;border-color:#22c55e" onclick="sendWhatsAppReminder(${r.id})">💬 WhatsApp</button>`:(r.dom||r.col)?`<button type="button" class="btn btn-s" onclick="copyAddr(${r.id})">📋 Copiar dir.</button>`:''}
    </div>
    <div class="btn2" style="margin-top:6px">
      <button type="button" class="btn btn-s" style="color:var(--ind);border-color:var(--ind)" onclick="showBenefQR(${r.id})">📱 QR Beneficiario</button>
      ${r.dom?`<button type="button" class="btn btn-s" style="color:var(--grn);border-color:var(--grn)" onclick="openMapForRecord(${r.id})">🗺️ Ver en mapa</button>`:''}
    </div>
    ${r.tel&&(r.dom||r.col)?`<div class="btn2" style="margin-top:6px"><button type="button" class="btn btn-s" onclick="copyAddr(${r.id})">📋 Copiar dirección</button>${r.dom?`<button type="button" class="btn btn-s" onclick="openMapForRecord(${r.id})">🗺️ Ver mapa</button>`:''}</div>`:''}
    <div class="btn2" style="margin-top:6px">
      <button type="button" class="btn btn-s" style="color:var(--red);border-color:var(--red)${!can('deleteRecord')?';display:none':''}" onclick="confDel(${r.id})">🗑️ Eliminar</button>
    </div>
    ${r.dup?`<button type="button" class="btn btn-d mt8" onclick="confDel(${r.id})">🗑️ Eliminar duplicado</button>`:''}
  `;
  openSheet('sh-det');

  // Update nav bar
  const navTitle = document.getElementById('det-nav-title');
  const navBack  = document.getElementById('det-nav-back-lbl');
  if(navTitle) navTitle.textContent = r.nombre;
  if(navBack)  navBack.textContent  = _detOriginLabel;

  // Scroll the sheet to top
  setTimeout(()=>{
    const sheet=document.getElementById('sh-det');
    if(sheet) sheet.scrollTop=0;
    // Init photo zoom on any photos
    document.querySelectorAll('.det-av-photo,#sh-det img').forEach(initPhotoZoom);
    // Init pull-close on detail sheet
    initSheetPullClose('sh-det');
  }, 50);
}
function togDA(w){document.getElementById('dm-'+w).classList.toggle('on');}
function setDA(id,field,val,e){
  e.stopPropagation();
  const r=R.find(x=>x.id===id);if(!r)return;
  const prev=r[field];r[field]=val;r.ult=nowStr();
  logCh(r,field.toUpperCase(),prev,val,'Cambio desde detalle');
  svR();svH();
  document.querySelectorAll('.da-menu').forEach(m=>m.classList.remove('on'));
  const cfg=field==='visita'?VIS:USO;
  const c=cfg[val];
  const key=field==='visita'?'vis':'uso';
  document.getElementById(`da-${key}-val`).textContent=c?.lbl||val;
  const da=document.getElementById('da-'+key);
  da.className='da '+(c?.cls||'');
  snack(`${field==='visita'?'🚗':'🌎'} ${val}`,field==='visita'?'🚗':'🌎');
}

/* ===== DELETE / CONFIRM ===== */
let pendAct=null;
function conf2(t,m,fn,btnTxt='Eliminar'){
  document.getElementById('conf-t').textContent=t;
  document.getElementById('conf-m').textContent=m;
  document.getElementById('conf-ok').textContent=btnTxt;
  pendAct=fn;
  document.getElementById('conf').classList.add('on');
}
function closeConf(){document.getElementById('conf').classList.remove('on');pendAct=null;}
document.getElementById('conf-ok').addEventListener('click',function(){if(pendAct){pendAct();closeConf();}});
/* ── Undo delete ── */
let _undoStack = [];
let _undoTimer = null;

function _showUndoToast(record){
  // Clear any pending undo
  if(_undoTimer) clearTimeout(_undoTimer);
  // Show undo toast
  let toast = document.getElementById('undo-toast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'undo-toast';
    toast.style.cssText = 'position:fixed;bottom:calc(var(--nh,64px) + var(--sb,20px) + 14px);left:50%;transform:translateX(-50%);background:var(--card);border:1px solid var(--b2);border-radius:20px;padding:11px 8px 11px 16px;display:flex;align-items:center;gap:10px;z-index:900;box-shadow:0 8px 28px rgba(0,0,0,.4);white-space:nowrap;animation:snackIn .25s ease;font-size:13px;font-weight:700;';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `🗑️ <span style="color:var(--txt)">${record.nombre.split(' ')[0]} eliminado</span> <button onclick="undoDelete()" style="background:var(--a);color:#fff;border:none;border-radius:12px;padding:6px 14px;font-size:12px;font-weight:800;cursor:pointer;font-family:var(--fnt);margin-left:4px">↩ Deshacer</button> <button onclick="closeUndoToast()" style="background:none;border:none;color:var(--sft);font-size:16px;cursor:pointer;padding:0 4px;line-height:1">×</button>`;
  toast.style.display = 'flex';
  _undoTimer = setTimeout(closeUndoToast, 6000);
}

function closeUndoToast(){
  const t = document.getElementById('undo-toast');
  if(t){ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>{ if(t)t.style.display='none'; t.style.opacity=''; t.style.transition=''; }, 300); }
  if(_undoTimer){ clearTimeout(_undoTimer); _undoTimer = null; }
  _undoStack = [];
}

function undoDelete(){
  if(!_undoStack.length) return;
  const {record, histEntry} = _undoStack.pop();
  // Restore record
  R.push(record);
  // Remove the history entry for this deletion
  H = H.filter(h => h !== histEntry);
  detectDups(); svR(); svH(); upHdr(); renderInicio();
  if(curTab==='registros') renderList();
  closeUndoToast();
  snack('↩ ' + record.nombre.split(' ')[0] + ' restaurado', '↩');
  if(navigator.vibrate) navigator.vibrate([20,10,20]);
}

function confDel(id){
  if(typeof requirePerm==='function'&&!requirePerm('deleteRecord','Eliminar registros requiere una cuenta')) return;
  const r=R.find(x=>x.id===id);
  conf2('Eliminar beneficiario',`¿Eliminar a "${r?.nombre}"? No se puede deshacer.`,()=>{
    H.push({id:Date.now(),folio:r.folio,nombre:r.nombre,cambios:'Registro eliminado',motivo:'—',resp:'Usuario',fecha:nowStr(),tipo:'del'});svH();
    R=R.filter(x=>x.id!==id);detectDups();svR();
    closeAllSheets();render(curTab);upHdr();
    snack('🗑️ Registro eliminado','🗑️');
  });
}
function confClearH(){
  conf2('Borrar historial','¿Eliminar todos los cambios registrados?',()=>{H=[];svH();renderHist();snack('🗑️ Historial borrado','🗑️');});
}

/* ===== HISTORY ===== */
let histFilter='all';
let histSrchQ='';
function renderHist(){
  const TYPE_ICO={new:'✨',edit:'✏️',del:'🗑️'};
  const TYPE_LBL={new:'Nuevo registro',edit:'Edición',del:'Eliminado'};
  const TYPE_CLR={new:'var(--grn)',edit:'var(--a)',del:'var(--red)'};
  // Search bar
  const searchBar=`<div class="hist-srch">
    <span class="hist-srch-ico">⌕</span>
    <input type="search" placeholder="Buscar en historial…" value="${histSrchQ.replace(/"/g,'&quot;')}"
      oninput="histSrchQ=this.value;renderHist()" style="font-size:13px"/>
  </div>`;
  // Filter bar
  const filterBar=`<div class="hi-filter-bar">
    ${[['all','Todos'],['new','✨ Nuevos'],['edit','✏️ Edits'],['del','🗑️ Eliminados']].map(([v,l])=>
      `<button class="hi-filter-chip${histFilter===v?' on':''}" onclick="histFilter='${v}';renderHist()">${l}</button>`
    ).join('')}
  </div>`;
  const all=[...H].reverse();
  let filtered=histFilter==='all'?all:all.filter(h=>h.tipo===histFilter);
  if(histSrchQ.trim()){const q=histSrchQ.toLowerCase();filtered=filtered.filter(h=>(h.nombre||'').toLowerCase().includes(q)||(h.folio||'').toLowerCase().includes(q)||(h.cambios||'').toLowerCase().includes(q));}
  document.getElementById('hist-sh').innerHTML=`Historial <span class="sh2-n">${filtered.length}/${H.length}</span>`;
  if(!filtered.length){
    document.getElementById('hist-list').innerHTML=searchBar+filterBar+'<div class="empty"><div class="empty-ico">📝</div><h3>Sin entradas</h3><p>No hay registros de este tipo</p></div>';
    return;
  }
  document.getElementById('hist-list').innerHTML=searchBar+filterBar+filtered.map(h=>{
    const tipo=h.tipo||'edit';
    const ico=TYPE_ICO[tipo]||'✏️';
    const clr=TYPE_CLR[tipo]||'var(--a)';
    const lbl=TYPE_LBL[tipo]||'Cambio';
    // Split changes into readable lines
    const cambioLines=(h.cambios||'').split(' | ').map(line=>
      `<div style="padding:2px 0;border-bottom:1px solid var(--b1)">${line}</div>`
    ).join('');
    return `<div class="hi ${tipo}" style="border-left-color:${clr}">
      <div class="hi-header">
        <div class="hi-type-ico ${tipo}">${ico}</div>
        <div class="hi-meta">
          <div class="hi-who">${h.nombre||h.folio||'—'}</div>
          <div class="hi-when">📂 ${h.folio||'—'} · 🕐 ${h.fecha||'—'}</div>
        </div>
        <button type="button" class="hi-del-btn" onclick="delHI(${h.id})">✕</button>
      </div>
      <div class="hi-changes">${cambioLines||h.cambios||'—'}</div>
      <div class="hi-footer">
        <span style="color:${clr};font-weight:800;font-size:10px">${lbl}</span>
        ${h.motivo&&h.motivo!=='Sin motivo'?`<span class="hi-motivo">📝 ${h.motivo}</span>`:''}
        <span style="margin-left:auto;font-size:9px">👤 ${h.resp||'Usuario'}</span>
      </div>
    </div>`;
  }).join('');
}
function delHI(id){H=H.filter(h=>h.id!==id);svH();renderHist();snack('Entrada eliminada');}

/* ===== SEARCH ===== */
let sfFilter='all';
let srchRecs=JSON.parse(localStorage.getItem('px_srch')||'[]');
let srchVoice=null,srchDeb=null;
const FLD_LBL={nombre:'Nombre',folio:'Folio',id:'ID',tipo:'Programa',tel:'Teléfono',dom:'Domicilio',num:'Número',col:'Colonia',obs:'Obs.',estatus:'Estatus',visita:'Visita',uso:'Uso'};
function renderSFPills(){
  const base=[['all','🔍 Todos'],['PAM','👴 PAM'],['PCD','♿ PCD'],['JCF','🎓 JCF'],['MT','👩 MT'],['BBJ','📚 BBJ'],['usa','✈️ USA'],['vis_si','✅ Visitados'],['vis_no','❌ Sin visita'],['vis_pe','⏳ Pendientes'],['dup','⚠️ Dup']];
  const secs=[...new Set(R.map(r=>r.seccion).filter(Boolean))].sort().map(s=>['sec_'+s,'📍 '+s]);
  const areas=[...new Set(R.map(r=>r.area).filter(Boolean))].sort().map(a=>['area_'+a,'🏘️ '+a]);
  const rutas=[...new Set(R.map(r=>r.ruta).filter(Boolean))].sort().map(rt=>['ruta_'+rt,'🗺️ '+rt]);
  const all=[...base,...secs,...areas,...rutas];
  const el=document.getElementById('sf-pills');
  if(el)el.innerHTML=all.map(([v,l])=>`<button class="sfp${sfFilter===v?' on':''}" onclick="setSFP('${v}')">${l}</button>`).join('');
}
function setSFP(v){
  sfFilter=v;renderSFPills();
  const q=document.getElementById('sq').value||'';
  if(v!=='all') execSrch(q,true);
  else if(q) execSrch(q);
  else showSrchIdle();
}
function initSrch(){if(typeof srchSel==='undefined')window.srchSel=new Set();else srchSel=new Set();if(typeof srchCurrentItems==='undefined')window.srchCurrentItems=[];else srchCurrentItems=[];renderSFPills();showSrchIdle();}
function onSI(){
  const q=document.getElementById('sq').value||'';
  document.getElementById('sq-clr').style.display=q?'flex':'none';
  clearTimeout(srchDeb);
  if(srchAdvOpen){srchDeb=setTimeout(()=>execSrchAdv(),100);return;}
  if(!q){showSrchIdle();return;}
  srchDeb=setTimeout(()=>execSrch(q),80);
}
function onSF(){}
function onSB(){}
function clrSrch(){document.getElementById('sq').value='';document.getElementById('sq-clr').style.display='none';showSrchIdle();}
function showSrchIdle(){
  renderSrchHistory();
  renderSrchHistory();
  srchSel=new Set();srchCurrentItems=[];
  document.getElementById('srch-idle-wrap').style.display='block';
  document.getElementById('srch-active-wrap').style.display='none';
  document.getElementById('srch-nores-wrap').style.display='none';
  const _db=document.getElementById('srch-del-bar');if(_db)_db.style.display='none';
  renderSrchRecs();renderQA();
}
function saveRec2(q){
  if(!q||q.length<2)return;
  srchRecs=srchRecs.filter(r=>r.q.toLowerCase()!==q.toLowerCase());
  const cnt=R.filter(r=>['nombre','folio','tipo','col'].some(f=>(r[f]+'').toLowerCase().includes(q.toLowerCase()))).length;
  srchRecs.unshift({q,cnt,ts:Date.now()});
  if(srchRecs.length>8)srchRecs=srchRecs.slice(0,8);
  localStorage.setItem('px_srch',JSON.stringify(srchRecs));
}
function renderSrchRecs(){
  const sw=document.getElementById('srch-recents-sec');
  if(!srchRecs.length){sw.innerHTML='';return;}
  sw.innerHTML=`<div class="sec-row"><span class="sec-lbl">Recientes</span><button class="sec-btn" onclick="clrRecs()">Borrar</button></div>`+
    srchRecs.map((r,i)=>`<div class="rec-item" onclick="tapRec('${r.q.replace(/'/g,"\\'")}')">
      <span class="ri-ico">⏱</span>
      <div style="flex:1;min-width:0"><div class="ri-q">${r.q}</div><div class="ri-n">${r.cnt} resultado${r.cnt!==1?'s':''}</div></div>
      <button type="button" class="ri-del" onclick="delRec(${i},event)">✕</button>
    </div>`).join('');
}
function clrRecs(){srchRecs=[];localStorage.setItem('px_srch','[]');renderSrchRecs();}
function delRec(i,e){e.stopPropagation();srchRecs.splice(i,1);localStorage.setItem('px_srch',JSON.stringify(srchRecs));renderSrchRecs();}
function tapRec(q){document.getElementById('sq').value=q;document.getElementById('sq-clr').style.display='flex';execSrch(q);}
function renderQA(){
  detectDups();
  const cards=[
    {ico:'👴',lbl:'PAM',         sub:R.filter(r=>r.tipo==='PAM').length+' reg',f:'prog_PAM',ac:'#60a5fa'},
    {ico:'♿',lbl:'PCD',         sub:R.filter(r=>r.tipo==='PCD').length+' reg',f:'prog_PCD',ac:'#4ade80'},
    {ico:'✈️',lbl:'Migrantes',  sub:R.filter(r=>r.uso==='Estados Unidos').length+' reg',f:'usa',ac:'#f59e0b'},
    {ico:'⚠️',lbl:'Duplicados', sub:R.filter(r=>r.dup).length+' reg',f:'dup',ac:'#ef4444'},
    {ico:'⏳',lbl:'Pendientes',  sub:R.filter(r=>r.estatus==='Pendiente').length+' reg',f:'pen',ac:'#f59e0b'},
    {ico:'✅',lbl:'Visitados',   sub:R.filter(r=>r.visita==='Si').length+' reg',f:'vis_si',ac:'#22c55e'},
  ];
  document.getElementById('srch-qa').innerHTML=
    '<div class="qa-cards">'+
    cards.map(c=>`<div class="qa-card" style="border-top:2px solid ${c.ac}" onclick="tapQA('${c.f}','${c.lbl}')">
      <span class="qa-card-ico">${c.ico}</span>
      <div class="qa-card-lbl" style="color:${c.ac}">${c.lbl}</div>
      <div class="qa-card-sub">${c.sub}</div>
    </div>`).join('')+'</div>';
}
function tapQA(f,lbl){
  const map={
    prog_PAM:()=>R.filter(r=>r.tipo==='PAM'),
    prog_PCD:()=>R.filter(r=>r.tipo==='PCD'),
    usa:()=>R.filter(r=>r.uso==='Estados Unidos'),
    dup:()=>{detectDups();return R.filter(r=>r.dup);},
    pen:()=>R.filter(r=>r.estatus==='Pendiente'),
    vis_si:()=>R.filter(r=>r.visita==='Si'),
  };
  showResults((map[f]||map.pen)(),lbl,'',null);
}
function execSrch(q,forceShow=false){
  detectDups();
  const ql=q.toLowerCase().trim();
  if(ql.length>=2)saveRec2(ql);
  const FIELDS=['nombre','folio','id','tipo','tel','dom','num','col','obs','estatus','visita','uso','seccion'];
  let pool=R.filter(r=>{
    if(sfFilter==='all')return true;
    if(sfFilter==='usa')return r.uso==='Estados Unidos';
    if(sfFilter==='vis_si')return r.visita==='Si';
    if(sfFilter==='vis_no')return r.visita==='No';
    if(sfFilter==='vis_pe')return r.visita==='Pendiente';
    if(['PAM','PCD','JCF','MT','BBJ'].includes(sfFilter))return r.tipo===sfFilter;
    if(sfFilter==='vis_pend')return r.visita==='Pendiente';
    if(sfFilter.startsWith('sec_'))return r.seccion===sfFilter.slice(4);
    if(sfFilter.startsWith('area_'))return r.area===sfFilter.slice(5);
    if(sfFilter.startsWith('ruta_'))return r.ruta===sfFilter.slice(5);
    if(sfFilter==='dup'){detectDups();return r.dup;}
    return r.tipo===sfFilter;
  });
  if(!ql&&(sfFilter!=='all'||forceShow)){showResults(pool,sfFilter.startsWith('sec_')?'📍 Sección '+sfFilter.slice(4):sfFilter,'',null);return;}
  if(!ql){showSrchIdle();return;}
  const results=[];
  pool.forEach(r=>{
    let score=0,mf=null,mv=null;
    FIELDS.forEach(f=>{
      const v=(r[f]+'').toLowerCase();
      if(v===ql){score+=100;if(!mf){mf=f;mv=r[f]+'';};}
      else if(v.startsWith(ql)){score+=60;if(!mf){mf=f;mv=r[f]+'';}}
      else if(v.includes(ql)){score+=30;if(!mf){mf=f;mv=r[f]+'';}}
    });
    if(r.nombre.toLowerCase().includes(ql))score+=20;
    if(score>0)results.push({r,score,mf,mv});
  });
  results.sort((a,b)=>b.score-a.score);
  if(!results.length){showNoRes(q);return;}
  showResults(results.map(x=>x.r),q,q,results);
}
function showResults(items,title,q,meta){
  srchCurrentItems=items.slice();
  srchSel=new Set();
  document.getElementById('srch-idle-wrap').style.display='none';
  document.getElementById('srch-nores-wrap').style.display='none';
  document.getElementById('srch-active-wrap').style.display='block';
  // show delete bar
  const _db=document.getElementById('srch-del-bar');
  if(_db)_db.style.display='flex';
  _updSrchBar();
  const dups=items.filter(r=>r.dup).length;
  document.getElementById('srch-stats').innerHTML=`<span><strong>${items.length}</strong> resultado${items.length!==1?'s':''} ${q?'para "'+q+'"':''}</span>
    <div style="display:flex;gap:5px">${dups?`<span style="font-size:9px;font-weight:800;background:#2a0e0e;color:var(--red);padding:2px 7px;border-radius:8px">⚠️ ${dups}</span>`:''}<span style="font-size:9px;font-weight:800;background:var(--s2);color:var(--sft);padding:2px 7px;border-radius:8px">${title||sfFilter}</span></div>`;
  const hl=text=>{if(!q||!text)return String(text||'');try{const re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');return String(text).replace(re,'<span class="hl">$1</span>');}catch(e){return String(text);}};
  document.getElementById('srch-res').innerHTML=items.map((r,i)=>{
    const p=pg(r.tipo),sc=SC[r.estatus]||'bdg-def';
    const mm=meta?meta[i]:null;
    const mfld=mm?.mf,mval=mm?.mv;
    const sel=srchSel.has(r.id);
    return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
      <div class="srch-chk${sel?' on':''}" id="srchchk-${r.id}" onclick="togSrchSel(${r.id},event)">${sel?'✓':''}</div>
      <div class="rec${r.dup?' dup':''}" style="flex:1;margin-bottom:0">
        <div class="rec-bar" style="background:${p.clr}30;border-bottom:2px solid ${p.clr}50"></div>
        <div class="rec-body" onclick="openDet(${r.id})">
          <div class="rec-top">
            <div class="av" style="background:${p.bg};color:${p.clr}">${ini(r.nombre)}</div>
            <div class="rec-meta">
              <div class="rec-name" style="${r.txtColor?'color:'+r.txtColor:''}">${hl(r.nombre)}</div>
              <div class="rec-folio">${hl(r.folio)} · ID ${r.id}</div>
            </div>
            ${r.dup?'<span class="dup-tag">⚠️</span>':''}
          </div>
          <div class="bdgs">
            <span class="bdg" style="background:${p.bg};color:${p.clr}">${p.ico} ${r.tipo}</span>
            <span class="bdg ${sc}">${r.estatus}</span>
          </div>
          ${mfld&&mval?`<div style="padding:5px 0;font-size:10px;color:var(--sft)"><span style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;margin-right:5px">${FLD_LBL[mfld]||mfld}</span>${hl(mval)}</div>`:''}
        </div>
        <div class="rec-acts">
          <button class="ra ${(VIS[r.visita]||VIS['Pendiente']).cls}" onclick="cycleVis(${r.id},event)"><span class="ri2">${(VIS[r.visita]||VIS['Pendiente']).ico}</span> ${(VIS[r.visita]||VIS['Pendiente']).lbl}</button>
          <button class="ra ${(USO[r.uso]||USO['Mexico']).cls}" onclick="cycleUso(${r.id},event)"><span class="ri2">${(USO[r.uso]||USO['Mexico']).ico}</span> ${(USO[r.uso]||USO['Mexico']).lbl}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}
function showNoRes(q){
  srchCurrentItems=[];srchSel=new Set();
  document.getElementById('srch-idle-wrap').style.display='none';
  document.getElementById('srch-active-wrap').style.display='none';
  document.getElementById('srch-nores-wrap').style.display='block';
  const _db=document.getElementById('srch-del-bar');if(_db)_db.style.display='none';
  document.getElementById('nores-t').textContent=`Sin resultados para "${q}"`;
  document.getElementById('nores-s').textContent='Prueba con otro término o quita los filtros.';
}
function voiceSrch(){
  if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){snack('Voz no disponible');return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  srchVoice=new SR();srchVoice.lang='es-MX';srchVoice.continuous=false;srchVoice.interimResults=true;
  document.getElementById('listen-wrap').classList.add('on');
  srchVoice.onresult=e=>{const t=Array.from(e.results).map(r=>r[0].transcript).join('');document.getElementById('sq').value=t;onSI();};
  srchVoice.onend=()=>{document.getElementById('listen-wrap').classList.remove('on');};
  srchVoice.onerror=()=>{document.getElementById('listen-wrap').classList.remove('on');snack('No se pudo escuchar');};
  srchVoice.start();
}
function stopVoice(){if(srchVoice){srchVoice.stop();srchVoice=null;}document.getElementById('listen-wrap').classList.remove('on');}

/* ===== VISITS ===== */
let selP=new Set(),visFilter='todas';
function renderVisFilters(){
  const el=document.getElementById('vis-filter-bar');if(!el)return;
  const filtros=[['todas','Todas'],['hoy','Hoy'],['semana','Esta semana'],['PAM','👴 PAM'],['JCF','🎓 JCF'],['PCD','♿ PCD']];
  el.innerHTML=filtros.map(([v,l])=>`<button class="vfc${visFilter===v?' on':''}" onclick="visFilter='${v}';renderVis()">${l}</button>`).join('');
}
function filterVisitas(vArr){
  const tod=today();
  const weekAgo=new Date();weekAgo.setDate(weekAgo.getDate()-7);
  const weekStr=weekAgo.toISOString().slice(0,10);
  if(visFilter==='hoy')return vArr.filter(v=>v.date===tod);
  if(visFilter==='semana')return vArr.filter(v=>v.date>=weekStr);
  if(['PAM','JCF','PCD','MT','BBJ'].includes(visFilter))return vArr.filter(v=>v.people.some(p=>p.tipo===visFilter));
  return vArr;
}
function openShV(){
  document.getElementById('vt').value='';
  document.getElementById('vd').value=today();
  document.getElementById('vh').value='09:00';
  document.getElementById('vr').value='';
  document.getElementById('vn').value='';
  document.getElementById('vq').value='';
  selP=new Set();renderPS('');openSheet('sh-vis');
}
function filtPS(){renderPS(document.getElementById('vq').value||'');}
function renderPS(q){
  const ql=q.toLowerCase();
  const fl=R.filter(r=>!ql||r.nombre.toLowerCase().includes(ql)||r.folio.toLowerCase().includes(ql));
  document.getElementById('psel').innerHTML=fl.map(r=>{
    const p=pg(r.tipo),sel=selP.has(r.id);
    return`<div class="psi${sel?' on':''}" onclick="togP(${r.id},this)">
      <div class="psi-chk">${sel?'✓':''}</div>
      <div class="psi-av" style="background:${p.bg};color:${p.clr}">${ini(r.nombre)}</div>
      <div><div class="psi-name">${r.nombre}</div><div class="psi-sub">${p.ico} ${r.tipo} · ${r.folio}</div></div>
    </div>`;
  }).join('')||'<p style="color:var(--mut);font-size:11px;padding:10px;text-align:center">Sin resultados</p>';
}
function togP(id,el){
  if(selP.has(id))selP.delete(id);else selP.add(id);
  const s=selP.has(id);el.classList.toggle('on',s);el.querySelector('.psi-chk').textContent=s?'✓':'';
}
function doSaveVisit(){
  const title=document.getElementById('vt').value.trim()||'Visita';
  const date=document.getElementById('vd').value||today();
  const time=document.getElementById('vh').value||'09:00';
  const resp=document.getElementById('vr').value.trim()||'Usuario';
  const notes=document.getElementById('vn').value.trim();
  const people=[...selP].map(id=>{const r=R.find(x=>x.id===id);return r?{id:r.id,nombre:r.nombre,folio:r.folio,tipo:r.tipo,status:'Pendiente'}:null;}).filter(Boolean);
  V.push({id:Date.now(),title,date,time,resp,notes,people,created:nowStr()});svV();
  E.push({id:Date.now()+1,date,time,title,type:'visit',notes:`${people.length} persona(s) · ${resp}`});svE();
  if(people.length){
    H.push({id:Date.now()+2,folio:'VISITA',nombre:title,cambios:`Visita: ${people.map(p=>p.nombre.split(' ')[0]).join(', ')}`,motivo:notes||'—',resp,fecha:nowStr(),tipo:'edit'});svH();
    people.forEach(p=>{const r=R.find(x=>x.id===p.id);if(r&&r.visita==='No')r.visita='Pendiente';});svR();
  }
  closeSheet('sh-vis');renderVis();
  snack(`📅 Visita guardada (${people.length} persona${people.length!==1?'s':''})`, '📅');
}
function renderVis(){
  renderVisFilters();
  const filtered=filterVisitas([...V].reverse());
  document.getElementById('vis-sh').innerHTML=`Visitas <span class="sh2-n">${filtered.length}</span>`;
  document.getElementById('vis-list').innerHTML=filtered.map(v=>`
    <div class="vc">
      <div class="vc-top"><div class="vc-title">📅 ${v.title}</div><div class="vc-date">${fmtD(v.date)} ${v.time}</div></div>
      <div style="font-size:10px;color:var(--mut);margin-bottom:8px">Responsable: ${v.resp}${v.notes?' · '+v.notes:''}</div>
      <div>${v.people.map(p=>{const pr=pg(p.tipo);return`<div class="vcp"><div class="vcp-av" style="background:${pr.bg};color:${pr.clr}">${ini(p.nombre)}</div><div style="flex:1;min-width:0"><div class="vcp-name">${p.nombre}</div><div class="vcp-sub">${pr.ico} ${p.tipo} · ${p.folio}</div></div><div class="vcp-s ${p.status==='Visitado'?'ok':p.status==='No asistio'?'no':'pe'}">${p.status}</div></div>`;}).join('')}${!v.people.length?'<p style="font-size:10px;color:var(--mut);text-align:center;padding:7px">Sin personas asignadas</p>':''}</div>
      <div class="vc-btns">
        <button type="button" class="btn btn-g" onclick="markVis(${v.id})">✅ Marcar visitados</button>
        <button type="button" class="btn btn-s" style="color:var(--red);border-color:var(--red);flex:none;width:40px" onclick="delVis(${v.id})">🗑️</button>
      </div>
    </div>`).join('')||'<div class="empty"><div class="empty-ico">🚗</div><h3>Sin visitas</h3><p>Programa la primera visita</p></div>';
}
function markVis(vid){
  const v=V.find(x=>x.id===vid);if(!v)return;
  v.people.forEach(p=>{p.status='Visitado';const r=R.find(x=>x.id===p.id);if(r)r.visita='Si';});
  svR();svV();renderVis();snack('✅ Todos visitados','✅');
}
function delVis(vid){conf2('Eliminar visita','¿Eliminar esta visita?',()=>{V=V.filter(x=>x.id!==vid);svV();renderVis();snack('🗑️ Visita eliminada','🗑️');});}

/* ===== CALENDAR ===== */
let calD=new Date(),selDay=null;
const MOS=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
function prevMo(){calD=new Date(calD.getFullYear(),calD.getMonth()-1,1);renderCal();}
function nextMo(){calD=new Date(calD.getFullYear(),calD.getMonth()+1,1);renderCal();}
function renderCal(){
  const grid=document.getElementById('cal-grid');
  const lbl=document.getElementById('cal-month-lbl');
  if(!grid)return;
  const yr=calD.getFullYear(),mo=calD.getMonth();
  if(lbl)lbl.textContent=MOS[mo]+' '+yr;
  const first=new Date(yr,mo,1).getDay();
  const last=new Date(yr,mo+1,0).getDate();
  const todayStr=today();
  // Build event map for this month
  const evMap={};
  E.filter(e=>e.date&&e.date.slice(0,7)===`${yr}-${String(mo+1).padStart(2,'0')}`).forEach(e=>{
    const d=e.date.slice(8,10);evMap[d]=(evMap[d]||0)+1;
  });
  V.filter(v=>v.date&&v.date.slice(0,7)===`${yr}-${String(mo+1).padStart(2,'0')}`).forEach(v=>{
    const d=v.date.slice(8,10);evMap[d]=(evMap[d]||0)+1;
  });
  let cells='';
  for(let i=0;i<first;i++) cells+=`<div style="background:var(--card);padding:6px 2px;min-height:36px"></div>`;
  for(let d=1;d<=last;d++){
    const ds=`${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday=ds===todayStr;
    const isSel=ds===selDay;
    const cnt=evMap[String(d).padStart(2,'0')]||0;
    cells+=`<div onclick="selD('${ds}')" style="background:${isSel?'var(--a)':isToday?'var(--s2)':'var(--card)'};padding:4px 2px;min-height:36px;cursor:pointer;text-align:center;position:relative;transition:.15s">
      <div style="font-size:12px;font-weight:${isToday||isSel?'800':'600'};color:${isSel?'#fff':isToday?'var(--a2)':'var(--t2)'}">${d}</div>
      ${cnt?`<div style="display:flex;justify-content:center;gap:2px;margin-top:2px">${Array.from({length:Math.min(cnt,3)},()=>'<div style="width:5px;height:5px;border-radius:50%;background:'+(isSel?'rgba(255,255,255,.7)':'var(--a)')+'"></div>').join('')}</div>`:''}
    </div>`;
  }
  grid.innerHTML=cells;
  // Show day panel if a day is selected
  const panel=document.getElementById('cal-day-panel');
  if(panel)panel.style.display=selDay?'block':'none';
  if(selDay)showDayEvs(selDay);
}
function toggleCalView(){
  const wrap=document.getElementById('cal-wrap');
  const btn=document.getElementById('cal-toggle-btn');
  if(!wrap)return;
  const showing=wrap.style.display!=='none';
  wrap.style.display=showing?'none':'block';
  if(btn)btn.style.background=showing?'':'var(--a)',btn.style.color=showing?'':'#fff';
  if(!showing)renderCal();
}

function selD(ds){selDay=ds;renderCal();}
function openShEv(){document.getElementById('evt').value='';document.getElementById('evh').value='09:00';document.getElementById('evtp').selectedIndex=0;document.getElementById('evn').value='';openSheet('sh-ev');}
function doSaveEv(){
  const ds=selDay||today();
  E.push({id:Date.now(),date:ds,time:document.getElementById('evh').value||'09:00',title:document.getElementById('evt').value.trim()||'Evento',type:document.getElementById('evtp').value,notes:document.getElementById('evn').value.trim()});
  svE();closeSheet('sh-ev');renderCal();snack('📅 Evento guardado','📅');
}
function showDayEvs(ds){
  const de=E.filter(e=>e.date===ds).sort((a,b)=>a.time.localeCompare(b.time));
  document.getElementById('cal-sh').innerHTML=`Eventos ${fmtD(ds)} <span class="sh2-n">${de.length}</span>`;
  document.getElementById('cal-evs').innerHTML=de.map(e=>`
    <div class="cal-ev${e.type==='visit'?' vis':''}">
      <div class="cev-t">${e.time}</div>
      <div class="cev-info"><div class="cev-ti">${e.title}</div>${e.notes?`<div class="cev-s">${e.notes}</div>`:''}</div>
      <button type="button" class="cev-del" onclick="delEv(${e.id})">✕</button>
    </div>`).join('')||'<p style="font-size:11px;color:var(--mut);text-align:center;padding:8px">Sin eventos</p>';
}
function delEv(id){E=E.filter(e=>e.id!==id);svE();renderCal();snack('Evento eliminado');}

/* ===== STATS ===== */
function renderStats(){
  detectDups();
  const total=R.length;
  if(!total){document.getElementById('stats-content').innerHTML=emptyState('📊','Sin datos aún','Agrega beneficiarios para ver estadísticas, gráficas y análisis de cobertura','➕ Agregar primero',"openShAdd()");return;}
  const act=R.filter(r=>r.estatus==='Activo').length,inact=R.filter(r=>r.estatus==='Inactivo').length;
  const pend=R.filter(r=>r.estatus==='Pendiente').length,baja=R.filter(r=>r.estatus==='Baja').length;
  const dups=R.filter(r=>r.dup).length,mx=R.filter(r=>r.uso==='Mexico').length;
  const usa=R.filter(r=>r.uso==='Estados Unidos').length;
  const visOk=R.filter(r=>r.visita==='Si').length,visPe=R.filter(r=>r.visita==='Pendiente').length,visNo=R.filter(r=>r.visita==='No').length;
  const progData=Object.entries(P).map(([k,p])=>({k,p,cnt:R.filter(r=>r.tipo===k).length})).filter(x=>x.cnt>0);
  const donut=buildDonut(progData.map(x=>({n:x.cnt,c:x.p.clr,l:x.k})));
  const secciones=[...new Set(R.map(r=>r.seccion).filter(Boolean))].sort();
  // Build 7-day activity data
  const days7=[];
  for(let i=6;i>=0;i--){
    const d=new Date();d.setDate(d.getDate()-i);
    const ds=d.toISOString().slice(0,10);
    const dayLabel=['Do','Lu','Ma','Mi','Ju','Vi','Sá'][d.getDay()];
    const regs=R.filter(r=>r.fecha===ds).length;
    const vis=H.filter(h=>h.tipo==='edit'&&h.fecha&&h.fecha.includes(d.toLocaleDateString('es-MX',{day:'2-digit',month:'short'}))).length;
    days7.push({ds,dayLabel,regs,vis,isToday:i===0});
  }
  const maxAct=Math.max(1,...days7.map(d=>d.regs+d.vis));
  const weekTotal7=days7.reduce((s,d)=>s+d.regs+d.vis,0);
  const weekHtml=`<div class="stat-week-card">
    <div class="stat-week-hdr">
      <span class="stat-week-title">📅 Actividad últimos 7 días</span>
      <span class="stat-week-total">${weekTotal7} acciones</span>
    </div>
    <div class="week-chart">
      ${days7.map(d=>{
        const pct=Math.round((d.regs+d.vis)/maxAct*100)||3;
        return `<div class="wc-col">
          <div class="wc-n">${d.regs+d.vis||''}</div>
          <div class="wc-bar-wrap"><div class="wc-bar" style="height:${pct}%;background:${d.isToday?'var(--a)':'var(--b3)'}"></div></div>
          <div class="wc-day" style="${d.isToday?'color:var(--a2)':''}">${d.dayLabel}</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;

  document.getElementById('stats-content').innerHTML=weekHtml+`
    <div class="stat-quick">
      <div class="sqc" onclick="go('registros')"><div class="sqc-n" style="color:var(--a2)">${total}</div><div class="sqc-l">Total</div></div>
      <div class="sqc" onclick="openQF('act','✓ Activos')"><div class="sqc-n" style="color:var(--grn)">${act}</div><div class="sqc-l">Activos</div></div>
      <div class="sqc" onclick="openQF('usa','✈️ USA')"><div class="sqc-n" style="color:var(--usa)">${usa}</div><div class="sqc-l">USA</div></div>
      <div class="sqc" onclick="openDupMgr()"><div class="sqc-n" style="color:var(--red)">${dups}</div><div class="sqc-l">Dups</div></div>
    </div>
    ${(()=>{
      const noDom=R.filter(r=>r.estatus==='Activo'&&!r.dom&&!r.col).length;
      const noTel=R.filter(r=>r.estatus==='Activo'&&!r.tel).length;
      if(!noDom&&!noTel)return '';
      return `<div style="display:flex;gap:7px;margin-bottom:12px">
        ${noDom?`<div style="flex:1;background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.25);border-radius:10px;padding:9px 10px;text-align:center;cursor:pointer" onclick="openQF('act','✓ Activos')">
          <div style="font-size:18px;font-weight:800;font-family:var(--fnt2);color:var(--amb)">${noDom}</div>
          <div style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;margin-top:1px">Sin dirección</div>
        </div>`:''}
        ${noTel?`<div style="flex:1;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:9px 10px;text-align:center;cursor:pointer" onclick="openQF('act','✓ Activos')">
          <div style="font-size:18px;font-weight:800;font-family:var(--fnt2);color:var(--red)">${noTel}</div>
          <div style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;margin-top:1px">Sin teléfono</div>
        </div>`:''}
      </div>`;
    })()}
    <div class="ch-card">
      <div class="ch-title">Distribución por programa</div>
      ${progData.map(x=>`<div class="bar-row"><div class="bar-lbl">${x.p.ico} ${x.k}</div><div class="bar-wrap"><div class="bar-fill" style="width:${Math.round(x.cnt/total*100)}%;background:${x.p.clr}"></div></div><div class="bar-n" style="color:${x.p.clr}">${x.cnt}</div></div>`).join('')}
    </div>
    <div class="ch-card">
      <div class="ch-title">Proporción por programa</div>
      <div class="donut-wrap">${donut}<div style="flex:1">${progData.map(x=>`<div class="dl-item"><div class="dl-dot" style="background:${x.p.clr}"></div><span style="flex:1;color:var(--t2)">${x.p.ico} ${x.k}</span><span class="dl-n">${x.cnt} (${Math.round(x.cnt/total*100)}%)</span></div>`).join('')}</div></div>
    </div>
    <div class="ch-card">
      <div class="ch-title">Estatus de beneficiarios</div>
      ${[['Activo',act,'#22c55e'],['Inactivo',inact,'#f87171'],['Pendiente',pend,'#fbbf24'],['Baja',baja,'#f472b6']].map(([l,n,c])=>`<div class="bar-row"><div class="bar-lbl">${l}</div><div class="bar-wrap"><div class="bar-fill" style="width:${total?Math.round(n/total*100):0}%;background:${c}"></div></div><div class="bar-n" style="color:${c}">${n}</div></div>`).join('')}
    </div>
    <div class="ch-card">
      <div class="ch-title">🌎 México vs Migrantes USA</div>
      <div class="bar-row"><div class="bar-lbl">🇲🇽 México</div><div class="bar-wrap"><div class="bar-fill" style="width:${total?Math.round(mx/total*100):0}%;background:var(--grn)"></div></div><div class="bar-n" style="color:var(--grn)">${mx}</div></div>
      <div class="bar-row"><div class="bar-lbl">✈️ USA</div><div class="bar-wrap"><div class="bar-fill" style="width:${total?Math.round(usa/total*100):0}%;background:var(--usa)"></div></div><div class="bar-n" style="color:var(--usa)">${usa}</div></div>
    </div>
    ${(()=>{
      const now=new Date();
      const ages=R.filter(r=>r.fnac).map(r=>{try{return Math.floor((now-new Date(r.fnac+'T00:00:00'))/(365.25*24*3600*1000));}catch{return null;}}).filter(a=>a&&a>0&&a<120);
      if(ages.length<3)return'';
      const avg=Math.round(ages.reduce((a,b)=>a+b,0)/ages.length);
      const brackets=[['60-69',ages.filter(a=>a>=60&&a<70).length,'#60a5fa'],['70-79',ages.filter(a=>a>=70&&a<80).length,'#34d399'],['80-89',ages.filter(a=>a>=80&&a<90).length,'#f472b6'],['90+',ages.filter(a=>a>=90).length,'#fb923c'],['<60',ages.filter(a=>a<60).length,'#94a3b8']].filter(x=>x[1]>0);
      const maxAge=Math.max(1,...brackets.map(b=>b[1]));
      return`<div class="ch-card">
        <div class="ch-title" style="display:flex;justify-content:space-between;align-items:center">
          <span>👴 Distribución de edades</span>
          <span style="font-size:10px;font-weight:700;color:var(--sft)">Prom. ${avg} años · ${ages.length} con fecha</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(${Math.min(brackets.length,5)},1fr);gap:6px;margin-top:8px">
          ${brackets.map(([lbl,n,c])=>`<div style="text-align:center">
            <div style="height:48px;display:flex;align-items:flex-end;justify-content:center;margin-bottom:4px">
              <div style="width:28px;background:${c};border-radius:4px 4px 0 0;height:${Math.max(6,Math.round(n/maxAge*44))}px;transition:.4s"></div>
            </div>
            <div style="font-size:14px;font-weight:800;font-family:var(--fnt2);color:${c}">${n}</div>
            <div style="font-size:8px;font-weight:700;color:var(--mut);text-transform:uppercase">${lbl}</div>
          </div>`).join('')}
        </div>
      </div>`;
    })()}
    ${(()=>{
      const vencidas=R.filter(r=>r.estatus==='Activo'&&r.fecha&&daysSince(r.fecha)>30&&r.visita!=='Si');
      if(!vencidas.length)return'';
      return`<div class="ch-card" style="border-color:rgba(239,68,68,.2);background:rgba(239,68,68,.04)">
        <div class="ch-title" style="color:var(--red)">⚠️ Visitas vencidas (+30 días sin actualizar)</div>
        <div style="font-size:28px;font-weight:800;font-family:var(--fnt2);color:var(--red);margin:4px 0">${vencidas.length}</div>
        <div style="font-size:11px;color:var(--mut);margin-bottom:8px">Beneficiarios activos sin visita en más de 30 días</div>
        ${vencidas.slice(0,3).map(r=>`<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-top:1px solid var(--b1)">
          <div style="width:28px;height:28px;border-radius:8px;background:rgba(239,68,68,.15);color:var(--red);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">${daysSince(r.fecha)}d</div>
          <div style="flex:1;min-width:0"><div style="font-size:11px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.nombre}</div><div style="font-size:9px;color:var(--mut)">${r.folio} · Sec.${r.seccion||'?'}</div></div>
          <button onclick="openDet(${r.id})" style="background:var(--red);color:#fff;border:none;border-radius:7px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;flex-shrink:0">Ver</button>
        </div>`).join('')}
        ${vencidas.length>3?`<div style="font-size:10px;color:var(--mut);margin-top:6px;text-align:center">+${vencidas.length-3} más con visita vencida</div>`:''}
      </div>`;
    })()}
    ${secciones.length?`<div class="ch-card"><div class="ch-title">📍 Registros por Sección</div>${secciones.map(sec=>{const cnt=R.filter(r=>r.seccion===sec).length;const vis=R.filter(r=>r.seccion===sec&&(r.visita==='Si'||r.visita==='Sí')).length;return`<div class="bar-row"><div class="bar-lbl">Sec. ${sec}</div><div class="bar-wrap"><div class="bar-fill" style="width:${total?Math.round(cnt/total*100):0}%;background:var(--a)"></div></div><div class="bar-n">${cnt}</div></div>`;}).join('')}</div>`:''}
    <div class="ch-card">
      <div class="ch-title">🚗 Estado de visitas</div>
      ${[['✅ Visitados',visOk,'#22c55e'],['⏳ Pendiente',visPe,'#fbbf24'],['❌ Sin visita',visNo,'#f87171']].map(([l,n,c])=>`<div class="bar-row"><div class="bar-lbl">${l}</div><div class="bar-wrap"><div class="bar-fill" style="width:${total?Math.round(n/total*100):0}%;background:${c}"></div></div><div class="bar-n" style="color:${c}">${n}</div></div>`).join('')}
    </div>
    ${(()=>{const aD=[...new Set(R.map(r=>r.area).filter(Boolean))].sort().map(a=>{const n=R.filter(r=>r.area===a).length,v=R.filter(r=>r.area===a&&r.visita==='Si').length;return{a,n,v};});return aD.length?`<div class="ch-card"><div class="ch-title">🏘️ Avance por Área</div>${aD.map(({a,n,v})=>`<div class="bar-row"><div class="bar-lbl" style="max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px">${a}</div><div class="bar-wrap"><div class="bar-fill" style="width:${n?Math.round(v/n*100):0}%;background:var(--grn)"></div></div><div class="bar-n" style="color:var(--grn)">${v}/${n}</div></div>`).join('')}</div>`:'';})()}
    ${(()=>{const rD=[...new Set(R.map(r=>r.ruta).filter(Boolean))].sort().map(rt=>{const n=R.filter(r=>r.ruta===rt).length,v=R.filter(r=>r.ruta===rt&&r.visita==='Si').length;return{rt,n,v};});return rD.length?`<div class="ch-card"><div class="ch-title">🗺️ Avance por Ruta</div>${rD.map(({rt,n,v})=>`<div class="bar-row"><div class="bar-lbl" style="max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:10px">${rt}</div><div class="bar-wrap"><div class="bar-fill" style="width:${n?Math.round(v/n*100):0}%;background:var(--a)"></div></div><div class="bar-n" style="color:var(--a2)">${v}/${n}</div></div>`).join('')}</div>`:'';})()}
    `;
}
  setTimeout(_enhanceStats,200);
function buildDonut(segs){
  const tot=segs.reduce((s,x)=>s+x.n,0);if(!tot)return'';
  const R2=46,cx=56,cy=56,circ=2*Math.PI*R2;let off=0,paths='';
  segs.forEach(s=>{const dash=circ*s.n/tot;paths+=`<circle cx="${cx}" cy="${cy}" r="${R2}" fill="none" stroke="${s.c}" stroke-width="14" stroke-dasharray="${dash} ${circ-dash}" stroke-dashoffset="${-off}"/>`;off+=dash;});
  return`<svg width="112" height="112" viewBox="0 0 112 112"><circle cx="${cx}" cy="${cy}" r="${R2}" fill="none" stroke="var(--s2)" stroke-width="14"/>${paths}<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="middle" fill="var(--txt)" font-size="14" font-weight="800" font-family="JetBrains Mono">${tot}</text></svg>`;
}

/* ===== DOWNLOAD ===== */
/* renderDL → moved to export module */
const COLS=['ID','Folio','Nombre','Programa','Teléfono','Domicilio','Número','Colonia','Sección','Área','Ruta','CURP','F.Nac','Visita','Uso','Estatus','Fecha','Ult.Edición','Obs.','Duplicado'];
const rowData=r=>[r.id,r.folio,r.nombre,r.tipo,r.tel||'',r.dom||'',r.num||'',r.col||'',r.seccion||'',r.area||'',r.ruta||'',r.curp||'',r.fnac||'',r.visita,r.uso,r.estatus,r.fecha||'',r.ult||'',r.obs||'',r.dup?'SI':'NO'];
function dlFile(name,url,isBlob=false){const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{document.body.removeChild(a);if(isBlob)URL.revokeObjectURL(url);},300);}
function dlCSV(){
  if(typeof requirePerm==='function'&&!requirePerm('exportData','Exportar datos requiere una cuenta')) return;
  const rows=[COLS,...R.map(rowData)];const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');dlFile(`Pensionados_${today()}.csv`,'data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv));snack('⬇️ CSV descargado','⬇️');}
function dlFilteredCSV(){
  // Get currently filtered records (same logic as renderList)
  const fl=R.filter(r=>{
    const mt=fT==='todos'||r.tipo===fT;
    let ms=true;
    if(fS==='act')ms=r.estatus==='Activo';
    if(fS==='dup'){detectDups();ms=r.dup;}
    if(fS==='usa')ms=r.uso==='Estados Unidos';
    if(fS==='vis_pe')ms=r.visita==='Pendiente';
    if(fS==='vis_no')ms=r.visita==='No';
    if(fS&&fS.startsWith('sec_'))ms=r.seccion===fS.slice(4);
    return mt&&ms;
  });
  if(!fl.length){snack('⚠️ Sin registros para exportar','⚠️');return;}
  const rows=[COLS,...fl.map(rowData)];
  const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  dlFile(`Pensionados_filtrado_${today()}.csv`,'data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv));
  snack(`⬇️ ${fl.length} registros exportados`,'⬇️');
}
function dlHistCSV(){const rows=[['ID','Folio','Nombre','Cambios','Motivo','Resp.','Fecha'],...H.map(h=>[h.id,h.folio,h.nombre,h.cambios,h.motivo,h.resp,h.fecha])];const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');dlFile(`Historial_${today()}.csv`,'data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv));snack('⬇️ Historial descargado','⬇️');}
function dlVisCSV(){const rows=[['ID','Título','Fecha','Hora','Resp.','Beneficiarios','Notas'],...V.map(v=>[v.id,v.title,v.date,v.time,v.resp,v.people.map(p=>p.nombre).join('|'),v.notes||''])];const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');dlFile(`Visitas_${today()}.csv`,'data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv));snack('⬇️ Visitas descargado','⬇️');}
function dlXLSX(){
  if(typeof requirePerm==='function'&&!requirePerm('exportData','Exportar datos requiere una cuenta')) return;
  const esc=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const L='ABCDEFGHIJKLMNO';
  const rows=[COLS,...R.map(rowData)];
  let xml='<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>';
  rows.forEach((row,ri)=>{xml+=`<row r="${ri+1}">`;row.forEach((cell,ci)=>{const ref=L[ci]+(ri+1);xml+=typeof cell==='number'?`<c r="${ref}" t="n"><v>${cell}</v></c>`:`<c r="${ref}" t="inlineStr"><is><t>${esc(cell)}</t></is></c>`;});xml+='</row>';});
  xml+='</sheetData></worksheet>';
  const enc=new TextEncoder();
  function crc(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++){c^=b[i];for(let j=0;j<8;j++)c=c&1?(c>>>1)^0xEDB88320:(c>>>1);}return(c^0xFFFFFFFF)>>>0;}
  function u16(n){return[n&0xFF,(n>>8)&0xFF];}
  function u32(n){return[n&0xFF,(n>>8)&0xFF,(n>>16)&0xFF,(n>>24)&0xFF];}
  const files={'xl/worksheets/sheet1.xml':xml,'xl/workbook.xml':'<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Pensionados" sheetId="1" r:id="rId1"/></sheets></workbook>','xl/_rels/workbook.xml.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>','[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>','_rels/.rels':'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'};
  let ent=[],off=0,cen=[];
  for(const[name,content]of Object.entries(files)){const d=enc.encode(content);const cr=crc(d);const nb=enc.encode(name);const lh=[0x50,0x4B,0x03,0x04,20,0,0,0,0,0,0,0,0,0,...u32(cr),...u32(d.length),...u32(d.length),...u16(nb.length),0,0,...nb];const lo=off;ent.push(...lh,...d);cen.push(0x50,0x4B,0x01,0x02,20,0,20,0,0,0,0,0,0,0,0,0,...u32(cr),...u32(d.length),...u32(d.length),...u16(nb.length),0,0,0,0,0,0,0,0,0,0,...u32(lo),...nb);off+=lh.length+d.length;}
  const eocd=[0x50,0x4B,0x05,0x06,0,0,0,0,...u16(Object.keys(files).length),...u16(Object.keys(files).length),...u32(cen.length),...u32(off),0,0];
  const blob=new Blob([new Uint8Array([...ent,...cen,...eocd])],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  dlFile(`Pensionados_${today()}.xlsx`,URL.createObjectURL(blob),true);snack('⬇️ Excel descargado','⬇️');
}

/* ===== IMPORT ===== */
function handleImp(ev){
  const file=ev.target.files[0];if(!file)return;
  const out=document.getElementById('imp-out');
  out.innerHTML='<div class="imp-res"><b>⏳ Analizando…</b></div>';
  const ext=file.name.split('.').pop().toLowerCase();
  if(ext==='csv'){
    const reader=new FileReader();
    reader.onload=e=>procCSV(e.target.result,file.name,out);
    reader.readAsText(file,'UTF-8');
  } else if(ext==='xlsx'||ext==='xls'){
    // Load SheetJS if needed
    if(typeof XLSX==='undefined'){
      const s=document.createElement('script');
      s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      s.onload=()=>_procXLSX(file,out);
      s.onerror=()=>{out.innerHTML=`<div class="imp-res bad">⚠️ No se pudo cargar el lector de Excel. Verifica tu conexión o convierte a CSV primero.</div>`;};
      document.head.appendChild(s);
    } else {
      _procXLSX(file,out);
    }
  } else {
    out.innerHTML=`<div class="imp-res bad"><b>📋 ${file.name}</b><br><br>Formato no soportado. Usa archivos <b>.csv</b> o <b>.xlsx</b>.</div>`;
  }
  ev.target.value='';
}
function _procXLSX(file,out){
  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const wb=XLSX.read(new Uint8Array(e.target.result),{type:'array'});
      const ws=wb.Sheets[wb.SheetNames[0]];
      const csv=XLSX.utils.sheet_to_csv(ws,{FS:',',RS:'\n'});
      procCSV(csv,file.name,out);
    }catch(err){
      out.innerHTML=`<div class="imp-res bad">⚠️ Error leyendo Excel: ${err.message||'archivo corrupto'}. Intenta guardarlo como CSV.</div>`;
    }
  };
  reader.readAsArrayBuffer(file);
}
function procCSV(text,fname,out){
  const lines=text.split(/\r?\n/).filter(l=>l.trim());
  if(lines.length<2){out.innerHTML='<div class="imp-res bad">⚠️ Archivo vacío o inválido</div>';return;}
  // Auto-detect separator: comma, semicolon, tab, pipe
  const firstLine=lines[0];
  const sep=[',',';','\t','|'].reduce((b,s)=>firstLine.split(s).length>firstLine.split(b).length?s:b,',');
  // Normalize header: remove accents, lowercase, alphanumeric only
  const norm=s=>s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  const hdrs=firstLine.split(sep).map(norm);
  // Flexible synonym map — works even if columns are in any order
  const FM={
    folio:  ['folio','id','clave','cod','code','idbeneficiario','numbeneficiario','idregistro'],
    nombre: ['nombre','nombrecompleto','name','beneficiario','apellido','apellidos'],
    tipo:   ['tipo','programa','program','tipoprograma','modalidad'],
    tel:    ['telefono','tel','celular','movil','phone','whatsapp','contacto'],
    dom:    ['domicilio','calle','direccion','address'],
    num:    ['numero','num','ext','noexterior','numerocasa'],
    col:    ['colonia','municipio','localidad','barrio','comunidad','delegacion'],
    seccion:['seccion','secciones','section','sec'],
    area:   ['area','zona','region','distrito'],
    ruta:   ['ruta','route','camino','recorrido'],
    curp:   ['curp','claverica','rfc'],
    fnac:   ['fechanacimiento','nacimiento','fnac','fechanac','dob'],
    estatus:['estatus','status','estado','situacion'],
    obs:    ['observacion','obs','notas','nota','comentarios','descripcion'],
    lat:    ['lat','latitud','latitude'],
    lng:    ['lng','lon','longitud','longitude'],
  };
  const ci={};
  Object.keys(FM).forEach(f=>{
    for(const a of FM[f]){
      const i=hdrs.findIndex(h=>h===a||h.includes(a)||a.includes(h));
      if(i>=0){ci[f]=i;break;}
    }
  });
  // Robust CSV line parser (handles commas inside quotes)
  function parseLine(line){
    if(sep!==',')return line.split(sep);
    const cells=[];let cur='',q=false;
    for(let i=0;i<line.length;i++){
      const c=line[i];
      if(c==='"'){q=!q;}else if(c===','&&!q){cells.push(cur);cur='';}else cur+=c;
    }
    cells.push(cur);return cells;
  }
  const gc=(cells,f)=>{const i=ci[f];if(i===undefined||i>=cells.length)return'';return cells[i].trim().replace(/^["']|["']$/g,'').trim();};
  const exF=new Map(R.map(r=>[r.folio,r]));
  const newF=new Set();let added=0,toAdd=[],toUpdate=[],dups=[];
  lines.slice(1).filter(l=>l.trim()).forEach((line,idx)=>{
    const cells=parseLine(line);
    const folio=(gc(cells,'folio')||`IMP-${idx+1}`).toUpperCase();
    const nombre=gc(cells,'nombre').toUpperCase();
    if(!nombre)return;
    const tipoR=gc(cells,'tipo').toUpperCase();
    const tipo=['PAM','PCD','JCF','MT','BBJ'].includes(tipoR)?tipoR:'PAM';
    const inc={folio,nombre,tipo,tel:gc(cells,'tel'),dom:gc(cells,'dom'),num:gc(cells,'num'),col:gc(cells,'col'),seccion:gc(cells,'seccion'),area:gc(cells,'area'),ruta:gc(cells,'ruta'),curp:gc(cells,'curp').toUpperCase(),fnac:gc(cells,'fnac'),estatus:gc(cells,'estatus')||'Activo',obs:gc(cells,'obs'),lat:parseFloat(gc(cells,'lat'))||null,lng:parseFloat(gc(cells,'lng'))||null};
    if(exF.has(folio)){
      const exist=exF.get(folio);
      const LABELS={nombre:'Nombre',tel:'Teléfono',dom:'Domicilio',num:'Número',col:'Colonia',seccion:'Sección',area:'Área',ruta:'Ruta',curp:'CURP',estatus:'Estatus',obs:'Obs.',tipo:'Programa'};
      const changes=[];
      Object.keys(LABELS).forEach(k=>{const ov=(exist[k]||'').trim(),nv=(inc[k]||'').trim();if(ov!==nv&&nv)changes.push({f:k,lbl:LABELS[k],old:ov,nw:nv});});
      if(changes.length)toUpdate.push({exist,inc,changes});
      return;
    }
    if(newF.has(folio)){dups.push(inc);return;}
    newF.add(folio);toAdd.push(inc);
  });
  toAdd.forEach(rec=>{
    R.push({id:nxtId()+added,folio:rec.folio,nombre:rec.nombre,tipo:rec.tipo,tel:rec.tel,dom:rec.dom,num:rec.num,col:rec.col,seccion:rec.seccion,area:rec.area,ruta:rec.ruta,curp:rec.curp,fnac:rec.fnac,visita:'Pendiente',uso:'Mexico',estatus:rec.estatus,obs:rec.obs,fecha:today(),ult:'',dup:false,lat:rec.lat||null,lng:rec.lng||null});
    added++;
  });
  detectDups();svR();upHdr();
  const recog=Object.entries(ci).map(([f,i])=>`<span style="background:var(--s2);padding:2px 6px;border-radius:4px;font-size:9px;font-weight:700;color:var(--grn)">${hdrs[i]}→${f}</span>`).join(' ');
  let html2=`<div class="imp-res ok"><b>📂 ${fname}</b><br>
    <span style="color:var(--grn);font-size:13px;font-weight:800">✅ ${added} nuevos importados</span>
    ${toUpdate.length?`<br><span style="color:var(--org);font-size:12px;font-weight:700">🔄 ${toUpdate.length} con cambios</span>`:''}
    ${dups.length?`<br><span style="color:var(--red);font-size:11px">⚠️ ${dups.length} duplicados en archivo</span>`:''}
    <div style="margin-top:7px;font-size:9px;color:var(--sft)">Columnas reconocidas (${Object.keys(ci).length}/${hdrs.length}):</div>
    <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:3px">${recog}</div>
  </div>`;
  if(toUpdate.length){
    window._impUpd=toUpdate.slice();
    html2+=`<button class="imp-apply-all-btn" onclick="impApplyAll()">✅ Aplicar TODOS los cambios (${toUpdate.length})</button>`;
    toUpdate.forEach((upd,i)=>{
      html2+=`<div class="imp-upd-card" id="impcard-${i}">
        <div class="imp-upd-name">${upd.exist.nombre} <span style="font-size:9px;color:var(--mut);font-family:'JetBrains Mono',monospace">${upd.exist.folio}</span></div>
        ${upd.changes.map(c=>`<div class="imp-change-row"><span class="imp-change-field">${c.lbl}</span><span class="imp-change-old">${c.old||'—'}</span><span style="color:var(--mut);padding:0 3px">→</span><span class="imp-change-new">${c.nw}</span></div>`).join('')}
        <div class="imp-upd-actions">
          <button class="imp-upd-btn-y" onclick="impApplyOne(${i})">✅ Aplicar</button>
          <button class="imp-upd-btn-n" onclick="impSkipOne(${i})">✗ Ignorar</button>
        </div>
      </div>`;
    });
  }
  if(dups.length)html2+=`<div class="imp-res bad"><b>⚠️ ${dups.length} folios duplicados en el archivo</b><br>${dups.map(r=>r.nombre).join(', ')}</div>`;
  out.innerHTML=html2;
  const clrWrap=document.getElementById('imp-clear-wrap');if(clrWrap)clrWrap.style.display='block';
  render(curTab);
  snack(`✅ ${added} importados${toUpdate.length?' · 🔄 '+toUpdate.length+' cambios':''}${dups.length?' · ⚠️ '+dups.length+' dup':''}`, '✅');
}

function impApplyOne(i){
  const upd=window._impUpd&&window._impUpd[i];if(!upd||upd._done)return;
  const r=R.find(x=>x.folio===upd.exist.folio);
  if(r){const chLog=upd.changes.map(c=>`${c.lbl}: "${c.old||'—'}"→"${c.nw}"`).join(' | ');upd.changes.forEach(c=>{r[c.f]=c.nw;});r.ult=nowStr();H.push({id:Date.now()+i,folio:r.folio,nombre:r.nombre,cambios:chLog,motivo:'Importación CSV',resp:'Sistema',fecha:nowStr(),tipo:'edit'});svH();svR();}
  upd._done=true;
  const card=document.getElementById('impcard-'+i);
  if(card){card.style.opacity='.45';card.style.pointerEvents='none';card.querySelector('.imp-upd-actions').innerHTML='<span style="color:var(--grn);font-size:11px;font-weight:800">✅ Aplicado</span>';}
  snack(`✅ ${upd.exist.nombre.split(' ')[0]} actualizado`,'✅');
}
function impSkipOne(i){
  if(window._impUpd&&window._impUpd[i])window._impUpd[i]._done=true;
  const card=document.getElementById('impcard-'+i);
  if(card){card.style.opacity='.3';card.style.pointerEvents='none';card.querySelector('.imp-upd-actions').innerHTML='<span style="color:var(--mut);font-size:11px">✗ Ignorado</span>';}
}
function impApplyAll(){
  if(!window._impUpd)return;let n=0;
  window._impUpd.forEach((upd,i)=>{if(!upd||upd._done)return;impApplyOne(i);n++;});
  renderInicio();snack(`✅ ${n} registros actualizados`,'✅');
}


/* ===== BATCH SELECT (v25) ===== */
let batchMode=false;
const batchSel=new Set();

function enterBatch(){
  batchMode=true;batchSel.clear();
  document.getElementById('batch-bar').classList.add('on');
  renderList();
  renderBulkBar();
}
function exitBatch(){
  batchMode=false;batchSel.clear();
  document.getElementById('batch-bar').classList.remove('on');
  renderList();
}
function toggleBatchRec(id){
  if(batchSel.has(id))batchSel.delete(id);else batchSel.add(id);
  const el=document.querySelector(`.rec[data-id="${id}"]`);
  if(el)el.classList.toggle('batch-sel',batchSel.has(id));
  const n=batchSel.size;
  document.getElementById('batch-txt').textContent=n+' seleccionado'+(n!==1?'s':'');
  renderBulkBar();
}
function batchMarkVisited(){
  if(!batchSel.size){snack('⚠️ Selecciona al menos uno','⚠️');return;}
  conf2('Marcar como visitados',`¿Marcar ${batchSel.size} beneficiarios como visitados?`,()=>{
    batchSel.forEach(id=>{const r=R.find(x=>x.id===id);if(r){r.visita='Si';r.ult=nowStr();}});
    svR();exitBatch();snack(`✅ ${batchSel.size} marcados como visitados`,'✅');
  },'Marcar');
}
function batchExport(){
  if(!batchSel.size){snack('⚠️ Selecciona al menos uno','⚠️');return;}
  const sel=R.filter(r=>batchSel.has(r.id));
  const rows=[COLS,...sel.map(rowData)];
  const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  dlFile(`Seleccion_${today()}.csv`,'data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv));
  snack(`⬇️ ${sel.length} exportados`,'⬇️');
}
function batchDelete(){
  if(!batchSel.size){snack('⚠️ Selecciona al menos uno','⚠️');return;}
  conf2('Eliminar seleccionados',`¿Eliminar ${batchSel.size} beneficiarios? No se puede deshacer.`,()=>{
    batchSel.forEach(id=>{
      const r=R.find(x=>x.id===id);
      if(r)H.push({id:Date.now()+id,folio:r.folio,nombre:r.nombre,cambios:'Eliminación masiva',motivo:'Batch delete',resp:'Usuario',fecha:nowStr(),tipo:'del'});
    });
    svH();R=R.filter(r=>!batchSel.has(r.id));detectDups();svR();
    exitBatch();upHdr();snack('🗑️ Registros eliminados','🗑️');
  },'Eliminar');
}

/* ===== COPY ADDRESS (v25) ===== */
function copyAddr(id){
  const r=R.find(x=>x.id===id);if(!r)return;
  const parts=[r.dom,r.num?'#'+r.num:'',r.col].filter(Boolean);
  const addr=parts.join(', ')+(r.seccion?' (Sec. '+r.seccion+')':'');
  if(!addr){snack('Sin domicilio registrado','⚠️');return;}
  navigator.clipboard?.writeText(addr).then(()=>snack('📋 Dirección copiada','📋')).catch(()=>{
    // fallback
    const ta=document.createElement('textarea');ta.value=addr;
    document.body.appendChild(ta);ta.select();document.execCommand('copy');
    document.body.removeChild(ta);snack('📋 Dirección copiada','📋');
  });
}

/* ===== CURP AUTO-PARSE (v25) ===== */
function parseCURP(curp){
  // CURP format: AAAA######XXXXXNN
  if(!curp||curp.length<10)return null;
  try{
    const yr=parseInt(curp.slice(4,6));
    const mo=parseInt(curp.slice(6,8));
    const dy=parseInt(curp.slice(8,10));
    const sex=curp[10]||'';
    const fullYr=yr<=25?2000+yr:1900+yr;
    if(mo<1||mo>12||dy<1||dy>31)return null;
    return{
      fnac:`${fullYr}-${String(mo).padStart(2,'0')}-${String(dy).padStart(2,'0')}`,
      sexo:sex==='H'?'Hombre':sex==='M'?'Mujer':'',
    };
  }catch{return null;}
}
// Auto-fill DOB from CURP when editing
(function patchCURP(){
  const origSave=window.doSaveRec;
})();
function onCURPInput(val){
  val=val.toUpperCase();
  document.getElementById('e-curp').value=val;
  const p=parseCURP(val);
  const disp=document.getElementById('edad-display');
  if(p&&p.fnac){
    const fnacEl=document.getElementById('e-fnac');
    if(fnacEl&&!fnacEl.value){
      fnacEl.value=p.fnac;
      updEdad();
    }
    if(disp&&p.sexo){
      const age=document.getElementById('edad-display').textContent;
      disp.textContent=(age?age+' · ':'')+'Sexo: '+p.sexo;
      disp.style.display='block';
    }
  }
}

/* ===== QUICK STATS CARD CLICK (v25 fix) ===== */

/* ===== ID MANUAL LIVE VALIDATION (v27) ===== */
function onIdManualInput(val){
  const warn=document.getElementById('form-id-warn');
  const sub=document.getElementById('form-id-sub');
  const tag=document.getElementById('form-id-mode-tag');
  const n=parseInt(val);
  if(!val||!n){
    // Empty = auto
    if(warn) warn.style.display='none';
    if(editId===null){
      const next=R.length?Math.max(...R.map(r=>r.id))+1:1;
      if(sub) sub.textContent='Deja vacío para asignar automáticamente (#'+next+')';
      if(tag){ tag.textContent='NUEVO'; tag.style.color='rgba(255,255,255,.6)';}
    }
    return;
  }
  // Check if ID is taken by a DIFFERENT record
  const conflict=R.find(x=>x.id===n&&x.id!==editId);
  if(conflict){
    if(warn){ warn.style.display='block'; warn.textContent='⚠️ ID #'+n+' ya está en uso por: '+conflict.nombre.split(' ')[0];}
    if(sub) sub.textContent='Elige un ID diferente';
    if(tag){ tag.textContent='EN USO'; tag.style.color='rgba(239,68,68,.9)';}
  } else {
    if(warn) warn.style.display='none';
    if(sub) sub.textContent=editId?'Cambiando ID: #'+editId+' → #'+n:'ID asignado manualmente: #'+n;
    if(tag){ tag.textContent='#'+n+' OK'; tag.style.color='rgba(134,239,172,.9)';}
  }
}
/* ===== IMPORTAR PAGE INIT ===== */
function renderImportarPg(){
  // Reset the file input so the same file can be re-imported after clearing
  const fi=document.getElementById('file-in');
  if(fi)fi.value='';
  // Show stats summary at top of importar page
  const wrap=document.getElementById('imp-stats-banner');
  if(wrap){
    const total=R.length;
    const pendV=R.filter(r=>r.visita==='Pendiente').length;
    wrap.innerHTML=total
      ?`<div style="display:flex;gap:8px;margin-bottom:12px">
          <div style="flex:1;background:var(--card);border:1px solid var(--b1);border-radius:var(--r2);padding:10px 8px;text-align:center">
            <div style="font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace;color:var(--a2)">${total}</div>
            <div style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.4px">Registros</div>
          </div>
          <div style="flex:1;background:var(--card);border:1px solid var(--b1);border-radius:var(--r2);padding:10px 8px;text-align:center">
            <div style="font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace;color:var(--amb)">${pendV}</div>
            <div style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.4px">Pendientes</div>
          </div>
          <div style="flex:1;background:var(--card);border:1px solid var(--b1);border-radius:var(--r2);padding:10px 8px;text-align:center">
            <div style="font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace;color:var(--grn)">${R.filter(r=>r.visita==='Si').length}</div>
            <div style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.4px">Visitados</div>
          </div>
        </div>`
      :'';
  }
}

/* ===== DUP MANAGER ===== */
let dupSel=new Set();
function openDupMgr(){detectDups();dupSel=new Set();renderDupMgr();openSheet('sh-dups');}
function renderDupMgr(){
  detectDups();
  const dups=R.filter(r=>r.dup);
  document.getElementById('dup-del-all').style.display=dups.length?'block':'none';
  const allIds=dups.map(r=>r.id),allSel=allIds.length&&allIds.every(id=>dupSel.has(id));
  const chkAll=document.getElementById('chk-all');
  chkAll.classList.toggle('on',allSel);chkAll.textContent=allSel?'✓':'';
  document.getElementById('sel-lbl').textContent=dupSel.size?`${dupSel.size} seleccionado${dupSel.size>1?'s':''}`:'Seleccionar todos';
  const delBtn=document.getElementById('dup-del-sel');delBtn.disabled=!dupSel.size;
  delBtn.textContent=dupSel.size?`🗑️ Eliminar ${dupSel.size}`:'🗑️ Eliminar';
  if(!dups.length){document.getElementById('dup-list').innerHTML='<div class="empty"><div class="empty-ico">✅</div><h3>Sin duplicados</h3><p>No hay folios repetidos</p></div>';return;}
  const groups={};dups.forEach(r=>{if(!groups[r.folio])groups[r.folio]=[];groups[r.folio].push(r);});
  let html='';
  Object.entries(groups).forEach(([folio,recs])=>{
    html+=`<div style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;padding:4px 2px;letter-spacing:.5px;margin-bottom:4px">📂 Folio ${folio} — ${recs.length} registros</div>`;
    recs.forEach((r,idx)=>{const p=pg(r.tipo),sel=dupSel.has(r.id);
      const vc=VIS[r.visita]||VIS['Pendiente'],uc=USO[r.uso]||USO['Mexico'];
      html+=`<div class="dup-rec${sel?' sel':''}" id="dr-${r.id}">
        <div class="dup-head" onclick="togDupSel(${r.id})">
          <div class="dup-chk">${sel?'✓':''}</div>
          <div class="av" style="width:38px;height:38px;border-radius:11px;background:${p.bg};color:${p.clr};flex-shrink:0">${ini(r.nombre)}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r.nombre}</div>
            <div style="font-size:9px;font-family:'JetBrains Mono',monospace;color:var(--mut)">${r.folio} · ID ${r.id}${r.seccion?' · Sec.'+r.seccion:''}</div>
            <div class="dup-pill">⚠️ DUPLICADO ${idx+1}</div>
          </div>
        </div>
        <div class="dup-fields">
          <div class="dup-field"><span>Teléfono</span>${r.tel||'—'}</div>
          <div class="dup-field"><span>Estatus</span>${r.estatus}</div>
          <div class="dup-field"><span>Visita</span>${vc.ico} ${r.visita}</div>
          <div class="dup-field"><span>Uso</span>${uc.ico} ${r.uso}</div>
          ${r.obs?`<div class="dup-field" style="grid-column:1/-1"><span>Obs.</span>${r.obs}</div>`:''}
        </div>
        <div class="dup-acts">
          <button type="button" class="btn btn-s" style="padding:8px;font-size:11px" onclick="openDet(${r.id})">👁️ Ver</button>
          <button type="button" class="btn btn-d" style="padding:8px;font-size:11px" onclick="delDupOne(${r.id})">🗑️ Eliminar</button>
        </div>
      </div>`;
    });
  });
  document.getElementById('dup-list').innerHTML=html;
}
function togDupSel(id){if(dupSel.has(id))dupSel.delete(id);else dupSel.add(id);renderDupMgr();}
function toggleSelAll(){const allIds=R.filter(r=>r.dup).map(r=>r.id);const allSel=allIds.every(id=>dupSel.has(id));if(allSel)dupSel.clear();else allIds.forEach(id=>dupSel.add(id));renderDupMgr();}
function delDupOne(id){const r=R.find(x=>x.id===id);conf2('Eliminar duplicado',`¿Eliminar "${r?.nombre}"?`,()=>{H.push({id:Date.now(),folio:r.folio,nombre:r.nombre,cambios:'Duplicado eliminado',motivo:'Gestión duplicados',resp:'Usuario',fecha:nowStr(),tipo:'del'});svH();R=R.filter(x=>x.id!==id);dupSel.delete(id);detectDups();svR();upHdr();renderDupMgr();renderInicio();snack('🗑️ Duplicado eliminado','🗑️');});}
function delSelected(){if(!dupSel.size)return;const n=dupSel.size;conf2('Eliminar seleccionados','¿Eliminar '+n+' registro(s)? No se puede deshacer.',()=>{dupSel.forEach(id=>{const r=R.find(x=>x.id===id);if(r)H.push({id:Date.now()+id,folio:r.folio,nombre:r.nombre,cambios:'Duplicado eliminado',motivo:'Eliminación masiva',resp:'Usuario',fecha:nowStr(),tipo:'del'});});svH();R=R.filter(x=>!dupSel.has(x.id));dupSel.clear();detectDups();svR();upHdr();renderDupMgr();renderInicio();snack('🗑️ '+n+' duplicados eliminados','🗑️');},'Eliminar '+n);}
function confDelAllDups(){detectDups();const dups=R.filter(r=>r.dup);if(!dups.length)return;conf2('Eliminar TODOS',`¿Eliminar ${dups.length} duplicados?`,()=>{dups.forEach(r=>H.push({id:Date.now()+r.id,folio:r.folio,nombre:r.nombre,cambios:'Dup eliminado (masiva)',motivo:'Eliminar todos',resp:'Usuario',fecha:nowStr(),tipo:'del'}));svH();const ids=new Set(dups.map(r=>r.id));R=R.filter(r=>!ids.has(r.id));dupSel.clear();detectDups();svR();upHdr();closeAllSheets();renderInicio();snack(`🗑️ ${dups.length} duplicados eliminados`,'🗑️');},`Eliminar ${dups.length}`);}


/* ===== v13: APARIENCIA ===== */
const ACCENT_COLORS=[
  {name:'Azul',    val:'#3b82f6',grad:'linear-gradient(135deg,#1d4ed8,#6366f1)'},
  {name:'Verde',   val:'#10b981',grad:'linear-gradient(135deg,#065f46,#10b981)'},
  {name:'Ámbar',   val:'#f59e0b',grad:'linear-gradient(135deg,#92400e,#f59e0b)'},
  {name:'Rosa',    val:'#ec4899',grad:'linear-gradient(135deg,#9d174d,#ec4899)'},
  {name:'Violeta', val:'#8b5cf6',grad:'linear-gradient(135deg,#3730a3,#8b5cf6)'},
  {name:'Rojo',    val:'#ef4444',grad:'linear-gradient(135deg,#7f1d1d,#ef4444)'},
  {name:'Cyan',    val:'#06b6d4',grad:'linear-gradient(135deg,#164e63,#06b6d4)'},
  {name:'Naranja', val:'#f97316',grad:'linear-gradient(135deg,#7c2d12,#f97316)'},
];
let curAccent=localStorage.getItem('px_accent')||null;
let curFontSize=parseInt(localStorage.getItem('px_fz')||'100');
let curBgBright=parseInt(localStorage.getItem('px_bgbright')||'0');
// restore on load
(function(){
  if(curFontSize!==100)document.body.style.fontSize=(curFontSize/100)+'rem';
  const sa=localStorage.getItem('px_accent'),sg=localStorage.getItem('px_accent_grad');
  if(sa){document.documentElement.style.setProperty('--a',sa);document.documentElement.style.setProperty('--a2',sa+'cc');if(sg)document.documentElement.style.setProperty('--lg',sg);}
  if(curBgBright>0)document.documentElement.style.setProperty('--bg-bright-overlay',`rgba(255,255,255,${curBgBright/400})`);
})();
function applyFontSize(val){
  curFontSize=parseInt(val);
  document.body.style.fontSize=(curFontSize/100)+'rem';
  const fp=document.getElementById('fz-preview');if(fp)fp.textContent=curFontSize+'%';
  localStorage.setItem('px_fz',curFontSize);
  snack('🔡 Fuente: '+curFontSize+'%','🔡');
}
function applyBgBright(val){
  curBgBright=parseInt(val);
  const bp=document.getElementById('bg-bright-preview');if(bp)bp.textContent=val+'%';
  if(curBgBright===0)document.documentElement.style.removeProperty('--bg-bright-overlay');
  else document.documentElement.style.setProperty('--bg-bright-overlay',`rgba(255,255,255,${curBgBright/400})`);
  localStorage.setItem('px_bgbright',curBgBright);
}
function applyAccent(i){
  const c=ACCENT_COLORS[i];if(!c)return;
  curAccent=c.val;
  localStorage.setItem('px_accent',c.val);localStorage.setItem('px_accent_grad',c.grad);
  document.documentElement.style.setProperty('--a',c.val);
  document.documentElement.style.setProperty('--a2',c.val+'cc');
  document.documentElement.style.setProperty('--lg',c.grad);
  renderAppearSheet();snack('🎨 '+c.name,'🎨');
}
function resetAppearance(){
  curFontSize=100;curBgBright=0;curAccent=null;
  localStorage.removeItem('px_fz');localStorage.removeItem('px_bgbright');
  localStorage.removeItem('px_accent');localStorage.removeItem('px_accent_grad');
  document.body.style.fontSize='';
  ['--a','--a2','--lg','--bg-bright-overlay'].forEach(p=>document.documentElement.style.removeProperty(p));
  renderAppearSheet();snack('🔄 Apariencia restablecida','🔄');
}
function renderAppearSheet(){
  const grid=document.getElementById('accent-grid');if(!grid)return;
  grid.innerHTML=ACCENT_COLORS.map((c,i)=>`<div class="color-swatch${curAccent===c.val?' on':''}" style="background:${c.grad}" onclick="applyAccent(${i})" title="${c.name}">${curAccent===c.val?'✓':''}</div>`).join('');
  const sl=document.getElementById('fz-slider');if(sl)sl.value=curFontSize;
  const fp=document.getElementById('fz-preview');if(fp)fp.textContent=curFontSize+'%';
  const bs=document.getElementById('bg-bright-slider');if(bs)bs.value=curBgBright;
  const bp=document.getElementById('bg-bright-preview');if(bp)bp.textContent=curBgBright+'%';
}

/* ===== v13: ELIMINAR DESDE BÚSQUEDA ===== */
let srchSel=new Set();
let srchCurrentItems=[];
function _updSrchBar(){
  const bar=document.getElementById('srch-del-bar');if(!bar)return;
  const n=srchSel.size;
  const info=document.getElementById('srch-sel-info');
  const btn=document.getElementById('srch-del-sel-btn');
  if(info)info.textContent=n?`${n} seleccionado${n>1?'s':''}`:srchCurrentItems.length?`${srchCurrentItems.length} resultado${srchCurrentItems.length!==1?'s':''}`:' ';
  if(btn){btn.disabled=!n;btn.textContent=n?`🗑️ Eliminar (${n})`:'🗑️ Eliminar';}
}
function togSrchSel(id,e){
  e.stopPropagation();
  if(srchSel.has(id))srchSel.delete(id);else srchSel.add(id);
  const chk=document.getElementById('srchchk-'+id);
  if(chk){chk.classList.toggle('on',srchSel.has(id));chk.textContent=srchSel.has(id)?'✓':'';}
  _updSrchBar();
}
function delSrchSel(){
  if(!srchSel.size)return;
  const ids=new Set(srchSel);const n=ids.size;
  conf2('Eliminar seleccionados',`¿Eliminar ${n} beneficiario${n>1?'s':''}? No se puede deshacer.`,()=>{
    ids.forEach(id=>{const r=R.find(x=>x.id===id);if(r)H.push({id:Date.now()+id,folio:r.folio,nombre:r.nombre,cambios:'Eliminado desde búsqueda',motivo:'Manual',resp:'Usuario',fecha:nowStr(),tipo:'del'});});
    svH();R=R.filter(x=>!ids.has(x.id));
    srchSel=new Set();srchCurrentItems=srchCurrentItems.filter(r=>!ids.has(r.id));
    detectDups();svR();upHdr();renderInicio();
    onSI();
    snack(`🗑️ ${n} eliminado${n>1?'s':''}`,'🗑️');
  },'Eliminar '+n);
}
function delSrchAll(){
  if(!srchCurrentItems.length)return;
  const items=srchCurrentItems.slice();const n=items.length;
  conf2('Eliminar TODOS',`¿Eliminar ${n} beneficiario${n>1?'s':''} de la búsqueda actual?`,()=>{
    const ids=new Set(items.map(r=>r.id));
    ids.forEach(id=>{const r=R.find(x=>x.id===id);if(r)H.push({id:Date.now()+id,folio:r.folio,nombre:r.nombre,cambios:'Eliminado (masivo)',motivo:'Búsqueda masiva',resp:'Usuario',fecha:nowStr(),tipo:'del'});});
    svH();R=R.filter(x=>!ids.has(x.id));
    srchSel=new Set();srchCurrentItems=[];
    detectDups();svR();upHdr();renderInicio();
    clrSrch();
    snack(`🗑️ ${n} eliminado${n>1?'s':''}`,'🗑️');
  },'Eliminar '+n);
}


/* ===== v14: COLOR DE TEXTO + INFO PANEL ===== */
let currentTxtColor = '';

function setTxtColor(color, clickedEl, silent) {
  currentTxtColor = color;
  // Update swatches
  document.querySelectorAll('.txt-color-swatch').forEach(sw => {
    sw.classList.toggle('on', (sw.dataset.color || '') === color);
  });
  // Update preview
  const prev = document.getElementById('txt-color-preview');
  if (prev) {
    const nm = document.getElementById('e-nombre');
    prev.textContent = (nm && nm.value) ? nm.value : 'Vista previa del nombre';
    prev.style.color = color || 'var(--txt)';
  }
  if (!silent) snack('🎨 Color aplicado', '🎨');
}

// Update preview live as user types name
document.addEventListener('input', function(e) {
  if (e.target && e.target.id === 'e-nombre') {
    const prev = document.getElementById('txt-color-preview');
    if (prev) {
      prev.textContent = e.target.value || 'Vista previa del nombre';
      prev.style.color = currentTxtColor || 'var(--txt)';
    }
  }
});

function renderEditInfoPanel(r) {
  const panel = document.getElementById('edit-info-panel');
  if (!panel) return;
  panel.classList.add('show');
  const p = pg(r.tipo);
  const sc = SC[r.estatus] || 'bdg-def';
  const vc = VIS[r.visita] || VIS['Pendiente'];
  const uc = USO[r.uso] || USO['Mexico'];
  // Days since registration
  const daysReg = r.fecha ? daysSince(r.fecha) : null;
  // Days since last edit
  const lastEdit = r.ult || '—';
  // History count
  const histCnt = H.filter(h => h.folio === r.folio).length;
  // Visits programmed
  const visCount = V.filter(v => v.people && v.people.some(p => p.id === r.id)).length;

  document.getElementById('eip-grid').innerHTML = `
    <div class="eip-cell">
      <div class="eip-lbl">🆔 ID del sistema</div>
      <div class="eip-val" style="color:var(--a2);font-size:16px">#${r.id}</div>
    </div>
    <div class="eip-cell">
      <div class="eip-lbl">📂 Folio</div>
      <div class="eip-val">${r.folio}</div>
    </div>
    <div class="eip-cell">
      <div class="eip-lbl">📅 Registro</div>
      <div class="eip-val" style="font-size:11px">${fmtD(r.fecha)}${daysReg !== null ? '<br><span style="font-size:9px;color:var(--mut)">hace '+daysReg+' días</span>' : ''}</div>
    </div>
    <div class="eip-cell">
      <div class="eip-lbl">✏️ Última edición</div>
      <div class="eip-val" style="font-size:10px;color:var(--sft)">${lastEdit}</div>
    </div>
    <div class="eip-cell">
      <div class="eip-lbl">🚗 Visita</div>
      <div class="eip-val">${vc.ico} ${r.visita}</div>
    </div>
    <div class="eip-cell">
      <div class="eip-lbl">🌎 Ubicación</div>
      <div class="eip-val">${uc.ico} ${r.uso}</div>
    </div>
    <div class="eip-cell">
      <div class="eip-lbl">📊 Programa</div>
      <div class="eip-val" style="color:${p.clr}">${p.ico} ${p.lbl}</div>
    </div>
    <div class="eip-cell">
      <div class="eip-lbl">📝 Historial</div>
      <div class="eip-val">${histCnt} cambio${histCnt !== 1 ? 's' : ''}</div>
    </div>
    ${visCount ? `<div class="eip-cell full">
      <div class="eip-lbl">🗓️ Visitas programadas</div>
      <div class="eip-val" style="color:var(--grn)">${visCount} visita${visCount !== 1 ? 's' : ''} en agenda</div>
    </div>` : ''}
    ${r.dup ? `<div class="eip-cell full" style="border-color:var(--red)40;background:#2a0e0e">
      <div class="eip-lbl" style="color:var(--red)">⚠️ Atención</div>
      <div class="eip-val" style="color:var(--red);font-size:11px">Este registro tiene folio duplicado</div>
    </div>` : ''}
  `;
  // Recent history
  const recentH = H.filter(h => h.folio === r.folio).slice(-3).reverse();
  if (recentH.length) {
    document.getElementById('eip-hist-wrap').innerHTML = `
      <div style="font-size:9px;font-weight:800;color:var(--mut);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">Últimos cambios</div>
      ${recentH.map(h => `<div class="eip-hist-item">
        <span class="eip-hist-ico">${h.tipo === 'new' ? '✨' : h.tipo === 'del' ? '🗑️' : '✏️'}</span>
        <span class="eip-hist-txt">${h.cambios}</span>
        <span class="eip-hist-date">${h.fecha}</span>
      </div>`).join('')}`;
  } else {
    document.getElementById('eip-hist-wrap').innerHTML = '<div style="font-size:10px;color:var(--mut);text-align:center;padding:4px 0">Sin historial previo</div>';
  }
}


/* ===== v15: SECCIONES PAGE ===== */
function renderSecPg(){
  const q=(document.getElementById('sec-srch')?.value||'').trim().toLowerCase();
  const allSecs=[...new Set(R.map(r=>r.seccion).filter(Boolean))].sort();
  const filtered=q?allSecs.filter(s=>s.toLowerCase().includes(q)):allSecs;

  // Stats bar
  const totalSec=allSecs.length;
  const totalBenef=R.filter(r=>r.seccion).length;
  const totalVis=R.filter(r=>r.seccion&&(r.visita==='Si'||r.visita==='Sí')).length;
  document.getElementById('sec-pg-stats').innerHTML=`
    <div class="sec-pg-stat-bar">
      <div class="sec-pg-scard">
        <div class="sec-pg-scard-n">${totalSec}</div>
        <div class="sec-pg-scard-l">📍 Secciones</div>
      </div>
      <div class="sec-pg-scard">
        <div class="sec-pg-scard-n" style="color:var(--grn)">${totalBenef}</div>
        <div class="sec-pg-scard-l">👥 Con sección</div>
      </div>
      <div class="sec-pg-scard">
        <div class="sec-pg-scard-n" style="color:var(--amb)">${R.filter(r=>!r.seccion).length}</div>
        <div class="sec-pg-scard-l">❓ Sin sección</div>
      </div>
    </div>`;

  if(!filtered.length){
    document.getElementById('sec-pg-list').innerHTML=`
      <div class="sec-empty">
        <div class="sec-empty-ico">📍</div>
        <h3 style="font-size:15px;font-weight:800;color:var(--sft);margin-bottom:6px">${q?'Sin resultados':'Sin secciones'}</h3>
        <p style="font-size:12px;color:var(--mut)">${q?'Prueba otro término':'Asigna una sección/ruta al agregar beneficiarios'}</p>
      </div>`;
    return;
  }

  // v37: HEAT MAP de cobertura
  const allVisData=allSecs.map(s=>{
    const regs=R.filter(r=>r.seccion===s);
    const cnt=regs.length;
    const vis=regs.filter(r=>r.visita==='Si'||r.visita==='Sí').length;
    return{s,cnt,pct:cnt?Math.round(vis/cnt*100):0};
  });
  const heatEl=document.getElementById('sec-pg-heatmap');
  if(heatEl&&allVisData.length){
    const heatCells=allVisData.map(function(d){
      var s=d.s,cnt=d.cnt,pct=d.pct;
      var clr=pct>=80?'#22c55e':pct>=50?'#f59e0b':pct>=20?'#f97316':'#ef4444';
      var bg=pct>=80?'rgba(34,197,94,.15)':pct>=50?'rgba(245,158,11,.15)':pct>=20?'rgba(249,115,22,.15)':'rgba(239,68,68,.13)';
      return '<div onclick="openQF(\'sec_'+s+'\',\'📍 Sección '+s+'\')" style="background:'+bg+';border:1.5px solid '+clr+'40;border-radius:9px;padding:6px 4px;text-align:center;cursor:pointer;transition:.15s">'
        +'<div style="font-size:13px;font-weight:900;font-family:\'Fira Code\',monospace;color:'+clr+'">'+pct+'%</div>'
        +'<div style="font-size:9px;font-weight:800;color:var(--sft);margin-top:1px">Sec.'+s+'</div>'
        +'<div style="font-size:8px;color:var(--mut)">'+cnt+' reg</div>'
        +'</div>';
    }).join('');
    var c80=allVisData.filter(function(x){return x.pct>=80;}).length;
    var cMid=allVisData.filter(function(x){return x.pct>=20&&x.pct<80;}).length;
    var cLow=allVisData.filter(function(x){return x.pct<20;}).length;
    heatEl.innerHTML='<div style="background:var(--card);border:1px solid var(--b1);border-radius:14px;padding:12px 14px;margin-bottom:12px">'
      +'<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'
      +'<div style="font-size:12px;font-weight:800;color:var(--t2)">🗺️ Mapa de Cobertura</div>'
      +'<div style="display:flex;gap:8px;font-size:9px;font-weight:700;color:var(--sft)"><span>🔴 &lt;20%</span><span>🟡 50%</span><span>🟢 ≥80%</span></div>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(52px,1fr));gap:5px">'+heatCells+'</div>'
      +'<div style="margin-top:10px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center">'
      +'<div style="background:rgba(34,197,94,.1);border-radius:8px;padding:6px"><div style="font-size:14px;font-weight:900;color:#22c55e">'+c80+'</div><div style="font-size:8px;font-weight:800;color:var(--mut);text-transform:uppercase">Cubiertas ≥80%</div></div>'
      +'<div style="background:rgba(245,158,11,.1);border-radius:8px;padding:6px"><div style="font-size:14px;font-weight:900;color:#f59e0b">'+cMid+'</div><div style="font-size:8px;font-weight:800;color:var(--mut);text-transform:uppercase">En progreso</div></div>'
      +'<div style="background:rgba(239,68,68,.1);border-radius:8px;padding:6px"><div style="font-size:14px;font-weight:900;color:#ef4444">'+cLow+'</div><div style="font-size:8px;font-weight:800;color:var(--mut);text-transform:uppercase">Críticas &lt;20%</div></div>'
      +'</div></div>';
  }else if(heatEl){heatEl.innerHTML='';}

  document.getElementById('sec-pg-list').innerHTML=filtered.map(sec=>{
    const regs=R.filter(r=>r.seccion===sec);
    const cnt=regs.length;
    const vis=regs.filter(r=>r.visita==='Si'||r.visita==='Sí').length;
    const pend=regs.filter(r=>r.visita==='Pendiente').length;
    const novis=regs.filter(r=>r.visita==='No').length;
    const usa=regs.filter(r=>r.uso==='Estados Unidos').length;
    const act=regs.filter(r=>r.estatus==='Activo').length;
    const pct=cnt?Math.round(vis/cnt*100):0;
    const prog=Object.entries(regs.reduce((a,r)=>{a[r.tipo]=(a[r.tipo]||0)+1;return a;},{}).valueOf?{}:regs.reduce((a,r)=>{a[r.tipo]=(a[r.tipo]||0)+1;return a;},{}));
    // Build program breakdown
    const progBreak=Object.entries(regs.reduce((a,r)=>{a[r.tipo]=(a[r.tipo]||0)+1;return a;},{}))
      .sort((a,b)=>b[1]-a[1]).slice(0,3)
      .map(([t,n])=>`<span style="font-size:9px;font-weight:800;background:var(--s2);color:${(P[t]||{clr:'var(--sft)'}).clr};padding:2px 6px;border-radius:5px">${(P[t]||{ico:'📋'}).ico} ${t}: ${n}</span>`).join('');
    return `<div class="sec-card">
      <div class="sec-card-top">
        <div class="sec-card-num">${sec}</div>
        <div style="flex:1">
          <div class="sec-card-name">Sección ${sec}</div>
          <div style="font-size:10px;color:var(--sft);margin-top:2px">${act} activos${usa?' · ✈️ '+usa+' USA':''}</div>
          <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:4px">${progBreak}</div>
        </div>
        <div class="sec-card-cnt">${cnt}</div>
      </div>
      <div class="sec-card-bar-row">
        <div class="sec-mini-stat">
          <div class="sec-mini-n" style="color:var(--grn)">✅ ${vis}</div>
          <div class="sec-mini-l">Visitados</div>
        </div>
        <div class="sec-mini-stat">
          <div class="sec-mini-n" style="color:var(--amb)">⏳ ${pend}</div>
          <div class="sec-mini-l">Pendiente</div>
        </div>
        <div class="sec-mini-stat">
          <div class="sec-mini-n" style="color:var(--red)">❌ ${novis}</div>
          <div class="sec-mini-l">Sin visita</div>
        </div>
      </div>
      <div style="margin-bottom:8px">
        <div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;color:var(--sft);margin-bottom:4px">
          <span>Progreso de visitas</span><span style="color:var(--grn);font-family:'JetBrains Mono',monospace">${pct}%</span>
        </div>
        <div class="sec-prog-bar"><div class="sec-prog-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="sec-card-actions">
        <button class="sec-act-btn primary" onclick="openQF('sec_${sec}','📍 Sección ${sec}')">📋 Ver ${cnt} registros</button>
        <button class="sec-act-btn" onclick="secFilter('${sec}')">🔍 Filtrar</button>
        <button class="sec-act-btn" onclick="secExport('${sec}')">⬇️ Exportar</button>
      </div>
    </div>`;
  }).join('');
}

function secFilter(sec){
  go('registros');
  fS='sec_'+sec;fT='todos';
  renderList();
}

function secExport(sec){
  const regs=R.filter(r=>r.seccion===sec);
  const rows=[['ID','Folio','Nombre','Programa','Tel','Domicilio','Num','Colonia','Visita','Uso','Estatus','Obs'],
    ...regs.map(r=>[r.id,r.folio,r.nombre,r.tipo,r.tel||'',r.dom||'',r.num||'',r.col||'',r.visita,r.uso,r.estatus,r.obs||''])];
  const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const a=document.createElement('a');
  a.href='data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv);
  a.download=`Seccion_${sec}_${today()}.csv`;
  document.body.appendChild(a);a.click();document.body.removeChild(a);
  snack(`⬇️ Sección ${sec} exportada`,'⬇️');
}


/* ===== v15: BÚSQUEDA AVANZADA ===== */
let srchAdvOpen = false;

function toggleSrchAdv(){
  srchAdvOpen=!srchAdvOpen;
  const wrap=document.getElementById('srch-adv-wrap');
  const btn=document.getElementById('srch-adv-btn');
  if(wrap)wrap.style.display=srchAdvOpen?'block':'none';
  if(btn)btn.style.background=srchAdvOpen?'var(--a)':'';
  if(srchAdvOpen){
    // populate secciones select
    const sel=document.getElementById('srch-f-sec');
    if(sel){const secs=[...new Set(R.map(r=>r.seccion).filter(Boolean))].sort();sel.innerHTML='<option value="">Todas secciones</option>'+secs.map(s=>`<option value="${s}">📍 ${s}</option>`).join('');}
    const selA=document.getElementById('srch-f-area');
    if(selA){const areas=[...new Set(R.map(r=>r.area).filter(Boolean))].sort();selA.innerHTML='<option value="">Todas áreas</option>'+areas.map(a=>`<option value="${a}">🏘️ ${a}</option>`).join('');}
    const selR=document.getElementById('srch-f-ruta');
    if(selR){const rutas=[...new Set(R.map(r=>r.ruta).filter(Boolean))].sort();selR.innerHTML='<option value="">Todas rutas</option>'+rutas.map(r=>`<option value="${r}">🗺️ ${r}</option>`).join('');}
  }
}

function clearSrchAdv(){
  ['srch-f-tipo','srch-f-est','srch-f-vis','srch-f-uso','srch-f-sec','srch-f-area','srch-f-ruta','srch-f-edad','srch-f-dup'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  execSrchAdv();
}

function getAdvFilters(){
  return {
    tipo: document.getElementById('srch-f-tipo')?.value||'',
    est:  document.getElementById('srch-f-est')?.value||'',
    vis:  document.getElementById('srch-f-vis')?.value||'',
    uso:  document.getElementById('srch-f-uso')?.value||'',
    sec:  document.getElementById('srch-f-sec')?.value||'',
    area: document.getElementById('srch-f-area')?.value||'',
    ruta: document.getElementById('srch-f-ruta')?.value||'',
    edad: document.getElementById('srch-f-edad')?.value||'',
    dup:  document.getElementById('srch-f-dup')?.value||'',
  };
}

function execSrchAdv(){
  const q=(document.getElementById('sq')?.value||'').trim();
  const f=getAdvFilters();
  const hasFilter=f.tipo||f.est||f.vis||f.uso||f.sec||f.area||f.ruta||f.edad||f.dup||q;
  if(!hasFilter){showSrchIdle();return;}
  let pool=R.slice();
  if(f.tipo)pool=pool.filter(r=>r.tipo===f.tipo);
  if(f.est) pool=pool.filter(r=>r.estatus===f.est);
  if(f.vis) pool=pool.filter(r=>r.visita===f.vis);
  if(f.uso) pool=pool.filter(r=>r.uso===f.uso);
  if(f.sec)  pool=pool.filter(r=>r.seccion===f.sec);
  if(f.area) pool=pool.filter(r=>r.area===f.area);
  if(f.ruta) pool=pool.filter(r=>r.ruta===f.ruta);
  if(f.dup==='1'){detectDups();pool=pool.filter(r=>r.dup);}
  if(f.edad){
    const now=new Date();
    pool=pool.filter(r=>{
      if(!r.fnac)return false;
      try{
        const age=Math.floor((now-new Date(r.fnac+'T00:00:00'))/(365.25*24*3600*1000));
        if(f.edad==='lt60')return age<60;
        if(f.edad==='60_69')return age>=60&&age<70;
        if(f.edad==='70_79')return age>=70&&age<80;
        if(f.edad==='80_89')return age>=80&&age<90;
        if(f.edad==='90p')return age>=90;
      }catch{return false;}
      return true;
    });
  }
  if(q){
    const ql=q.toLowerCase();
    pool=pool.filter(r=>r.nombre.toLowerCase().includes(ql)||r.folio.toLowerCase().includes(ql)||(r.tel||'').includes(ql)||(r.col||'').toLowerCase().includes(ql)||(r.dom||'').toLowerCase().includes(ql)||(r.obs||'').toLowerCase().includes(ql)||(r.seccion||'').includes(ql));
  }
  const activeFilters=Object.values(f).filter(Boolean).length;
  const title=q?`"${q}"${activeFilters?' + '+activeFilters+' filtro'+(activeFilters>1?'s':''):''}`:activeFilters+' filtro'+(activeFilters>1?'s':'');
  if(pool.length) showResults(pool,title,q,null);
  else showNoRes(q||'filtros aplicados');
  saveRec2(q);
}


/* ===== v16: EDIT INFO PANEL TOGGLE ===== */
let editInfoOpen = false;
function toggleEditInfo(){
  editInfoOpen = !editInfoOpen;
  const panel = document.getElementById('edit-info-panel');
  const arrow = document.getElementById('edit-info-arrow');
  if(panel){
    panel.style.maxHeight = editInfoOpen ? '600px' : '0';
    panel.style.opacity   = editInfoOpen ? '1'    : '0';
  }
  if(arrow) arrow.textContent = editInfoOpen ? '▲' : '▼';
}
function showEditInfoToggle(show){
  const tog = document.getElementById('edit-info-toggle');
  if(tog) tog.style.display = show ? 'block' : 'none';
  // Reset collapsed state
  editInfoOpen = false;
  const panel = document.getElementById('edit-info-panel');
  const arrow = document.getElementById('edit-info-arrow');
  if(panel){ panel.style.maxHeight='0'; panel.style.opacity='0'; }
  if(arrow) arrow.textContent = '▼';
}


/* ===== v17: CURP / EDAD / GUARDAR-Y-NUEVO ===== */
function updEdad(){
  const fnac=document.getElementById('e-fnac')?.value;
  const disp=document.getElementById('edad-display');
  if(!disp)return;
  if(!fnac){disp.style.display='none';return;}
  const hoy=new Date(),nac=new Date(fnac+'T00:00:00');
  let edad=hoy.getFullYear()-nac.getFullYear();
  const m=hoy.getMonth()-nac.getMonth();
  if(m<0||(m===0&&hoy.getDate()<nac.getDate()))edad--;
  if(edad>=0&&edad<130){
    disp.style.display='block';
    const cat=edad>=60?'👴 Adulto Mayor':edad>=18?'🧑 Adulto':edad>=12?'🧒 Joven':'👶 Menor';
    disp.textContent=`🎂 ${edad} años · ${cat}`;
  }else{disp.style.display='none';}
}

function doSaveAndNew(){
  // Save current record then reopen blank form
  const prevEditId=editId;
  doSaveRec();
  // After save delay, reopen blank form
  setTimeout(()=>{
    if(!prevEditId){
      openShAdd();
      snack('💾➕ Guardado — formulario listo','💾');
    }
  },900);
}


/* ===== v19: EDICIÓN INLINE EN DETALLE ===== */
let _activeInlineId=null,_activeInlineField=null;

function detSetField(id,field,val){
  if(typeof requirePerm==='function'){
    if(field==='visita'&&!requirePerm('markVisit','Marcar visitas requiere una cuenta')) return;
    if(field!=='visita'&&!requirePerm('editRecord','Editar campos requiere una cuenta')) return;
  }
  const r=R.find(x=>x.id===id);if(!r)return;
  const prev=r[field];
  r[field]=val;r.ult=nowStr();
  logCh(r,field.toUpperCase(),prev,val,'Cambio rápido desde detalle');
  svR();svH();
  // Refresh det view
  openDet(id);
  if(navigator.vibrate)navigator.vibrate(15);
  snack(`✅ ${field==='visita'?'Visita':'Ubicación'}: ${val}`,'✅');
}

function inlineEdit(id,field,currentVal,inputType,placeholder){
  if(typeof requirePerm==='function'&&!requirePerm('editInline','Editar campos requiere una cuenta')) return;
  const r=R.find(x=>x.id===id);if(!r)return;
  // If same field already editing, cancel
  if(_activeInlineId===id&&_activeInlineField===field){_cancelInline(id,field,currentVal);return;}
  _cancelAnyInline();
  _activeInlineId=id;_activeInlineField=field;
  const dvEl=document.getElementById('dv-'+field+'-'+id);
  const dfEl=dvEl?.closest('.df');
  if(!dvEl||!dfEl)return;
  dfEl.classList.add('editing');
  const realVal=r[field]||'';
  dvEl.innerHTML=`<input class="df-inline-input" id="ii-${field}-${id}" type="${inputType}" value="${String(realVal).replace(/"/g,'&quot;')}" placeholder="${placeholder}" autocomplete="off"/>
    <div class="df-save-row">
      <button class="df-save-btn df-save-ok" onclick="saveInline(${id},'${field}')">✓ Guardar</button>
      <button class="df-save-btn df-save-no" onclick="_cancelInline(${id},'${field}','${String(currentVal).replace(/'/g,"\\'")}')">✗ Cancelar</button>
    </div>`;
  const inp=document.getElementById('ii-'+field+'-'+id);
  if(inp){
    setTimeout(()=>inp.focus(),50);
    inp.addEventListener('keydown',e=>{
      if(e.key==='Enter')saveInline(id,field);
      if(e.key==='Escape')_cancelInline(id,field,currentVal);
    });
  }
}

function inlineEditSelect(id,field,currentVal,options){
  const r=R.find(x=>x.id===id);if(!r)return;
  if(_activeInlineId===id&&_activeInlineField===field){_cancelInline(id,field,currentVal);return;}
  _cancelAnyInline();
  _activeInlineId=id;_activeInlineField=field;
  const dvEl=document.getElementById('dv-'+field+'-'+id);
  const dfEl=dvEl?.closest('.df');
  if(!dvEl||!dfEl)return;
  dfEl.classList.add('editing');
  const optHtml=options.map(o=>`<option value="${o}"${o===currentVal?' selected':''}>${o}</option>`).join('');
  dvEl.innerHTML=`<select class="df-inline-select" id="ii-${field}-${id}">${optHtml}</select>
    <div class="df-save-row">
      <button class="df-save-btn df-save-ok" onclick="saveInline(${id},'${field}')">✓ Guardar</button>
      <button class="df-save-btn df-save-no" onclick="_cancelInline(${id},'${field}','${currentVal}')">✗ Cancelar</button>
    </div>`;
  setTimeout(()=>document.getElementById('ii-'+field+'-'+id)?.focus(),50);
}

function saveInline(id,field){
  const r=R.find(x=>x.id===id);if(!r)return;
  const inp=document.getElementById('ii-'+field+'-'+id);if(!inp)return;
  let val=inp.value.trim();
  // Auto uppercase for specific fields
  if(['nombre','folio','curp'].includes(field))val=val.toUpperCase();
  const prev=r[field]||'';
  if(val===prev){_cancelAnyInline();openDet(id);return;}
  r[field]=val;r.ult=nowStr();
  logCh(r,field.toUpperCase(),prev,val,'Edición inline');
  detectDups();svR();svH();
  _activeInlineId=null;_activeInlineField=null;
  openDet(id);render(curTab);
  snack(`💾 ${field.charAt(0).toUpperCase()+field.slice(1)} actualizado`,'💾');
  if(navigator.vibrate)navigator.vibrate([20,10,20]);
}

function _cancelInline(id,field,originalVal){
  _activeInlineId=null;_activeInlineField=null;
  const dvEl=document.getElementById('dv-'+field+'-'+id);
  const dfEl=dvEl?.closest('.df');
  if(dfEl)dfEl.classList.remove('editing');
  openDet(id);
}

function _cancelAnyInline(){
  if(_activeInlineId&&_activeInlineField){
    const dvEl=document.getElementById('dv-'+_activeInlineField+'-'+_activeInlineId);
    const dfEl=dvEl?.closest('.df');
    if(dfEl)dfEl.classList.remove('editing');
  }
  _activeInlineId=null;_activeInlineField=null;
}


function inlineEditObs(id){
  const r=R.find(x=>x.id===id);if(!r)return;
  inlineEdit(id,'obs',r.obs||'','text','Observaciones / Notas');
}

/* ===== INIT ===== */
// Load data from v9 keys if v10 is empty
(function migrateData(){
  const oldR=localStorage.getItem('px_v10_r');
  if(!oldR||JSON.parse(oldR).length===0){
    // Try old key
    const v9=localStorage.getItem('px_v9_r')||localStorage.getItem('px_v10_r');
    if(v9){const d=JSON.parse(v9);if(d.length>0){R=d;svR();}}
  }
})();

// Normalize legacy 'Sí' (with accent) → 'Si' for consistency
(function normalizeVisita(){
  let changed=0;
  R.forEach(r=>{
    if(r.visita==='Sí'){r.visita='Si';changed++;}
  });
  if(changed>0){svR();console.log('Normalized '+changed+' visita values');}
})();

/* _updateStreak, detectDups, upHdr, renderInicio etc are called by startSession() */

/* ═══════════════════════════════════════════════════════════
   AUTH SYSTEM v31 — Multi-Role · Creator · User · Guest
   ═══════════════════════════════════════════════════════════ */

const AUTH_KEY     = 'px_auth_v1';        // Creator (admin único)
const USERS_KEY    = 'px_users_v2';       // Usuarios registrados []
const SESSION_KEY  = 'px_session_v1';
const REMEMBER_KEY = 'px_remember_session_v1';
const ELOG_KEY     = 'px_access_log_v1';
const EMAILCFG_KEY = 'px_emailcfg_v1';
const LOCK_KEY     = 'px_lockout_v1';
const MAX_ATTEMPTS = 5;
const LOCK_MINS    = 15;
const OTP_MINS     = 10;

/* ── Hash ── */
async function hashStr(str){
  const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

/* ── Data getters ── */
const getAuthCreds  =()=>{try{return JSON.parse(localStorage.getItem(AUTH_KEY)||'null');}catch{return null;}};
const getUsers      =()=>{try{return JSON.parse(localStorage.getItem(USERS_KEY)||'[]');}catch{return[];}};
const saveUsers     =(u)=>localStorage.setItem(USERS_KEY,JSON.stringify(u));
const getSession    =()=>{try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');}catch{return null;}};
const getEmailCfg   =()=>{try{return JSON.parse(localStorage.getItem(EMAILCFG_KEY)||'null');}catch{return null;}};
const getAccessLog  =()=>{try{return JSON.parse(localStorage.getItem(ELOG_KEY)||'[]');}catch{return[];}};
const getLockout    =()=>{try{return JSON.parse(localStorage.getItem(LOCK_KEY)||'null');}catch{return null;}};

/* ── State ── */
let authMode='', authUsername='', authDisplayName='';
let _pendingOTP='', _otpExpiry=0, _otpTimer=null, _pendingUser='';
const isGuest    = ()=>authMode==='guest';
const isAdmin    = ()=>authMode==='admin';    // registered user
const isCreator  = ()=>authMode==='creator';  // app owner

/* ── Slide navigation ── */
let _prevSlide = null;
function showSlide(id){
  const all = document.querySelectorAll('.auth-slide');
  const current = [...all].find(s=>s.classList.contains('on'));
  if(current){
    current.classList.remove('on');
    current.classList.add('prev');
    setTimeout(()=>current.classList.remove('prev'),400);
  }
  const target = document.getElementById(id);
  if(target) target.classList.add('on');
  _prevSlide = current?.id;
  // Init creator slide
  if(id==='as-creator'){
    const hasCreds=!!getAuthCreds();
    const vb=document.getElementById('creator-verify-block');
    if(vb) vb.style.display=hasCreds?'block':'none';
    const lnk=document.getElementById('creator-setup-link');
    if(lnk) lnk.style.display=hasCreds?'none':'block';
  }
}
function showGuestConfirm(){ showSlide('as-guest-confirm'); }

/* ── Audit Log ── */
function logAccess(type,username,detail=''){
  const log=getAccessLog();
  log.unshift({id:Date.now(),type,username,detail,
    ts:new Date().toLocaleString('es-MX',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),
    ua:navigator.userAgent.slice(0,80)});
  if(log.length>300)log.splice(300);
  localStorage.setItem(ELOG_KEY,JSON.stringify(log));
}

function renderAccessLog(){
  const log=getAccessLog();
  const el=document.getElementById('access-log-content');
  if(!el)return;
  if(!log.length){el.innerHTML='<div class="empty"><div class="empty-ico">🔐</div><h3>Sin accesos registrados</h3><p>Los accesos aparecerán aquí</p></div>';return;}
  const TYPE={login:{ico:'✅',lbl:'Inicio de sesión',clr:'var(--grn)'},register:{ico:'🆕',lbl:'Nuevo registro',clr:'var(--a2)'},otp_ok:{ico:'📧',lbl:'OTP verificado',clr:'var(--a2)'},otp_fail:{ico:'⚠️',lbl:'OTP incorrecto',clr:'var(--amb)'},logout:{ico:'🚪',lbl:'Cierre de sesión',clr:'var(--sft)'},guest:{ico:'👻',lbl:'Modo invitado',clr:'var(--amb)'},fail:{ico:'❌',lbl:'Contraseña incorrecta',clr:'var(--red)'},lockout:{ico:'🔒',lbl:'Cuenta bloqueada',clr:'var(--red)'},creator_setup:{ico:'👑',lbl:'Cuenta admin guardada',clr:'var(--vio)'}};
  el.innerHTML=`<div class="sh2" style="margin-bottom:12px">Bitácora de accesos <span class="sh2-n">${log.length}</span></div>`+
  log.map(e=>{const t=TYPE[e.type]||{ico:'ℹ️',lbl:e.type,clr:'var(--sft)'};return `<div style="background:var(--card);border:1px solid var(--b1);border-left:3px solid ${t.clr};border-radius:14px;padding:11px 13px;margin-bottom:7px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="font-size:15px">${t.ico}</span><div style="flex:1"><div style="font-size:12px;font-weight:800;color:${t.clr}">${t.lbl}</div><div style="font-size:10px;color:var(--mut);font-family:'JetBrains Mono',monospace">${e.ts}</div></div><div style="background:var(--s2);border-radius:8px;padding:2px 8px;font-size:10px;font-weight:800;color:var(--a2)">${e.username||'—'}</div></div>${e.detail?`<div style="font-size:10px;color:var(--sft);margin-left:23px">${e.detail}</div>`:''}</div>`;}).join('');
}

function dlAccessLog(){
  const log=getAccessLog();if(!log.length){snack('Sin accesos','⚠️');return;}
  const csv=['Tipo,Usuario,Fecha,Detalle',...log.map(e=>[e.type,e.username,e.ts,e.detail||''].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(','))].join('\n');
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  dlFile(`AccesosPM_${today()}.csv`,url,true);
  snack('⬇️ Bitácora exportada','⬇️');
}
function clearAccessLog(){
  conf2('Limpiar bitácora','¿Borrar todos los registros de acceso?',()=>{localStorage.removeItem(ELOG_KEY);renderAccessLog();snack('🗑️ Bitácora limpiada','🗑️');});
}

/* ── Brute-force protection ── */
function checkLockout(){
  const lock=getLockout();if(!lock)return false;
  const remaining=Math.ceil((lock.until-Date.now())/60000);
  if(remaining>0){
    const bar=document.getElementById('lockout-bar');
    if(bar){bar.textContent=`🔒 Bloqueado ${remaining} min más (${lock.attempts} intentos)`;bar.classList.add('on');}
    const btn=document.getElementById('login-btn');
    if(btn){btn.disabled=true;btn.style.opacity='.4';}
    return true;
  }
  localStorage.removeItem(LOCK_KEY);return false;
}
function recordFailedAttempt(username){
  const lock=getLockout()||{attempts:0,until:0};
  lock.attempts=(lock.attempts||0)+1;
  logAccess('fail',username,`Intento ${lock.attempts}/${MAX_ATTEMPTS}`);
  if(lock.attempts>=MAX_ATTEMPTS){
    lock.until=Date.now()+LOCK_MINS*60000;
    localStorage.setItem(LOCK_KEY,JSON.stringify(lock));
    logAccess('lockout',username,`Bloqueado ${LOCK_MINS} min`);
    checkLockout();return;
  }
  localStorage.setItem(LOCK_KEY,JSON.stringify(lock));
  const left=MAX_ATTEMPTS-lock.attempts;
  const bar=document.getElementById('login-attempts-bar');
  if(bar)bar.classList.add('on');
  const txt=document.getElementById('ld-text');
  if(txt)txt.textContent=`${left} intento${left!==1?'s':''} restante${left!==1?'s':''}`;
  for(let i=1;i<=MAX_ATTEMPTS;i++){const d=document.getElementById('ld'+i);if(d)d.classList.toggle('used',i<=lock.attempts);}
}
function clearFailedAttempts(){
  localStorage.removeItem(LOCK_KEY);
  const bar=document.getElementById('login-attempts-bar');if(bar)bar.classList.remove('on');
  const lb=document.getElementById('lockout-bar');if(lb)lb.classList.remove('on');
  const btn=document.getElementById('login-btn');if(btn){btn.disabled=false;btn.style.opacity='';}
  for(let i=1;i<=5;i++){const d=document.getElementById('ld'+i);if(d)d.classList.remove('used');}
}

/* ── OTP ── */
function generateOTP(){return String(Math.floor(100000+Math.random()*900000));}
async function sendOTPEmail(email,otp,username){
  const cfg=getEmailCfg();if(!cfg||!cfg.pubkey||!cfg.svcId||!cfg.tplId)return false;
  try{
    if(!window.emailjs){
      await new Promise((res,rej)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s);});
      emailjs.init({publicKey:cfg.pubkey});
    }
    await emailjs.send(cfg.svcId,cfg.tplId,{otp,user:username,app:'Pensionados MX',time:new Date().toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})});
    return true;
  }catch(e){console.error('EmailJS:',e);return false;}
}
function startOTPTimer(){
  clearOTPTimer();
  const timerEl=document.getElementById('auth-otp-timer');
  const barEl=document.getElementById('otp-timer-bar');
  const total=OTP_MINS*60;
  _otpTimer=setInterval(()=>{
    const left=Math.max(0,Math.ceil((_otpExpiry-Date.now())/1000));
    if(timerEl)timerEl.textContent=left>0?`⏱ ${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`:'⚠️ Expirado';
    if(barEl){const pct=left/total*100;barEl.style.width=pct+'%';barEl.style.background=pct<20?'var(--red)':pct<40?'var(--org)':'var(--a)';}
    if(left<=0)clearOTPTimer();
  },1000);
}
function clearOTPTimer(){if(_otpTimer){clearInterval(_otpTimer);_otpTimer=null;}}
function setupOTPBoxes(){
  for(let i=0;i<6;i++){
    const box=document.getElementById('ob'+i);if(!box)continue;
    box.oninput=e=>{
      const val=e.target.value.replace(/[^0-9]/g,'');e.target.value=val;
      e.target.classList.toggle('filled',!!val);
      if(val&&i<5)document.getElementById('ob'+(i+1))?.focus();
      const all=[...Array(6)].map((_,k)=>document.getElementById('ob'+k)?.value||'').join('');
      if(all.length===6)setTimeout(verifyOTPBoxes,100);
    };
    box.onkeydown=e=>{
      if(e.key==='Backspace'&&!e.target.value&&i>0)document.getElementById('ob'+(i-1))?.focus();
      if(e.key==='Enter')verifyOTPBoxes();
    };
  }
  // Support paste on first box
  const b0=document.getElementById('ob0');
  if(b0)b0.addEventListener('paste',e=>{
    const pasted=(e.clipboardData.getData('text')||'').replace(/[^0-9]/g,'').slice(0,6);
    e.preventDefault();
    for(let k=0;k<6;k++){const b=document.getElementById('ob'+k);if(b){b.value=pasted[k]||'';b.classList.toggle('filled',!!pasted[k]);}}
    document.getElementById('ob'+Math.min(pasted.length,5))?.focus();
    if(pasted.length===6)setTimeout(verifyOTPBoxes,100);
  });
}
function getOTPValue(){return [...Array(6)].map((_,i)=>document.getElementById('ob'+i)?.value||'').join('');}
function clearOTPBoxes(){for(let i=0;i<6;i++){const b=document.getElementById('ob'+i);if(b){b.value='';b.classList.remove('filled','otp-ok');}}}
function verifyOTP(){verifyOTPBoxes();}
function verifyOTPBoxes(){
  const input=getOTPValue();
  const err=document.getElementById('err-otp');
  if(input.length<6){if(err){err.textContent='Ingresa los 6 dígitos';err.classList.add('on');}return;}
  if(Date.now()>_otpExpiry){if(err){err.textContent='⏱ Código expirado';err.classList.add('on');}return;}
  if(err)err.classList.remove('on');
  if(input===_pendingOTP){
    for(let i=0;i<6;i++){const b=document.getElementById('ob'+i);if(b)b.classList.add('otp-ok');}
    setTimeout(()=>{
      clearOTPTimer();
      logAccess('otp_ok',_pendingUser,'2FA OK');
      startSession(authMode,_pendingUser,authDisplayName);
      resetOTPStep();
    },400);
  } else {
    if(err){err.textContent='❌ Código incorrecto';err.classList.add('on');}
    logAccess('otp_fail',_pendingUser,'OTP incorrecto');
    clearOTPBoxes();document.getElementById('ob0')?.focus();
    const boxes=document.querySelector('.otp-boxes');
    if(boxes){boxes.style.animation='none';requestAnimationFrame(()=>{boxes.style.animation='errShake .3s ease';});}
  }
}
async function initiateOTP(mode,username,display,email){
  _pendingOTP=generateOTP();_otpExpiry=Date.now()+OTP_MINS*60000;
  _pendingUser=username;authMode=mode;authDisplayName=display;
  const sent=await sendOTPEmail(email,_pendingOTP,username);
  if(!sent)return false;
  document.getElementById('as-login-creds').style.display='none';
  document.getElementById('as-login-otp').style.display='block';
  const sentEl=document.getElementById('otp-sent-to');
  if(sentEl)sentEl.textContent='Código enviado a: '+email.replace(/(.{2}).+(@.+)/,'$1…$2');
  clearOTPBoxes();setupOTPBoxes();
  document.getElementById('ob0')?.focus();
  startOTPTimer();return true;
}
async function resendOTP(){
  const btn=document.getElementById('login-btn');
  if(btn){btn.classList.add('loading');}
  _pendingOTP=generateOTP();_otpExpiry=Date.now()+OTP_MINS*60000;
  const creds=getAuthCreds();const email=creds?.email||'';
  if(email)await sendOTPEmail(email,_pendingOTP,_pendingUser);
  if(btn){btn.classList.remove('loading');}
  startOTPTimer();clearOTPBoxes();document.getElementById('ob0')?.focus();
  snack('📧 Código reenviado','📧');
}
function cancelOTP(){clearOTPTimer();resetOTPStep();_pendingOTP='';_pendingUser='';}
function resetOTPStep(){
  document.getElementById('as-login-creds').style.display='block';
  document.getElementById('as-login-otp').style.display='none';
  clearOTPBoxes();
}

/* ── CREATOR LOGIN (admin único) ── */
async function doLogin(){
  if(checkLockout())return;
  const user=(document.getElementById('l-user').value||'').trim().toLowerCase();
  const pass=document.getElementById('l-pass').value||'';
  const err=document.getElementById('err-login');
  if(!user||!pass){err.textContent='⚠️ Ingresa usuario y contraseña';err.classList.add('on');return;}
  err.classList.remove('on');
  const btn=document.getElementById('login-btn');if(btn)btn.classList.add('loading');
  // Check creator first
  const creds=getAuthCreds();
  if(creds&&user===creds.user){
    const h=await hashStr(pass);
    if(h===creds.hash){
      clearFailedAttempts();
      if(btn)btn.classList.remove('loading');
      const cfg=getEmailCfg();
      // FIX v35: sin internet → omitir OTP (no se puede enviar email sin red)
      const otpRequired=cfg&&cfg.otpRequired&&creds.email&&navigator.onLine;
      if(otpRequired){
        const sent=await initiateOTP('creator',user,user,creds.email);
        if(!sent){logAccess('login',user,'Creator directo');startSession('creator',user,user);}
      } else {
        logAccess('login',user,'Creator');startSession('creator',user,user);
      }
      return;
    }
  }
  // Check registered users
  const users=getUsers();
  const found=users.find(u=>u.username===user);
  if(found){
    const h=await hashStr(pass);
    if(h===found.hash&&!found.blocked){
      if(btn)btn.classList.remove('loading');
      clearFailedAttempts();
      // Update login metadata
      const d=_getDeviceInfo();
      found.lastLogin   = Date.now();
      found.loginCount  = (found.loginCount||0)+1;
      found.device      = d.device;
      found.browser     = d.browser;
      saveUsers(users);
      logAccess('login',user,`Usuario · ${d.device} · Login #${found.loginCount}`);
      startSession('admin',user,found.name||user);
      return;
    }
  }
  if(btn)btn.classList.remove('loading');
  err.textContent='❌ Usuario o contraseña incorrectos';err.classList.add('on');
  document.getElementById('l-pass').value='';document.getElementById('l-pass').focus();
  recordFailedAttempt(user||'desconocido');
}

/* ── REGISTER new user ── */
async function doRegister(){
  const name=(document.getElementById('r-name').value||'').trim();
  const user=(document.getElementById('r-user').value||'').trim().toLowerCase();
  const pass=document.getElementById('r-pass').value||'';
  const pass2=document.getElementById('r-pass2').value||'';
  const err=document.getElementById('err-register');
  const ok=document.getElementById('ok-register');
  err.classList.remove('on');ok.classList.remove('on');
  if(!name){err.textContent='⚠️ Ingresa tu nombre';err.classList.add('on');return;}
  if(!user||user.length<3){err.textContent='⚠️ Usuario: mínimo 3 caracteres';err.classList.add('on');return;}
  if(!pass||pass.length<6){err.textContent='⚠️ Contraseña: mínimo 6 caracteres';err.classList.add('on');return;}
  if(pass!==pass2){err.textContent='❌ Las contraseñas no coinciden';err.classList.add('on');return;}
  // Check if username taken
  const users=getUsers();const creds=getAuthCreds();
  if(users.find(u=>u.username===user)||(creds&&creds.user===user)){
    err.textContent='❌ Ese nombre de usuario ya existe';err.classList.add('on');return;
  }
  const btn=document.getElementById('register-btn');if(btn)btn.classList.add('loading');
  const hash=await hashStr(pass);
  // Capture device & session info at registration
  const deviceInfo=_getDeviceInfo();
  const newUser={
    id:          Date.now(),
    name,
    username:    user,
    hash,
    createdAt:   Date.now(),
    createdDate: new Date().toLocaleString('es-MX',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),
    lastLogin:   Date.now(),
    loginCount:  1,
    blocked:     false,
    approved:    true,   // Auto-approved — admin can change
    device:      deviceInfo.device,
    browser:     deviceInfo.browser,
    actions:     0,
  };
  users.push(newUser);saveUsers(users);
  logAccess('register',user,`Nuevo usuario: ${name} · ${deviceInfo.device}`);
  if(btn)btn.classList.remove('loading');
  ok.textContent='✅ Cuenta creada. Iniciando sesión…';ok.classList.add('on');
  setTimeout(()=>startSession('admin',user,name),900);
}

/* ── CREATOR SETUP ── */
async function doCreatorSetup(){
  const existing=getAuthCreds();
  const newUser=(document.getElementById('c-user').value||'').trim().toLowerCase();
  const newEmail=(document.getElementById('c-email').value||'').trim();
  const newPass=document.getElementById('c-pass').value||'';
  const confPass=document.getElementById('c-pass2').value||'';
  const err=document.getElementById('err-creator');
  const ok=document.getElementById('ok-creator');
  err.classList.remove('on');ok.classList.remove('on');
  if(existing){
    const curUser=(document.getElementById('cv-user').value||'').trim().toLowerCase();
    const curPass=document.getElementById('cv-pass').value||'';
    if(!curUser||!curPass){err.textContent='⚠️ Verifica con credenciales actuales';err.classList.add('on');return;}
    const curHash=await hashStr(curPass);
    if(curUser!==existing.user||curHash!==existing.hash){err.textContent='❌ Credenciales actuales incorrectas';err.classList.add('on');return;}
  }
  if(!newUser||newUser.length<3){err.textContent='⚠️ Usuario: mínimo 3 caracteres';err.classList.add('on');return;}
  if(newEmail&&!/^[^@]+@[^@]+\.[^@]+$/.test(newEmail)){err.textContent='⚠️ Correo inválido';err.classList.add('on');return;}
  if(!newPass||newPass.length<8){err.textContent='⚠️ Contraseña: mínimo 8 caracteres';err.classList.add('on');return;}
  if(newPass!==confPass){err.textContent='❌ Las contraseñas no coinciden';err.classList.add('on');return;}
  const btn=document.getElementById('creator-btn');if(btn)btn.classList.add('loading');
  const hash=await hashStr(newPass);
  localStorage.setItem(AUTH_KEY,JSON.stringify({user:newUser,hash,email:newEmail||''}));
  logAccess('creator_setup',newUser,'Cuenta admin configurada');
  if(btn)btn.classList.remove('loading');
  ok.textContent='✅ Cuenta de administrador guardada';ok.classList.add('on');
  // Hide creator setup link permanently
  const lnk=document.getElementById('creator-setup-link');if(lnk)lnk.style.display='none';
  setTimeout(()=>{ok.classList.remove('on');showSlide('as-login');document.getElementById('l-user').value=newUser;document.getElementById('l-pass').focus();},1600);
}

/* ── GUEST ── */
function doGuest(){
  // Assign or reuse a guest fingerprint for this device
  let gId=localStorage.getItem('px_guest_device_id');
  if(!gId){gId='G-'+Date.now().toString(36).toUpperCase();localStorage.setItem('px_guest_device_id',gId);}
  const d=_getDeviceInfo();
  // Track guest visits in the log
  const gLog=JSON.parse(localStorage.getItem('px_guest_log')||'[]');
  gLog.unshift({
    id:      gId,
    ts:      Date.now(),
    date:    new Date().toLocaleString('es-MX',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}),
    device:  d.device,
    browser: d.browser,
    visits:  (gLog.filter(g=>g.id===gId).length)+1,
  });
  if(gLog.length>200) gLog.splice(200);
  localStorage.setItem('px_guest_log',JSON.stringify(gLog));
  logAccess('guest',gId,`Invitado · ${d.device}`);
  startSession('guest','Invitado','Invitado');
}

/* ── HELPER: start session ── */
function startSession(mode,username,displayName){
  authMode=mode;authUsername=username;authDisplayName=displayName||username;
  const sObj={mode,username,displayName:authDisplayName,ts:Date.now()};
  sessionStorage.setItem(SESSION_KEY,JSON.stringify(sObj));
  // Remember-me
  const remEl=document.getElementById('l-remember');
  if(remEl?.checked&&mode!=='guest'){
    localStorage.setItem(REMEMBER_KEY,JSON.stringify({...sObj,expiry:Date.now()+30*24*3600*1000}));
  }
  _hideAuthScreen();
  _applySession();
}
function _hideAuthScreen(){
  document.getElementById('auth-screen').style.display='none';
  document.getElementById('app-shell').style.display='flex';
}
function _applySession(){
  const guest=isGuest();
  const creator=isCreator();
  const dn=authDisplayName||authUsername;

  // ── Guest banner ──
  const gb=document.getElementById('guest-banner');
  if(gb)gb.classList.toggle('on',guest);

  // ── Header user button ──
  const btn=document.getElementById('hdr-user-btn');
  if(btn){
    btn.textContent=guest?'👻':creator?'👑':dn[0]?.toUpperCase()||'U';
    btn.title=guest?'Invitado':dn;
    btn.className='hdr-user'+(guest?' guest-mode':creator?' creator-mode':'');
  }

  // ── Apply all guest restrictions ──
  _applyGuestRestrictions(guest, creator);

  document.title=guest?'Pensionados MX — Invitado 👻':creator?`Pensionados MX — ${dn} 👑`:`Pensionados MX — ${dn}`;
  _updateStreak();detectDups();upHdr();selDay=today();
  renderInicio();renderChips();renderSFPills();
  // Auto-connect Firebase if configured
  setTimeout(fbAutoInit, 800);
  // Check daily notifications (after 2s delay)
  setTimeout(checkDailyNotifications, 2000);
  // Backup reminder
  setTimeout(checkBackupReminder, 5000);
  // Session timeout
  resetSessionTimer();
  // Tab swipe init
  setTimeout(initTabSwipe, 500);
}

/* ════════════════════════════════════════════════
   GUEST RESTRICTIONS — Complete Permission System
   ════════════════════════════════════════════════ */

// Central permission check — use everywhere
function can(action){
  if(isCreator()) return true;           // Creator: todo permitido
  if(isGuest()) return GUEST_PERMS[action]===true;
  // Check user-specific role setting
  const users=getUsers();
  const u=users.find(x=>x.username===authUsername);
  const role=u?.role||'full';
  if(role==='readonly'){
    // Read-only: can view but not modify
    const readOnly=['viewList','viewDetail','viewStats','viewSearch','viewSections','viewFullPhone','viewFullCurp'];
    return readOnly.includes(action);
  }
  if(role==='limited'){
    // Limited: like guest but can see contact data
    const limited=['viewList','viewDetail','viewStats','viewSearch','viewSections'];
    return limited.includes(action);
  }
  return USER_PERMS[action]===true;      // full access
}

const GUEST_PERMS = {
  viewList:       true,   // Ver lista de registros
  viewStats:      true,   // Ver estadísticas
  viewSearch:     true,   // Usar buscador
  viewSections:   true,   // Ver secciones
  viewDetail:     true,   // Ver detalle de registro (con datos ocultos)
  // Todo lo demás: false por default
  addRecord:      false,
  editRecord:     false,
  deleteRecord:   false,
  markVisit:      false,
  exportData:     false,
  importData:     false,
  viewAccessLog:  false,
  viewGeneral:    false,
  viewFullPhone:  false,  // Teléfono enmascarado
  viewFullCurp:   false,  // CURP enmascarada
  printRecord:    false,
  shareRecord:    false,
  backupData:     false,
  editInline:     false,
  batchOps:       false,
};

const USER_PERMS = {
  viewList:       true,
  viewStats:      true,
  viewSearch:     true,
  viewSections:   true,
  viewDetail:     true,
  addRecord:      true,
  editRecord:     true,
  deleteRecord:   true,
  markVisit:      true,
  exportData:     true,
  importData:     true,
  viewAccessLog:  false,  // Solo creator
  viewGeneral:    true,
  viewFullPhone:  true,
  viewFullCurp:   true,
  printRecord:    true,
  shareRecord:    true,
  backupData:     true,
  editInline:     true,
  batchOps:       true,
};

// Mask sensitive data for guests
function maskPhone(tel){
  if(!tel) return '—';
  if(can('viewFullPhone')) return tel;
  const d=tel.replace(/[^0-9]/g,'');
  if(d.length<4) return '••••••••';
  return d.slice(0,3)+'•••'+d.slice(-2);
}
function maskCurp(curp){
  if(!curp) return '—';
  if(can('viewFullCurp')) return curp;
  return curp.slice(0,4)+'••••••••••••••';
}
function maskName(nombre){
  if(can('viewDetail')) return nombre;  // guest can see names
  return nombre; // show names but mask contact data
}

function _applyGuestRestrictions(guest, creator){
  // FAB (add button)
  const fab=document.getElementById('fab');
  if(fab)fab.style.display=can('addRecord')?'flex':'none';

  // Export nav button
  const nbDl=document.getElementById('nb-descargar');
  if(nbDl){nbDl.style.display=can('exportData')?'':'none';nbDl.style.opacity='';}

  // ── ADMIN TAB — only for creator ──
  const admTab =document.getElementById('tab-admin');
  const admNb  =document.getElementById('nb-admin');
  if(admTab) admTab.style.display=creator?'':'none';
  if(admNb)  admNb.style.display=creator?'':'none';

  // ── Restrict horizontal tabs ──
  const tabRestrictions = {
    'accesos':  !can('viewAccessLog'),
    'importar': !can('importData'),
    'historial':!can('editRecord'),
    'descargar':!can('exportData'),
  };
  Object.entries(tabRestrictions).forEach(([tabName, shouldHide])=>{
    const t=document.querySelector(`.tab[onclick="go('${tabName}')"]`);
    if(t) t.style.display=shouldHide?'none':'';
  });

  // General tab — all modes can access (guest sees limited)
  const genTab=document.querySelector(`.tab[onclick="go('general')"]`);
  if(genTab) genTab.style.display='';

  // Apply [data-perm] attributes in DOM
  document.querySelectorAll('[data-perm]').forEach(el=>{
    const perm=el.dataset.perm;
    el.style.display=can(perm)?'':'none';
  });

  // Add/remove guest-locked class
  document.querySelectorAll('[data-guest-lock]').forEach(el=>{
    el.classList.toggle('guest-locked',guest);
  });

  // ── Update banners based on role ──
  const ub=document.getElementById('user-banner');
  const ubn=document.getElementById('user-banner-name');
  if(ub){
    ub.classList.toggle('on',!guest&&!creator);
    if(ubn&&!guest)ubn.textContent=authDisplayName||authUsername;
  }
}

// Show guest upgrade prompt with context
function requirePerm(action, message){
  if(can(action)) return true;
  if(isGuest()){
    _showGuestUpgrade(message||'Esta función requiere una cuenta');
  } else {
    snack('⛔ Sin permisos','⛔');
  }
  return false;
}

// Guest upgrade modal
function _showGuestUpgrade(msg){
  if(navigator.vibrate) navigator.vibrate([10,20,10]);
  conf2(
    '👻 Modo Invitado',
    `<div style="text-align:center;padding:8px 0">
      <div style="font-size:40px;margin-bottom:8px">🔒</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:6px">${msg}</div>
      <div style="font-size:12px;color:var(--sft);line-height:1.6">
        Crea una cuenta gratis para acceder<br>a todas las funciones de la app.
      </div>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:8px">
        <div style="background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);border-radius:10px;padding:8px;font-size:11px;font-weight:700">
          ✅ Agregar y editar registros<br>
          ✅ Marcar visitas realizadas<br>
          ✅ Exportar CSV y Excel<br>
          ✅ Acceso a todos los datos
        </div>
      </div>
    </div>`,
    ()=>{ doLogout(); setTimeout(()=>showSlide('as-register'),150); },
    '✍️ Crear cuenta gratis'
  );
}

// applyGuestMode kept as alias
function applyGuestMode(g){ _applyGuestRestrictions(g,false); }

/* ── LOGOUT ── */
function doLogout(){
  logAccess('logout',authUsername,'Cierre de sesión');
  presenceStop();  // Remove online presence
  authMode='';authUsername='';authDisplayName='';
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  closeAllSheets();
  document.getElementById('auth-screen').style.display='flex';
  document.getElementById('app-shell').style.display='none';
  document.getElementById('guest-banner').classList.remove('on');
  const ub=document.getElementById('user-banner');if(ub)ub.classList.remove('on');
  // Reset login form
  const lu=document.getElementById('l-user');const lp=document.getElementById('l-pass');
  if(lu)lu.value='';if(lp)lp.value='';
  const el=document.getElementById('err-login');if(el)el.classList.remove('on');
  // Back to welcome
  document.querySelectorAll('.auth-slide').forEach(s=>{s.classList.remove('on','prev');});
  const welcome=document.getElementById('as-welcome');if(welcome)welcome.classList.add('on');
  checkLockout();
}

/* ── User menu ── */
function openUserMenu(){
  const title=document.getElementById('user-menu-title');
  if(title)title.textContent=isGuest()?'👻 Modo Invitado':isCreator()?`👑 ${authDisplayName}`:authDisplayName||authUsername;
  openSheet('sh-user');
}

/* ── Settings helpers ── */
function togglePassVis(inputId,btn){const el=document.getElementById(inputId);if(!el)return;const isPass=el.type==='password';el.type=isPass?'text':'password';btn.textContent=isPass?'🙈':'👁';}
function guestGuard(action){if(isGuest()){snack('🔒 No disponible en modo invitado','🔒');return false;}if(action)action();return true;}

/* ── Password strength (for creator + register) ── */
function _pwStrength(val,wrap,lbl,segs){
  const w=document.getElementById(wrap);if(!w)return;
  if(!val){w.style.display='none';return;}w.style.display='block';
  let s=0;if(val.length>=8)s++;if(val.length>=12)s++;if(/[A-Z]/.test(val)&&/[a-z]/.test(val))s++;if(/[0-9]/.test(val))s++;if(/[^A-Za-z0-9]/.test(val))s++;
  const lvl=s<=1?1:s<=2?2:s<=3?3:4;
  const lbls=['','Muy débil','Débil','Buena','Fuerte 🔒'];
  const cls=['','s1','s2','s3','s4'];
  segs.forEach((id,i)=>{const el=document.getElementById(id);if(el)el.className='pw-seg'+(i+1<=lvl?' '+cls[lvl]:'');});
  const le=document.getElementById(lbl);if(le){le.textContent=lbls[lvl];le.style.color=lvl===4?'var(--grn)':lvl===3?'var(--amb)':lvl===2?'var(--org)':'var(--red)';}
}
function updatePwStrength(val){_pwStrength(val,'pw-strength-wrap','pws-lbl',['pws1','pws2','pws3','pws4']);}
function updatePwStrength2(val){_pwStrength(val,'pw2-wrap','pw2-lbl',['pw2s1','pw2s2','pw2s3','pw2s4']);}

/* ── Email config (for creator only) ── */
function saveEmailCfg(){
  const pubkey=(document.getElementById('cfg-ejs-pubkey')?.value||'').trim();
  const svcId=(document.getElementById('cfg-ejs-svc')?.value||'').trim();
  const tplId=(document.getElementById('cfg-ejs-tpl')?.value||'').trim();
  const otpRequired=document.getElementById('cfg-otp-required')?.checked||false;
  if(!pubkey||!svcId||!tplId){snack('⚠️ Completa los 3 campos','⚠️');return;}
  localStorage.setItem(EMAILCFG_KEY,JSON.stringify({pubkey,svcId,tplId,otpRequired}));
  snack('✅ Email configurado','✅');
}
function loadEmailCfgFields(){
  const cfg=getEmailCfg();if(!cfg)return;
  const f={'cfg-ejs-pubkey':cfg.pubkey||'','cfg-ejs-svc':cfg.svcId||'','cfg-ejs-tpl':cfg.tplId||''};
  Object.entries(f).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v;});
  const chk=document.getElementById('cfg-otp-required');if(chk)chk.checked=!!cfg.otpRequired;
}
async function testOTPEmail(){
  const creds=getAuthCreds();
  if(!creds||!creds.email){snack('⚠️ Configura email en General → Email','⚠️');return;}
  saveEmailCfg();const cfg=getEmailCfg();
  if(!cfg?.pubkey){snack('⚠️ Guarda la config primero','⚠️');return;}
  snack('📧 Enviando prueba…','📧');
  const ok=await sendOTPEmail(creds.email,generateOTP(),creds.user||'admin');
  snack(ok?'✅ Correo enviado. Revisa '+creds.email:'❌ Error en EmailJS',ok?'✅':'❌');
}
function switchAuthTab(tab){ if(tab==='setup')showSlide('as-creator'); }

/* ── CLOCK ── */
let _clockMode=0; // 0=12h, 1=24h
let _clockInterval=null;
function startClock(){
  if(_clockInterval)clearInterval(_clockInterval);
  function tick(){
    const now=new Date();
    const el=document.getElementById('hdr-clock-time');
    const de=document.getElementById('hdr-clock-date');
    if(!el)return;
    if(_clockMode===0){
      let h=now.getHours();const ampm=h>=12?'PM':'AM';h=h%12||12;
      el.textContent=h+':'+String(now.getMinutes()).padStart(2,'0')+' '+ampm;
    } else {
      el.textContent=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    }
    if(de)de.textContent=now.toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'});
  }
  tick();
  _clockInterval=setInterval(tick,1000);
}
function toggleClockMode(){_clockMode=(_clockMode+1)%2;startClock();if(navigator.vibrate)navigator.vibrate(10);}

/* ── INIT ── */
(function authInit(){
  startClock();
  // 1. Session storage
  const session=getSession();
  if(session&&session.mode){
    authMode=session.mode;authUsername=session.username;authDisplayName=session.displayName||session.username;
    _hideAuthScreen();_applySession();return;
  }
  // 2. Remember-me
  try{
    const rem=JSON.parse(localStorage.getItem(REMEMBER_KEY)||'null');
    if(rem&&rem.mode!=='guest'&&rem.expiry>Date.now()){
      authMode=rem.mode;authUsername=rem.username;authDisplayName=rem.displayName||rem.username;
      _hideAuthScreen();_applySession();return;
    } else if(rem) localStorage.removeItem(REMEMBER_KEY);
  }catch{}
  // 3. Show welcome screen
  document.getElementById('auth-screen').style.display='flex';
  document.getElementById('app-shell').style.display='none';
  document.querySelectorAll('.auth-slide').forEach(s=>s.classList.remove('on','prev'));
  const welcome=document.getElementById('as-welcome');if(welcome)welcome.classList.add('on');
  // Show/hide creator setup link
  const hasCreds=!!getAuthCreds();
  const lnk=document.getElementById('creator-setup-link');
  if(lnk)lnk.style.display=hasCreds?'none':'block';
  checkLockout();
})();


/* ════════════════════════════════════════════════════
   ADMIN PANEL JS v31 — Panel exclusivo del Creador
   ════════════════════════════════════════════════════ */

/* ── Admin: expand/collapse user card ── */
function admExpandUser(userId){
  const exp=document.getElementById('ucard-exp-'+userId);
  const arr=document.getElementById('ucard-arr-'+userId);
  if(!exp)return;
  const open=exp.style.display==='none';
  exp.style.display=open?'block':'none';
  if(arr) arr.textContent=open?'⌄':'›';
}

/* ── Admin: approve/suspend user ── */
function admToggleApprove(userId){
  const users=getUsers();
  const u=users.find(x=>x.id===userId);if(!u)return;
  u.approved=u.approved===false?true:false;
  saveUsers(users);
  logAccess(u.approved?'user_approved':'user_suspended',authUsername,`${u.approved?'Aprobó':'Suspendió'}: @${u.username}`);
  snack(u.approved?`✅ @${u.username} aprobado`:`⏸️ @${u.username} suspendido`);
  renderAdminPanel();
}

/* ── Admin: set permissions per user ── */
function admSetRole(userId){
  const users=getUsers();
  const u=users.find(x=>x.id===userId);if(!u)return;
  const roles=[
    {key:'full',    lbl:'Acceso completo', desc:'Puede editar, exportar y marcar visitas'},
    {key:'readonly',lbl:'Solo lectura',    desc:'Solo puede ver registros, no editar'},
    {key:'limited', lbl:'Limitado',        desc:'Ve registros pero sin datos sensibles'},
  ];
  const cur=u.role||'full';
  const html2=roles.map(r=>`
    <div onclick="admApplyRole(${userId},'${r.key}')" style="display:flex;align-items:center;gap:10px;padding:11px 14px;background:${cur===r.key?'rgba(59,130,246,.1)':''};border:1px solid ${cur===r.key?'var(--a)':'var(--b2)'};border-radius:12px;cursor:pointer;margin-bottom:8px;transition:.15s">
      <div style="font-size:20px">${r.key==='full'?'🔓':r.key==='readonly'?'👁️':'🔒'}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:800;${cur===r.key?'color:var(--a2)':''}">${r.lbl}${cur===r.key?' ✓':''}</div>
        <div style="font-size:11px;color:var(--sft)">${r.desc}</div>
      </div>
    </div>`).join('');
  conf2(`🎭 Permisos de @${u.username}`, html2, null, null);
}

function admApplyRole(userId, role){
  const users=getUsers();
  const u=users.find(x=>x.id===userId);if(!u)return;
  u.role=role;
  saveUsers(users);
  closeAllSheets();
  logAccess('role_change',authUsername,`@${u.username} → ${role}`);
  snack(`🎭 Permisos de @${u.username}: ${role}`,'🎭');
  renderAdminPanel();
}

/* ── Admin: clear guest log ── */
function admClearGuestLog(){
  conf2('Limpiar visitas de invitados','¿Borrar el historial de visitas de invitados?',()=>{
    localStorage.removeItem('px_guest_log');
    snack('🗑️ Historial de invitados limpiado','🗑️');
    renderAdminPanel();
  },'Limpiar');
}

function renderAdminPanel(){
  if(!isCreator()){snack('⛔ Acceso solo para administrador','⛔');go('inicio');return;}

  const users   = getUsers();
  const log     = getAccessLog();
  const creds   = getAuthCreds();
  const vis     = R.filter(r=>r.visita==='Si'||r.visita==='Sí').length;
  const now     = new Date();

  // ── Hero time ──
  const te=document.getElementById('adm-hero-time');
  if(te) te.textContent=now.toLocaleString('es-MX',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
  const ts=document.getElementById('adm-hero-sub');
  if(ts) ts.textContent=`${authDisplayName} · Creador`;

  // ── KPIs ──
  const gLog2=JSON.parse(localStorage.getItem('px_guest_log')||'[]');
  document.getElementById('adm-kpi-n-total').textContent = R.length;
  document.getElementById('adm-kpi-n-users').textContent = users.length + 1;
  document.getElementById('adm-kpi-n-vis').textContent   = vis;
  document.getElementById('adm-kpi-n-log').textContent   = log.length;
  const gEl=document.getElementById('adm-kpi-n-guests');
  if(gEl) gEl.textContent=new Set(gLog2.map(g=>g.id)).size;
  const onlineEl=document.getElementById('adm-kpi-n-online');
  if(onlineEl) onlineEl.textContent=_onlineUsers.length;
  if(_onlineUsers.length>0) _renderPresence();
  else if(!fbIsConfigured()){
    const listEl=document.getElementById('adm-online-list');
    if(listEl) listEl.innerHTML='<div style="padding:16px;text-align:center;font-size:12px;color:var(--mut)">Conecta Firebase para ver usuarios en tiempo real</div>';
  }

  // ── Theme label ──
  const t=THEMES.find(x=>x.id===curTheme);
  const tl=document.getElementById('adm-theme-lbl');
  if(tl) tl.textContent=t?.nm||curTheme;

  // ── Credentials label ──
  const cl=document.getElementById('adm-creds-lbl');
  if(cl) cl.textContent=creds?`@${creds.user}${creds.email?' · '+creds.email.replace(/(.{2}).+(@)/,'$1…$2'):''}`:' Sin cuenta configurada';

  // ── Users list ──
  _renderAdminUsers(users, creds);

  // ── Log preview (last 5) ──
  _renderAdminLog(log.slice(0,5));

  // ── Storage ──
  _renderAdminStorage();
}

function _renderAdminUsers(users, creds){
  const el=document.getElementById('adm-users-list');if(!el)return;
  const gLog=JSON.parse(localStorage.getItem('px_guest_log')||'[]');
  // Count unique guest devices
  const uniqueGuests=new Set(gLog.map(g=>g.id)).size;
  const guestTotal=gLog.length;
  const lastGuest=gLog[0];

  // ── Summary strip ──
  let rows=`<div style="display:grid;grid-template-columns:1fr 1fr 1fr;padding:12px 14px;gap:8px;border-bottom:1px solid var(--b1);margin-bottom:2px">
    <div style="text-align:center">
      <div style="font-size:20px;font-weight:900;font-family:'JetBrains Mono',monospace;color:var(--vio)">${users.length+1}</div>
      <div style="font-size:9px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.4px">Registrados</div>
    </div>
    <div style="text-align:center;border-left:1px solid var(--b1);border-right:1px solid var(--b1)">
      <div style="font-size:20px;font-weight:900;font-family:'JetBrains Mono',monospace;color:var(--amb)">${uniqueGuests}</div>
      <div style="font-size:9px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.4px">Dispositivos invitado</div>
    </div>
    <div style="text-align:center">
      <div style="font-size:20px;font-weight:900;font-family:'JetBrains Mono',monospace;color:var(--grn)">${guestTotal}</div>
      <div style="font-size:9px;font-weight:700;color:var(--mut);text-transform:uppercase;letter-spacing:.4px">Visitas invitado</div>
    </div>
  </div>`;

  // ── Creator row ──
  rows+=`<div class="adm-user-row">
    <div class="adm-user-av" style="background:linear-gradient(135deg,#7c3aed,#c026d3)">👑</div>
    <div class="adm-user-body">
      <div class="adm-user-name">${authDisplayName} <span style="font-size:10px;color:var(--vio);font-weight:700">CREADOR</span></div>
      <div class="adm-user-meta">@${creds?.user||'—'} · ${creds?.email||'Sin email'}</div>
      <div class="adm-user-tags"><span class="adm-utag green">✅ Activo</span><span class="adm-utag purple">Acceso total</span></div>
    </div>
  </div>`;

  // ── Registered users ──
  if(!users.length){
    rows+=`<div class="adm-row-div"></div>
    <div style="padding:20px;text-align:center">
      <div style="font-size:28px;margin-bottom:6px">👤</div>
      <div style="font-size:13px;font-weight:700;color:var(--sft);margin-bottom:4px">Sin usuarios registrados</div>
      <div style="font-size:11px;color:var(--mut)">Cuando alguien cree una cuenta aparecerá aquí</div>
    </div>`;
  } else {
    users.forEach((u)=>{
      const blocked=u.blocked||false;
      const approved=u.approved!==false;
      const ts=u.lastLogin?new Date(u.lastLogin).toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'Nunca';
      const since=u.createdDate||new Date(u.createdAt||0).toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'});
      const logins=u.loginCount||1;
      const dev=u.device||'—';
      rows+=`<div class="adm-row-div"></div>
      <div class="adm-user-card" id="ucard-${u.id}">
        <div class="adm-user-row" onclick="admExpandUser(${u.id})" style="cursor:pointer">
          <div class="adm-user-av" style="background:linear-gradient(135deg,${blocked?'#7f1d1d,#b91c1c':'#1e3a8a,#3b82f6'})">${(u.name||u.username||'?')[0].toUpperCase()}</div>
          <div class="adm-user-body">
            <div class="adm-user-name">${u.name||u.username} ${blocked?'<span style="font-size:9px;color:var(--red)">BLOQUEADO</span>':!approved?'<span style="font-size:9px;color:var(--amb)">PENDIENTE</span>':''}</div>
            <div class="adm-user-meta">@${u.username} · Último: ${ts}</div>
            <div class="adm-user-tags">
              <span class="adm-utag ${blocked?'red':approved?'green':'amber'}">${blocked?'🔒 Bloqueado':approved?'✅ Activo':'⏳ Pendiente'}</span>
              <span class="adm-utag gray">${dev}</span>
              <span class="adm-utag blue">${logins} login${logins!==1?'s':''}</span>
            </div>
          </div>
          <div style="color:var(--mut);font-size:16px;font-weight:300;flex-shrink:0" id="ucard-arr-${u.id}">›</div>
        </div>
        <!-- Expanded detail (hidden by default) -->
        <div class="adm-user-expand" id="ucard-exp-${u.id}" style="display:none">
          <div class="adm-user-detail-grid">
            <div class="adm-ud-item"><span>📅 Registrado</span>${since}</div>
            <div class="adm-ud-item"><span>🕐 Último acceso</span>${ts}</div>
            <div class="adm-ud-item"><span>📱 Dispositivo</span>${u.device||'—'} · ${u.browser||'—'}</div>
            <div class="adm-ud-item"><span>🔑 Logins</span>${logins} veces</div>
          </div>
          <div class="adm-user-actions" style="margin-top:10px;justify-content:flex-start;gap:8px">
            <button class="adm-ua-btn ${blocked?'warn':''}" onclick="admToggleBlock(${u.id})">${blocked?'🔓 Desbloquear':'🔒 Bloquear'}</button>
            <button class="adm-ua-btn ${approved?'warn':'green'}" onclick="admToggleApprove(${u.id})">${approved?'⏸️ Suspender':'✅ Aprobar'}</button>
            <button class="adm-ua-btn" onclick="admSetRole(${u.id})">🎭 Permisos</button>
            <button class="adm-ua-btn danger" onclick="admDeleteUser(${u.id})">🗑️ Eliminar</button>
          </div>
        </div>
      </div>`;
    });
  }

  // ── Guest visits section ──
  rows+=`<div class="adm-row-div" style="margin-top:6px"></div>
  <div style="padding:10px 14px 4px;display:flex;align-items:center;justify-content:space-between">
    <div style="font-size:10px;font-weight:800;color:var(--sft);text-transform:uppercase;letter-spacing:.5px">👻 Visitas de invitados</div>
    <button onclick="admClearGuestLog()" style="background:none;border:none;font-size:10px;color:var(--mut);cursor:pointer;font-family:var(--fnt)">Limpiar</button>
  </div>`;

  if(!gLog.length){
    rows+=`<div style="padding:12px 14px 16px;text-align:center;font-size:12px;color:var(--mut)">Sin visitas de invitados aún</div>`;
  } else {
    rows+=gLog.slice(0,8).map(g=>`
      <div style="display:flex;align-items:center;gap:10px;padding:8px 14px;border-top:1px solid var(--b1)">
        <div style="width:28px;height:28px;border-radius:8px;background:rgba(245,158,11,.12);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">👻</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:700;color:var(--sft)">ID: ${g.id}</div>
          <div style="font-size:10px;color:var(--mut);font-family:'JetBrains Mono',monospace">${g.date} · ${g.device||'—'} · Visita #${g.visits}</div>
        </div>
      </div>`).join('');
    if(gLog.length>8) rows+=`<div style="padding:8px;text-align:center;font-size:11px;color:var(--sft)">${gLog.length-8} visitas más…</div>`;
  }

  el.innerHTML=rows;
}

function _renderAdminLog(entries){
  const el=document.getElementById('adm-log-preview');if(!el)return;
  if(!entries.length){
    el.innerHTML='<div style="padding:14px;text-align:center;font-size:12px;color:var(--mut)">Sin accesos registrados</div>';
    return;
  }
  const TYPE={login:'✅',register:'🆕',otp_ok:'📧',otp_fail:'⚠️',logout:'🚪',guest:'👻',fail:'❌',lockout:'🔒',creator_setup:'👑'};
  const CLR={login:'var(--grn)',register:'var(--a2)',otp_ok:'var(--a2)',otp_fail:'var(--amb)',logout:'var(--sft)',guest:'var(--amb)',fail:'var(--red)',lockout:'var(--red)',creator_setup:'var(--vio)'};
  el.innerHTML=entries.map(e=>`
    <div class="adm-log-item">
      <div class="adm-log-ico">${TYPE[e.type]||'ℹ️'}</div>
      <div class="adm-log-body">
        <div class="adm-log-type" style="color:${CLR[e.type]||'var(--sft)'}">${e.username||'—'}</div>
        <div class="adm-log-meta">${e.detail||e.type}</div>
      </div>
      <div class="adm-log-ts">${(e.ts||'').split(',')[0]||''}</div>
    </div>`).join('');
}

function _renderAdminStorage(){
  const el=document.getElementById('adm-storage-content');if(!el)return;
  const keys=[
    {k:'px_v10_r',    lbl:'📋 Registros',    clr:'var(--a)'},
    {k:'px_v10_h',    lbl:'📝 Historial',    clr:'var(--ind)'},
    {k:'px_users_v2', lbl:'👥 Usuarios',     clr:'var(--vio)'},
    {k:'px_access_log_v1',lbl:'🔐 Accesos',  clr:'var(--red)'},
    {k:'px_streak',   lbl:'🔥 Racha',        clr:'var(--amb)'},
  ];
  let totalKB=0;
  const bars=keys.map(({k,lbl,clr})=>{
    const raw=localStorage.getItem(k)||'';
    const kb=((raw.length*2)/1024).toFixed(2);
    totalKB+=parseFloat(kb);
    const pct=Math.min(100,parseFloat(kb)/50*100);
    return `<div class="adm-store-row">
      <div class="adm-store-label">
        <span>${lbl}</span>
        <span style="font-family:'JetBrains Mono',monospace;color:var(--sft)">${kb} KB</span>
      </div>
      <div class="adm-store-bar-bg">
        <div class="adm-store-bar" style="width:${Math.max(1,pct)}%;background:${clr}"></div>
      </div>
    </div>`;
  });
  el.innerHTML=bars.join('')+`
    <div style="border-top:1px solid var(--b1);padding-top:10px;margin-top:6px;display:flex;justify-content:space-between;font-size:13px;font-weight:800">
      <span>Total usado</span>
      <span style="font-family:'JetBrains Mono',monospace;color:var(--a2)">${totalKB.toFixed(2)} KB / ~5 MB</span>
    </div>`;
}

/* ── User management actions ── */
function admToggleBlock(userId){
  const users=getUsers();
  const u=users.find(x=>x.id===userId);if(!u)return;
  u.blocked=!u.blocked;
  u.lastModified=Date.now();
  saveUsers(users);
  logAccess(u.blocked?'user_blocked':'user_unblocked', authUsername, `${u.blocked?'Bloqueó':'Desbloqueó'}: @${u.username}`);
  snack(u.blocked?`🔒 @${u.username} bloqueado`:`🔓 @${u.username} desbloqueado`, u.blocked?'🔒':'🔓');
  renderAdminPanel();
}

function admDeleteUser(userId){
  const users=getUsers();
  const u=users.find(x=>x.id===userId);if(!u)return;
  conf2('Eliminar usuario',`¿Eliminar la cuenta de <b>${u.name||u.username}</b>?<br><br>Sus datos de beneficiarios no se eliminan.`,()=>{
    const filtered=users.filter(x=>x.id!==userId);
    saveUsers(filtered);
    logAccess('user_deleted', authUsername, `Eliminó: @${u.username}`);
    snack(`🗑️ @${u.username} eliminado`,'🗑️');
    renderAdminPanel();
  }, 'Eliminar');
}

function admResetAllData(){
  conf2('⚠️ BORRAR TODO','¿Borrar <b>TODOS</b> los registros, historial y usuarios?<br><br>Tu cuenta de administrador se mantiene.',()=>{
    const keep=['px_auth_v1','px_emailcfg_v1','px_theme','px_accent','px_accent_grad','px_fz','px_bgbright','px_gen_prefs_v1'];
    const saved={};
    keep.forEach(k=>{const v=localStorage.getItem(k);if(v)saved[k]=v;});
    localStorage.clear();
    Object.entries(saved).forEach(([k,v])=>localStorage.setItem(k,v));
    R=[];H=[];V=[];E=[];svR();svH();svV();
    detectDups();upHdr();
    logAccess('data_reset',authUsername,'Borró todos los datos');
    snack('🗑️ Datos borrados','🗑️');
    renderAdminPanel();renderInicio();
  },'⚠️ Borrar todo');
}

function admResetUsers(){
  conf2('Eliminar usuarios','¿Eliminar <b>todas las cuentas</b> de usuarios registrados?<br><br>Los beneficiarios NO se eliminan.',()=>{
    saveUsers([]);
    logAccess('users_reset',authUsername,'Eliminó todos los usuarios registrados');
    snack('👥 Usuarios eliminados','👥');
    renderAdminPanel();
  },'Eliminar usuarios');
}



/* ════════════════════════════════════════════════════════════
   FIREBASE SYNC MODULE v31
   Sincronización en tiempo real — Firestore
   ════════════════════════════════════════════════════════════
   CÓMO USAR:
   1. Crea proyecto en console.firebase.google.com
   2. Ve a Firestore Database → Crear base → Modo prueba
   3. Ve a Configuración → Apps web → Copia firebaseConfig
   4. En la app: General → Configurar Firebase → Pega la config
   ════════════════════════════════════════════════════════════ */

const FB_CONFIG_KEY  = 'px_fb_config_v1';
const FB_SYNC_KEY    = 'px_fb_last_sync';
const FB_PROJECT_KEY = 'px_fb_project_id';

let _fbApp      = null;
let _fbDb       = null;
let _fbUnsubR   = null;  // real-time listener for records
let _fbUnsubH   = null;
let _fbConnected= false;
let _fbSyncing  = false;

/* ── Check if Firebase is configured ── */
function fbIsConfigured(){
  return !!localStorage.getItem(FB_CONFIG_KEY);
}

/* ── Get stored config ── */
function fbGetConfig(){
  try{ return JSON.parse(localStorage.getItem(FB_CONFIG_KEY)||'null'); }
  catch{ return null; }
}

/* ── Parse config text (handles both JSON and firebaseConfig = {...} formats) ── */
function fbParseConfigText(text){
  text=text.trim();
  // Remove "const firebaseConfig = " prefix if present
  text=text.replace(/^const\s+firebaseConfig\s*=\s*/,'');
  // Remove trailing semicolon
  text=text.replace(/;?\s*$/,'');
  // Convert JS object to JSON (add quotes to keys)
  text=text.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g,'$1"$2"$3');
  return JSON.parse(text);
}

/* ── Load Firebase SDK dynamically ── */
async function fbLoadSDK(){
  if(window.firebase) return true;
  try{
    await new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src='https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js';
      s.onload=res;s.onerror=rej;document.head.appendChild(s);
    });
    await new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src='https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js';
      s.onload=res;s.onerror=rej;document.head.appendChild(s);
    });
    return true;
  }catch(e){
    console.error('Firebase SDK load error:',e);
    return false;
  }
}

/* ── Initialize Firebase ── */
async function fbInit(config){
  const loaded=await fbLoadSDK();
  if(!loaded) throw new Error('No se pudo cargar Firebase SDK');
  // Initialize or reuse app
  if(!_fbApp){
    try{ _fbApp=firebase.app(); }
    catch{ _fbApp=firebase.initializeApp(config); }
  }
  _fbDb=firebase.firestore();
  _fbConnected=true;
  return true;
}

/* ── Save config and connect ── */
async function fbSaveConfig(){
  const textarea=document.getElementById('fb-config-input');
  const errEl=document.getElementById('fb-config-err');
  const text=(textarea?.value||'').trim();
  errEl.style.display='none';
  if(!text){errEl.textContent='⚠️ Pega tu configuración de Firebase';errEl.style.display='block';return;}
  let config;
  try{
    config=fbParseConfigText(text);
    if(!config.projectId||!config.apiKey) throw new Error('Faltan campos requeridos');
  }catch(e){
    errEl.textContent='❌ Formato inválido. Verifica que pegaste el objeto completo. Error: '+e.message;
    errEl.style.display='block';return;
  }
  const btn=document.querySelector('#sh-firebase .btn-p');
  if(btn){btn.textContent='🔄 Conectando…';btn.disabled=true;}
  try{
    await fbInit(config);
    // Test connection
    await _fbDb.collection('_test').doc('ping').set({ts:Date.now()});
    // Save config
    localStorage.setItem(FB_CONFIG_KEY,JSON.stringify(config));
    localStorage.setItem(FB_PROJECT_KEY,config.projectId);
    if(btn){btn.textContent='🔌 Conectar y sincronizar';btn.disabled=false;}
    closeSheet('sh-firebase');
    snack('✅ Firebase conectado: '+config.projectId,'✅');
    // Start sync
    await fbSyncNow();
    fbStartListeners();
    fbUpdateUI(true);
    renderGeneral();
  }catch(e){
    if(btn){btn.textContent='🔌 Conectar y sincronizar';btn.disabled=false;}
    errEl.textContent='❌ Error al conectar: '+e.message+'. Verifica tu projectId y que Firestore esté activado.';
    errEl.style.display='block';
  }
}

/* ── Sync all data to/from Firestore ── */
async function fbSyncNow(){
  const config=fbGetConfig();
  if(!config){snack('⚠️ Configura Firebase primero','⚠️');return;}
  if(_fbSyncing){snack('🔄 Sincronizando…','🔄');return;}
  _fbSyncing=true;
  fbUpdateDot('syncing');
  try{
    if(!_fbDb) await fbInit(config);
    const projectId=config.projectId;
    // Push local data to Firestore (creator pushes, others pull)
    if(isCreator()){
      // Batch write records
      const batch=_fbDb.batch();
      const metaRef=_fbDb.collection(projectId).doc('_meta');
      batch.set(metaRef,{
        updatedAt:  Date.now(),
        updatedBy:  authUsername,
        recordCount:R.length,
        app:        'PensionadosMX v31',
      });
      const dataRef=_fbDb.collection(projectId).doc('records');
      batch.set(dataRef,{data:JSON.stringify(R),ts:Date.now()});
      const histRef=_fbDb.collection(projectId).doc('history');
      batch.set(histRef,{data:JSON.stringify(H.slice(-100)),ts:Date.now()});
      await batch.commit();
      const now=new Date().toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
      localStorage.setItem(FB_SYNC_KEY,now);
      snack('☁️ Datos subidos a la nube','☁️');
    } else {
      // Pull from Firestore
      await fbPullData();
    }
    fbUpdateDot('connected');
  }catch(e){
    console.error('Sync error:',e);
    fbUpdateDot('error');
    snack('❌ Error al sincronizar: '+e.message,'❌');
  }
  _fbSyncing=false;
}

/* ── Pull data from Firestore ── */
async function fbPullData(){
  const config=fbGetConfig();if(!config)return;
  const projectId=config.projectId;
  const snap=await _fbDb.collection(projectId).doc('records').get();
  if(!snap.exists){snack('ℹ️ No hay datos en la nube aún','ℹ️');return;}
  const data=snap.data();
  if(data?.data){
    R=JSON.parse(data.data);
    svR();
    detectDups();upHdr();
    if(curTab==='inicio'||curTab==='registros') render(curTab);
    const now=new Date().toLocaleString('es-MX',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
    localStorage.setItem(FB_SYNC_KEY,now);
    snack('☁️ Datos actualizados desde la nube','☁️');
  }
}

/* ── Start real-time listeners ── */
function fbStartListeners(){
  const config=fbGetConfig();if(!config||!_fbDb)return;
  const projectId=config.projectId;
  // Stop old listeners
  if(_fbUnsubR){_fbUnsubR();_fbUnsubR=null;}
  // Listen to records changes
  // Start presence tracking
  presenceStart();

  _fbUnsubR=_fbDb.collection(projectId).doc('records')
    .onSnapshot(snap=>{
      if(!snap.exists)return;
      const d=snap.data();
      if(d?.data&&d.ts){
        const remoteTs=d.ts||0;
        const localTs=parseInt(localStorage.getItem('px_fb_local_ts')||'0');
        // Only update if remote is newer AND we're not the creator (avoid overwriting own data)
        if(remoteTs>localTs&&!isCreator()){
          R=JSON.parse(d.data);
          svR();localStorage.setItem('px_fb_local_ts',String(remoteTs));
          detectDups();upHdr();
          if(curTab==='inicio'||curTab==='registros') render(curTab);
          fbUpdateDot('connected');
          // Silent update indicator
          _fbShowSyncBadge();
        } else if(isCreator()){
          fbUpdateDot('connected');
        }
      }
    },err=>{
      console.error('Listener error:',err);
      fbUpdateDot('error');
    });
}

let _syncBadgeTimeout=null;
function _fbShowSyncBadge(){
  const dot=document.getElementById('fb-sync-dot');
  if(dot){
    dot.title='✅ Datos actualizados';
    dot.style.setProperty('--dot-color','var(--grn)');
    clearTimeout(_syncBadgeTimeout);
    _syncBadgeTimeout=setTimeout(()=>{dot.style.removeProperty('--dot-color');},3000);
  }
}

/* ── Disconnect ── */
function fbDisconnect(){
  conf2('Desconectar Firebase','¿Dejar de sincronizar con la nube?<br><br>Los datos locales no se borran.',()=>{
    if(_fbUnsubR){_fbUnsubR();_fbUnsubR=null;}
    if(_fbUnsubH){_fbUnsubH();_fbUnsubH=null;}
    presenceStop();
    localStorage.removeItem(FB_CONFIG_KEY);
    localStorage.removeItem(FB_PROJECT_KEY);
    localStorage.removeItem(FB_SYNC_KEY);
    _fbDb=null;_fbApp=null;_fbConnected=false;
    fbUpdateUI(false);
    renderGeneral();
    snack('🔌 Firebase desconectado','🔌');
  },'Desconectar');
}

/* ── Update UI ── */
function fbUpdateUI(connected){
  const setupRows =document.getElementById('gen-fb-setup-rows');
  const activeRows=document.getElementById('gen-fb-active-rows');
  const ico       =document.getElementById('gen-fb-ico');
  const title     =document.getElementById('gen-fb-title');
  const sub       =document.getElementById('gen-fb-sub');
  const lastSync  =document.getElementById('gen-fb-last-sync');
  const dot       =document.getElementById('fb-sync-dot');
  const config    =fbGetConfig();

  if(connected&&config){
    if(setupRows)  setupRows.style.display='none';
    if(activeRows) activeRows.style.display='';
    if(ico)        ico.style.background='linear-gradient(135deg,#065f46,#10b981)';
    if(ico)        ico.textContent='☁️';
    if(title)      title.textContent='Firebase conectado';
    if(sub)        sub.textContent=config.projectId;
    const ls=localStorage.getItem(FB_SYNC_KEY)||'—';
    if(lastSync)   lastSync.textContent='Última sync: '+ls;
    if(dot)        dot.style.display='flex';
    fbUpdateDot('connected');
  } else {
    if(setupRows)  setupRows.style.display='';
    if(activeRows) activeRows.style.display='none';
    if(ico)        ico.style.background='linear-gradient(135deg,#f59e0b,#ef4444)';
    if(ico)        ico.textContent='☁️';
    if(title)      title.textContent='Sin sincronización';
    if(sub)        sub.textContent='Toca para configurar Firebase';
    if(dot)        dot.style.display='none';
  }
}

/* ── Dot states: connected / syncing / error / offline ── */
function fbUpdateDot(state){
  const dot=document.getElementById('fb-sync-dot');if(!dot)return;
  dot.className='fb-sync-dot fb-dot-'+state;
  dot.style.display='flex';
}

/* ── Open setup sheet ── */
function openFbSetupSheet(){
  const ta=document.getElementById('fb-config-input');
  if(ta){const cfg=fbGetConfig();ta.value=cfg?JSON.stringify(cfg,null,2):'';}
  openSheet('sh-firebase');
}

/* ── Open status sheet ── */
function openFbStatus(){
  const config=fbGetConfig();
  const el=document.getElementById('sh-fb-status-content');
  const title=document.getElementById('sh-fb-status-title');
  if(!config){
    if(title) title.textContent='☁️ Sincronización';
    if(el) el.innerHTML=`
      <div style="text-align:center;padding:20px 0">
        <div style="font-size:40px;margin-bottom:12px">☁️</div>
        <div style="font-size:15px;font-weight:800;margin-bottom:6px">Sin sincronización activa</div>
        <div style="font-size:13px;color:var(--sft);margin-bottom:20px;line-height:1.6">
          Conecta Firebase para que otros vean<br>tus datos en tiempo real
        </div>
        <button class="btn btn-p" onclick="closeSheet('sh-fb-status');openFbSetupSheet()">
          🔌 Configurar Firebase
        </button>
      </div>`;
    openSheet('sh-fb-status');return;
  }
  const ls=localStorage.getItem(FB_SYNC_KEY)||'—';
  if(title) title.textContent='☁️ '+config.projectId;
  if(el) el.innerHTML=`
    <div style="background:rgba(16,185,129,.08);border:1px solid rgba(16,185,129,.2);border-radius:14px;padding:14px;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <span style="font-size:20px">✅</span>
        <div>
          <div style="font-size:14px;font-weight:800;color:var(--grn)">Conectado</div>
          <div style="font-size:11px;color:var(--sft)">Proyecto: ${config.projectId}</div>
        </div>
      </div>
      <div style="font-size:12px;color:var(--t2)">Última sincronización: <b>${ls}</b></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      <button class="btn btn-p" onclick="fbSyncNow();closeSheet('sh-fb-status')">🔄 Sincronizar ahora</button>
      <button class="btn btn-s" onclick="closeSheet('sh-fb-status');fbDisconnect()">🔌 Desconectar</button>
    </div>`;
  openSheet('sh-fb-status');
}

/* ── Guide modal ── */
function openFbGuide(){
  conf2('📖 Guía Firebase (5 min)',
    `<div style="font-size:13px;line-height:1.8;color:var(--t2)">
      <b style="color:var(--txt)">Paso 1 — Crea el proyecto</b><br>
      → Ve a <b>console.firebase.google.com</b><br>
      → "Agregar proyecto" → ponle nombre → Continuar<br><br>
      <b style="color:var(--txt)">Paso 2 — Activa Firestore</b><br>
      → En el menú izquierdo: "Firestore Database"<br>
      → "Crear base de datos" → <b>Modo de prueba</b> → Listo<br><br>
      <b style="color:var(--txt)">Paso 3 — Obtén tu config</b><br>
      → ⚙️ Configuración → "Tus apps" → ícono Web <b>&lt;/&gt;</b><br>
      → Ponle nombre → "Registrar app"<br>
      → Copia el objeto <b>firebaseConfig</b><br><br>
      <b style="color:var(--txt)">Paso 4 — Pega en la app</b><br>
      → General → Configurar Firebase → Pega → Conectar<br><br>
      <span style="color:var(--grn)">✅ ¡Listo! Todos con el link de tu app verán los datos en tiempo real.</span>
    </div>`,
    ()=>openFbSetupSheet(),
    '→ Ir a configurar'
  );
}

/* ── Auto-init on app load if configured ── */
async function fbAutoInit(){
  const config=fbGetConfig();
  if(!config)return;
  try{
    await fbInit(config);
    fbUpdateUI(true);
    fbStartListeners();   // This also calls presenceStart()
    // Auto-pull if not creator
    if(!isCreator()) await fbPullData();
  }catch(e){
    console.warn('Firebase auto-init failed:',e);
    fbUpdateDot('error');
  }
}


/* ════════════════════════════════════════════════
   NOTIFICACIONES LOCALES v31
   Cumpleaños · Meta diaria · Recordatorios
   ════════════════════════════════════════════════ */

const NOTIF_KEY = 'px_notif_prefs';

function getNotifPrefs(){
  return JSON.parse(localStorage.getItem(NOTIF_KEY)||'{"birthday":true,"goal":true,"pending":true}');
}

async function requestNotifPermission(){
  if(!('Notification' in window)) return false;
  if(Notification.permission==='granted') return true;
  const result=await Notification.requestPermission();
  return result==='granted';
}

function sendLocalNotif(title, body, icon='icon-192.png', tag='pm-notif'){
  if(Notification.permission!=='granted') return;
  const n=new Notification(title,{body,icon,tag,badge:'icon-192.png',vibrate:[200,100,200]});
  n.onclick=()=>{window.focus();n.close();};
}

function checkDailyNotifications(){
  if(Notification.permission!=='granted') return;
  const prefs=getNotifPrefs();
  const today=new Date();
  const todayStr=today.toISOString().slice(0,10);
  const lastCheck=localStorage.getItem('px_notif_last_check');
  if(lastCheck===todayStr) return; // Already checked today
  localStorage.setItem('px_notif_last_check',todayStr);

  const mm=today.getMonth()+1, dd=today.getDate();

  // 🎂 Birthday notifications
  if(prefs.birthday){
    const cumples=R.filter(r=>{
      if(!r.fnac) return false;
      const parts=r.fnac.split('-');
      return parseInt(parts[1])===mm && parseInt(parts[2])===dd;
    });
    if(cumples.length===1){
      sendLocalNotif('🎂 Cumpleaños hoy',`${cumples[0].nombre} cumple años hoy`,'icon-192.png','birthday');
    } else if(cumples.length>1){
      sendLocalNotif('🎂 Cumpleaños hoy',`${cumples.length} beneficiarios cumplen años hoy`,'icon-192.png','birthday');
    }
  }

  // 🎯 Goal reminder (afternoon)
  if(prefs.goal && today.getHours()>=14){
    const m=_getMeta();
    const vis=R.filter(r=>{
      if(!r.ult) return false;
      return r.ult.startsWith(todayStr) && (r.visita==='Si'||r.visita==='Sí');
    }).length;
    if(m.goal>0 && vis<m.goal){
      const left=m.goal-vis;
      sendLocalNotif('🎯 Meta del día',`Te faltan ${left} visita${left!==1?'s':''} para cumplir tu meta`,'icon-192.png','goal');
    }
  }

  // ⏳ Pending visits (more than 7 days old)
  if(prefs.pending){
    const oldPending=R.filter(r=>{
      if(r.visita!=='Pendiente'||!r.fecha) return false;
      const diff=(Date.now()-new Date(r.fecha+'T00:00:00').getTime())/(1000*60*60*24);
      return diff>7;
    }).length;
    if(oldPending>0){
      sendLocalNotif('⏳ Visitas pendientes',`${oldPending} beneficiario${oldPending!==1?'s tienen':' tiene'} más de 7 días sin visitar`,'icon-192.png','pending');
    }
  }
}

async function toggleNotifications(){
  if(Notification.permission==='denied'){
    conf2('Notificaciones bloqueadas','Las notificaciones están bloqueadas en iOS.<br><br>Para activarlas:<br>Ajustes → Safari → Notificaciones → PensionadosMX',null,null);
    return;
  }
  const granted=await requestNotifPermission();
  if(granted){
    snack('🔔 Notificaciones activadas','🔔');
    // Test notification
    setTimeout(()=>sendLocalNotif('✅ PensionadosMX','Las notificaciones están activadas'),500);
    checkDailyNotifications();
  } else {
    snack('❌ Permiso denegado','❌');
  }
  renderGeneral();
}


/* ════════════════════════════════════════════════
   SWIPE GESTURES v31
   ← Desliza izquierda para eliminar
   → Desliza derecha para marcar visitado
   ════════════════════════════════════════════════ */

const SWIPE_THRESHOLD = 80;  // px needed to trigger action
const SWIPE_MAX = 140;       // max drag distance

function initSwipeOnRec(recEl, recordId){
  if(!recEl || recEl.dataset.swipeInit) return;
  recEl.dataset.swipeInit='1';

  // Create background layers
  const wrap=recEl.closest('.rec-wrap');
  if(!wrap) return;
  let bgLeft=wrap.querySelector('.rec-swipe-bg.left');
  let bgRight=wrap.querySelector('.rec-swipe-bg.right');
  if(!bgLeft){
    bgLeft=document.createElement('div');
    bgLeft.className='rec-swipe-bg left';
    bgLeft.innerHTML='🗑️ Eliminar';
    wrap.prepend(bgLeft);
  }
  if(!bgRight){
    bgRight=document.createElement('div');
    bgRight.className='rec-swipe-bg right';
    bgRight.innerHTML='✅ Visitado';
    wrap.prepend(bgRight);
  }

  let startX=0, startY=0, currentX=0, dragging=false, axis=null;

  function onStart(e){
    const touch=e.touches?.[0]||e;
    startX=touch.clientX; startY=touch.clientY;
    currentX=0; dragging=true; axis=null;
    recEl.classList.add('swiping');
  }
  function onMove(e){
    if(!dragging) return;
    const touch=e.touches?.[0]||e;
    const dx=touch.clientX-startX;
    const dy=touch.clientY-startY;
    if(!axis){
      if(Math.abs(dx)<5&&Math.abs(dy)<5) return;
      axis=Math.abs(dx)>Math.abs(dy)?'x':'y';
    }
    if(axis!=='x') return;
    e.preventDefault();
    currentX=Math.max(-SWIPE_MAX,Math.min(SWIPE_MAX,dx));
    recEl.style.transform=`translateX(${currentX}px)`;
    // Show bg based on direction
    if(currentX < -20){
      bgLeft.classList.add('show'); bgRight.classList.remove('show');
      bgLeft.style.opacity=Math.min(1,Math.abs(currentX)/SWIPE_THRESHOLD).toString();
    } else if(currentX > 20){
      bgRight.classList.add('show'); bgLeft.classList.remove('show');
      bgRight.style.opacity=Math.min(1,currentX/SWIPE_THRESHOLD).toString();
    } else {
      bgLeft.classList.remove('show'); bgRight.classList.remove('show');
    }
  }
  function onEnd(){
    if(!dragging) return;
    dragging=false; axis=null;
    recEl.classList.remove('swiping');
    recEl.style.transform='';
    bgLeft.classList.remove('show'); bgRight.classList.remove('show');
    bgLeft.style.opacity=''; bgRight.style.opacity='';
    // Trigger action if past threshold
    if(currentX < -SWIPE_THRESHOLD){
      // Swipe left → delete (with haptic)
      if(navigator.vibrate) navigator.vibrate([30,20,30]);
      if(can('deleteRecord')) confDel(recordId);
      else _showGuestUpgrade('Eliminar registros requiere una cuenta');
    } else if(currentX > SWIPE_THRESHOLD){
      // Swipe right → mark visited (with haptic)
      if(navigator.vibrate) navigator.vibrate(25);
      if(can('markVisit')) detSetField(recordId,'visita','Si');
      else _showGuestUpgrade('Marcar visitas requiere una cuenta');
    }
    currentX=0;
  }

  recEl.addEventListener('touchstart', onStart, {passive:true});
  recEl.addEventListener('touchmove',  onMove,  {passive:false});
  recEl.addEventListener('touchend',   onEnd,   {passive:true});
}

// Wrap all records with swipe container after render
function _wrapRecsForSwipe(){
  requestAnimationFrame(()=>{
    document.querySelectorAll('.recs .rec').forEach(el=>{
      const id=parseInt(el.querySelector('[data-id]')?.dataset.id||el.dataset.id||'0');
      if(!id) return;
      if(el.closest('.rec-wrap')) { initSwipeOnRec(el, id); return; }
      const wrap=document.createElement('div');
      wrap.className='rec-wrap';
      el.parentNode.insertBefore(wrap, el);
      wrap.appendChild(el);
      initSwipeOnRec(el, id);
    });
  });
}


function _toggleRecTray(id){
  // Double tap = open detail, single tap = show quick tray
  const tray=document.getElementById('rqt-'+id);
  if(!tray){ openDet(id); return; }
  const isOpen=tray.classList.contains('open');
  // Close all other trays
  document.querySelectorAll('.rec-quick-tray.open').forEach(t=>{if(t!==tray)t.classList.remove('open');});
  if(isOpen){ openDet(id); }
  else { tray.classList.add('open'); if(navigator.vibrate)navigator.vibrate(8); }
}


/* ════════════════════════════════════════════════════════════
   PRESENCIA EN TIEMPO REAL v31
   Quién está conectado ahora mismo — via Firebase
   ════════════════════════════════════════════════════════════ */

const PRESENCE_TTL     = 90000;   // 90 seconds — considered "online"
const PRESENCE_INTERVAL= 30000;   // Heartbeat every 30s
let _presenceInterval  = null;
let _presenceUnsubscribe = null;
let _myPresenceRef     = null;
let _onlineUsers       = [];      // Cache of online users

/* ── Write my presence to Firestore ── */
async function presenceHeartbeat(){
  if(!_fbDb||!fbIsConfigured()) return;
  const config=fbGetConfig();
  if(!config) return;
  const projectId=config.projectId;
  const uid=isGuest()
    ? (localStorage.getItem('px_guest_device_id')||'guest-unknown')
    : authUsername;
  const d=_getDeviceInfo();
  const presenceData={
    uid,
    displayName:  isGuest()?'Invitado':authDisplayName||authUsername,
    role:         authMode,          // 'creator'|'admin'|'guest'
    device:       d.device,
    browser:      d.browser,
    lastSeen:     Date.now(),
    tab:          curTab,
    app:          'PensionadosMX v31',
  };
  try{
    _myPresenceRef=_fbDb
      .collection(projectId)
      .doc('_presence')
      .collection('users')
      .doc(uid);
    await _myPresenceRef.set(presenceData,{merge:true});
  }catch(e){ console.warn('Presence write:',e); }
}

/* ── Remove my presence on logout/close ── */
async function presenceRemove(){
  if(_myPresenceRef){
    try{ await _myPresenceRef.delete(); }catch{}
    _myPresenceRef=null;
  }
}

/* ── Listen to all online users ── */
function presenceStartListener(){
  if(!_fbDb||!fbIsConfigured()) return;
  const config=fbGetConfig();if(!config)return;
  const projectId=config.projectId;
  if(_presenceUnsubscribe){ _presenceUnsubscribe(); _presenceUnsubscribe=null; }
  _presenceUnsubscribe=_fbDb
    .collection(projectId).doc('_presence').collection('users')
    .onSnapshot(snap=>{
      const now=Date.now();
      _onlineUsers=[];
      snap.forEach(doc=>{
        const d=doc.data();
        if(now-d.lastSeen < PRESENCE_TTL){
          _onlineUsers.push(d);
        }
      });
      _renderPresence();
      // Notify creator when someone new joins
      if(typeof isCreator==='function'&&isCreator()&&_onlineUsers.length>(_prevJoinCount||0)&&(_prevJoinCount||0)>0){
        const sorted=_onlineUsers.slice().sort((a,b)=>b.lastSeen-a.lastSeen);
        const newest=sorted[0];
        if(newest&&(Date.now()-newest.lastSeen)<8000&&newest.uid!==authUsername){
          snack('🟢 '+(newest.displayName||'Alguien')+' entró a la app','🟢');
        }
      }
      window._prevJoinCount=_onlineUsers.length;
    },err=>console.warn('Presence listener:',err));
}

/* ── Render online users everywhere ── */
function _renderPresence(){
  const count=_onlineUsers.length;
  // ── KPI badge ──
  const kpiEl=document.getElementById('adm-kpi-n-online');
  if(kpiEl) kpiEl.textContent=count;
  // ── Header badge ──
  const hdrBadge=document.getElementById('hdr-presence-badge');
  if(hdrBadge){
    hdrBadge.textContent=count>9?'9+':count;
    hdrBadge.classList.toggle('show',count>1); // >1 because I'm also online
  }
  // ── Admin online label ──
  const lbl=document.getElementById('adm-online-count');
  if(lbl) lbl.textContent=count;
  // ── Admin online list ──
  const listEl=document.getElementById('adm-online-list');
  if(!listEl) return;
  if(!count){
    listEl.innerHTML='<div style="padding:14px;text-align:center;font-size:12px;color:var(--mut)">Nadie más en línea ahora</div>';
    return;
  }
  const now=Date.now();
  listEl.innerHTML=_onlineUsers.map(u=>{
    const ago=Math.round((now-u.lastSeen)/1000);
    const agoStr=ago<10?'Ahora mismo':ago<60?`${ago}s`:ago<3600?`${Math.round(ago/60)}min`:'Hace rato';
    const roleColors={creator:'linear-gradient(135deg,#7c3aed,#c026d3)',admin:'linear-gradient(135deg,#1e3a8a,#3b82f6)',guest:'linear-gradient(135deg,#78350f,#b45309)'};
    const roleIcons={creator:'👑',admin:'👤',guest:'👻'};
    const isMe=u.uid===authUsername||(isGuest()&&u.role==='guest'&&u.uid===localStorage.getItem('px_guest_device_id'));
    const tabLabels={inicio:'🏠 Inicio',registros:'📋 Lista',buscar:'🔍 Búsqueda',visitas:'🚗 Visitas',estadisticas:'📊 Stats',general:'⚙️ General',admin:'👑 Admin'};
    const tabLbl=tabLabels[u.tab]||u.tab||'—';
    return `<div class="presence-user-row">
      <div class="presence-av" style="background:${roleColors[u.role]||roleColors.admin}">
        ${roleIcons[u.role]||'👤'}
        <div class="presence-online-ring"></div>
      </div>
      <div class="presence-body">
        <div class="presence-name">${u.displayName||u.uid}${isMe?' <span style="font-size:9px;color:var(--sft)">(tú)</span>':''}</div>
        <div class="presence-meta">${u.device||'—'} · ${tabLbl} · ${agoStr}</div>
      </div>
      <span class="presence-status ${u.role==='guest'?'guest':'online'}">${u.role==='creator'?'👑 Admin':u.role==='guest'?'👻 Invitado':'👤 Usuario'}</span>
    </div>`;
  }).join('');
}

/* ── Start full presence system ── */
async function presenceStart(){
  if(!fbIsConfigured()||!_fbDb) return;
  // Write initial presence
  await presenceHeartbeat();
  // Start heartbeat
  if(_presenceInterval) clearInterval(_presenceInterval);
  _presenceInterval=setInterval(presenceHeartbeat, PRESENCE_INTERVAL);
  // Listen to others
  presenceStartListener();
  // Remove on page unload
  window.addEventListener('beforeunload', presenceRemove);
  // Update tab info when navigating
  const _origGoOuter=window._origGoForPresence||go;
  window._origGoForPresence=_origGoOuter;
}

/* ── Stop presence ── */
function presenceStop(){
  if(_presenceInterval){ clearInterval(_presenceInterval); _presenceInterval=null; }
  if(_presenceUnsubscribe){ _presenceUnsubscribe(); _presenceUnsubscribe=null; }
  presenceRemove();
}

/* ── Update tab on navigation ── */
function presenceUpdateTab(tab){
  if(!_myPresenceRef) return;
  _myPresenceRef.update({tab, lastSeen:Date.now()}).catch(()=>{});
}


/* ════════════════════════════════════════════════════════════
   EXPORT & FILE SCANNER JS v31
   ════════════════════════════════════════════════════════════ */

/* ── Date utility ── */
function _dateOnly(d){ return d?new Date(d+'T00:00:00'):null; }

/* ── Set default dates on page load ── */
function renderDL(){
  detectDups();
  // Set default dates: start of current month → today
  const now=new Date();
  const firstDay=new Date(now.getFullYear(),now.getMonth(),1).toISOString().slice(0,10);
  const todayStr=today();
  const fromEl=document.getElementById('exp-date-from');
  const toEl=document.getElementById('exp-date-to');
  if(fromEl&&!fromEl.value) fromEl.value=firstDay;
  if(toEl&&!toEl.value)     toEl.value=todayStr;
  renderExportPreview();
}

/* ── Quick date presets for export ── */
const EXP_PRESETS=['ep-all','ep-today','ep-week','ep-month','ep-3m'];
function expPreset(p){
  EXP_PRESETS.forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.classList.toggle('on',id==='ep-'+p);
  });
  const now=new Date();
  const from=document.getElementById('exp-date-from');
  const to=document.getElementById('exp-date-to');
  if(!from||!to) return;
  to.value=today();
  if(p==='all'){   from.value='2000-01-01';to.value='2099-12-31';}
  if(p==='today'){ from.value=today();}
  if(p==='week'){
    const d=new Date(now);d.setDate(d.getDate()-6);
    from.value=d.toISOString().slice(0,10);
  }
  if(p==='month'){ from.value=new Date(now.getFullYear(),now.getMonth(),1).toISOString().slice(0,10);}
  if(p==='3m'){
    const d=new Date(now);d.setMonth(d.getMonth()-3);
    from.value=d.toISOString().slice(0,10);
  }
  renderExportPreview();
}

/* ── Get filtered records by date + filters ── */
function getFilteredRecords(){
  const from=document.getElementById('exp-date-from')?.value||'';
  const to=document.getElementById('exp-date-to')?.value||'';
  const tipo=document.getElementById('exp-fil-tipo')?.value||'';
  const vis=document.getElementById('exp-fil-vis')?.value||'';
  return R.filter(r=>{
    // Date filter on record creation date
    const rDate=r.fecha||r.ult||'';
    const rD=rDate.slice(0,10);
    if(from&&rD&&rD<from) return false;
    if(to&&rD&&rD>to)     return false;
    if(tipo&&r.tipo!==tipo)    return false;
    if(vis&&r.visita!==vis)    return false;
    return true;
  });
}

/* ── Preview count ── */
function renderExportPreview(){
  // Deactivate all presets (user typed a custom range)
  const filtered=getFilteredRecords();
  const countEl=document.getElementById('exp-count-lbl');
  const rangeEl=document.getElementById('exp-range-lbl');
  if(countEl) countEl.textContent=`${filtered.length} de ${R.length} registros`;
  const from=document.getElementById('exp-date-from')?.value||'';
  const to=document.getElementById('exp-date-to')?.value||'';
  if(rangeEl){
    if(from==='2000-01-01'&&to==='2099-12-31') rangeEl.textContent='Todos los periodos';
    else if(from===today()&&to===today())      rangeEl.textContent='Solo hoy';
    else rangeEl.textContent=(from?from.slice(5):'')+(from&&to?' → ':'')+(to?to.slice(5):'');
  }
}

/* ── Download filtered by date ── */
function dlFilteredDateCSV(format='xlsx'){
  if(typeof requirePerm==='function'&&!requirePerm('exportData','Exportar datos requiere una cuenta')) return;
  const filtered=getFilteredRecords();
  if(!filtered.length){snack('⚠️ Sin registros en ese rango','⚠️');return;}
  const from=document.getElementById('exp-date-from')?.value||'';
  const to=document.getElementById('exp-date-to')?.value||'';
  const suffix=(from&&to)?`_${from}_${to}`:today();
  const fname=`Pensionados${suffix}`;
  if(format==='csv'){
    const rows=[COLS,...filtered.map(rowData)];
    const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
    dlFile(fname+'.csv','data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv));
    snack(`⬇️ ${filtered.length} registros → CSV`,'⬇️');
  } else if(format==='json'){
    const blob=new Blob([JSON.stringify({records:filtered,exported:new Date().toISOString(),total:filtered.length},null,2)],{type:'application/json'});
    dlFile(fname+'.json',URL.createObjectURL(blob),true);
    snack(`⬇️ ${filtered.length} registros → JSON`,'⬇️');
  } else {
    // Default: XLSX via existing function with filtered data
    if(typeof dlXLSXFiltered==='function') dlXLSXFiltered(filtered,fname);
    else {
      // Fallback to CSV if XLSX not available
      const rows=[COLS,...filtered.map(rowData)];
      const csv=rows.map(r=>r.map(v=>`"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n');
      dlFile(fname+'.csv','data:text/csv;charset=utf-8,\uFEFF'+encodeURIComponent(csv));
      snack(`⬇️ ${filtered.length} registros exportados`,'⬇️');
    }
  }
}

/* ════════════════════════════════════════════════
   FILE SCANNER
   ════════════════════════════════════════════════ */

let _scannedFiles=[];   // Array of {file, selected}
let _visibleFiles=[];   // After filter

const FILE_TYPE_MAP={
  'image':    {ico:'🖼️', bg:'rgba(236,72,153,.12)', lbl:'Imagen'},
  'video':    {ico:'🎬', bg:'rgba(139,92,246,.12)', lbl:'Video'},
  'audio':    {ico:'🎵', bg:'rgba(59,130,246,.12)',  lbl:'Audio'},
  'text':     {ico:'📄', bg:'rgba(34,197,94,.12)',   lbl:'Texto'},
  'pdf':      {ico:'📕', bg:'rgba(239,68,68,.12)',   lbl:'PDF'},
  'json':     {ico:'🔒', bg:'rgba(99,102,241,.12)',  lbl:'JSON'},
  'zip':      {ico:'📦', bg:'rgba(245,158,11,.12)',  lbl:'ZIP'},
  'spreadsheet':{ico:'📊',bg:'rgba(34,197,94,.12)', lbl:'Excel'},
  'default':  {ico:'📎', bg:'rgba(100,116,139,.12)',lbl:'Archivo'},
};

function _getFileType(file){
  const t=file.type||'';
  const n=file.name.toLowerCase();
  if(t.startsWith('image'))  return 'image';
  if(t.startsWith('video'))  return 'video';
  if(t.startsWith('audio'))  return 'audio';
  if(t==='application/pdf'||n.endsWith('.pdf')) return 'pdf';
  if(t.includes('json')||n.endsWith('.json'))   return 'json';
  if(t.includes('zip')||n.endsWith('.zip'))     return 'zip';
  if(n.endsWith('.xlsx')||n.endsWith('.xls')||t.includes('spreadsheet')) return 'spreadsheet';
  if(t.startsWith('text')||n.endsWith('.csv')||n.endsWith('.txt'))       return 'text';
  return 'default';
}

function _fmtSize(bytes){
  if(bytes<1024)    return bytes+'B';
  if(bytes<1048576) return (bytes/1024).toFixed(1)+'KB';
  return (bytes/1048576).toFixed(2)+'MB';
}

function _fmtDate(ts){
  if(!ts) return '—';
  return new Date(ts).toLocaleString('es-MX',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
}

/* ── Handle file input ── */
function handleFileScanner(event){
  const files=Array.from(event.target.files||[]);
  if(!files.length) return;
  _scannedFiles=files.map(f=>({file:f,selected:true}));
  // Set default date range to encompass all files
  const dates=files.map(f=>f.lastModified).filter(Boolean).sort();
  if(dates.length){
    const fromEl=document.getElementById('file-date-from');
    const toEl=document.getElementById('file-date-to');
    if(fromEl) fromEl.value=new Date(dates[0]).toISOString().slice(0,10);
    if(toEl)   toEl.value=new Date(dates[dates.length-1]).toISOString().slice(0,10);
  }
  document.getElementById('exp-file-filter-wrap').style.display='block';
  // Reset the input so the same files can be re-selected
  event.target.value='';
  filterScannedFiles();
}

/* ── Filter scanned files ── */
const FILE_PRESETS=['fp-all','fp-today','fp-week','fp-month'];
function filePreset(p){
  FILE_PRESETS.forEach(id=>{const el=document.getElementById(id);if(el)el.classList.toggle('on',id==='fp-'+p);});
  const now=new Date();
  const from=document.getElementById('file-date-from');
  const to=document.getElementById('file-date-to');
  if(!from||!to) return;
  to.value=today();
  if(p==='all'){   from.value='2000-01-01';to.value='2099-12-31';}
  if(p==='today'){ from.value=today();}
  if(p==='week'){  const d=new Date(now);d.setDate(d.getDate()-6);from.value=d.toISOString().slice(0,10);}
  if(p==='month'){ from.value=new Date(now.getFullYear(),now.getMonth(),1).toISOString().slice(0,10);}
  filterScannedFiles();
}

function filterScannedFiles(){
  const from=document.getElementById('file-date-from')?.value||'';
  const to=document.getElementById('file-date-to')?.value||'';
  const typeFilter=document.getElementById('file-type-filter')?.value||'';
  const sort=document.getElementById('file-sort')?.value||'date-desc';

  // Apply date + type filter
  _visibleFiles=_scannedFiles.filter(({file})=>{
    const fDate=file.lastModified?new Date(file.lastModified).toISOString().slice(0,10):'';
    if(from&&fDate&&fDate<from) return false;
    if(to&&fDate&&fDate>to)     return false;
    if(typeFilter){
      const ft=_getFileType(file);
      if(!ft.includes(typeFilter)&&typeFilter!==ft) return false;
    }
    return true;
  });

  // Sort
  _visibleFiles.sort((a,b)=>{
    if(sort==='date-asc')  return (a.file.lastModified||0)-(b.file.lastModified||0);
    if(sort==='date-desc') return (b.file.lastModified||0)-(a.file.lastModified||0);
    if(sort==='name-asc')  return a.file.name.localeCompare(b.file.name);
    if(sort==='size-desc') return b.file.size-a.file.size;
    return 0;
  });

  // Stats
  const totalSize=_visibleFiles.reduce((s,{file})=>s+file.size,0);
  const cntEl=document.getElementById('file-count-lbl');
  const szEl=document.getElementById('file-size-lbl');
  if(cntEl) cntEl.textContent=`${_visibleFiles.length} de ${_scannedFiles.length} archivos`;
  if(szEl)  szEl.textContent=_fmtSize(totalSize)+' total';

  renderFileList();
}

function renderFileList(){
  const el=document.getElementById('exp-file-list');if(!el)return;
  if(!_visibleFiles.length){
    el.innerHTML='<div style="padding:20px;text-align:center;font-size:13px;color:var(--sft)">Sin archivos en ese rango de fechas</div>';
    return;
  }
  const selCount=_visibleFiles.filter(({selected})=>selected).length;
  el.innerHTML=`
    <div class="exp-sel-bar">
      <span class="exp-sel-bar-txt">${selCount} seleccionado${selCount!==1?'s':''}</span>
      <button class="exp-sel-all-btn" onclick="toggleSelectAll()">${selCount===_visibleFiles.length?'Deseleccionar todo':'Seleccionar todo'}</button>
    </div>`+
  _visibleFiles.map((item,i)=>{
    const f=item.file;
    const ft=_getFileType(f);
    const meta=FILE_TYPE_MAP[ft]||FILE_TYPE_MAP.default;
    const date=_fmtDate(f.lastModified);
    const size=_fmtSize(f.size);
    return `<div class="exp-file-item${item.selected?' selected':''}" onclick="toggleFileSelect(${i})">
      <div class="exp-file-type-ico" style="background:${meta.bg}">${meta.ico}</div>
      <div class="exp-file-body">
        <div class="exp-file-name" title="${f.name}">${f.name}</div>
        <div class="exp-file-meta">${date} · ${size} · ${meta.lbl}</div>
      </div>
      <div class="exp-file-chk">${item.selected?'✓':''}</div>
    </div>`;
  }).join('');
}

function toggleFileSelect(i){
  if(_visibleFiles[i]) _visibleFiles[i].selected=!_visibleFiles[i].selected;
  renderFileList();
}

function toggleSelectAll(){
  const allSel=_visibleFiles.every(f=>f.selected);
  _visibleFiles.forEach(f=>f.selected=!allSel);
  renderFileList();
}

/* ── Download selected files ── */
async function downloadSelectedFiles(){
  const selected=_visibleFiles.filter(f=>f.selected);
  if(!selected.length){snack('⚠️ Selecciona al menos un archivo','⚠️');return;}
  snack(`⬇️ Descargando ${selected.length} archivo${selected.length!==1?'s':''}…`,'⬇️');
  // Download each file with delay
  for(const {file} of selected){
    const url=URL.createObjectURL(file);
    dlFile(file.name,url,true);
    await new Promise(r=>setTimeout(r,300));
  }
}

function clearFileScanner(){
  _scannedFiles=[];_visibleFiles=[];
  document.getElementById('exp-file-filter-wrap').style.display='none';
  document.getElementById('exp-file-in').value='';
  snack('🗑️ Archivos limpiados','🗑️');
}

/* ── Drag and drop support ── */
(function initFileDrop(){
  const zone=document.getElementById('exp-file-zone');
  if(!zone) return;
  zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('dragover');},{passive:false});
  zone.addEventListener('dragleave',()=>zone.classList.remove('dragover'));
  zone.addEventListener('drop',e=>{
    e.preventDefault();zone.classList.remove('dragover');
    const files=Array.from(e.dataTransfer.files||[]);
    if(!files.length) return;
    _scannedFiles=files.map(f=>({file:f,selected:true}));
    document.getElementById('exp-file-filter-wrap').style.display='block';
    filterScannedFiles();
  },{passive:false});
})();


/* ═══════════════════════════════════════════════════════════════
   800% MEJORAS JS v31
   ═══════════════════════════════════════════════════════════════ */

/* ── 1. CONFETTI CELEBRATION ── */
function launchConfetti(x, y, count=30){
  const colors=['#60a5fa','#6366f1','#22c55e','#f59e0b','#ec4899','#a78bfa'];
  for(let i=0;i<count;i++){
    const p=document.createElement('div');
    p.className='confetti-particle';
    p.style.cssText=`
      left:${x+Math.random()*80-40}px;
      top:${y||100}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      --dur:${.8+Math.random()*1.2}s;
      --rot:${Math.random()>0.5?'+':'-'}${360+Math.random()*360}deg;
      transform-origin: ${Math.random()*100}% ${Math.random()*100}%;
      width:${6+Math.random()*6}px;
      height:${4+Math.random()*8}px;
      opacity:${.7+Math.random()*.3};
    `;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 2500);
  }
}

/* ── 2. NAV COUNT BADGES ── */
function updateNavBadges(){
  // Registros badge — show dup count
  const dups=R.filter(r=>r.dup).length;
  const dupBadge=document.getElementById('nb-count-registros');
  if(dupBadge){
    dupBadge.textContent=dups>99?'99+':dups;
    dupBadge.classList.toggle('show',dups>0);
  }
  // Visitas badge — pending visits
  const pend=R.filter(r=>r.visita==='Pendiente').length;
  const pendBadge=document.getElementById('nb-count-visitas');
  if(pendBadge){
    pendBadge.textContent=pend>99?'99+':pend;
    pendBadge.classList.toggle('show',pend>0);
  }
}

/* ── 3. SKELETON LOADERS ── */
function showSkeleton(containerId, count=4){
  const el=document.getElementById(containerId);
  if(!el) return;
  el.innerHTML=Array(count).fill('<div class="skel skel-rec"></div>').join('');
}

/* ── 4. SEARCH HISTORY ── */
const SRCH_HIST_KEY='px_srch_history';
const MAX_SRCH_HIST=10;

function getSrchHistory(){
  return JSON.parse(localStorage.getItem(SRCH_HIST_KEY)||'[]');
}
function addSrchHistory(term){
  if(!term||term.length<2) return;
  let h=getSrchHistory().filter(x=>x!==term);
  h.unshift(term);
  if(h.length>MAX_SRCH_HIST) h=h.slice(0,MAX_SRCH_HIST);
  localStorage.setItem(SRCH_HIST_KEY,JSON.stringify(h));
}
function delSrchHistory(term){
  const h=getSrchHistory().filter(x=>x!==term);
  localStorage.setItem(SRCH_HIST_KEY,JSON.stringify(h));
  renderSrchHistory();
}
function renderSrchHistory(){
  const idle=document.getElementById('srch-idle');
  if(!idle) return;
  const h=getSrchHistory();
  if(!h.length){
    idle.innerHTML='<div class="empty-state-v2"><div class="es-illo">🔍</div><div class="es-title">Busca un beneficiario</div><div class="es-sub">Por nombre, folio, colonia, sección o teléfono</div></div>';
    return;
  }
  idle.innerHTML=`
    <div class="srch-recent-lbl">🕐 Búsquedas recientes</div>
    ${h.map(t=>`
      <div class="srch-recent-item" onclick="applyRecentSearch('${t.replace(/'/g,"\'")}')">
        <span class="srch-recent-ico">🕐</span>
        <span class="srch-recent-txt">${t}</span>
        <span class="srch-recent-del" onclick="event.stopPropagation();delSrchHistory('${t.replace(/'/g,"\'")}')">×</span>
      </div>`).join('')}
    <div style="padding:8px 16px">
      <button onclick="localStorage.removeItem('${SRCH_HIST_KEY}');renderSrchHistory()" style="background:none;border:none;color:var(--sft);font-size:12px;font-weight:700;cursor:pointer;font-family:var(--fnt)">Limpiar historial</button>
    </div>`;
}
function applyRecentSearch(term){
  const sq=document.getElementById('sq');
  if(sq){sq.value=term;sq.dispatchEvent(new Event('input'));}
}

/* ── 5. FORM VALIDATION ── */
function validateField(inputEl, rules={}){
  const val=inputEl.value.trim();
  const wrap=inputEl.closest('.fi-wrap')||inputEl.parentNode;
  let errMsg=wrap?.querySelector('.field-err-msg');
  let err='';
  if(rules.required&&!val) err=rules.required==='true'?'Este campo es requerido':rules.required;
  if(val&&rules.minLen&&val.length<rules.minLen) err=`Mínimo ${rules.minLen} caracteres`;
  if(val&&rules.pattern&&!new RegExp(rules.pattern).test(val)) err=rules.patternMsg||'Formato inválido';
  if(val&&rules.curp&&!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(val)) err='CURP inválida (18 caracteres)';
  inputEl.classList.toggle('invalid', !!err);
  inputEl.classList.toggle('valid', !err&&!!val);
  if(errMsg){errMsg.textContent=err;errMsg.classList.toggle('show',!!err);}
  return !err;
}

/* ── 6. BATCH VISIT MARKING ── */
function markBatchVisit(){
  const selected=batchSel||new Set();
  if(!selected.size){snack('⚠️ Selecciona registros primero','⚠️');return;}
  const count=selected.size;
  conf2(`✅ Marcar ${count} como visitados`,
    `¿Marcar ${count} beneficiario${count!==1?'s':''} como Visitado?`,
    ()=>{
      let changed=0;
      selected.forEach(id=>{
        const r=R.find(x=>x.id===id);
        if(r&&r.visita!=='Si'){r.visita='Si';r.ult=nowStr();changed++;}
      });
      svR();detectDups();upHdr();renderList();renderInicio();
      if(batchMode){batchSel=new Set();renderBatchBar();}
      // Confetti!
      if(changed>0) launchConfetti(window.innerWidth/2, 200, 40);
      snack(`✅ ${changed} marcados como visitados`,'✅');
      if(navigator.vibrate) navigator.vibrate([30,15,30]);
    },`Marcar ${count}`);
}

/* ── 7. HAPTIC FEEDBACK on key actions ── */
function haptic(pattern=[15]){
  if(navigator.vibrate) navigator.vibrate(pattern);
}

/* ── 8. VIRTUAL SCROLL for large lists ── */
const VS_ROW_H=88; // approximate record height px
let _vsOffset=0, _vsTotal=0, _vsRendered=[];

function virtualScroll(items, renderFn, containerId, rowHeight=VS_ROW_H){
  const container=document.getElementById(containerId);
  if(!container||items.length<50) return false; // only for large lists
  // Simple windowed render: show 20 items around scroll position
  const main=document.getElementById('main');
  const scrollTop=main?.scrollTop||0;
  const start=Math.max(0,Math.floor(scrollTop/rowHeight)-5);
  const end=Math.min(items.length,start+30);
  container.style.position='relative';
  container.style.height=(items.length*rowHeight)+'px';
  const visible=items.slice(start,end);
  let html2='';
  visible.forEach((item,i)=>{
    html2+=`<div style="position:absolute;top:${(start+i)*rowHeight}px;left:0;right:0">${renderFn(item)}</div>`;
  });
  container.innerHTML=html2;
  return true;
}

/* ── 9. QUICK FILTER CHIPS from home ── */
let _homeFilter='all';
function setHomeFilter(f, chipEl){
  _homeFilter=f;
  document.querySelectorAll('.hfc').forEach(c=>c.classList.remove('act','grn','amb','red','vio'));
  if(chipEl) chipEl.classList.add('act');
  // Jump to list with filter applied
  if(f!=='all'){
    // Set filter and go to registros
    if(f==='visitado'){fS='vis_ok';}
    else if(f==='pendiente'){fS='vis_pe';}
    else if(f==='sinvisita'){fS='vis_no';}
    else if(f==='dup'){fS='dup';}
    else{fS='';}
    go('registros');
  } else {
    fS='';
    go('registros');
  }
}

/* ── 10. SMART EMPTY STATES ── */
function emptyState(illo, title, sub, btnLabel, btnAction){
  return `<div class="empty-state-v2">
    <div class="es-illo">${illo}</div>
    <div class="es-title">${title}</div>
    <div class="es-sub">${sub}</div>
    ${btnLabel?`<button class="es-btn" onclick="${btnAction}">${btnLabel}</button>`:''}
  </div>`;
}

/* ── 11. PROGRESS BAR for exports ── */
function exportWithProgress(items, processFn, label='Exportando'){
  return new Promise(async(resolve)=>{
    const total=items.length;
    let done=0;
    snack(`⏳ ${label}… 0/${total}`,'⏳');
    const results=[];
    for(const item of items){
      results.push(await processFn(item));
      done++;
      if(done%10===0||done===total){
        snack(`⏳ ${label}… ${done}/${total}`,'⏳');
      }
    }
    resolve(results);
  });
}

/* ── 12. COPY TO CLIPBOARD with feedback ── */
function copyToClipboard(text, label=''){
  navigator.clipboard.writeText(text).then(()=>{
    snack('📋 '+(label||text.slice(0,20))+ ' copiado','📋');
    haptic([10,5,10]);
  }).catch(()=>{
    // Fallback
    const ta=document.createElement('textarea');
    ta.value=text;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    snack('📋 Copiado','📋');
  });
}

/* ── 13. SAVE HAPTIC + confetti on streak ── */
function _autoSuggestSection(lat, lng){
  // Find most common section among nearby records (within ~300m)
  if(!lat||!lng)return null;
  const nearby=R.filter(function(r){
    if(!r.lat||!r.lng||!r.seccion)return false;
    const dlat=r.lat-lat, dlng=r.lng-lng;
    const dist=Math.sqrt(dlat*dlat+dlng*dlng)*111000; // approx meters
    return dist<300;
  });
  if(!nearby.length)return null;
  const freq={};
  nearby.forEach(function(r){freq[r.seccion]=(freq[r.seccion]||0)+1;});
  return Object.entries(freq).sort(function(a,b){return b[1]-a[1];})[0][0];
}

function _onRecordSaved(isNew, nombre){
  haptic(isNew?[20,10,20]:[15]);
  // Auto-refresh SIGE chips if on map page
  setTimeout(function(){if(typeof initSigeChips==='function')initSigeChips();},100);
  // Check if milestone
  const s=_getStreak();
  if(isNew&&(R.length%10===0||R.length===1)){
    setTimeout(()=>launchConfetti(window.innerWidth/2,150,isNew?50:20),100);
    if(R.length===1) snack('🎉 ¡Primer beneficiario registrado!','🎉');
    else snack(`🎊 ¡${R.length} beneficiarios registrados!`,'🎊');
  }
}


/* ═══════════════════════════════════════════════════════════════
   30 MEJORAS JS v31
   ═══════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════
   v32 SUPREMA — IA · Logros · Prioridad · Heatmap · Confeti
   ═══════════════════════════════════════════════════════════════ */

/* ────────────────────────────────────────────────────
   ANIMATED COUNTER
   ──────────────────────────────────────────────────── */
function animateCounter(el, target, duration=600){
  if(!el) return;
  const start=parseInt(el.textContent)||0;
  const diff=target-start;
  if(diff===0){el.textContent=target;return;}
  const startTime=performance.now();
  function step(now){
    const p=Math.min(1,(now-startTime)/duration);
    const ease=1-Math.pow(1-p,3);
    el.textContent=Math.round(start+diff*ease);
    if(p<1) requestAnimationFrame(step);
    else el.textContent=target;
  }
  requestAnimationFrame(step);
}
function animateAllCounters(){
  document.querySelectorAll('[data-cnt]').forEach(el=>{
    const t=parseInt(el.dataset.cnt)||0;
    animateCounter(el,t,700);
  });
}

/* ────────────────────────────────────────────────────
   ACHIEVEMENT SYSTEM
   ──────────────────────────────────────────────────── */
const ACHIEVEMENTS=[
  {id:'first',ico:'🌱',name:'Primer registro',cond:()=>R.length>=1},
  {id:'ten',ico:'🔥',name:'10 registros',cond:()=>R.length>=10},
  {id:'fifty',ico:'💪',name:'50 registros',cond:()=>R.length>=50},
  {id:'hundred',ico:'💯',name:'100 registros',cond:()=>R.length>=100},
  {id:'vis10',ico:'🚗',name:'10 visitas',cond:()=>R.filter(r=>r.visita==='Si').length>=10},
  {id:'vis50',ico:'🏆',name:'50 visitas',cond:()=>R.filter(r=>r.visita==='Si').length>=50},
  {id:'streak3',ico:'⚡',name:'Racha 3 días',cond:()=>_getStreak().count>=3},
  {id:'streak7',ico:'🔱',name:'Racha 7 días',cond:()=>_getStreak().count>=7},
  {id:'allprog',ico:'🌈',name:'5 programas',cond:()=>Object.keys(P).every(k=>R.some(r=>r.tipo===k))},
  {id:'cov80',ico:'🗺️',name:'80% visitados',cond:()=>R.length>0&&R.filter(r=>r.visita==='Si').length/R.length>=0.8},
];
const ACH_KEY='px_ach_v1';
function getEarnedAchs(){try{return JSON.parse(localStorage.getItem(ACH_KEY)||'[]');}catch{return[];}}
function checkAchievements(){
  const earned=getEarnedAchs();
  const newOnes=[];
  ACHIEVEMENTS.forEach(a=>{
    if(!earned.includes(a.id)&&a.cond()){
      earned.push(a.id);
      newOnes.push(a);
    }
  });
  if(newOnes.length){
    localStorage.setItem(ACH_KEY,JSON.stringify(earned));
    newOnes.forEach((a,i)=>setTimeout(()=>celebrateAch(a),i*800));
  }
  return earned;
}
function celebrateAch(a){
  snack(`🏆 ¡Logro desbloqueado! ${a.ico} ${a.name}`,'🏆');
  launchConfetti();
}
function renderAchievements(){
  const wrap=document.getElementById('ach-wrap');if(!wrap)return;
  const earned=checkAchievements();
  if(R.length===0){wrap.innerHTML='';return;}
  const pills=ACHIEVEMENTS.map(a=>{
    const ok=earned.includes(a.id);
    return`<div class="ach-pill ${ok?'earned':''}" title="${a.name}" onclick="achInfo('${a.id}')">
      <span class="ach-ico">${a.ico}</span>
      <span class="ach-name">${a.name}</span>
    </div>`;
  }).join('');
  wrap.innerHTML=`<div class="sh2" style="margin-bottom:7px">🏆 Logros <span class="sh2-n">${earned.length}/${ACHIEVEMENTS.length}</span></div>
    <div class="ach-bar">${pills}</div>`;
}
function achInfo(id){
  const a=ACHIEVEMENTS.find(x=>x.id===id);if(!a)return;
  const earned=getEarnedAchs().includes(id);
  snack(`${a.ico} ${a.name} — ${earned?'¡Desbloqueado!':'Aún no desbloqueado'}`, a.ico);
}

/* ────────────────────────────────────────────────────
   CONFETTI
   ──────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────
   SMART PRIORITY QUEUE
   ──────────────────────────────────────────────────── */
function calcPriorityScore(r){
  let score=0;
  if(r.estatus==='Baja')return -1;
  // Days since last visit / registration
  const ds=r.ult?daysSince(r.ult.slice(0,10)):r.fecha?daysSince(r.fecha):0;
  score+=Math.min(ds*2,80);
  // Never visited
  if(r.visita==='No')score+=30;
  if(r.visita==='Pendiente')score+=20;
  // Birthday soon
  if(r.fnac){
    try{
      const bd=new Date(r.fnac+'T00:00:00');
      const now=new Date();
      const next=new Date(now.getFullYear(),bd.getMonth(),bd.getDate());
      if(next<now)next.setFullYear(next.getFullYear()+1);
      const daysUntil=Math.round((next-now)/(1000*60*60*24));
      if(daysUntil<=7)score+=25;
      else if(daysUntil<=30)score+=10;
    }catch{}
  }
  // Status active gets slight bump
  if(r.estatus==='Activo')score+=5;
  return Math.round(score);
}
function renderSmartPriority(){
  const wrap=document.getElementById('prio-wrap-home');if(!wrap)return;
  if(R.length<3){wrap.innerHTML='';return;}
  const scored=R
    .map(r=>({r,score:calcPriorityScore(r)}))
    .filter(x=>x.score>0)
    .sort((a,b)=>b.score-a.score)
    .slice(0,5);
  if(!scored.length){wrap.innerHTML='';return;}
  const rows=scored.map((x,i)=>{
    const cls=x.score>70?'hot':x.score>40?'warm':'cool';
    const ds=x.r.ult?daysSince(x.r.ult.slice(0,10)):x.r.fecha?daysSince(x.r.fecha):0;
    const p=pg(x.r.tipo);
    return`<div class="prio-item" onclick="openDet(${x.r.id})">
      <div class="prio-rank ${cls}">${i+1}</div>
      <div style="flex:1;min-width:0">
        <div class="prio-name">${x.r.nombre}</div>
        <div class="prio-info">${p.ico} ${x.r.tipo} · ${ds}d sin actualizar</div>
      </div>
      <div class="prio-score">${x.score}pts</div>
    </div>`;
  }).join('');
  wrap.innerHTML=`<div class="prio-card">
    <div class="prio-hdr">
      <span style="font-size:16px">🎯</span>
      <span class="prio-title">Visitar hoy · Prioridad</span>
      <span class="prio-badge">IA</span>
    </div>
    ${rows}
    <button class="btn btn-s" style="margin-top:8px;font-size:11px;padding:7px;width:100%" onclick="openPriorityFull()">Ver todos los pendientes →</button>
  </div>`;
}
function openPriorityFull(){
  const scored=R
    .map(r=>({r,score:calcPriorityScore(r)}))
    .filter(x=>x.score>0)
    .sort((a,b)=>b.score-a.score);
  document.getElementById('qf-t').textContent='🎯 Prioridad de visitas';
  document.getElementById('qf-n').textContent=scored.length+' beneficiarios';
  document.getElementById('qf-list').innerHTML=scored.map(x=>recCard(x.r)).join('');
  openSheet('sh-qf');
}

/* ────────────────────────────────────────────────────
   AI INSIGHT CHIP (home)
   ──────────────────────────────────────────────────── */
const INSIGHTS=[
  ()=>{const n=R.filter(r=>r.visita!=='Si'&&r.estatus!=='Baja').length;return n>0?`Tienes ${n} beneficiarios pendientes de visita. Prioriza los que llevan más días sin actualizar.`:null;},
  ()=>{const n=R.filter(r=>r.estatus==='Pendiente').length;return n>0?`${n} registros están en estatus Pendiente. Revisa y actualiza su situación.`:null;},
  ()=>{const pct=R.length?Math.round(R.filter(r=>r.visita==='Si').length/R.length*100):0;return pct>0?`Has completado el ${pct}% de tus visitas. ${pct>=80?'¡Excelente cobertura!':pct>=50?'Buen avance, sigue así.':'Aún hay mucho por visitar.'}`:null;},
  ()=>{const n=R.filter(r=>!r.tel&&r.estatus==='Activo').length;return n>0?`${n} beneficiarios activos no tienen teléfono registrado. Actualiza sus datos.`:null;},
  ()=>{const s=_getStreak();return s.count>0?`Llevas ${s.count} día${s.count>1?'s':''} de racha activa. ¡Tu mejor racha fue ${s.best} días!`:null;},
  ()=>{const hoy=new Date(),mm=hoy.getMonth(),dd=hoy.getDate();const bd=R.filter(r=>{if(!r.fnac)return false;try{const d=new Date(r.fnac+'T00:00:00');return d.getMonth()===mm&&d.getDate()===dd;}catch{return false;}});return bd.length?`🎂 ¡Hoy es el cumpleaños de ${bd[0].nombre.split(' ')[0]}${bd.length>1?` y ${bd.length-1} más`:''}! Recuerda felicitarlos.`:null;},
  ()=>{const venc=R.filter(r=>r.estatus==='Activo'&&r.fecha&&daysSince(r.fecha)>30&&r.visita!=='Si').length;return venc>0?`⚠️ ${venc} beneficiarios activos llevan más de 30 días sin actualizar. Agenda visitas urgentes.`:null;},
  ()=>{const secs=[...new Set(R.map(r=>r.seccion).filter(Boolean))];if(secs.length<2)return null;const worst=secs.map(s=>{const t=R.filter(r=>r.seccion===s).length;const v=R.filter(r=>r.seccion===s&&r.visita==='Si').length;return{s,pct:t?Math.round(v/t*100):0};}).sort((a,b)=>a.pct-b.pct)[0];return worst&&worst.pct<50?`📉 La sección ${worst.s} tiene solo el ${worst.pct}% de cobertura. ¡Necesita atención prioritaria!`:null;},
  ()=>{const now=new Date(),mm=now.getMonth();const bdMes=R.filter(r=>{if(!r.fnac)return false;try{return new Date(r.fnac+'T00:00:00').getMonth()===mm;}catch{return false;}}).length;return bdMes>0?`🎂 ${bdMes} beneficiario${bdMes>1?'s':''}  cumplen años este mes. Revisa el listado.`:null;},
  ()=>{const n=R.filter(r=>r.dup).length;return n>0?`🔁 Hay ${n} registros duplicados en la base. Revisa y unifica para mantener datos limpios.`:null;},
  ()=>{const usa=R.filter(r=>r.uso==='Estados Unidos').length;return usa>0?`✈️ ${usa} beneficiario${usa>1?'s':''} están registrado${usa>1?'s':''} como migrantes en USA. Considera canales especiales de contacto.`:null;},
  ()=>{const act=R.filter(r=>r.estatus==='Activo').length;const total=R.length;return total>0?`📊 El ${Math.round(act/total*100)}% de tu base (${act} personas) están activas. ${act/total>.8?'¡Excelente tasa!':act/total>.5?'Buena base activa.':'Muchos registros inactivos — revisa estatus.'}`:null;},
];
let _insightIdx=0;
function renderInsight(){
  const wrap=document.getElementById('insight-wrap');if(!wrap||R.length===0){if(wrap)wrap.innerHTML='';return;}
  let txt=null;
  for(let i=0;i<INSIGHTS.length;i++){
    const fn=INSIGHTS[(_insightIdx+i)%INSIGHTS.length];
    txt=fn();
    if(txt){_insightIdx=(_insightIdx+i+1)%INSIGHTS.length;break;}
  }
  if(!txt){wrap.innerHTML='';return;}
  wrap.innerHTML=`<div class="insight-strip" onclick="nextInsight()">
    <span class="insight-ico">💡</span>
    <div class="insight-txt">
      <div class="insight-lbl">Insight IA</div>
      ${txt}
    </div>
    <span class="insight-refresh">↻</span>
  </div>`;
}
function nextInsight(){
  _insightIdx=(_insightIdx+1)%INSIGHTS.length;
  renderInsight();
}

/* ────────────────────────────────────────────────────
   COVERAGE HEATMAP (on estadisticas)
   ──────────────────────────────────────────────────── */
function renderHeatmap(){
  const secs=[...new Set(R.map(r=>r.seccion).filter(Boolean))].sort((a,b)=>a-b||a.localeCompare(b));
  if(secs.length<2)return '';
  const cells=secs.map(sec=>{
    const total=R.filter(r=>r.seccion===sec).length;
    const vis=R.filter(r=>r.seccion===sec&&r.visita==='Si').length;
    const pct=total?Math.round(vis/total*100):0;
    const cls=pct===0?'hm-0':pct<30?'hm-low':pct<60?'hm-mid':pct<100?'hm-high':'hm-full';
    const color=pct===0?'#ef4444':pct<30?'#f59e0b':pct<60?'#60a5fa':pct<100?'#22c55e':'#4ade80';
    return`<div class="hm-cell ${cls}" onclick="openQF('sec_${sec}','📍 Sección ${sec}')" title="Sección ${sec}: ${vis}/${total} visitados">
      <span class="hm-sec" style="color:${color}">Sec ${sec}</span>
      <span class="hm-pct" style="color:${color}">${pct}%</span>
    </div>`;
  }).join('');
  return`<div class="heatmap-card">
    <div class="heatmap-title">
      <span>🗺️ Mapa de cobertura</span>
      <span style="font-size:9px;color:var(--mut)">🔴<30% 🟡30-60% 🔵60-99% 🟢100%</span>
    </div>
    <div class="heatmap-grid">${cells}</div>
  </div>`;
}

/* ────────────────────────────────────────────────────
   AI ASSISTANT (Claude API)
   ──────────────────────────────────────────────────── */
const AI_SUGS_DEFAULT=[
  '¿Quién debe visitarse hoy?',
  '¿Cuántos activos hay?',
  '¿Cuál sección tiene menos cobertura?',
  '¿Quién lleva más días sin visita?',
  'Resumen de la base de datos',
];
let aiMessages=[];
function buildDataContext(){
  const total=R.length;
  if(total===0)return'No hay registros en la base de datos todavía.';
  const act=R.filter(r=>r.estatus==='Activo').length;
  const pend=R.filter(r=>r.estatus==='Pendiente').length;
  const baja=R.filter(r=>r.estatus==='Baja').length;
  const visOk=R.filter(r=>r.visita==='Si').length;
  const visPe=R.filter(r=>r.visita==='Pendiente').length;
  const visNo=R.filter(r=>r.visita==='No').length;
  const usa=R.filter(r=>r.uso==='Estados Unidos').length;
  const dups=R.filter(r=>r.dup).length;
  const sinTel=R.filter(r=>!r.tel&&r.estatus==='Activo').length;
  const sinDir=R.filter(r=>!r.dom&&r.estatus==='Activo').length;
  const streak=_getStreak();
  const progResumen=Object.entries(P).map(([k,p])=>`${p.ico}${k}:${R.filter(r=>r.tipo===k).length}`).join(', ');
  const secciones=[...new Set(R.map(r=>r.seccion).filter(Boolean))].sort();
  const secResumen=secciones.slice(0,10).map(s=>{
    const t=R.filter(r=>r.seccion===s).length;
    const v=R.filter(r=>r.seccion===s&&r.visita==='Si').length;
    return`Sec.${s}:${v}/${t}(${Math.round(v/t*100)}%)`;
  }).join(', ');
  // Sección con menor cobertura
  const secCov=secciones.map(s=>{const t=R.filter(r=>r.seccion===s).length;const v=R.filter(r=>r.seccion===s&&r.visita==='Si').length;return{s,pct:t?Math.round(v/t*100):0,t};}).filter(x=>x.t>0);
  const worstSec=secCov.length?[...secCov].sort((a,b)=>a.pct-b.pct)[0]:null;
  const bestSec=secCov.length?[...secCov].sort((a,b)=>b.pct-a.pct)[0]:null;
  const scored=R.map(r=>({r,s:calcPriorityScore(r)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,5);
  const topPrio=scored.map(x=>`${x.r.nombre.split(' ').slice(0,2).join(' ')}(score:${x.s})`).join(', ');
  // Cumpleaños
  const hoy=new Date(),mm=hoy.getMonth(),dd=hoy.getDate();
  const bdHoy=R.filter(r=>{if(!r.fnac)return false;try{const d=new Date(r.fnac+'T00:00:00');return d.getMonth()===mm&&d.getDate()===dd;}catch{return false;}}).map(r=>r.nombre.split(' ')[0]);
  const bdMes=R.filter(r=>{if(!r.fnac)return false;try{const d=new Date(r.fnac+'T00:00:00');return d.getMonth()===mm;}catch{return false;}}).length;
  // Distribución de edades
  const now=new Date();
  const ages=R.filter(r=>r.fnac).map(r=>{try{return Math.floor((now-new Date(r.fnac+'T00:00:00'))/(365.25*24*3600*1000));}catch{return null;}}).filter(Boolean);
  const age60_70=ages.filter(a=>a>=60&&a<70).length;
  const age70_80=ages.filter(a=>a>=70&&a<80).length;
  const age80p=ages.filter(a=>a>=80).length;
  const ageAvg=ages.length?Math.round(ages.reduce((a,b)=>a+b,0)/ages.length):0;
  // Visitas vencidas (>30 días)
  const vencidas=R.filter(r=>r.estatus==='Activo'&&r.fecha&&daysSince(r.fecha)>30&&r.visita!=='Si').length;
  // Top colonias
  const colCnt={};R.forEach(r=>{if(r.col)(colCnt[r.col]=(colCnt[r.col]||0)+1);});
  const topCols=Object.entries(colCnt).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([c,n])=>`${c}(${n})`).join(', ');
  // Actividad última semana
  const hace7=new Date();hace7.setDate(hace7.getDate()-7);
  const recsEsta=R.filter(r=>r.fecha&&new Date(r.fecha+'T00:00:00')>=hace7).length;
  return`=== PensionadosMX — Datos en tiempo real ===
📊 TOTALES: ${total} registros | Activo=${act} | Pendiente=${pend} | Baja=${baja} | Inactivo=${total-act-pend-baja}
✅ VISITAS: Visitados=${visOk}(${Math.round(visOk/total*100)}%) | Pendiente=${visPe} | Sin visita=${visNo} | Vencidas+30días=${vencidas}
🏥 PROGRAMAS: ${progResumen}
🗺️ COBERTURA POR SECCIÓN: ${secResumen||'Sin secciones'}
📉 Peor sección: ${worstSec?`Sec.${worstSec.s} (${worstSec.pct}% cubierta)`:'N/A'} | Mejor: ${bestSec?`Sec.${bestSec.s} (${bestSec.pct}%)`:'N/A'}
🎯 TOP PRIORIDAD HOY: ${topPrio||'Ninguno urgente'}
👴 EDADES: 60-69años=${age60_70} | 70-79años=${age70_80} | 80+años=${age80p} | Promedio=${ageAvg}años
🎂 Cumpleaños hoy: ${bdHoy.length?bdHoy.join(', '):'Ninguno'} | Este mes: ${bdMes}
✈️ Migrantes USA: ${usa} | Duplicados: ${dups} | Sin tel: ${sinTel} | Sin dir: ${sinDir}
🏘️ Top colonias: ${topCols||'N/A'}
📅 Registros última semana: ${recsEsta}
🔥 Racha actual: ${streak.count} días (mejor: ${streak.best} días)`;
}
function openAI(){
  const sheet=document.getElementById('ai-sheet');
  if(!sheet)return;
  sheet.classList.add('on');
  updateAIKeyIndicator();
  if(aiMessages.length===0){
    const hasKey=!!getAIKey();
    const noKeyNote=hasKey?'':`\n\n⚠️ **Sin API Key configurada.** Toca el botón 🔑 arriba para configurar tu clave de Anthropic y activar el chat.`;
    aiMessages=[{role:'assistant',content:`¡Hola! 👋 Soy tu asistente IA para **PensionadosMX**.\n\nAnalizo tu base de **${R.length}** beneficiar${R.length===1?'io':'ios'} en tiempo real. ¿En qué te puedo ayudar hoy?${noKeyNote}`}];
    renderAIMsgs();
  }
  renderAISugs(AI_SUGS_DEFAULT);
  setTimeout(()=>document.getElementById('ai-inp')?.focus(),300);
}
function closeAI(){
  document.getElementById('ai-sheet')?.classList.remove('on');
}
function renderAIMsgs(){
  const el=document.getElementById('ai-msgs');if(!el)return;
  el.innerHTML=aiMessages.map(m=>{
    const isUser=m.role==='user';
    const txt=(m.content||'').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
    return`<div class="ai-msg ${isUser?'ai-msg-user':''}">
      <div class="ai-avatar ${isUser?'ai-avatar-user':'ai-avatar-ai'}">${isUser?'👤':'🤖'}</div>
      <div class="ai-bubble ${isUser?'ai-bubble-user':'ai-bubble-ai'}">${txt}</div>
    </div>`;
  }).join('');
  el.scrollTop=el.scrollHeight;
}
function renderAISugs(sugs){
  const el=document.getElementById('ai-sugs');if(!el)return;
  el.innerHTML=sugs.map(s=>`<div class="ai-sug" onclick="aiSugClick('${s.replace(/'/g,"\\'")}')"> ${s}</div>`).join('');
}
function aiSugClick(text){
  const inp=document.getElementById('ai-inp');
  if(inp){inp.value=text;}
  aiSend();
}
function showAITyping(){
  const el=document.getElementById('ai-msgs');if(!el)return;
  const div=document.createElement('div');div.className='ai-msg';div.id='ai-typing-indicator';
  div.innerHTML=`<div class="ai-avatar ai-avatar-ai">🤖</div><div class="ai-typing"><div class="ai-dot"></div><div class="ai-dot"></div><div class="ai-dot"></div></div>`;
  el.appendChild(div);el.scrollTop=el.scrollHeight;
}
function removeAITyping(){
  document.getElementById('ai-typing-indicator')?.remove();
}
/* ── AI API Key management (v34) ── */
const AI_KEY_STORE='px_ai_key_v1';
function getAIKey(){return localStorage.getItem(AI_KEY_STORE)||'';}
function saveAIKey(){
  const v=(document.getElementById('ai-key-inp')?.value||'').trim();
  if(!v){snack('⚠️ Escribe tu API Key primero','⚠️');return;}
  if(!v.startsWith('sk-ant-')){snack('⚠️ Clave inválida — debe iniciar con sk-ant-','⚠️');return;}
  localStorage.setItem(AI_KEY_STORE,v);
  document.getElementById('ai-key-panel').style.display='none';
  updateAIKeyIndicator();
  snack('✅ API Key guardada correctamente','🔑');
}
function clearAIKey(){
  localStorage.removeItem(AI_KEY_STORE);
  const inp=document.getElementById('ai-key-inp');if(inp)inp.value='';
  updateAIKeyIndicator();
  snack('🗑 API Key eliminada','🔑');
}
function openAIKeySheet(){
  const panel=document.getElementById('ai-key-panel');if(!panel)return;
  const showing=panel.style.display!=='none';
  panel.style.display=showing?'none':'block';
  if(!showing){const inp=document.getElementById('ai-key-inp');if(inp){inp.value=getAIKey();inp.focus();}}
}
function updateAIKeyIndicator(){
  const btn=document.getElementById('ai-key-btn');
  const sub=document.getElementById('ai-hdr-sub');
  if(!btn)return;
  const hasKey=!!getAIKey();
  btn.style.color=hasKey?'var(--grn)':'var(--amb)';
  btn.style.borderColor=hasKey?'rgba(34,197,94,.3)':'rgba(245,158,11,.3)';
  btn.title=hasKey?'API Key configurada ✅':'Configurar API Key';
  if(sub)sub.textContent=hasKey?'Conectado · Análisis en tiempo real':'Sin API Key — toca 🔑 para configurar';
}

async function aiSend(){
  const inp=document.getElementById('ai-inp');if(!inp)return;
  const text=(inp.value||'').trim();if(!text)return;
  const apiKey=getAIKey();
  if(!apiKey){
    openAIKeySheet();
    snack('🔑 Configura tu API Key primero','🔑');
    return;
  }
  inp.value='';
  document.getElementById('ai-sugs').innerHTML='';
  aiMessages.push({role:'user',content:text});
  renderAIMsgs();
  showAITyping();
  const dataCtx=buildDataContext();
  const systemPrompt=`Eres un asistente experto en gestión de beneficiarios de programas sociales en México para la app PensionadosMX. Responde siempre en español, de forma concisa y útil (máx 150 palabras). Usa emojis estratégicamente. Analiza los datos y da recomendaciones accionables. No repitas los datos completos, solo da la respuesta relevante.\n\nDATOS ACTUALES:\n${dataCtx}`;
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:1000,
        system:systemPrompt,
        messages:aiMessages.slice(-8).map(m=>({role:m.role,content:m.content})),
      }),
    });
    const data=await res.json();
    removeAITyping();
    if(data.error){
      const errMsg=data.error.type==='authentication_error'
        ?'🔑 API Key inválida. Toca 🔑 arriba para corregirla.'
        :`⚠️ Error API: ${data.error.message||'Inténtalo de nuevo.'}`;
      aiMessages.push({role:'assistant',content:errMsg});
    }else{
      const reply=data?.content?.[0]?.text||'Lo siento, no pude procesar esa consulta.';
      aiMessages.push({role:'assistant',content:reply});
    }
    renderAIMsgs();
    renderAISugs(['¿Quién visitar mañana?','¿Cuántos cumplen años este mes?','¿Qué sección tiene menos cobertura?','Dame un reporte ejecutivo','¿Cuáles necesitan actualización urgente?']);
  }catch(err){
    removeAITyping();
    aiMessages.push({role:'assistant',content:'⚠️ Error de conexión. Verifica tu internet e intenta de nuevo.'});
    renderAIMsgs();
  }
}

/* ────────────────────────────────────────────────────
   PATCH renderInicio to call new v32 renders
   ──────────────────────────────────────────────────── */
const _origRenderInicioInner=window._renderInicioInner||(()=>{});
// Hook into renderInicio end via a patch on the animateStats call
const _origAnimateStats=window.animateStats;
function animateStats(){
  if(_origAnimateStats)_origAnimateStats();
  // v32: also animate counters with data-cnt
  requestAnimationFrame(animateAllCounters);
}
// Patch _renderInicioInner by overriding it after definition

/* ══════════════════════════════════════════════════════════
   v37 — INDICADOR DE CAMBIOS OFFLINE PENDIENTES DE SYNC
   ══════════════════════════════════════════════════════════ */
const PENDING_KEY = 'px_pending_sync_v1';
function getPendingCount(){ return parseInt(localStorage.getItem(PENDING_KEY)||'0'); }
function setPendingCount(n){ localStorage.setItem(PENDING_KEY,String(Math.max(0,n))); updateSyncBadge(); }
function incPending(){ setPendingCount(getPendingCount()+1); }
function clearPending(){ setPendingCount(0); }

// updateSyncBadge defined below with full implementation
// Patch svR to count pending changes when offline
const _origSvR=window.svR;
if(typeof _origSvR==='function'){
  window.svR=function(){
    _origSvR();
    if(fbIsConfigured&&fbIsConfigured()&&!_fbConnected&&!navigator.onLine) incPending();
  };
}
// Clear pending when Firebase syncs
document.addEventListener('fb-synced',()=>clearPending());
setTimeout(updateSyncBadge,2000);
setInterval(updateSyncBadge,30000);

// Offline detection
window.addEventListener('online',  ()=>document.getElementById('pwa-offline').classList.remove('show'));
// Reset session timer on user interaction
['touchstart','click','keydown'].forEach(ev=>{
  document.addEventListener(ev, ()=>{if(authUsername)resetSessionTimer();},{passive:true,capture:true});
});
// ── v23: Fix teclado iOS ──
if(window.visualViewport){
  let _vt=false;
  const _vf=()=>{if(_vt)return;_vt=true;requestAnimationFrame(()=>{
    const kb=Math.max(0,window.innerHeight-window.visualViewport.height);
    const b=document.querySelector('.bnav'),f=document.querySelector('.fab'),s=document.getElementById('snack');
    if(b)b.style.transform=kb>60?`translateY(-${kb}px)`:'';
    if(f)f.style.transform=kb>60?`translateY(-${kb}px)`:'';
    if(s)s.style.bottom=kb>60?`${kb+10}px`:'';
    _vt=false;
  });};
  window.visualViewport.addEventListener('resize',_vf);
  window.visualViewport.addEventListener('scroll',_vf);
}

window.addEventListener('offline', ()=>document.getElementById('pwa-offline').classList.add('show'));
if(!navigator.onLine)document.getElementById('pwa-offline').classList.add('show');

// Install prompt
let _deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();_deferredPrompt=e;
  if(!localStorage.getItem('pwa_install_dismissed'))
    setTimeout(()=>document.getElementById('pwa-install-bar').classList.add('show'),3000);
});
document.getElementById('pwa-install-btn').addEventListener('click',async()=>{
  if(!_deferredPrompt)return;
  _deferredPrompt.prompt();
  const{outcome}=await _deferredPrompt.userChoice;
  if(outcome==='accepted')snack('✅ App instalada correctamente','✅');
  _deferredPrompt=null;
  hidePWABar();
});
window.addEventListener('appinstalled',()=>{hidePWABar();snack('✅ App instalada','✅');});
/* ═══════════════════════════════════════════════════
   v34 — ATAJOS DE TECLADO
   ═══════════════════════════════════════════════════ */
document.addEventListener('keydown',function(e){
  // Ignore when typing in inputs
  const tag=(document.activeElement||{}).tagName||'';
  if(['INPUT','TEXTAREA','SELECT'].includes(tag))return;
  // '/' → focus search
  if(e.key==='/'&&!e.ctrlKey&&!e.metaKey){
    e.preventDefault();
    go('buscar');
    setTimeout(()=>{const s=document.getElementById('sq')||document.getElementById('srch-inp');if(s){s.focus();s.select();}},150);
    return;
  }
  // 'n' / 'N' → new record
  if((e.key==='n'||e.key==='N')&&!e.ctrlKey&&!e.metaKey){
    e.preventDefault();
    if(typeof openShAdd==='function')openShAdd();
    return;
  }
  // 'h' → inicio
  if(e.key==='h'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();go('inicio');return;}
  // 's' → estadisticas
  if(e.key==='s'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();go('estadisticas');return;}
  // Escape → close all sheets
  if(e.key==='Escape'){e.preventDefault();closeAllSheets();closeAI();return;}
  // 'a' → open AI
  if(e.key==='a'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();openAI();return;}
});

/* ═══════════════════════════════════════════════════
   v34 — CUMPLEAÑOS DE ESTE MES (widget en inicio)
   ═══════════════════════════════════════════════════ */
function renderBdMesWidget(){
  const wrap=document.getElementById('bd-mes-wrap');if(!wrap)return;
  const hoy=new Date(),mm=hoy.getMonth(),dd=hoy.getDate();
  const proximos=R.filter(r=>{
    if(!r.fnac)return false;
    try{
      const d=new Date(r.fnac+'T00:00:00');
      if(d.getMonth()!==mm)return false;
      return d.getDate()>=dd; // este mes, desde hoy en adelante
    }catch{return false;}
  }).sort((a,b)=>{
    const da=new Date(a.fnac+'T00:00:00').getDate();
    const db=new Date(b.fnac+'T00:00:00').getDate();
    return da-db;
  });
  if(!proximos.length){wrap.innerHTML='';return;}
  const hoyBd=proximos.filter(r=>new Date(r.fnac+'T00:00:00').getDate()===dd);
  wrap.innerHTML=`<div style="background:linear-gradient(135deg,rgba(236,72,153,.12),rgba(139,92,246,.12));border:1px solid rgba(236,72,153,.2);border-radius:var(--r);padding:12px 14px;margin-bottom:12px;cursor:pointer" onclick="go('buscar')">
    <div style="display:flex;align-items:center;gap:10px">
      <div style="font-size:26px">🎂</div>
      <div style="flex:1">
        <div style="font-size:11px;font-weight:800;color:rgba(236,72,153,.9);text-transform:uppercase;letter-spacing:.5px">Cumpleaños este mes</div>
        ${hoyBd.length?`<div style="font-size:13px;font-weight:700;color:var(--txt);margin-top:2px">🎉 ¡Hoy: ${hoyBd.map(r=>r.nombre.split(' ')[0]).join(', ')}!</div>`:''}
        <div style="font-size:11px;color:var(--sft);margin-top:1px">${proximos.length} cumpleaño${proximos.length>1?'s':''} restante${proximos.length>1?'s':''} en ${new Date(hoy.getFullYear(),mm,1).toLocaleString('es-MX',{month:'long'})}</div>
      </div>
      <div style="font-size:18px;font-weight:800;font-family:var(--fnt2);color:rgba(236,72,153,.9)">${proximos.length}</div>
    </div>
  </div>`;
}

/* ═══════════════════════════════════════════════════
   v34 — EXPORTAR PDF IMPRIMIBLE
   ═══════════════════════════════════════════════════ */
function exportPDFReport(){
  if(typeof requirePerm==='function'&&!requirePerm('exportData','Exportar requiere una cuenta')) return;
  const total=R.length;
  if(!total){snack('No hay datos para exportar','📄');return;}
  const act=R.filter(r=>r.estatus==='Activo').length;
  const visOk=R.filter(r=>r.visita==='Si').length;
  const pct=Math.round(visOk/total*100);
  const fecha=new Date().toLocaleDateString('es-MX',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const progData=Object.entries(P).map(([k,p])=>({k,p,cnt:R.filter(r=>r.tipo===k).length})).filter(x=>x.cnt>0);
  const secciones=[...new Set(R.map(r=>r.seccion).filter(Boolean))].sort();
  const secRows=secciones.map(s=>{
    const t=R.filter(r=>r.seccion===s).length;
    const v=R.filter(r=>r.seccion===s&&r.visita==='Si').length;
    const pc=Math.round(v/t*100);
    return`<tr><td>Sección ${s}</td><td style="text-align:center">${t}</td><td style="text-align:center">${v}</td><td style="text-align:center;color:${pc>70?'green':pc>40?'#b45309':'#dc2626'}">${pc}%</td></tr>`;
  }).join('');
  const win=window.open('','_blank','width=800,height=900');
  if(!win)return;
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reporte PensionadosMX</title>
  <style>body{font-family:Arial,sans-serif;color:#111;margin:0;padding:24px;font-size:13px;}
  h1{font-size:22px;margin:0 0 4px;}h2{font-size:15px;color:#444;margin:18px 0 8px;border-bottom:1px solid #ddd;padding-bottom:4px;}
  .meta{color:#666;font-size:11px;margin-bottom:20px;}
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}
  .kpi{border:1px solid #ddd;border-radius:8px;padding:10px;text-align:center;}
  .kpi-n{font-size:28px;font-weight:700;line-height:1;}
  .kpi-l{font-size:10px;color:#666;text-transform:uppercase;margin-top:3px;}
  table{width:100%;border-collapse:collapse;margin-bottom:16px;}
  th{background:#f5f5f5;padding:7px 10px;text-align:left;font-size:11px;border:1px solid #ddd;}
  td{padding:6px 10px;border:1px solid #eee;font-size:12px;}
  tr:nth-child(even){background:#fafafa;}
  .bar-cell{background:#eee;border-radius:3px;height:8px;margin:2px 0;}
  .bar-fill{height:8px;border-radius:3px;background:#1d4ed8;}
  @media print{body{margin:0;}button{display:none;}}</style></head><body>
  <div style="display:flex;justify-content:space-between;align-items:flex-start">
    <div><h1>📋 Reporte PensionadosMX v36</h1><div class="meta">${fecha}</div></div>
    <button onclick="window.print()" style="background:#1d4ed8;color:#fff;border:none;border-radius:7px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer">🖨️ Imprimir</button>
  </div>
  <div class="kpi-grid">
    <div class="kpi"><div class="kpi-n">${total}</div><div class="kpi-l">Total</div></div>
    <div class="kpi"><div class="kpi-n" style="color:green">${act}</div><div class="kpi-l">Activos</div></div>
    <div class="kpi"><div class="kpi-n" style="color:#1d4ed8">${visOk}</div><div class="kpi-l">Visitados</div></div>
    <div class="kpi"><div class="kpi-n" style="color:${pct>70?'green':pct>40?'#b45309':'#dc2626'}">${pct}%</div><div class="kpi-l">Cobertura</div></div>
  </div>
  <h2>Distribución por programa</h2>
  <table><tr><th>Programa</th><th>Registros</th><th>% del total</th><th>Cobertura visitas</th></tr>
  ${progData.map(({k,p,cnt})=>{const v=R.filter(r=>r.tipo===k&&r.visita==='Si').length;const pp=Math.round(cnt/total*100);const vp=Math.round(v/cnt*100);return`<tr><td>${p.ico} ${k}</td><td>${cnt}</td><td>${pp}%</td><td>${vp}%</td></tr>`;}).join('')}
  </table>
  ${secRows?`<h2>Cobertura por sección</h2><table><tr><th>Sección</th><th>Total</th><th>Visitados</th><th>Cobertura</th></tr>${secRows}</table>`:''}
  <h2>Listado completo (${R.filter(r=>r.estatus==='Activo').length} activos)</h2>
  <table><tr><th>Folio</th><th>Nombre</th><th>Programa</th><th>Sección</th><th>Visita</th><th>Estatus</th></tr>
  ${R.filter(r=>r.estatus==='Activo').slice(0,200).map(r=>`<tr><td style="font-family:monospace">${r.folio}</td><td>${r.nombre}</td><td>${r.tipo}</td><td>${r.seccion||'—'}</td><td>${r.visita==='Si'?'✅':r.visita==='Pendiente'?'⏳':'❌'}</td><td>${r.estatus}</td></tr>`).join('')}
  ${R.filter(r=>r.estatus==='Activo').length>200?`<tr><td colspan="6" style="text-align:center;color:#666;font-style:italic">... y ${R.filter(r=>r.estatus==='Activo').length-200} más (muestra limitada a 200 en PDF)</td></tr>`:''}
  </table>
  <div style="margin-top:20px;color:#999;font-size:10px;text-align:center">Generado por PensionadosMX v36 · ${fecha}</div>
  </body></html>`);
  win.document.close();
}

/* ═══════════════════════════════════════════════════
   v34 — HOOK: inyectar bd-mes-wrap y botón PDF en inicio
   ═══════════════════════════════════════════════════ */
(function v34Hooks(){
  // Patch _renderInicioInner to add birthday month widget
  const _origII=window._renderInicioInner;
  if(typeof _origII==='function'&&!window._v34BdPatched){
    window._v34BdPatched=true;
    const _origRenderInicio=window.renderInicio;
    window.renderInicio=function(){
      if(_origRenderInicio)_origRenderInicio();
      // Inject bd-mes-wrap if not exists
      setTimeout(()=>{
        if(!document.getElementById('bd-mes-wrap')){
          const ini=document.getElementById('p-inicio');
          if(ini){
            const div=document.createElement('div');
            div.id='bd-mes-wrap';
            ini.querySelector('.main-inner,#inicio-inner,.pg.on')?.prepend(div)||ini.prepend(div);
          }
        }
        renderBdMesWidget();
      },100);
    };
  }
  // Add PDF export button to download tab
  setTimeout(()=>{
    const dl=document.getElementById('p-descargar');
    if(dl&&!document.getElementById('v34-pdf-btn')){
      const btn=document.createElement('button');
      btn.id='v34-pdf-btn';
      btn.className='btn btn-s';
      btn.style.cssText='width:100%;margin-top:10px;display:flex;align-items:center;justify-content:center;gap:8px';
      btn.innerHTML='📄 Exportar Reporte PDF imprimible';
      btn.onclick=exportPDFReport;
      dl.appendChild(btn);
    }
  },500);
})();

/* ════════════════════════════════════════════════
   v37 — WHATSAPP TEMPLATES + BULK ACTIONS
   ════════════════════════════════════════════════ */

const WA_TEMPLATES = {
  PAM: 'Buen día {nombre}, le saluda el equipo del programa Adulto Mayor (PAM). Le contactamos para recordarle que puede acudir a nuestras oficinas o comunicarse con nosotros para cualquier duda sobre su apoyo. Folio: {folio}.',
  PCD: 'Buen día {nombre}, le contacta el programa de Personas con Discapacidad (PCD). Le recordamos que estamos para apoyarle. Si tiene alguna necesidad o duda, por favor contáctenos. Folio: {folio}.',
  JCF: 'Hola {nombre}, te saluda el equipo de Jóvenes Construyendo el Futuro. Te recordamos que puedes acudir con nosotros para cualquier consulta sobre tu programa. Folio: {folio}.',
  MT:  'Buen día {nombre}, le saluda el equipo del programa Madres. Le recordamos que estamos a sus órdenes para apoyarle. Cualquier duda, no dude en comunicarse. Folio: {folio}.',
  BBJ: 'Hola {nombre}, te contacta el equipo de Becas Benito Juárez. Te recordamos seguir al corriente con tus estudios. Estamos para cualquier duda. Folio: {folio}.',
  _default: 'Hola {nombre}, le contactamos del programa {programa} para confirmar su información y saludarle. Por favor comuníquese con nosotros. Folio: {folio}.',
};
function _getWATemplate(tipo){ return WA_TEMPLATES[tipo]||WA_TEMPLATES._default; }
function _selectWATpl(tipo,btn){
  var ta=document.getElementById('wa-bulk-msg');
  if(ta) ta.value=_getWATemplate(tipo);
  btn.closest('div').querySelectorAll('button').forEach(function(b){b.style.background='var(--s2)';});
  btn.style.background='var(--a)';
}

function sendWhatsAppBulk(){
  var selected=batchSel||new Set();
  if(!selected.size){snack('⚠️ Selecciona registros primero','⚠️');return;}
  var records=[...selected].map(function(id){return R.find(function(r){return r.id===id;});}).filter(Boolean);
  var withPhone=records.filter(function(r){return r.tel;});
  if(!withPhone.length){snack('⚠️ Sin teléfono en la selección','⚠️');return;}
  var progCount={};
  records.forEach(function(r){progCount[r.tipo]=(progCount[r.tipo]||0)+1;});
  var dominantProg=Object.entries(progCount).sort(function(a,b){return b[1]-a[1];})[0]?.[0]||'_default';
  var defaultTpl=_getWATemplate(dominantProg);
  var tplBtns=Object.entries(WA_TEMPLATES).filter(function(e){return e[0]!=='_default';}).map(function(e){
    var k=e[0]; var p=P[k]||{ico:'📋'};
    var isActive=k===dominantProg;
    return '<button type="button" onclick="_selectWATpl(\'' +k+ '\',this)" style="flex:1;min-width:50px;padding:7px 3px;background:'+(isActive?'var(--a)':'var(--s2)')+';color:var(--txt);border:1.5px solid var(--b2);border-radius:9px;font-size:10px;font-weight:800;cursor:pointer;font-family:var(--fnt);transition:.15s">'+p.ico+' '+k+'</button>';
  }).join('');
  conf2(
    '💬 WhatsApp a '+withPhone.length+' beneficiarios',
    '<div style="margin-bottom:6px;font-size:11px;font-weight:800;color:var(--t2)">Plantilla por programa:</div>'
    +'<div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:10px">'+tplBtns+'</div>'
    +'<div style="margin-bottom:6px;font-size:10px;color:var(--sft)">Variables: <code style="background:var(--s2);padding:1px 4px;border-radius:4px">{nombre}</code> <code style="background:var(--s2);padding:1px 4px;border-radius:4px">{programa}</code> <code style="background:var(--s2);padding:1px 4px;border-radius:4px">{folio}</code></div>'
    +'<textarea id="wa-bulk-msg" style="width:100%;min-height:90px;background:var(--s2);border:1.5px solid var(--b2);border-radius:12px;color:var(--txt);padding:10px;font-family:var(--fnt);font-size:12px;outline:none;resize:none;box-sizing:border-box;line-height:1.5">'+defaultTpl+'</textarea>'
    +'<div style="font-size:10px;color:var(--mut);margin-top:6px">⏱ 0.6s entre mensajes · '+withPhone.length+' de '+records.length+' tienen teléfono</div>',
    function(){
      var template=document.getElementById('wa-bulk-msg')?.value||'Hola {nombre}';
      withPhone.forEach(function(r,i){
        setTimeout(function(){
          var msg=template
            .replace(/{nombre}/g,r.nombre.split(' ')[0])
            .replace(/{programa}/g,r.tipo)
            .replace(/{folio}/g,r.folio||'');
          var tel=r.tel.replace(/[^0-9]/g,'');
          window.open('https://wa.me/52'+tel+'?text='+encodeURIComponent(msg),'_blank');
        },i*600);
      });
      snack('💬 Enviando WA a '+withPhone.length+' contactos','💬');
    },
    'Enviar a '+withPhone.length
  );
}

function sendWhatsAppReminder(id){
  var r=R.find(function(x){return x.id===id;});if(!r||!r.tel)return;
  var tel=r.tel.replace(/[^0-9]/g,'');
  var nombre=r.nombre.split(' ')[0];
  var msg=_getWATemplate(r.tipo).replace(/{nombre}/g,nombre).replace(/{programa}/g,r.tipo).replace(/{folio}/g,r.folio||'');
  conf2(
    '💬 WhatsApp a '+nombre,
    '<div style="font-size:13px;color:var(--sft);margin-bottom:10px">Mensaje:</div>'
    +'<textarea id="wa-ind-msg" style="width:100%;min-height:80px;background:var(--s2);border:1.5px solid var(--b2);border-radius:12px;color:var(--txt);padding:10px;font-family:var(--fnt);font-size:12px;outline:none;resize:none;box-sizing:border-box;line-height:1.5">'+msg+'</textarea>',
    function(){
      var finalMsg=document.getElementById('wa-ind-msg')?.value||msg;
      window.open('https://wa.me/52'+tel+'?text='+encodeURIComponent(finalMsg),'_blank');
    },
    'Abrir WhatsApp'
  );
}

/* ── Sync pending badge update ── */
function updateSyncBadge(){
  var n=getPendingCount();
  var badge=document.getElementById('sync-pending-badge');
  if(!badge)return;
  var fbOk=typeof fbIsConfigured==='function'&&fbIsConfigured();
  if(n>0&&fbOk&&!_fbConnected){
    badge.textContent=n+' sin sync';
    badge.style.display='inline-flex';
  }else{
    badge.style.display='none';
    if(n>0&&typeof _fbConnected!=='undefined'&&_fbConnected) clearPending();
  }
}


setTimeout(updateSyncBadge,3000);
setInterval(updateSyncBadge,30000);


/* ── v37: Asignar sección masiva ── */
function openBulkAssignSection(){
  var selected=batchSel||new Set();
  if(!selected.size){snack('⚠️ Selecciona registros primero','⚠️');return;}
  var secs=[...new Set(R.map(function(r){return r.seccion;}).filter(Boolean))].sort();
  var customInput='<input id="bulk-sec-custom" class="fi" style="margin-bottom:8px" placeholder="Sección (ej: 615)" type="text"/>';
  var grid='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px">'+secs.map(function(s){return '<button type="button" onclick="applyBulkSection(\'' +s+ '\')" style="padding:9px 4px;background:var(--s2);color:var(--a2);border:1.5px solid var(--b2);border-radius:9px;font-size:12px;font-weight:800;cursor:pointer;font-family:\'Fira Code\',monospace">'+s+'</button>';}).join('')+'</div>';
  conf2('📍 Asignar sección a '+selected.size+' registros',
    customInput+grid,
    function(){var custom=document.getElementById('bulk-sec-custom')?.value?.trim();if(custom)applyBulkSection(custom);},
    'Usar personalizada'
  );
}
function applyBulkSection(sec){
  var selected=batchSel||new Set();
  var count=0;
  selected.forEach(function(id){var r=R.find(function(x){return x.id===id;});if(r){r.seccion=sec;r.ult=nowStr();count++;}});
  svR();detectDups();if(typeof renderList==='function')renderList();
  exitBatch();snack('📍 '+count+' registros asignados a sección '+sec,'📍');
  if(typeof fbIsConfigured==='function'&&fbIsConfigured())fbPushData();
}

/* ========== GPS CAPTURE ========== */
function captureGPS(){
  const btn=document.getElementById('gps-btn-txt');
  const ico=document.getElementById('gps-btn-ico');
  const disp=document.getElementById('gps-display');
  if(!navigator.geolocation){snack('GPS no disponible en este dispositivo','❌');return;}
  if(btn)btn.textContent='Obteniendo ubicación…';
  if(ico)ico.textContent='⏳';
  navigator.geolocation.getCurrentPosition(
    pos=>{
      const lat=pos.coords.latitude;
      const lng=pos.coords.longitude;
      const acc=Math.round(pos.coords.accuracy);
      const latEl=document.getElementById('e-lat');
      const lngEl=document.getElementById('e-lng');
      if(latEl)latEl.value=lat;
      if(lngEl)lngEl.value=lng;
      if(disp){
        disp.style.display='block';
        disp.textContent='📍 '+lat.toFixed(6)+', '+lng.toFixed(6)+' (±'+acc+'m)';
      }
      if(btn)btn.textContent='✅ Ubicación capturada · Actualizar';
      if(ico)ico.textContent='✅';
      snack('GPS capturado ±'+acc+'m','📍');
    },
    err=>{
      if(btn)btn.textContent='Capturar ubicación actual';
      if(ico)ico.textContent='📍';
      const msgs={1:'Permiso denegado — activa GPS en Configuración',2:'Señal GPS no disponible',3:'Tiempo agotado — intenta de nuevo'};
      snack(msgs[err.code]||'Error GPS','❌');
    },
    {enableHighAccuracy:true,timeout:15000,maximumAge:0}
  );
}

/* GPS directo desde vista de detalle (sin abrir el form) */
function captureGPSForRecord(id){
  const r=R.find(x=>x.id===id);
  if(!r)return;
  if(!navigator.geolocation){snack('GPS no disponible','❌');return;}
  snack('Obteniendo GPS…','⏳');
  navigator.geolocation.getCurrentPosition(
    pos=>{
      r.lat=pos.coords.latitude;
      r.lng=pos.coords.longitude;
      r.ult=today()+' (GPS)';
      svR();
      if(typeof fbIsConfigured==='function'&&fbIsConfigured())fbPushData();
      snack('GPS guardado ±'+Math.round(pos.coords.accuracy)+'m','📍');
      // re-render detail if open
      if(typeof openDet==='function')openDet(id);
    },
    err=>{
      const msgs={1:'Permiso denegado',2:'Sin señal',3:'Tiempo agotado'};
      snack(msgs[err.code]||'Error GPS','❌');
    },
    {enableHighAccuracy:true,timeout:15000,maximumAge:0}
  );
}

/* ========== MAPA DE BENEFICIARIOS ========== */
const PROG_COLORS={PAM:'#4d9eff',PCD:'#a855f7',JCF:'#f97316',MT:'#22c55e',BBJ:'#f43f5e'};
let _leafMap=null;
let _leafMarkers=[];
let _mapFilter='all';

function makeCircleIcon(color){
  return L.divIcon({
    className:'',
    html:`<div style="width:13px;height:13px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,.85);box-shadow:0 1px 5px rgba(0,0,0,.5)"></div>`,
    iconSize:[13,13],
    iconAnchor:[6,6],
    popupAnchor:[0,-8]
  });
}

function initMapPg(){
  // Count how many have GPS
  const withGPS=R.filter(r=>r.lat&&r.lng);
  const countEl=document.getElementById('map-count');
  if(countEl)countEl.textContent='📍 '+withGPS.length+' con GPS de '+R.length;

  // Init Leaflet map centered on Jerez, Zacatecas
  const container=document.getElementById('map-container');
  if(!container)return;

  if(!_leafMap){
    // Default center: Jerez de García Salinas, Zacatecas
    _leafMap=L.map('map-container',{zoomControl:true,attributionControl:false}).setView([22.6478,-102.9963],13);
    _sigeLayer=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:19,
      attribution:'© OpenStreetMap'
    }).addTo(_leafMap);
    L.control.attribution({prefix:false,position:'bottomright'}).addTo(_leafMap);
  }

  // Init SIGE section chips
  initSigeChips();

  renderMapMarkers();
}

function renderMapMarkers(){
  if(!_leafMap)return;
  // Remove existing markers
  _leafMarkers.forEach(m=>_leafMap.removeLayer(m));
  _leafMarkers=[];

  const withGPS=R.filter(r=>r.lat&&r.lng&&(_mapFilter==='all'||r.tipo===_mapFilter));
  if(!withGPS.length){
    snack('Sin beneficiarios con GPS'+('' !==_mapFilter&&_mapFilter!=='all'?' para '+_mapFilter:''),'📍');
    return;
  }

  const bounds=[];
  withGPS.forEach(r=>{
    const color=PROG_COLORS[r.tipo]||'#888';
    const marker=L.marker([r.lat,r.lng],{icon:makeCircleIcon(color)});
    const addr=[r.dom,r.num?'#'+r.num:'',r.col].filter(Boolean).join(' ')||'Sin domicilio';
    const p=pg(r.tipo);
    marker.bindPopup(`
      <div style="font-family:Inter,sans-serif;min-width:160px">
        <div style="font-weight:800;font-size:13px;margin-bottom:3px">${r.nombre}</div>
        <div style="font-size:11px;color:#666;margin-bottom:4px">${p.ico||'📋'} ${r.tipo} · Sec.${r.seccion||'—'}</div>
        <div style="font-size:11px;margin-bottom:6px">🏠 ${addr}</div>
        <button onclick="closeMapAndOpenDetail(${r.id})" style="background:#4d9eff;color:#fff;border:none;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer;width:100%">Ver detalle →</button>
      </div>
    `,{maxWidth:220});
    marker.addTo(_leafMap);
    _leafMarkers.push(marker);
    bounds.push([r.lat,r.lng]);
  });

  if(bounds.length){
    if(bounds.length===1){
      _leafMap.setView(bounds[0],16);
    } else {
      _leafMap.fitBounds(bounds,{padding:[30,30]});
    }
  }
}

function mapFilter(prog){
  _mapFilter=prog;
  // Update chips
  document.querySelectorAll('.map-filter-chip').forEach(c=>{
    const id=c.id.replace('mf-','');
    c.classList.toggle('on',id===prog);
  });
  renderMapMarkers();
}

function viewOnMap(id){
  const r=R.find(x=>x.id===id);
  if(!r||!r.lat||!r.lng){snack('Sin coordenadas GPS','❌');return;}
  go('mapa');
  setTimeout(()=>{
    if(_leafMap){
      _leafMap.setView([r.lat,r.lng],17);
      const m=_leafMarkers.find(mk=>{const ll=mk.getLatLng();return Math.abs(ll.lat-r.lat)<0.0001&&Math.abs(ll.lng-r.lng)<0.0001;});
      if(m)m.openPopup();
    }
  },400);
}

function closeMapAndOpenDetail(id){
  if(_leafMap)_leafMap.closePopup();
  if(typeof openDet==='function'){openDet(id);}
}

// Force Leaflet to recalculate size when tab becomes visible
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden&&_leafMap)setTimeout(()=>_leafMap.invalidateSize(),200);
});


/* ===== SIGE — BUSQUEDA POR SECCION ELECTORAL ===== */
let _sigeLayer=null;
const _mapLayers={
  street:'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  dark:'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  sat:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
};

function setMapLayer(type){
  document.querySelectorAll('.map-layer-btn').forEach(b=>b.classList.remove('on'));
  var btn=document.getElementById('ml-'+type);
  if(btn)btn.classList.add('on');
  if(!_leafMap)return;
  if(_sigeLayer){_leafMap.removeLayer(_sigeLayer);}
  _sigeLayer=L.tileLayer(_mapLayers[type],{maxZoom:19}).addTo(_leafMap);
}

function onSigeSecInput(){
  var v=document.getElementById('sige-sec-input').value;
  var btn=document.getElementById('sige-clear-btn');
  if(btn)btn.style.display=v?'block':'none';
}

function sigeClearSec(){
  var inp=document.getElementById('sige-sec-input');
  if(inp)inp.value='';
  var panel=document.getElementById('sige-sec-panel');
  if(panel){panel.classList.remove('show');panel.innerHTML='';}
  var btn=document.getElementById('sige-clear-btn');
  if(btn)btn.style.display='none';
  document.querySelectorAll('.sige-chip').forEach(function(c){c.classList.remove('on');});
  renderMapMarkers();
}

function sigeSearchSec(sec){
  var s=sec||(document.getElementById('sige-sec-input')?document.getElementById('sige-sec-input').value:'');
  s=String(s).trim();
  if(!s){snack('Ingresa un número de sección','📍');return;}
  var inp=document.getElementById('sige-sec-input');
  if(inp)inp.value=s;
  document.querySelectorAll('.sige-chip').forEach(function(c){c.classList.toggle('on',c.dataset.sec===s);});
  var clearBtn=document.getElementById('sige-clear-btn');
  if(clearBtn)clearBtn.style.display='block';
  var regs=R.filter(function(r){return r.seccion&&String(r.seccion)===s;});
  var panel=document.getElementById('sige-sec-panel');
  if(!panel)return;
  if(!regs.length){
    panel.className='sige-sec-panel show';
    panel.innerHTML='<div style="text-align:center;padding:16px 0"><div style="font-size:28px">🔍</div><div style="font-size:13px;font-weight:800;color:var(--sft);margin-top:8px">Sección '+s+' sin registros</div><div style="font-size:11px;color:var(--mut);margin-top:4px">No hay beneficiarios asignados a esta sección</div></div>';
    return;
  }
  var vis=regs.filter(function(r){return r.visita==='Si'||r.visita==='Sí';}).length;
  var pend=regs.filter(function(r){return r.visita==='Pendiente';}).length;
  var novis=regs.filter(function(r){return r.visita==='No';}).length;
  var act=regs.filter(function(r){return r.estatus==='Activo';}).length;
  var conGPS=regs.filter(function(r){return r.lat&&r.lng;}).length;
  var pct=regs.length?Math.round(vis/regs.length*100):0;
  var clr=pct>=80?'#22c55e':pct>=50?'#f59e0b':pct>=20?'#f97316':'#ef4444';
  var progMap={};
  regs.forEach(function(r){progMap[r.tipo]=(progMap[r.tipo]||0)+1;});
  var progBreak=Object.entries(progMap).sort(function(a,b){return b[1]-a[1];})
    .map(function(e){var t=e[0],n=e[1];var pi=P[t]||{ico:'📋',clr:'var(--sft)'};return '<span style="font-size:9px;font-weight:800;background:var(--s2);color:'+pi.clr+';padding:2px 8px;border-radius:5px">'+pi.ico+' '+t+': '+n+'</span>';}).join('');
  panel.className='sige-sec-panel show';
  var html='';
  html+='<div class="sige-sec-panel-top">';
  html+='<div class="sige-sec-badge">§'+s+'</div>';
  html+='<div>';
  html+='<div class="sige-sec-panel-title">Sección Electoral '+s+'</div>';
  html+='<div class="sige-sec-panel-sub">'+regs.length+' registros · '+act+' activos · '+conGPS+' con GPS</div>';
  html+='<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:5px">'+progBreak+'</div>';
  html+='</div></div>';
  html+='<div class="sige-sec-stats">';
  html+='<div class="sige-sc"><div class="sige-sc-n">'+regs.length+'</div><div class="sige-sc-l">Total</div></div>';
  html+='<div class="sige-sc"><div class="sige-sc-n" style="color:#22c55e">'+vis+'</div><div class="sige-sc-l">Visitados</div></div>';
  html+='<div class="sige-sc"><div class="sige-sc-n" style="color:#f59e0b">'+pend+'</div><div class="sige-sc-l">Pendiente</div></div>';
  html+='<div class="sige-sc"><div class="sige-sc-n" style="color:#ef4444">'+novis+'</div><div class="sige-sc-l">Sin visita</div></div>';
  html+='</div>';
  html+='<div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;color:var(--sft);margin-bottom:5px">';
  html+='<span>Cobertura de visitas</span><span style="color:'+clr+';font-family:var(--fnt2)">'+pct+'%</span></div>';
  html+='<div class="sige-prog-bar"><div class="sige-prog-fill" style="width:'+pct+'%;background:'+clr+'"></div></div>';
  html+='<div style="margin-top:12px" class="sige-sec-actions">';
  html+='<button class="sige-sec-act primary" data-action="goto">📋 Ver registros</button>';
  html+='<button class="sige-sec-act" data-action="zoom">🎯 Centrar</button>';
  html+='<button class="sige-sec-act" data-action="csv">⬇️ CSV</button>';
  html+='</div>';
  panel.innerHTML=html;
  panel.querySelectorAll('button[data-action]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var act=this.dataset.action;
      if(act==='goto')sigeGoToSec(s);
      else if(act==='zoom')sigeZoomSec(s);
      else if(act==='csv')secExport(s);
    });
  });
  sigeZoomSec(s);
}

function autoFillSection(){
  const latVal=parseFloat(document.getElementById('e-lat')?.value||'');
  const lngVal=parseFloat(document.getElementById('e-lng')?.value||'');
  if(!latVal||!lngVal){
    // Try GPS first
    if(!navigator.geolocation){snack('Sin acceso a GPS','❌');return;}
    snack('📍 Obteniendo ubicación…','📍');
    navigator.geolocation.getCurrentPosition(function(pos){
      const lat=pos.coords.latitude, lng=pos.coords.longitude;
      if(document.getElementById('e-lat'))document.getElementById('e-lat').value=lat.toFixed(6);
      if(document.getElementById('e-lng'))document.getElementById('e-lng').value=lng.toFixed(6);
      const sec=_autoSuggestSection(lat,lng);
      if(sec){
        document.getElementById('e-seccion').value=sec;
        snack('📍 Sección '+sec+' sugerida por GPS','📍');
      } else {
        snack('📍 GPS capturado — sección no detectada','📍');
      }
    },function(){snack('No se pudo obtener GPS','❌');},{timeout:6000});
    return;
  }
  const sec=_autoSuggestSection(latVal,lngVal);
  if(sec){
    document.getElementById('e-seccion').value=sec;
    snack('🔍 Sección '+sec+' sugerida por vecinos','📍');
  } else {
    snack('Sin registros cercanos para sugerir sección','ℹ️');
  }
}

function sigeGoToSec(sec){
  go('secciones');
  setTimeout(function(){
    var i=document.getElementById('sec-srch');
    if(i){i.value=sec;renderSecPg();}
  },250);
}

function sigeZoomSec(sec){
  var pts=R.filter(function(r){return r.seccion&&String(r.seccion)===String(sec)&&r.lat&&r.lng;});
  if(!pts.length){snack('Sin GPS en sección '+sec,'📍');return;}
  if(!_leafMap)return;
  var bounds=pts.map(function(r){return[r.lat,r.lng];});
  if(bounds.length===1)_leafMap.setView(bounds[0],16);
  else _leafMap.fitBounds(bounds,{padding:[40,40]});
}

function initSigeChips(){
  var el=document.getElementById('sige-chips');
  if(!el)return;
  var secs=[...new Set(R.map(function(r){return r.seccion;}).filter(Boolean))].sort(function(a,b){return Number(a)-Number(b);});
  if(!secs.length){el.innerHTML='<span style="font-size:11px;color:var(--mut)">Sin secciones asignadas</span>';return;}
  var html='';
  var show=secs.slice(0,20);
  show.forEach(function(s){html+='<button class="sige-chip" data-sec="'+s+'">'+s+'</button>';});
  if(secs.length>20)html+='<span style="font-size:11px;color:var(--mut);padding:5px 4px;flex-shrink:0">+'+(secs.length-20)+' más</span>';
  el.innerHTML=html;
  el.querySelectorAll('.sige-chip').forEach(function(btn){
    btn.addEventListener('click',function(){sigeSearchSec(this.dataset.sec);});
  });
}