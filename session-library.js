const exercises = {
 football: {
  eyebrow:"BALL CONTROL & TECHNIQUE",
  title:"Football Skills",
  description:"Build confident control and accurate technique.",
  emoji:"⚽",
  level:"Beginner",
  duration:"24 min",
  items:[
   ["Ball mastery","⚽","ball","8–12 min","Easy","Practise toe taps, inside touches and gentle sole rolls. Keep the ball close."],
   ["Passing & first touch","👟","float","8–12 min","Easy","Pass against a wall or with a partner. Receive calmly and look up before passing."],
   ["Dribbling","🏃","run","8–12 min","Easy–moderate","Use a few cones or markers. Change direction with control and use both feet."]
  ]
 },
 strength:{
  eyebrow:"CONTROL & COORDINATION",
  title:"Strength & Athleticism",
  description:"Build basic movement control with comfortable technique.",
  emoji:"💪",
  level:"Beginner",
  duration:"10–15 min",
  items:[
   ["Glute bridge","🧍","strength","2 sets · 8 reps","Easy","Lie comfortably, bend knees and lift hips gently. Stop if uncomfortable."],
   ["Bird dog","🐕","float","2 sets · 6 each side","Easy","From hands and knees, extend opposite arm and leg while keeping balance."],
   ["Calf raises","🦶","strength","2 sets · 8 reps","Easy","Hold a stable support and rise slowly onto your toes, then lower with control."]
  ]
 },
 mobility:{
  eyebrow:"MOVEMENT & RECOVERY",
  title:"Mobility & Reset",
  description:"Move gently and recover without forcing a stretch.",
  emoji:"🧘",
  level:"Gentle",
  duration:"7–10 min",
  items:[
   ["Ankle mobility","🦶","stretch","1–2 min","Gentle","Move each ankle through a comfortable range without forcing it."],
   ["Hip mobility","🧘","stretch","1–2 min","Gentle","Use slow, comfortable hip movements. Avoid bouncing or forcing range."],
   ["Easy cool-down","🌿","float","5–8 min","Gentle","Walk easily, breathe calmly and use comfortable stretches after activity."]
  ]
 }
};

const storageKey="shanu-session-checklist-v1";
let completed={};
try { completed=JSON.parse(localStorage.getItem(storageKey)||"{}")||{}; }
catch { completed={}; }

let category="football";
let currentIndex=0;
let seconds=45;
let timer=null;
let running=false;
let coach="animated";

const $=id=>document.getElementById(id);
const cards=$("exerciseCards");
const data=()=>exercises[category];

function saveCompleted(){
 localStorage.setItem(storageKey,JSON.stringify(completed));
}

function updateProgress(){
 const total=Object.values(exercises).reduce((n,c)=>n+c.items.length,0);
 const count=Object.values(completed).filter(Boolean).length;
 $("progressText").textContent=`${count} / ${total} completed`;
 $("progressBar").style.width=`${count/total*100}%`;
}

function render(){
 const d=data();
 $("categoryEyebrow").textContent=d.eyebrow;
 $("categoryTitle").textContent=d.title;
 $("categoryDescription").textContent=d.description;
 $("heroEmoji").textContent=d.emoji;
 $("difficultyText").textContent=d.level;
 $("durationText").textContent=d.duration;
 $("exerciseCount").textContent=d.items.length;
 $("listCount").textContent=`0${d.items.length} MOVEMENTS`;
 cards.replaceChildren();

 d.items.forEach((item,index)=>{
  const [name,emoji,motion,duration,difficulty,description]=item;
  const id=`${category}-${index}`;

  const article=document.createElement("article");
  article.className="exercise-card";

  const thumb=document.createElement("div");
  thumb.className="exercise-thumb";
  thumb.textContent=emoji;

  const info=document.createElement("div");
  info.className="exercise-info";

  const title=document.createElement("h3");
  title.textContent=`${String(index+1).padStart(2,"0")} · ${name}`;

  const detail=document.createElement("p");
  detail.textContent=description;

  const meta=document.createElement("div");
  meta.className="exercise-meta";
  meta.textContent=`${duration} · ${difficulty}`;

  info.append(title,detail,meta);

  const label=document.createElement("label");
  label.className="exercise-check";

  const input=document.createElement("input");
  input.type="checkbox";
  input.checked=!!completed[id];
  input.addEventListener("change",()=>{
   completed[id]=input.checked;
   saveCompleted();
   updateProgress();
  });

  const labelText=document.createElement("span");
  labelText.textContent="Completed";
  label.append(input,labelText);

  article.append(thumb,info,label);
  cards.append(article);
 });
 updateProgress();
}

