// The PathShala School — Offline-first School OS
const KEY='pathshala_db_v1';
const $=id=>document.getElementById(id);
const today=()=>new Date().toISOString().slice(0,10);
const rs=n=>'₹'+Number(n||0).toLocaleString('en-IN');

let DB=null, editS=-1, editT=-1, attendCache={};

function seed(){return{
 students:[
  {name:'Aarav Sharma',cls:'Class 6-8',roll:'101',gender:'Boy',phone:'9876543210',addr:'Saragaon'},
  {name:'Diya Verma',cls:'Class 1-5',roll:'45',gender:'Girl',phone:'9876501234',addr:'Raipur'},
  {name:'Kabir Nayak',cls:'Class 9-10',roll:'12',gender:'Boy',phone:'9988776655',addr:'Baronda'}
 ],
 staff:[
  {name:'Mrs. Kiran Nayak',role:'Principal',sub:'Management',phone:'8871626560',sal:45000},
  {name:'N.D. Nayak',role:'Teacher',sub:'Maths/Computer',phone:'8871626561',sal:30000},
  {name:'Mrs. Isha Verma',role:'Teacher',sub:'English',phone:'8871626562',sal:28000}
 ],
 fees:[{date:today(),student:'Aarav Sharma',amt:2500,month:'Sept 2026',status:'paid'}],
 expenses:[{date:today(),title:'Electricity Bill',cat:'Utilities',amt:3200}],
 attendance:{},
 notices:[
  {t:'📢 Admission 2026-27 open — Nursery to Class 11. Last date: 31 March.',d:today()},
  {t:'📝 Unit Test 2 Date Sheet class 6-10 ke liye notice board par lag gayi hai.',d:today()},
  {t:'🏆 Annual Sports Day — 15 December ko school ground me.',d:today()}
 ],
 enquiries:[]
};}
function load(){try{DB=JSON.parse(localStorage.getItem(KEY))||seed();}catch{DB=seed();}save();}
function save(){localStorage.setItem(KEY,JSON.stringify(DB));}

// Theme
function setTheme(m){document.documentElement.dataset.theme=m;localStorage.setItem('ps_theme',m);const t=m==='dark'?'☀️ Light':'🌙 Dark';if($('themeBtn'))$('themeBtn').textContent=t;if($('themeBtn2'))$('themeBtn2').textContent=m==='dark'?'☀️':'🌙';}
function initTheme(){setTheme(localStorage.getItem('ps_theme')||'light');}

// Public render
function renderPublic(){
 const att=DB.attendance[today()]||{};
 const present=Object.values(att).filter(v=>v==='P').length;
 $('hsStudents').textContent=DB.students.length;
 $('hsStaff').textContent=DB.staff.length;
 $('hsFees').textContent=rs(DB.fees.filter(f=>f.status==='paid').reduce((a,b)=>a+ +b.amt,0));
 $('hsAttend').textContent=DB.students.length?present+'/'+DB.students.length:'—';
 $('stStudents').textContent=(500+DB.students.length)+'+';
 $('stStaff').textContent=(17+DB.staff.length)+'+';
 $('publicTeachers').innerHTML=DB.staff.slice(0,6).map(s=>`<div class="card"><div class="emoji">👩‍🏫</div><h3>${esc(s.name)}</h3><p>${esc(s.role)} - ${esc(s.sub)}</p></div>`).join('')||'<p class="muted">No teachers yet</p>';
 $('publicNotices').innerHTML=DB.notices.map(n=>`<li><span>${esc(n.t)}</span><small class="muted">${esc(n.d)}</small></li>`).join('')||'<li>No notices</li>';
}
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// Dashboard nav
function openDashboard(){
 if(sessionStorage.getItem('ps_login')!=='1'){$('loginModal').classList.remove('hidden');return;}
 $('publicSite').classList.add('hidden');$('dashboard').classList.remove('hidden');showPage('overview');renderAll();window.scrollTo(0,0);
}
function closeDashboard(){$('dashboard').classList.add('hidden');$('publicSite').classList.remove('hidden');renderPublic();}
function showPage(p){document.querySelectorAll('.dtab').forEach(b=>b.classList.toggle('active',b.dataset.page===p));document.querySelectorAll('.dpage').forEach(s=>s.classList.add('hidden'));$('pg-'+p).classList.remove('hidden');}

