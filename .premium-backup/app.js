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


// PLAYER PROFILE OS
const profileForm = document.getElementById('profileForm');

if (profileForm) {
  const fields = {
    name: document.getElementById('playerName'),
    position: document.getElementById('playerPosition'),
    foot: document.getElementById('playerFoot'),
    ambition: document.getElementById('playerAmbition')
  };

  const status = document.getElementById('profileStatus');
  const summary = document.getElementById('profileSummary');

  function updateSummary() {
    summary.textContent = `${fields.position.value} • ${fields.foot.value}`;
  }

  try {
    const saved = JSON.parse(
      localStorage.getItem('shanu-player-profile') || 'null'
    );

    if (saved) {
      fields.name.value = saved.name || '';
      fields.position.value = saved.position || 'Winger';
      fields.foot.value = saved.foot || 'Both feet';
      fields.ambition.value = saved.ambition || 'Professional footballer';
      status.textContent = 'Saved profile loaded.';
    }
  } catch {
    status.textContent = 'Could not load saved profile.';
  }

  updateSummary();

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const profile = {
      name: fields.name.value.trim(),
      position: fields.position.value,
      foot: fields.foot.value,
      ambition: fields.ambition.value.trim()
    };

    try {
      localStorage.setItem('shanu-player-profile', JSON.stringify(profile));
      updateSummary();
      status.textContent = 'Player profile saved successfully.';
    } catch {
      status.textContent = 'Could not save. Check browser storage.';
    }
  });

  fields.position.addEventListener('change', updateSummary);
  fields.foot.addEventListener('change', updateSummary);
}


// FIREBASE CLOUD TRAINING
(async function initFirebaseCloudTraining() {
  const status = document.getElementById('cloudStatus');
  const login = document.getElementById('googleLogin');
  const logout = document.getElementById('googleLogout');
  const account = document.getElementById('cloudAccount');
  const area = document.getElementById('cloudLogArea');
  const form = document.getElementById('cloudLogForm');
  const list = document.getElementById('cloudLogList');

  if (!status || !login || !form || !list) return;

  const firebaseConfig = {
    apiKey: "AIzaSyAXrVX1iW1xwGvEJ7yVovmkrXrs0Xq6MEU",
    authDomain: "shanu-football-os.firebaseapp.com",
    projectId: "shanu-football-os",
    storageBucket: "shanu-football-os.firebasestorage.app",
    messagingSenderId: "733802067399",
    appId: "1:733802067399:web:d72c5f5b3cc861c7cc15e2",
    measurementId: "G-H8HG7JBXBV"
  };

  let unsubscribeLogs = null;
  let currentUser = null;

  try {
    const appSdk = await import(
      'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'
    );
    const authSdk = await import(
      'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js'
    );
    const dbSdk = await import(
      'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'
    );

    const app = appSdk.initializeApp(firebaseConfig);
    const auth = authSdk.getAuth(app);
    const db = dbSdk.getFirestore(app);
    const provider = new authSdk.GoogleAuthProvider();

    login.addEventListener('click', async () => {
      try {
        status.textContent = 'Opening Google sign-in...';
        await authSdk.signInWithPopup(auth, provider);
      } catch (error) {
        console.error(error);
        status.textContent = 'Google sign-in failed: ' + error.message;
      }
    });

    logout.addEventListener('click', async () => {
      try {
        await authSdk.signOut(auth);
      } catch (error) {
        status.textContent = 'Sign-out failed: ' + error.message;
      }
    });

    authSdk.onAuthStateChanged(auth, (user) => {
      currentUser = user;

      if (unsubscribeLogs) {
        unsubscribeLogs();
        unsubscribeLogs = null;
      }

      if (!user) {
        login.hidden = false;
        logout.hidden = true;
        area.hidden = true;
        account.textContent = '';
        list.replaceChildren();
        status.textContent = 'Sign in with Google to access your cloud training log.';
        return;
      }

      login.hidden = true;
      logout.hidden = false;
      area.hidden = false;
      account.textContent = 'Signed in: ' + (user.email || 'Google account');
      status.textContent = 'Connected. Your training logs sync automatically.';

      const logsRef = dbSdk.collection(
        db, 'users', user.uid, 'trainingLogs'
      );
      const logsQuery = dbSdk.query(
        logsRef,
        dbSdk.orderBy('createdAt', 'desc')
      );

      unsubscribeLogs = dbSdk.onSnapshot(logsQuery, (snapshot) => {
        list.replaceChildren();

        if (snapshot.empty) {
          list.textContent = 'No training logs yet. Add your first session above.';
          return;
        }

        snapshot.forEach((documentSnapshot) => {
          const data = documentSnapshot.data();
          const card = document.createElement('article');
          card.className = 'cloud-log-item';

          const heading = document.createElement('h4');
          heading.textContent = data.activity || 'Training';

          const details = document.createElement('p');
          details.textContent =
            `${data.date || ''} • ${data.minutes || 0} minutes`;

          const notes = document.createElement('p');
          notes.textContent = data.notes || '';

          const remove = document.createElement('button');
          remove.type = 'button';
          remove.textContent = 'Delete log';
          remove.addEventListener('click', async () => {
            if (!currentUser || currentUser.uid !== user.uid) return;
            if (!confirm('Delete this training log?')) return;

            try {
              await dbSdk.deleteDoc(
                dbSdk.doc(db, 'users', user.uid, 'trainingLogs',
                  documentSnapshot.id)
              );
            } catch (error) {
              status.textContent = 'Could not delete log: ' + error.message;
            }
          });

          card.append(heading, details);
          if (data.notes) card.append(notes);
          card.append(remove);
          list.append(card);
        });
      }, (error) => {
        console.error(error);
        status.textContent = 'Could not load logs: ' + error.message;
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (!currentUser) {
        status.textContent = 'Please sign in first.';
        return;
      }

      const user = currentUser;
      const saveButton = document.getElementById('saveCloudLog');
      saveButton.disabled = true;

      try {
        const minutes = Number(document.getElementById('logMinutes').value);

        if (!Number.isInteger(minutes) || minutes < 1 || minutes > 300) {
          throw new Error('Enter a duration from 1 to 300 minutes.');
        }

        await dbSdk.addDoc(
          dbSdk.collection(db, 'users', user.uid, 'trainingLogs'),
          {
            date: document.getElementById('logDate').value,
            activity: document.getElementById('logActivity').value,
            minutes,
            notes: document.getElementById('logNotes').value.trim(),
            createdAt: dbSdk.serverTimestamp()
          }
        );

        form.reset();
        document.getElementById('logDate').value =
          new Date().toLocaleDateString('en-CA');
        status.textContent = 'Training log saved to your cloud account!';
      } catch (error) {
        console.error(error);
        status.textContent = 'Could not save: ' + error.message;
      } finally {
        saveButton.disabled = false;
      }
    });

    document.getElementById('logDate').value =
      new Date().toLocaleDateString('en-CA');

  } catch (error) {
    console.error('Firebase setup error:', error);
    status.textContent =
      'Firebase could not start. Check your connection and browser console.';
  }
})();
