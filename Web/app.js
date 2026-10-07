/* Datos de ejemplo (después vendrán de PHP + base de datos) */
const EVENTOS=[
{id:1,nombre:"Enjambre: Daños Luz Tour 2026",fecha:"2026-11-14",hora:"21:00",tipo:"Concierto",zonas:["Preferente","Platea","General baja","General alta","Palcos"],desc:"Una noche de rock en español con los mayores éxitos de la banda."},
{id:2,nombre:"Noche de Lucha Libre",fecha:"2026-11-20",hora:"20:00",tipo:"Lucha libre",zonas:["Preferente","General baja","General alta"],desc:"Función estelar con las mejores luchadoras y luchadores de la Comarca."},
{id:3,nombre:"Torneo de Voleibol Lagunero",fecha:"2026-11-27",hora:"18:00",tipo:"Deportivo",zonas:["Platea","General baja","General alta"],desc:"Final regional con equipos de Torreón, Gómez Palacio y Lerdo."},
{id:4,nombre:"Mundo Fantástico (show infantil)",fecha:"2026-12-05",hora:"16:00",tipo:"Familiar",zonas:["Platea","General baja","Palcos"],desc:"Espectáculo musical para toda la familia con personajes y sorpresas."}];
const HISTORIAL=[
{nombre:"Cartel Festival de Rock 2025",autor:"Producciones Laguna",anio:"2025",cat:"Concierto",pdf:"#"},
{nombre:"Boletín Lucha Libre Aniversario",autor:"Arena Torreón",anio:"2025",cat:"Lucha libre",pdf:"#"},
{nombre:"Programa Torneo Estatal de Box",autor:"Comité Deportivo",anio:"2024",cat:"Deportivo",pdf:"#"},
{nombre:"Cartel Concierto Navideño",autor:"Gobierno Municipal",anio:"2024",cat:"Familiar",pdf:"#"},
{nombre:"Cartel Gira Norteña",autor:"Producciones Laguna",anio:"2023",cat:"Concierto",pdf:"#"}];
const ZONAS={"Preferente":1800,"Palcos":1500,"Platea":1200,"General baja":800,"General alta":500};
const CUOTA=2500;
const $=(s,r=document)=>r.querySelector(s);
const unicos=a=>[...new Set(a)].sort();
const opciones=(sel,vals)=>vals.forEach(v=>sel.add(new Option(v,v)));
const tarjeta=e=>`<article class="tarjeta"><span class="etiqueta">${e.fecha}</span><span class="etiqueta">${e.hora}</span><span class="etiqueta">${e.tipo}</span><h3>${e.nombre}</h3><p>${e.desc}</p><a class="btn sec" href="evento.html?id=${e.id}">Ver detalle</a></article>`;