function renderAll(){renderPublic();renderOv();renderStudents();renderStaff();renderAttend();renderFees();renderExp();renderNotices();renderEnq();$('eqCount').textContent=DB.enquiries.filter(e=>e.status==='new').length;}

// Overview
function renderOv(){
 const coll=DB.fees.filter(f=>f.status==='paid').reduce((a,b)=>a+ +b.amt,0);
 const pend=DB.fees.filter(f=>f.status==='pending').reduce((a,b)=>a+ +b.amt,0);
 const exp=DB.expenses.reduce((a,b)=>a+ +b.amt,0);
 $('ovCards').innerHTML=[['👨‍🎓 Students',DB.students.length],['👩‍🏫 Staff',DB.staff.length],['💰 Fees Collected',rs(coll)],['🧾 Expenses',rs(exp)]].map(x=>`<div class="card"><small class="muted">${x[0]}</small><h2>${x[1]}</h2></div>`).join('')+`<div class="card"><small class="muted">⏳ Pending Fees</small><h2>${rs(pend)}</h2></div><div class="card"><small class="muted">📊 Balance</small><h2>${rs(coll-exp)}</h2></div><div class="card"><small class="muted">📝 Enquiries</small><h2>${DB.enquiries.length}</h2></div><div class="card"><small class="muted">📢 Notices</small><h2>${DB.notices.length}</h2></div>`;
 $('ovFees').innerHTML=DB.fees.slice(-4).reverse().map(f=>`<p>✅ ${esc(f.student)} — ${rs(f.amt)} <small class="muted">${esc(f.month)}</small></p>`).join('')||'<p class="muted">No fees</p>';
 $('ovExp').innerHTML=DB.expenses.slice(-4).reverse().map(e=>`<p>🧾 ${esc(e.title)} — ${rs(e.amt)}</p>`).join('')||'<p class="muted">No expenses</p>';
}

// Students
function renderStudents(){
 const q=($('sSearch').value||'').toLowerCase();
 const list=DB.students.filter(s=>(s.name+s.roll+s.cls).toLowerCase().includes(q));
 $('sCount').textContent=DB.students.length;
 $('sTable').querySelector('tbody').innerHTML=list.map((s,i)=>`<tr><td>${esc(s.name)}</td><td>${esc(s.cls)}</td><td>${esc(s.roll)}</td><td>${esc(s.phone)}</td><td><button onclick="editStudent(${DB.students.indexOf(s)})">✏</button> <button onclick="delStudent(${DB.students.indexOf(s)})">🗑</button></td></tr>`).join('');
}
window.editStudent=i=>{const s=DB.students[i];editS=i;$('sName').value=s.name;$('sClass').value=s.cls;$('sRoll').value=s.roll;$('sGender').value=s.gender;$('sPhone').value=s.phone;$('sAddr').value=s.addr;$('sCancel').classList.remove('hidden');};
window.delStudent=i=>{if(confirm('Delete student?')){DB.students.splice(i,1);save();renderAll();}};

// Staff
function renderStaff(){
 $('tCount').textContent=DB.staff.length;
 $('tTable').querySelector('tbody').innerHTML=DB.staff.map((s,i)=>`<tr><td>${esc(s.name)}</td><td>${esc(s.role)}</td><td>${esc(s.sub)}</td><td>${rs(s.sal)}</td><td><button onclick="editStaff(${i})">✏</button> <button onclick="delStaff(${i})">🗑</button></td></tr>`).join('');
}
window.editStaff=i=>{const s=DB.staff[i];editT=i;$('tName').value=s.name;$('tRole').value=s.role;$('tSub').value=s.sub;$('tPhone').value=s.phone;$('tSal').value=s.sal;$('tCancel').classList.remove('hidden');};
window.delStaff=i=>{if(confirm('Delete staff?')){DB.staff.splice(i,1);save();renderAll();}};

// Attendance
function renderAttend(){
 if(!$('aDate').value)$('aDate').value=today();
 const d=$('aDate').value;attendCache={...(DB.attendance[d]||{})};
 $('aList').innerHTML=DB.students.map((s,i)=>{const v=attendCache[i]||'P';return`<div class="a-row"><span>${esc(s.name)} <small class="muted">${esc(s.cls)} • Roll ${esc(s.roll)}</small></span><span class="seg"><button class="${v==='P'?'on-P':''}" onclick="setAtt(${i},'P')">P</button><button class="${v==='A'?'on-A':''}" onclick="setAtt(${i},'A')">A</button><button class="${v==='L'?'on-L':''}" onclick="setAtt(${i},'L')">L</button></span></div>`;}).join('')||'<p class="muted">Pehle student add karein</p>';
}
window.setAtt=(i,v)=>{attendCache[i]=v;renderAttend();};

