import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const $=s=>document.querySelector(s);
const today=new Date();
$('#todayLabel').textContent=today.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'}).toUpperCase();
$('#datePill').textContent=today.toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
// Decorative Three.js football; the rest of the app works if WebGL is unavailable.
try{
 const host=$('#ball3d'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(260,260);host.appendChild(renderer.domElement);
 const ball=new THREE.Group();scene.add(ball);
 const geo=new THREE.IcosahedronGeometry(1,2);
 const mat=new THREE.MeshStandardMaterial({color:0xf2f4e9,roughness:.78,flatShading:true});
 const mesh=new THREE.Mesh(geo,mat);ball.add(mesh);
 const wire=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.003,1)),new THREE.LineBasicMaterial({color:0x183e2a,transparent:true,opacity:.9}));ball.add(wire);
 scene.add(new THREE.HemisphereLight(0xffffff,0x254532,2));
 const light=new THREE.DirectionalLight(0xc7f36b,3);light.position.set(3,4,5);scene.add(light);
 camera.position.z=4;
 function animate(){requestAnimationFrame(animate);ball.rotation.y+=.006;ball.rotation.x=Math.sin(Date.now()*.0005)*.08;renderer.render(scene,camera)}animate();
}catch(e){$('#ball3d').textContent='⚽'}

