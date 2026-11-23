const $ = (id) => document.getElementById(id);
const ageGate = $("ageGate"), studio = $("studio");
const toast = (msg) => { $("toast").textContent=msg; $("toast").classList.add("show"); setTimeout(()=>$("toast").classList.remove("show"),3200); };

$("adultConfirm").addEventListener("change", e => $("enterBtn").disabled = !e.target.checked);
$("enterBtn").addEventListener("click", () => {
  if (!$("adultConfirm").checked) return;
  sessionStorage.setItem("aiStudioAdultConfirmed","yes");
  ageGate.hidden=true; studio.hidden=false;
});
if (sessionStorage.getItem("aiStudioAdultConfirmed")==="yes") { ageGate.hidden=true; studio.hidden=false; }

document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b===btn));
  ["image","video","gallery"].forEach(name => $(name+"Panel").hidden = name!==btn.dataset.tab);
  if(btn.dataset.tab==="gallery") renderGallery();
}));

function previewFile(input, target) {
  const file=input.files && input.files[0]; if(!file) return;
  if(!file.type.startsWith("image/")) { toast("Escolha um arquivo de imagem."); return; }
  const url=URL.createObjectURL(file);
  $(target).classList.remove("empty");
  $(target).innerHTML="";
  const img=document.createElement("img"); img.src=url; img.alt="Prévia da imagem selecionada"; $(target).appendChild(img);
}
$("imageFile").addEventListener("change",()=>previewFile($("imageFile"),"imagePreview"));
$("videoSource").addEventListener("change",()=>previewFile($("videoSource"),"videoPreview"));

$("generateImage").addEventListener("click",()=>{
  const prompt=$("prompt").value.trim();
  if(!prompt){toast("Escreva uma descrição para a imagem.");return;}
  toast("Projeto preparado. Para gerar, falta conectar um provedor de IA.");
});
$("generateVideo").addEventListener("click",()=>{
  if(!$("videoSource").files.length){toast("Escolha uma foto primeiro.");return;}
  if(!$("motion").value.trim()){toast("Descreva o movimento desejado.");return;}
  toast("Pedido preparado. Falta conectar um serviço de foto-para-vídeo.");
});

// IndexedDB: armazenamento local de criações/importações no aparelho.
const DB_NAME="ai-studio-db", STORE="assets";
function openDB(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:"id",autoIncrement:true});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function saveFile(file,label){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).add({file,label,created:Date.now()});tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);});}
async function getAssets(){const db=await openDB();return new Promise((resolve,reject)=>{const req=db.transaction(STORE).objectStore(STORE).getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});}
async function deleteAsset(id){const db=await openDB();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).delete(id);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}
async function renderGallery(){
 const el=$("gallery"); el.innerHTML="";
 try{
  const assets=await getAssets();
  if(!assets.length){el.innerHTML='<div class="preview empty">Sua galeria está vazia.</div>';return;}
  assets.sort((a,b)=>b.created-a.created).forEach(item=>{
   const card=document.createElement("div");card.className="gallery-item";
   const media=document.createElement(item.file.type.startsWith("video/")?"video":"img");
   media.src=URL.createObjectURL(item.file); if(media.tagName==="VIDEO") media.controls=true; else media.alt="Arquivo salvo";
   const del=document.createElement("button");del.textContent="Excluir";del.onclick=async()=>{await deleteAsset(item.id);renderGallery();};
   card.append(media,del);el.append(card);
  });
 }catch(e){el.innerHTML='<div class="preview empty">Não foi possível carregar a galeria.</div>';}
}
async function saveSelected(input,label){if(!input.files.length){toast("Selecione um arquivo.");return;}try{await saveFile(input.files[0],label);toast("Arquivo salvo na galeria deste aparelho.");}catch(e){toast("Não foi possível salvar o arquivo.");}}
// Toque longo no preview ou botão contextual simples para guardar a referência escolhida.
["imageFile","videoSource"].forEach((id)=>$(id).addEventListener("change",()=>saveSelected($(id),id==="imageFile"?"Referência":"Foto para vídeo")));

if("serviceWorker" in navigator) window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