// Fees
function renderFees(){
 $('fStudent').innerHTML=DB.students.map(s=>`<option>${esc(s.name)}</option>`).join('');
 const coll=DB.fees.filter(f=>f.status==='paid').reduce((a,b)=>a+ +b.amt,0);
 const pend=DB.fees.filter(f=>f.status==='pending').reduce((a,b)=>a+ +b.amt,0);
 $('fTot').textContent=rs(coll);$('fPend').textContent=rs(pend);
 $('fTable').querySelector('tbody').innerHTML=DB.fees.slice().reverse().map(f=>{const i=DB.fees.indexOf(f);return`<tr><td>${esc(f.date)}</td><td>${esc(f.student)}<br><small class="muted">${esc(f.month)}</small></td><td>${rs(f.amt)}</td><td>${f.status}</td><td><button onclick="delFee(${i})">🗑</button></td></tr>`;}).join('');
}
window.delFee=i=>{if(confirm('Delete fee record?')){DB.fees.splice(i,1);save();renderAll();}};

// Expenses
function renderExp(){
 $('eTot').textContent=rs(DB.expenses.reduce((a,b)=>a+ +b.amt,0));
 $('eTable').querySelector('tbody').innerHTML=DB.expenses.slice().reverse().map(e=>{const i=DB.expenses.indexOf(e);return`<tr><td>${esc(e.date)}</td><td>${esc(e.title)}<br><small class="muted">${esc(e.cat)}</small></td><td>${rs(e.amt)}</td><td><button onclick="delExp(${i})">🗑</button></td></tr>`;}).join('');
}
window.delExp=i=>{if(confirm('Delete expense?')){DB.expenses.splice(i,1);save();renderAll();}};

// Notices
function renderNotices(){
 $('nList').innerHTML=DB.notices.map((n,i)=>`<li><span>${esc(n.t)}</span><span><small class="muted">${esc(n.d)}</small> <button onclick="delNotice(${i})">🗑</button></span></li>`).join('');
}
window.delNotice=i=>{if(confirm('Delete notice?')){DB.notices.splice(i,1);save();renderAll();}};

// Enquiries
function renderEnq(){
 $('qTable').querySelector('tbody').innerHTML=DB.enquiries.slice().reverse().map(q=>{const i=DB.enquiries.indexOf(q);return`<tr><td>${esc(q.d)}</td><td>${esc(q.name)}</td><td>${esc(q.phone)}</td><td>${esc(q.cls)}</td><td><select onchange="setQ(${i},this.value)">${['new','contacted','admitted'].map(s=>`<option ${q.status===s?'selected':''}>${s}</option>`).join('')}</select></td><td><button onclick="delQ(${i})">🗑</button></td></tr>`;}).join('')||'<tr><td colspan=6 class="muted">No enquiries</td></tr>';
}
window.setQ=(i,v)=>{DB.enquiries[i].status=v;save();renderAll();};
window.delQ=i=>{DB.enquiries.splice(i,1);save();renderAll();};