const routines={
 growth:{title:'Growth & recovery habits',tag:'DAILY FOUNDATION',items:[
 ['Sleep routine','Aim for 8–10 hours each night. Keep a steady bedtime and wake time.','EVERY DAY'],
 ['Balanced breakfast','Include an energy food, protein source and fruit/vegetables where available.','DAILY'],
 ['Hydration','Drink water regularly, especially around football sessions.','THROUGH THE DAY'],
 ['Fuel after training','Have a meal or snack with carbohydrates and protein after practice.','AFTER TRAINING'],
 ['Recovery check','Notice unusual pain, illness or persistent tiredness and tell a parent/coach.','DAILY'],
 ['Healthy growth','Height is influenced mainly by genetics and development. No exercise or food guarantees extra height.','REMEMBER']
 ]},
 performance:{title:'Football performance menu',tag:'ONLY WHEN RECOVERED',items:[
 ['Dynamic warm-up','5–10 minutes: easy jog, arm swings, leg swings, ankle bounces and gradual movement.','5–10 MIN • EASY → MODERATE'],
 ['Acceleration technique','With coach supervision: short, controlled accelerations focusing on posture and relaxed arms. Stop before form breaks.','4–6 SHORT REPS • FULL REST'],
 ['Ball mastery','Toe taps, inside-inside touches, sole rolls and close-control dribbling. Use both feet.','8–12 MIN'],
 ['Passing & first touch','Wall passes or partner passing: receive across your body, scan, then pass accurately.','8–12 MIN'],
 ['Strength basics','Technique-first squats, glute bridges, calf raises and incline push-ups. No max lifts or training to failure.','2 SETS • 8–12 EACH'],
 ['Core & balance','Dead bug, bird dog and side plank from knees. Keep breathing and maintain control.','2 ROUNDS • EASY'],
 ['Cool-down','Walk slowly, breathe calmly and do comfortable stretches. Refuel and drink water.','5–8 MIN']
 ]},
 mobility:{title:'Gentle mobility & reset',tag:'LIGHT / RECOVERY DAY',items:[
 ['Easy walk','Walk at a comfortable pace and breathe easily.','5–10 MIN'],
 ['Ankle rocks','Keep heel down and gently move knee forward over toes.','8 EACH SIDE'],
 ['Hip circles','Make small, controlled circles with your hips or knees.','6 EACH WAY'],
 ['Leg swings','Hold support; swing gently forward/back without forcing range.','8 EACH LEG'],
 ['Hamstring mobility','Lie on your back and gently straighten one leg until you feel a mild stretch.','15–20 SEC EACH'],
 ['Upper-back rotations','On hands and knees, rotate gently and follow your hand with your eyes.','6 EACH SIDE'],
 ['Relaxed breathing','Breathe slowly and let your shoulders relax.','1–2 MIN']
 ]}
};
function showMode(mode){const r=routines[mode];$('#detailTitle').textContent=r.title;$('#detailTag').textContent=r.tag;$('#exerciseList').innerHTML=r.items.map((x,i)=>`<article class="exercise"><h4>${String(i+1).padStart(2,'0')} · ${x[0]}</h4><p>${x[1]}</p><span class="dose">${x[2]}</span></article>`).join('');$('#detailPanel').scrollIntoView({behavior:'smooth',block:'start'})}
document.querySelectorAll('.mode-open').forEach(b=>b.addEventListener('click',()=>showMode(b.dataset.mode)));
$('#recommendBtn').addEventListener('click',()=>{
 const e=$('#energy').value,l=$('#load').value,t=$('#todayLoad').value,b=$('#body').value;
 let mode='performance',title='SECTION 2 — Football performance',desc='You report feeling fresh. Keep the session age-appropriate, technique-focused and coordinated with your coach.';
 if(b==='pain'||e==='low'){mode='mobility';title='REST / SECTION 3 — Gentle reset only';desc='Skip hard training today. If pain is significant, worsening or unusual, tell a parent/guardian and coach; get medical advice when needed.'}
 else if(e==='medium'||b==='sore'||l==='hard'){mode='mobility';title='SECTION 3 — Mobility & recovery';desc='Today is better for gentle mobility and recovery. If you also have practice, tell your coach how you feel and follow their adjusted plan.'}
 else if(t==='practice'||t==='match'){mode='growth';title='SECTION 1 — Fuel, prepare & recover';desc='Your football session is the main physical load today. Do the coach-led warm-up and practice; skip an extra hard workout.'}
 else if(l==='normal'){mode='mobility';title='SECTION 3 — Light recovery';desc='You trained yesterday. Choose easy mobility or rest rather than stacking another demanding session.'}
 $('#recommendation').innerHTML=`<span class="rec-icon">◎</span><div><b>${title}</b><p>${desc}</p><button class="text-btn" id="openRecommended">OPEN THIS PLAN →</button></div>`;
 $('#openRecommended').addEventListener('click',()=>showMode(mode));
});
const goals=['Sleep routine protected','Drink water regularly','Eat balanced meals and refuel','Football skill / coach session (or recovery day)','Mobility or cool-down if appropriate','Reflect: one win + one thing to improve'];
const goalKey='shanu-goals-'+today.toISOString().slice(0,10);
let checked=JSON.parse(localStorage.getItem(goalKey)||'[]');
function renderGoals(){$('#goalList').innerHTML=goals.map((g,i)=>`<label class="goal-item"><input type="checkbox" data-i="${i}" ${checked.includes(i)?'checked':''}>${g}</label>`).join('');$('#goalCount').textContent=`${checked.length} / ${goals.length} complete` ;$('#progressBar').style.width=(checked.length/goals.length*100)+'%';document.querySelectorAll('#goalList input').forEach(c=>c.addEventListener('change',()=>{const i=+c.dataset.i;checked=c.checked?[...checked,i]:checked.filter(x=>x!==i);localStorage.setItem(goalKey,JSON.stringify(checked));renderGoals()}))}
renderGoals();
$('#resetGoals').addEventListener('click',()=>{checked=[];localStorage.removeItem(goalKey);renderGoals()});
$('#themeBtn').addEventListener('click',()=>document.body.classList.toggle('bright'));
const REM='shanu-reminder';
function loadReminder(){const v=JSON.parse(localStorage.getItem(REM)||'{}');if(v.time)$('#reminderTime').value=v.time;$('#reminderOn').checked=!!v.on;$('#reminderStatus').textContent=v.on?`Daily reminder set for ${v.time}. Keep this page open for the in-page reminder.`:'No reminder scheduled.'}
loadReminder();
$('#notifyPermission').addEventListener('click',async()=>{if(!('Notification'in window)){alert('Notifications are not supported in this browser.');return}const p=await Notification.requestPermission();$('#reminderStatus').textContent='Notification permission: '+p});
$('#saveReminder').addEventListener('click',()=>{const v={time:$('#reminderTime').value,on:$('#reminderOn').checked};localStorage.setItem(REM,JSON.stringify(v));$('#reminderStatus').textContent=v.on?`Reminder saved for ${v.time}. Keep this page open; browser background limits vary.`:'Reminder turned off.'});
let lastReminder='';
setInterval(()=>{const v=JSON.parse(localStorage.getItem(REM)||'{}');if(!v.on)return;const now=new Date(),hm=now.toTimeString().slice(0,5),key=now.toDateString()+hm;if(hm===v.time&&lastReminder!==key){lastReminder=key;const msg='Shanu: check your recovery, hydrate and prepare calmly for tomorrow.';if('Notification'in window&&Notification.permission==='granted')new Notification('Shanu Football OS',{body:msg});else alert(msg)}},20000);
$('#closeDialog').addEventListener('click',()=>$('#infoDialog').close());
if('serviceWorker'in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
