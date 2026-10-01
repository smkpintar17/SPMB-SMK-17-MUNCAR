/* ==========================================================
   SMK PINTAR - SMK 17 MUNCAR
   Single-file JavaScript: Auth + Game + Dashboard + Sheets
   ========================================================== */

const CONFIG={
  GOOGLE_SCRIPT_URL:"https://script.google.com/macros/s/AKfycbxyUWjlMW4hmZngSvUlsJlpGDv24FZZIbCR3p86BnVPgLwOYe2qryWGs0GnG38Rfpve/exec", // Isi URL Web App Google Apps Script.
  SCHOOL:"SMK 17 MUNCAR",
  GAME:"SMK PINTAR",
  // Akun Superadmin DEMO. Untuk produksi, pindahkan autentikasi admin ke backend.
  SUPERADMIN_USER:"superadmin",
  SUPERADMIN_PASS:"SMK17Muncar#2026"
};

const Q=[
 {n:1,title:"Kenali SMK 17 Muncar",type:"essay",q:"Apa yang kamu ketahui tentang SMK 17 Muncar?",mission:"Temukan Buku Pengenalan"},
 {n:2,title:"6 Program Keahlian",type:"mc",q:"Pilih pernyataan yang tepat untuk masing-masing program keahlian.",mission:"Temukan Buku Program Keahlian",
  options:[
   ["AKL","Akuntansi dan Keuangan Lembaga — pencatatan transaksi, pembukuan, laporan dan administrasi keuangan."],
   ["BDP","Bisnis Daring dan Pemasaran — bisnis, pemasaran, pelayanan pelanggan, digital marketing dan e-commerce."],
   ["PH","Perhotelan — pelayanan tamu, front office, tata graha, food & beverage dan hospitality."],
   ["RPL","Rekayasa Perangkat Lunak — analisis, desain, pemrograman, pengujian dan pengembangan aplikasi/website."],
   ["TO","Teknik Otomotif — teknologi kendaraan, perawatan, perbaikan mesin dan sistem kendaraan."],
   ["TP","Teknik Pengelasan — penyambungan logam, fabrikasi, K3 dan pemeriksaan hasil pengelasan."]
  ]},
 {n:3,title:"Minat Jurusan",type:"select",q:"Jika kamu bersekolah di SMK 17 Muncar, program keahlian apa yang paling kamu minati?",mission:"Temukan Buku Minat",options:["AKL","BDP","PH","RPL","TO","TP"]},
 {n:4,title:"Alasan Memilih",type:"essay",q:"Mengapa kamu tertarik memilih program keahlian tersebut?",mission:"Temukan Buku Alasan"},
 {n:5,title:"Harapanmu",type:"essay",q:"Apa yang ingin kamu capai atau dapatkan selama bersekolah di SMK 17 Muncar?",mission:"Temukan Buku Harapan"},
 {n:6,title:"Cita-Cita",type:"essay",q:"Apa cita-citamu setelah lulus sekolah?",mission:"Temukan Buku Cita-Cita"},
 {n:7,title:"Kontak",type:"tel",q:"Tuliskan nomor WhatsApp yang dapat digunakan untuk informasi SPMB.",mission:"Temukan Buku Kontak"},
 {n:8,title:"Profil",type:"essay",q:"Tuliskan alamat tempat tinggalmu.",mission:"Temukan Buku Profil"}
];

const Store={
 key:"smkpintar_github_users_v1",cur:"smkpintar_github_current_v1",
 users(){return JSON.parse(localStorage.getItem(this.key)||"[]")},
 save(a){localStorage.setItem(this.key,JSON.stringify(a))},
 current(){return JSON.parse(localStorage.getItem(this.cur)||"null")},
 set(u){localStorage.setItem(this.cur,JSON.stringify(u))},
 hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)},
 register(name,school,user,pass){
  let a=this.users();
  if(a.some(x=>x.username.toLowerCase()===user.toLowerCase()))throw Error("Username sudah digunakan.");
  let u={id:(crypto.randomUUID?crypto.randomUUID():Date.now()+""),name,school,username:user,password:this.hash(pass),level:1,score:0,books:0,answers:{},completed:false,startedAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
  a.push(u);this.save(a);this.set(u);Sheets.send("register",u);return u
 },
 login(user,pass){
  let u=this.users().find(x=>x.username.toLowerCase()===user.toLowerCase()&&x.password===this.hash(pass));
  if(!u)throw Error("Username atau password salah.");
  this.set(u);return u
 },
 update(p){
  let u=this.current();if(!u)return;
  Object.assign(u,p,{updatedAt:new Date().toISOString()});
  let a=this.users(),i=a.findIndex(x=>x.id===u.id);if(i>=0)a[i]=u;this.save(a);this.set(u);Sheets.send("progress",u);return u
 },
 logout(){localStorage.removeItem(this.cur);location.hash="home"}
};