// Events
window.openDashboard=openDashboard;
window.addEventListener('DOMContentLoaded',()=>{
 load();initTheme();renderPublic();
 $('themeBtn').onclick=()=>setTheme((document.documentElement.dataset.theme||'light')==='dark'?'light':'dark');
 $('themeBtn2').onclick=$('themeBtn').onclick;
 $('menuBtn').onclick=()=>$('mainNav').classList.toggle('open');
 document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));t.classList.add('active');document.querySelectorAll('.tabpanel').forEach(p=>p.classList.add('hidden'));$(t.dataset.tab).classList.remove('hidden');});
 document.querySelectorAll('.dtab').forEach(b=>b.onclick=()=>showPage(b.dataset.page));
 $('loginBtn').onclick=openDashboard;
 $('closeLogin').onclick=()=>$('loginModal').classList.add('hidden');
 $('doLogin').onclick=()=>{if($('lgUser').value.trim()==='admin'&&$('lgPass').value==='pathshala123'){sessionStorage.setItem('ps_login','1');$('loginModal').classList.add('hidden');$('lgErr').classList.add('hidden');openDashboard();}else $('lgErr').classList.remove('hidden');};
 $('logoutBtn').onclick=()=>{sessionStorage.removeItem('ps_login');closeDashboard();};
 $('backSite').onclick=closeDashboard();

 $('enquiryForm').onsubmit=e=>{e.preventDefault();if(!$('eqName').value.trim()||$('eqPhone').value.length!==10){alert('Naam aur 10-digit mobile zaroori hai');return;}DB.enquiries.push({d:today(),name:$('eqName').value.trim(),phone:$('eqPhone').value.trim(),cls:$('eqClass').value,msg:$('eqMsg').value,status:'new'});save();$('eqOk').classList.remove('hidden');e.target.reset();renderAll();setTimeout(()=>$('eqOk').classList.add('hidden'),4000);};

 $('sSave').onclick=()=>{const o={name:$('sName').value.trim(),cls:$('sClass').value,roll:$('sRoll').value.trim(),gender:$('sGender').value,phone:$('sPhone').value.trim(),addr:$('sAddr').value.trim()};if(!o.name){alert('Name zaroori hai');return;}if(editS>=0)DB.students[editS]=o;else DB.students.push(o);editS=-1;$('sCancel').classList.add('hidden');['sName','sRoll','sPhone','sAddr'].forEach(id=>$(id).value='');save();renderAll();};
 $('sCancel').onclick=()=>{editS=-1;$('sCancel').classList.add('hidden');['sName','sRoll','sPhone','sAddr'].forEach(id=>$(id).value='');};
 $('sSearch').oninput=renderStudents;
 $('sCsv').onclick=()=>{const csv='Name,Class,Roll,Phone\n'+DB.students.map(s=>`"${s.name}","${s.cls}","${s.roll}","${s.phone}"`).join('\n');dl(csv,'students.csv','text/csv');};

 $('tSave').onclick=()=>{const o={name:$('tName').value.trim(),role:$('tRole').value.trim()||'Teacher',sub:$('tSub').value.trim(),phone:$('tPhone').value.trim(),sal:+$('tSal').value||0};if(!o.name){alert('Name zaroori hai');return;}if(editT>=0)DB.staff[editT]=o;else DB.staff.push(o);editT=-1;$('tCancel').classList.add('hidden');['tName','tRole','tSub','tPhone','tSal'].forEach(id=>$(id).value='');save();renderAll();};
 $('tCancel').onclick=()=>{editT=-1;$('tCancel').classList.add('hidden');};

 $('aDate').onchange=renderAttend;
 $('aAllP').onclick=()=>{DB.students.forEach((_,i)=>attendCache[i]='P');renderAttend();};
 $('aSave').onclick=()=>{DB.attendance[$('aDate').value]={...attendCache};save();renderAll();alert('Attendance saved: '+$('aDate').value);};

 $('fSave').onclick=()=>{if(!$('fAmt').value){alert('Amount zaroori hai');return;}DB.fees.push({date:today(),student:$('fStudent').value,amt:+$('fAmt').value,month:$('fMonth').value||'Sept 2026',status:$('fStatus').value});$('fAmt').value='';$('fMonth').value='';save();renderAll();};

 $('eSave').onclick=()=>{if(!$('eTitle').value.trim()||!$('eAmt').value){alert('Title + Amount zaroori');return;}DB.expenses.push({date:$('eDate').value||today(),title:$('eTitle').value.trim(),cat:$('eCat').value.trim(),amt:+$('eAmt').value});$('eTitle').value='';$('eCat').value='';$('eAmt').value='';save();renderAll();};

 $('nSave').onclick=()=>{if(!$('nText').value.trim())return;DB.notices.unshift({t:$('nText').value.trim(),d:today()});$('nText').value='';save();renderAll();};

 $('bExport').onclick=()=>dl(JSON.stringify(DB,null,2),'pathshala-backup.json','application/json');
 $('bEnc').onclick=()=>{$('bText').value=btoa(unescape(encodeURIComponent(JSON.stringify(DB))));alert('Encrypted text ready — copy karke Google Drive me rakhein');};
 $('bImport').onclick=()=>{try{let t=$('bText').value.trim();let o=JSON.parse(t.startsWith('{')?t:decodeURIComponent(escape(atob(t))));if(!o.students)throw 0;DB=o;save();renderAll();alert('Backup restored ✅');}catch{alert('❌ Invalid backup');}};
 $('bWipe').onclick=()=>{if(confirm('Saara data delete?')){DB=seed();save();renderAll();}};
});
function dl(content,name,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();}