function layout(){
 const pag=document.body.dataset.pagina;
 const links=[["index","Inicio"],["cartelera","Cartelera"],["eventos","Eventos"],["historial","Historial"],["registro","Registro"],["boletos","Boletos"]];
 $("#cabecera").innerHTML=`<div class="contenedor"><a class="logo" href="index.html">Coliseo Centenario</a><nav aria-label="Principal"><ul class="menu">${links.map(([f,t])=>`<li><a href="${f}.html" class="${f===pag?"activo":""}">${t}</a></li>`).join("")}</ul></nav></div>`;
 $("#pie").innerHTML=`<div class="contenedor">Coliseo Centenario de Torreón · Proyecto de Programación Web (datos de ejemplo)</div>`;
}
function index(){$("#proximos").innerHTML=EVENTOS.slice(0,3).map(tarjeta).join("");}
function eventos(){$("#lista").innerHTML=EVENTOS.map(tarjeta).join("");}
function cartelera(){
 const lista=$("#lista"),fd=$("#f-dia"),ft=$("#f-tipo"),fz=$("#f-zona");
 opciones(fd,unicos(EVENTOS.map(e=>e.fecha)));opciones(ft,unicos(EVENTOS.map(e=>e.tipo)));opciones(fz,Object.keys(ZONAS));
 const pintar=()=>{
  const r=EVENTOS.filter(e=>(!fd.value||e.fecha===fd.value)&&(!ft.value||e.tipo===ft.value)&&(!fz.value||e.zonas.includes(fz.value))).sort((a,b)=>(a.fecha+a.hora).localeCompare(b.fecha+b.hora));
  lista.innerHTML=r.length?r.map(tarjeta).join(""):"<p>No hay eventos con esos filtros. Cambia los filtros.</p>";};
 [fd,ft,fz].forEach(s=>s.addEventListener("change",pintar));pintar();
}
function evento(){
 const e=EVENTOS.find(x=>x.id==new URLSearchParams(location.search).get("id"));
 $("#detalle").innerHTML=e?`<article class="tarjeta"><span class="etiqueta">${e.tipo}</span><h2>${e.nombre}</h2><p>${e.fecha} a las ${e.hora} · Coliseo Centenario, Torreón</p><p>${e.desc}</p><h3>Precios por zona</h3><ul>${e.zonas.map(z=>`<li>${z}: $${ZONAS[z]} MXN</li>`).join("")}</ul><p><a class="btn" href="boletos.html?evento=${e.id}">Comprar boletos</a> <a class="btn sec" href="eventos.html">Volver</a></p></article>`:`<p>No encontramos ese evento. <a href="eventos.html">Ver eventos</a></p>`;
}
function historial(){
 const lista=$("#lista"),fa=$("#f-anio"),fc=$("#f-cat");
 opciones(fa,unicos(HISTORIAL.map(m=>m.anio)));opciones(fc,unicos(HISTORIAL.map(m=>m.cat)));
 const pintar=()=>{
  const r=HISTORIAL.filter(m=>(!fa.value||m.anio===fa.value)&&(!fc.value||m.cat===fc.value));
  lista.innerHTML=r.length?r.map(m=>`<article class="tarjeta"><span class="etiqueta">${m.anio}</span><span class="etiqueta">${m.cat}</span><h3>${m.nombre}</h3><p>${m.autor}</p><a class="btn" href="${m.pdf}" target="_blank" rel="noopener">Ver PDF</a></article>`).join(""):"<p>No hay documentos con esos filtros.</p>";};
 [fa,fc].forEach(s=>s.addEventListener("change",pintar));pintar();
}
function registro(){
 const f=$("#form"),rol=$("#rol");
 opciones($("#zona-pref"),Object.keys(ZONAS));
 const alternar=()=>{$("#campos-organizador").classList.toggle("oculto",rol.value!=="organizador");$("#campos-asistente").classList.toggle("oculto",rol.value!=="asistente");};
 rol.addEventListener("change",alternar);alternar();
 f.addEventListener("submit",e=>{
  e.preventDefault();let ok=true;
  f.querySelectorAll(".msg-error,.ok").forEach(m=>m.remove());f.querySelectorAll(".error").forEach(i=>i.classList.remove("error"));
  const err=(el,t)=>{ok=false;el.classList.add("error");el.insertAdjacentHTML("afterend",`<span class="msg-error">${t}</span>`);};
  [...f.querySelectorAll("[required]")].filter(i=>!i.closest(".oculto")).forEach(i=>{if(!i.value.trim())err(i,"Este campo es obligatorio.");});
  const c=$("#correo");if(c.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.value))err(c,"Escribe un correo válido.");
  const p=$("#clave");if(p.value&&p.value.length<6)err(p,"La contraseña debe tener al menos 6 caracteres.");
  const d=$("#descripcion");if(rol.value==="organizador"&&d.value.trim()&&d.value.trim().length<50)err(d,"La descripción debe tener al menos 50 caracteres.");
  if(ok){f.reset();alternar();f.insertAdjacentHTML("beforeend",`<div class="ok">Registro recibido. Continúa en <a href="boletos.html">Boletos</a>. (La validación del servidor se agregará con PHP.)</div>`);}
 });
}
function boletos(){
 const rol=$("#rol-pago"),cant=$("#cant"),tot=$("#total");
 const ev=EVENTOS.find(e=>e.id==new URLSearchParams(location.search).get("evento"));
 if(ev)$("#evento-nombre").textContent=ev.nombre;
 $("#leyenda").innerHTML=Object.entries(ZONAS).map(([z,p])=>`<span class="etiqueta">${z}: $${p}</span>`).join("");
 let zona="";
 const calc=()=>{
  const org=rol.value==="organizador";
  $("#panel-asistente").classList.toggle("oculto",org);
  $("#zona-txt").textContent=zona||"Ninguna";
  tot.textContent=org?"$"+CUOTA+" MXN (cuota de publicación)":zona?"$"+ZONAS[zona]*cant.value+" MXN":"Elige una zona en el mapa";};
 document.querySelectorAll("[data-zona]").forEach(z=>{
  const libre=!ev||ev.zonas.includes(z.dataset.zona);
  if(!libre)z.classList.add("agotada");
  const elegir=()=>{if(!libre)return;zona=z.dataset.zona;document.querySelectorAll("[data-zona]").forEach(o=>o.classList.toggle("sel",o===z));calc();};
  z.addEventListener("click",elegir);
  z.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();elegir();}});
 });
 [rol,cant].forEach(s=>s.addEventListener("change",calc));calc();
 $("#confirmar").addEventListener("click",()=>{
  if(rol.value==="asistente"&&!zona){$("#conf").innerHTML=`<p class="msg-error">Primero elige una zona en el mapa.</p>`;return;}
  $("#conf").innerHTML=`<div class="ok">Pago simulado (${rol.value}): ${tot.textContent}. Se confirmará de verdad después de la unidad de PHP.</div>`;});
}
document.addEventListener("DOMContentLoaded",()=>{layout();({index,cartelera,eventos,evento,historial,registro,boletos}[document.body.dataset.pagina]||(()=>{}))();});