document.querySelectorAll("[data-category]").forEach(button=>{
 button.addEventListener("click",()=>{
  stopTimer();
  category=button.dataset.category;
  document.querySelectorAll("[data-category]").forEach(b=>
   b.classList.toggle("active",b===button));
  render();
 });
});

$("resetChecklist").addEventListener("click",()=>{
 if(!confirm("Reset all exercise checkmarks on this device?")) return;
 completed={};
 localStorage.removeItem(storageKey);
 render();
});

function openPlayer(){
 currentIndex=0;
 $("overviewScreen").hidden=true;
 $("playerScreen").hidden=false;
 showExercise();
 window.scrollTo({top:0,behavior:"smooth"});
}

function showExercise(){
 stopTimer();
 const item=data().items[currentIndex];
 $("playerEmoji").textContent=item[1];
 $("playerTitle").textContent=item[0];
 $("playerDescription").textContent=item[5];
 $("playerStep").textContent=`EXERCISE ${currentIndex+1} OF ${data().items.length}`;
 const percent=(currentIndex/data().items.length)*100;
 $("playerPercent").textContent=`${Math.round(percent)}%`;
 $("playerProgressBar").style.width=`${percent}%`;
 seconds=45;
 updateTimer();
 $("playPause").textContent="▶ Start";
 $("previousExercise").disabled=currentIndex===0;
 $("nextExercise").textContent=currentIndex===data().items.length-1?"Finish ✓":"Next →";
}

function updateTimer(){
 const mins=Math.floor(seconds/60);
 const secs=seconds%60;
 $("timerDisplay").textContent=
  `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
}

function stopTimer(){
 if(timer) clearInterval(timer);
 timer=null;
 running=false;
}

function toggleTimer(){
 if(running){
  stopTimer();
  $("playPause").textContent="▶ Resume";
  return;
 }
 running=true;
 $("playPause").textContent="Ⅱ Pause";
 timer=setInterval(()=>{
  if(seconds>0){
   seconds--;
   updateTimer();
  }else{
   stopTimer();
   $("playPause").textContent="↻ Restart";
  }
 },1000);
}

$("startWorkout").addEventListener("click",openPlayer);
$("playPause").addEventListener("click",()=>{
 if(seconds===0){
  seconds=45;
  updateTimer();
 }
 toggleTimer();
});

$("nextExercise").addEventListener("click",()=>{
 stopTimer();
 if(currentIndex===data().items.length-1){
  data().items.forEach((item,index)=>{
   completed[`${category}-${index}`]=true;
  });
  saveCompleted();
  updateProgress();
  $("playerScreen").hidden=true;
  $("overviewScreen").hidden=false;
  render();
  window.scrollTo({top:0,behavior:"smooth"});
  return;
 }
 currentIndex++;
 showExercise();
});

$("previousExercise").addEventListener("click",()=>{
 if(currentIndex>0){
  currentIndex--;
  showExercise();
 }
});

$("backToOverview").addEventListener("click",()=>{
 stopTimer();
 $("playerScreen").hidden=true;
 $("overviewScreen").hidden=false;
 window.scrollTo({top:0,behavior:"smooth"});
});

$("openSettings").addEventListener("click",()=>{
 $("settingsModal").hidden=false;
});

$("closeSettings").addEventListener("click",()=>{
 $("settingsModal").hidden=true;
});

$("settingsModal").addEventListener("click",e=>{
 if(e.target===$("settingsModal")) $("settingsModal").hidden=true;
});

document.querySelectorAll("[data-coach]").forEach(button=>{
 button.addEventListener("click",()=>{
  coach=button.dataset.coach;
  document.querySelectorAll("[data-coach]").forEach(b=>
   b.classList.toggle("selected",b===button));
 });
});

$("saveSettings").addEventListener("click",()=>{
 localStorage.setItem("shanu-workout-coach",coach);
 $("settingsModal").hidden=true;
});

try {
 const savedCoach=localStorage.getItem("shanu-workout-coach");
 if(savedCoach==="real"||savedCoach==="animated") coach=savedCoach;
 document.querySelectorAll("[data-coach]").forEach(b=>
  b.classList.toggle("selected",b.dataset.coach===coach));
} catch {}

render();
</script>