const Sheets={
 send(type,data){
  if(!CONFIG.GOOGLE_SCRIPT_URL)return;
  fetch(CONFIG.GOOGLE_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({type,data})}).catch(()=>{});
 }
};

const App={
 root:document.getElementById("app"),
 init(){
  if(location.hash.startsWith("#game"))this.gamePage();
  else if(location.hash.startsWith("#dashboard"))this.dashboardPage();
  else if(location.hash.startsWith("#admin"))this.adminPage();
  else this.homePage();
 },
 go(h){location.hash=h},
 homePage(){
  this.root.innerHTML=`<div class="app landing"><header class="brand"><div class="logo">17</div><div><h1>SMK PINTAR</h1><p>SMK 17 MUNCAR</p></div></header><main class="hero"><section class="card hero-card"><span class="badge">SPMB • PETUALANGAN EDUKATIF</span><h2>Petualangan Mencari Buku</h2><p>Jelajahi lingkungan sekolah, temukan 8 buku, selesaikan misi, dan kenali program keahlian SMK 17 Muncar.</p><div class="features"><span>🎮 8 Level</span><span>📱 Android</span><span>📚 8 Buku</span><span>🏆 Skor</span></div></section><section class="card"><div class="tabs"><button class="tab active" id="tl">Masuk</button><button class="tab" id="tr">Daftar</button></div><form id="login" class="form"><label>Username<input id="lu" required autocomplete="username"></label><label>Password<input id="lp" type="password" required autocomplete="current-password"></label><button class="primary">🚀 Masuk & Main</button><button type="button" class="ghost" onclick="App.go('#admin')">Dashboard Admin</button></form><form id="reg" class="form hidden"><label>Nama Lengkap<input id="rn" required></label><label>Asal Sekolah SMP/MTs<input id="rs" required></label><label>Username<input id="ru" required minlength="4"></label><label>Password<input id="rp" type="password" required minlength="6"></label><label>Konfirmasi Password<input id="rp2" type="password" required minlength="6"></label><label class="check"><input id="cons" type="checkbox" required>Saya menyetujui data digunakan untuk kebutuhan informasi SPMB SMK 17 Muncar.</label><button class="primary">✨ Daftar & Mulai Otomatis</button></form><p id="msg" class="msg"></p></section></main><footer>MANDIRI • TERAMPIL • SIAP KERJA</footer></div>`;
  tl.onclick=()=>{tl.classList.add("active");tr.classList.remove("active");login.classList.remove("hidden");reg.classList.add("hidden")};
  tr.onclick=()=>{tr.classList.add("active");tl.classList.remove("active");reg.classList.remove("hidden");login.classList.add("hidden")};
  login.onsubmit=e=>{e.preventDefault();try{Store.login(lu.value.trim(),lp.value);this.go("#game")}catch(x){msg.textContent=x.message}};
  reg.onsubmit=e=>{e.preventDefault();if(rp.value!==rp2.value){msg.textContent="Konfirmasi password tidak sama.";return}try{Store.register(rn.value.trim(),rs.value.trim(),ru.value.trim(),rp.value);this.go("#game")}catch(x){msg.textContent=x.message}};
  if(Store.current()){} 
 },
 dashboardPage(){
  let u=Store.current();if(!u){this.go("#home");return}
  this.root.innerHTML=`<div class="app"><header class="top"><b>SMK PINTAR • DASHBOARD</b><div class="actions"><button class="ghost" onclick="App.go('#game')">🎮 Lanjut Game</button><button class="ghost" onclick="Store.logout()">Keluar</button></div></header><main class="dashboard"><section class="card welcome"><div><span class="badge">DASHBOARD PEMAIN</span><h2>${esc(u.name)}</h2><p>${esc(u.school)}</p></div><div class="score"><small>SKOR</small><b>${u.score}</b></div></section><section class="stats"><div class="stat"><b>${Math.min(u.level,8)}/8</b><span>Level</span></div><div class="stat"><b>${u.books}/8</b><span>Buku</span></div><div class="stat"><b>${u.completed?"Selesai":"Berjalan"}</b><span>Status</span></div><div class="stat"><b>${u.username}</b><span>Username</span></div></section><section class="card"><h3>Progres Petualangan</h3><div class="bar"><i style="width:${u.books/8*100}%"></i></div><div class="levels">${Array.from({length:8},(_,i)=>`<div class="level ${i<u.books?"done":""}"><b>Level ${i+1}</b>${i<u.books?"✓ Selesai":"🔒 Terkunci"}</div>`).join("")}</div></section><section class="card"><h3>Jawaban Kuisioner</h3><div class="answers">${Object.entries(u.answers||{}).map(([k,v])=>`<div class="answer"><b>${k.replace("level","Level ")}</b>${esc(v)}</div>`).join("")||"Belum ada jawaban."}</div></section></main></div>`
 },
 adminPage(){
  this.root.innerHTML=`<div class="app"><header class="top"><b>ADMIN • SMK 17 MUNCAR</b><button class="ghost" onclick="App.go('#home')">Kembali</button></header><section class="card"><span class="badge">SUPERADMIN</span><h2>Dashboard Peserta</h2><p>Masuk sebagai superadmin untuk melihat peserta yang tersimpan di Google Sheets atau pada perangkat ini.</p><form id="adminLogin" class="form"><label>Username<input id="au" autocomplete="username" required></label><label>Password<input id="ap" type="password" autocomplete="current-password" required></label><button class="primary">🔐 Masuk Superadmin</button><p id="am" class="msg"></p></form></section></div>`;
  adminLogin.onsubmit=e=>{e.preventDefault();if(au.value.trim()===CONFIG.SUPERADMIN_USER&&ap.value===CONFIG.SUPERADMIN_PASS){this.adminPanel()}else am.textContent="Username atau password superadmin salah."}
 },
 adminPanel(){
  let us=Store.users();
  this.root.innerHTML=`<div class="app"><header class="top"><div><b>SUPERADMIN • SMK 17 MUNCAR</b><small style="display:block;color:#69727d">Monitoring peserta SPMB</small></div><div class="actions"><button class="ghost" onclick="App.go('#home')">Beranda</button><button class="ghost" onclick="App.go('#game')">🎮 Game</button></div></header><section class="card"><span class="badge">MONITORING PESERTA</span><h2>Siapa Saja yang Telah Bermain?</h2><p id="adminSource">Memuat data lokal…</p><div class="adminbuttons"><button class="primary" onclick="App.loadSheets()">☁️ Muat dari Google Sheets</button><button class="secondary" onclick="App.adminRefresh()">↻ Lokal</button><button class="secondary" onclick="App.csv()">⬇ Export CSV</button></div><div class="tablewrap"><table><thead><tr><th>Nama</th><th>Sekolah</th><th>Username</th><th>Level</th><th>Skor</th><th>Buku</th><th>Status</th><th>Update</th></tr></thead><tbody id="adminbody">${this.rows(us)}</tbody></table></div></section></div>`;
  this.adminRefresh();
 },
 rows(us){return us.length?us.map(u=>`<tr><td>${esc(u.name)}</td><td>${esc(u.school)}</td><td>${esc(u.username)}</td><td>${u.level}/8</td><td>${u.score}</td><td>${u.books}/8</td><td>${u.completed?"Selesai":"Berjalan"}</td><td>${u.updatedAt?new Date(u.updatedAt).toLocaleString("id-ID"):"-"}</td></tr>`).join(""):`<tr><td colspan="8">Belum ada peserta.</td></tr>`},
 adminRefresh(){let el=document.getElementById("adminbody");if(el)el.innerHTML=this.rows(Store.users());let s=document.getElementById("adminSource");if(s)s.textContent="Data lokal browser. Klik ‘Muat dari Google Sheets’ untuk data seluruh perangkat setelah integrasi aktif."},
 async loadSheets(){
  let s=document.getElementById("adminSource");if(!CONFIG.GOOGLE_SCRIPT_URL){if(s)s.textContent="URL Google Sheets belum diisi di script.js (GOOGLE_SCRIPT_URL).";return}
  if(s)s.textContent="Mengambil data peserta dari Google Sheets…";
  try{
    const r=await fetch(CONFIG.GOOGLE_SCRIPT_URL+"?action=participants&adminKey="+encodeURIComponent(CONFIG.SUPERADMIN_PASS));
    const j=await r.json();
    const data=(j.participants||[]).map(x=>({name:x.name||x.Nama||"",school:x.school||x.Sekolah||"",username:x.username||x.Username||"",level:Number(x.level||x.Level||1),score:Number(x.score||x.Score||0),books:Number(x.books||x.Books||0),completed:String(x.completed||x.Completed||"").toUpperCase()==="YA"||String(x.completed||x.Completed||"").toLowerCase()==="true",updatedAt:x.updatedAt||x.Timestamp||"-"}));
    document.getElementById("adminbody").innerHTML=this.rows(data);if(s)s.textContent=`Google Sheets: ${data.length} peserta.`;
  }catch(e){if(s)s.textContent="Gagal membaca Google Sheets. Periksa URL Web App dan deployment."}
 },
 clearUsers(){if(confirm("Hapus semua peserta lokal dari browser ini?")){localStorage.removeItem(Store.key);this.adminRefresh()}},
 csv(){
  let rows=[["Nama","Sekolah","Username","Level","Skor","Buku","Status","Update"],...Store.users().map(u=>[u.name,u.school,u.username,u.level,u.score,u.books,u.completed?"Selesai":"Berjalan",u.updatedAt])];
  let csv=rows.map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(",")).join("\n"),a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));a.download="peserta-smk-pintar.csv";a.click()
 },
 gamePage(){
  let u=Store.current();if(!u){this.go("#home");return}
  let start=Math.min(Math.max(u.level,1),8);
  this.root.innerHTML=`<div class="game"><div class="gamewrap"><header class="gametop"><div><b>SMK PINTAR</b><small>${esc(u.name)}</small></div><div class="actions"><button class="ghost" onclick="App.go('#dashboard')">📊 Dashboard</button><span>📖 <b id="bc">${u.books}</b>/8 &nbsp; ⭐ <b id="sc">${u.score}</b></span></div></header><section class="world"><canvas id="cv"></canvas><div class="hud"><b id="lt"></b><span id="mi"></span></div><div class="controls"><button data-k="ArrowUp">▲</button><div><button data-k="ArrowLeft">◀</button><button data-k="ArrowDown">▼</button><button data-k="ArrowRight">▶</button></div></div><div id="panel" class="panel hidden"><div class="modal"><span id="ql" class="badge"></span><h2 id="qt"></h2><div id="qb"></div><div id="qo"></div><button id="submit" class="primary">Lanjut</button><p id="qm" class="msg"></p></div></div></section></div></div>`;
  Game.start(start)
 }
};

const Game={
 c:null,x:null,y:null,px:70,py:300,bx:600,by:260,keys:{},level:1,opening:false,
 start(n){
  this.c=document.getElementById("cv");this.x=this.c.getContext("2d");this.level=n;this.resize();addEventListener("resize",()=>this.resize());
  addEventListener("keydown",e=>{this.keys[e.key]=true;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key))e.preventDefault()});
  addEventListener("keyup",e=>this.keys[e.key]=false);
  document.querySelectorAll(".controls button").forEach(b=>{let k=b.dataset.k;b.onpointerdown=()=>this.keys[k]=true;["pointerup","pointercancel","pointerleave"].forEach(e=>b.addEventListener(e,()=>this.keys[k]=false))});
  this.levelStart(n);requestAnimationFrame(()=>this.loop())
 },
 resize(){let r=this.c.getBoundingClientRect(),d=devicePixelRatio||1;this.c.width=Math.floor(r.width*d);this.c.height=Math.floor(r.height*d);this.x.setTransform(d,0,0,d,0,0)},
 levelStart(n){
  this.level=n;let q=Q[n-1];lt.textContent=`LEVEL ${n} • ${q.title}`;mi.textContent=q.mission;this.px=65;this.py=Math.max(95,this.c.clientHeight-115);this.bx=Math.max(180,this.c.clientWidth-100);this.by=Math.min(290,this.c.clientHeight-160)
 },
 loop(){this.update();this.draw();requestAnimationFrame(()=>this.loop())},
 update(){
  let s=3.1,k=this.keys;if(k.ArrowUp||k.w)this.py-=s;if(k.ArrowDown||k.s)this.py+=s;if(k.ArrowLeft||k.a)this.px-=s;if(k.ArrowRight||k.d)this.px+=s;
  this.px=Math.max(28,Math.min(this.c.clientWidth-28,this.px));this.py=Math.max(70,Math.min(this.c.clientHeight-25,this.py));
  if(Math.hypot(this.px-this.bx,this.py-this.by)<43)this.question()
 },
 draw(){
  let w=this.c.clientWidth,h=this.c.clientHeight,c=this.x;c.clearRect(0,0,w,h);c.fillStyle="#21452f";c.fillRect(0,0,w,h);
  c.fillStyle="#2d5a3d";for(let xx=0;xx<w;xx+=46)for(let yy=60;yy<h;yy+=46)c.fillRect(xx+2,yy+2,39,39);
  c.fillStyle="#9b6b43";c.fillRect(0,h-92,w,72);c.fillStyle="#d0a77b";c.fillRect(0,h-78,w,48);
  c.fillStyle="#fff";c.font="bold 17px system-ui";c.fillText("SMK 17 MUNCAR",17,43);
  c.fillStyle="#efc34f";c.fillRect(this.bx-15,this.by-20,30,40);c.fillStyle="#703d19";for(let i=-1;i<2;i++)c.fillRect(this.bx-10,this.by+i*12,20,4);
  c.fillStyle="#e6eef5";c.beginPath();c.arc(this.px,this.py-18,13,0,Math.PI*2);c.fill();c.fillStyle="#d94861";c.fillRect(this.px-13,this.py-5,26,28);c.fillStyle="#263238";c.fillRect(this.px-13,this.py+23,9,15);c.fillRect(this.px+4,this.py+23,9,15)
 },
 question(){
  if(this.opening)return;this.opening=true;this.keys={};let q=Q[this.level-1];ql.textContent=`LEVEL ${q.n}`;qt.textContent=q.title;qb.innerHTML=`<p>${q.q}</p>`;qo.innerHTML="";
  if(q.type==="mc")q.options.forEach(o=>{let b=document.createElement("button");b.className="option";b.textContent=`${o[0]} — ${o[1]}`;b.onclick=()=>{document.querySelectorAll(".option").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");b.dataset.value=o[0]};qo.appendChild(b)});
  else if(q.type==="select"){let s=document.createElement("select");s.className="essay";s.style.minHeight="55px";s.innerHTML='<option value="">Pilih program keahlian</option>'+q.options.map(o=>`<option>${o}</option>`).join("");qo.appendChild(s)}
  else {let t=document.createElement("textarea");t.className="essay";t.placeholder=q.type==="tel"?"Contoh: 08xxxxxxxxxx":"Tulis jawabanmu di sini...";qo.appendChild(t)}
  qm.textContent="";panel.classList.remove("hidden");submit.onclick=()=>this.submit(q)
 },
 submit(q){
  let val="";
  if(q.type==="mc"){let b=document.querySelector(".option.selected");if(!b){qm.textContent="Pilih jawaban.";return}val=b.dataset.value}
  else if(q.type==="select"){val=qo.querySelector("select").value;if(!val){qm.textContent="Pilih jurusan.";return}}
  else{val=qo.querySelector("textarea").value.trim();if(!val){qm.textContent="Jawaban belum diisi.";return}}
  let u=Store.current();u.answers["level"+q.n]=val;u.score+=(q.type==="mc"?50:30);u.books=Math.max(u.books,q.n);u.level=Math.min(8,q.n+1);u.completed=q.n===8;Store.update(u);bc.textContent=u.books;sc.textContent=u.score;panel.classList.add("hidden");this.opening=false;
  if(q.n===8){alert("🎉 SELAMAT! Semua 8 level selesai. Terima kasih telah mengenal SMK 17 Muncar.");App.go("#dashboard")}else this.levelStart(q.n+1)
 }
};

function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
window.addEventListener("hashchange",()=>App.init());App.init();

/* Google Apps Script:
   Sheet columns:
   Timestamp | Event | ID | Nama | Sekolah | Username | Level | Score |
   Books | Completed | Minat Jurusan | Alasan | Harapan | Cita-Cita | WhatsApp | Alamat
*/
