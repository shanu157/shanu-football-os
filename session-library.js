const VIDEO={
 ball:"https://players.brightcove.net/5561472251001/default_default/index.html?videoId=6352097874112",
 running:"https://players.brightcove.net/5561472251001/default_default/index.html?videoId=6352096939112",
 dribbling:"https://players.brightcove.net/5561472251001/default_default/index.html?videoId=6352096419112",
 first:"https://players.brightcove.net/5561472251001/default_default/index.html?videoId=6352096238112"
};

const officialLinks={
 ball:"https://footballaustralia.com.au/video/core-skills-ball-mastery",
 running:"https://footballaustralia.com.au/video/core-skills-running-ball",
 dribbling:"https://footballaustralia.com.au/video/core-skills-dribbling",
 first:"https://footballaustralia.com.au/video/core-skills-first-touch"
};

const library={
 football:{
  eyebrow:"BALL CONTROL & TECHNIQUE",title:"Football skills",
  items:[
   {id:"ball",name:"Ball mastery",meta:"TECHNIQUE · 5 MIN",duration:30,reps:20,video:VIDEO.ball,source:officialLinks.ball,description:"Practise gentle, controlled touches with both feet. Keep the ball close and work at a comfortable pace.",cues:["Stay balanced and relaxed.","Use both feet.","Keep touches controlled."],mistakes:"Avoid rushing or looking down continuously."},
   {id:"running",name:"Running with the ball",meta:"BALL CARRYING · 5 MIN",duration:30,reps:10,video:VIDEO.running,source:officialLinks.running,description:"Move into open space while keeping the ball within comfortable playing distance.",cues:["Look up between touches.","Use space in front of you.","Keep the ball under control."],mistakes:"Do not kick the ball too far ahead."},
   {id:"dribbling",name:"Dribbling",meta:"CONTROL · 5 MIN",duration:30,reps:10,video:VIDEO.dribbling,source:officialLinks.dribbling,description:"Practise changing direction around a few safe markers with controlled touches.",cues:["Use inside and outside of both feet.","Change direction smoothly.","Leave enough space around you."],mistakes:"Avoid sharp turns at a speed you cannot control."},
   {id:"first",name:"First touch",meta:"RECEIVING · 5 MIN",duration:30,reps:10,video:VIDEO.first,source:officialLinks.first,description:"Receive a gentle pass and guide the ball into space for your next action.",cues:["Watch the ball arrive.","Relax the receiving foot.","Move the ball into useful space."],mistakes:"Avoid letting the ball get too far away."}
  ]
 },
 strength:{
  eyebrow:"CONTROL & COORDINATION",title:"Strength & coordination",
  items:[
   {id:"bridge",name:"Glute bridge",meta:"BODY CONTROL · 2 SETS",duration:30,reps:8,description:"Lie comfortably with knees bent and feet supported. Lift hips gently, then lower with control.",cues:["Keep movement comfortable.","Move smoothly.","Breathe normally."],mistakes:"Do not force the movement or arch excessively."},
   {id:"bird",name:"Bird dog",meta:"BALANCE · 2 SETS",duration:30,reps:6,description:"From hands and knees, reach opposite arm and leg while keeping your balance.",cues:["Move slowly.","Keep your back comfortable.","Use a stable surface."],mistakes:"Avoid twisting or rushing."},
   {id:"calf",name:"Calf raises",meta:"COORDINATION · 2 SETS",duration:30,reps:8,description:"Hold a stable support and rise gently onto your toes, then lower slowly.",cues:["Use a comfortable range.","Keep balance.","Lower with control."],mistakes:"Do not bounce or force the range."}
  ]
 },
 mobility:{
  eyebrow:"MOVEMENT & RESET",title:"Mobility & recovery",
  items:[
   {id:"ankle",name:"Ankle mobility",meta:"GENTLE MOVEMENT · 1 MIN",duration:30,reps:8,description:"Move each ankle through a comfortable range without forcing the movement.",cues:["Move gently.","Keep the movement smooth.","Switch sides."],mistakes:"Do not force a stretch."},
   {id:"hip",name:"Hip mobility",meta:"GENTLE MOVEMENT · 1 MIN",duration:30,reps:8,description:"Use slow and comfortable hip movements. Keep the range easy.",cues:["Move slowly.","Stay relaxed.","Stop if uncomfortable."],mistakes:"Avoid bouncing or forcing range."},
   {id:"cool",name:"Easy cool-down",meta:"RESET · 3 MIN",duration:60,reps:1,description:"Walk easily, breathe calmly and let your body settle after activity.",cues:["Keep it easy.","Breathe normally.","Drink water when needed."],mistakes:"Do not turn a cool-down into another hard session."}
  ]
 },
 speed:{
  eyebrow:"MOVEMENT & BALANCE",title:"Movement & agility",
  items:[
   {id:"prep",name:"Movement preparation",meta:"WARM-UP · 2 MIN",duration:30,reps:1,description:"Begin with comfortable walking and gentle movement before football practice.",cues:["Start easily.","Use a clear space.","Build up gradually."],mistakes:"Do not start with sudden intense movement."},
   {id:"balance",name:"Balance practice",meta:"CONTROL · 2 MIN",duration:30,reps:6,description:"Practise standing balance on each side near a stable support.",cues:["Keep your eyes forward.","Stay near support.","Switch sides."],mistakes:"Do not close your eyes or use an unstable surface."},
   {id:"change",name:"Controlled direction changes",meta:"FOOTWORK · 3 MIN",duration:30,reps:6,description:"Walk through a simple marker route, changing direction smoothly.",cues:["Use a clear area.","Keep steps controlled.","Take enough space."],mistakes:"Avoid sudden turns at an unsafe speed."}
  ]
 }
};

const params=new URLSearchParams(location.search);
let category=params.get("focus")||"football";
if(category==="dribbling"||category==="passing")category="football";
if(!library[category])category="football";

let selected=0;
let mode="time";
let timerValue=30;
let timer=null;
let restValue=30;
let restTimer=null;
let completed=JSON.parse(localStorage.getItem("shanu-session-v2")||"{}");

const $=id=>document.getElementById(id);
const cards=$("exerciseCards");

function currentItems(){return library[category].items}
function updateProgress(){
 const all=Object.values(library).flatMap(x=>x.items);
 const count=all.filter(x=>completed[x.id]).length;
 $("progressText").textContent=`${count} / ${all.length} completed`;
 $("progressBar").style.width=`${count/all.length*100}%`;
}

function renderCards(){
 const data=library[category];
 $("categoryEyebrow").textContent=data.eyebrow;
 $("categoryTitle").textContent=data.title;
 $("exerciseCount").textContent=`${data.items.length} EXERCISES`;
 cards.replaceChildren();
 data.items.forEach((item,index)=>{
  const article=document.createElement("article");
  article.className="exercise-card"+(index===selected?" selected":"");
  const meta=document.createElement("div");
  meta.className="exercise-meta";meta.textContent=item.meta;
  const title=document.createElement("h3");title.textContent=`${String(index+1).padStart(2,"0")} · ${item.name}`;
  const desc=document.createElement("p");desc.textContent=item.description;
  const button=document.createElement("button");button.type="button";
  button.textContent=completed[item.id]?"COMPLETED ✓":"OPEN EXERCISE →";
  button.addEventListener("click",()=>selectExercise(index));
  article.addEventListener("click",()=>selectExercise(index));
  article.append(meta,title,desc,button);
  cards.append(article);
 });
 updateProgress();
}

function selectExercise(index){
 selected=index;
 renderCards();
 const item=currentItems()[selected];
 $("detailTitle").textContent=item.name;
 $("detailInstructions").textContent=item.description;
 $("targetValue").textContent=mode==="time"?`${item.duration} SEC`:`${item.reps} REPS`;
 $("timerDisplay").textContent=mode==="time"?formatTime(item.duration):String(item.reps);
 $("targetLabel").textContent=mode==="time"?"DURATION":"TARGET REPS";
 $("timerStart").textContent="START";
 stopTimer();
 timerValue=item.duration;
 if(item.video){
  const frame=document.createElement("iframe");
  frame.src=item.video;
  frame.title=item.name+" demonstration";
  frame.allow="autoplay; encrypted-media; picture-in-picture";
  frame.allowFullscreen=true;
  $("videoStage").replaceChildren(frame);
  const link=document.createElement("a");
  link.href=item.source;link.target="_blank";link.rel="noopener";
  link.textContent="VIEW ORIGINAL FOOTBALL AUSTRALIA VIDEO ↗";
  $("videoCredit").replaceChildren(link);
 }else{
  const placeholder=document.createElement("div");
  placeholder.className="sl-video-placeholder";
  const icon=document.createElement("span");icon.textContent="▶";
  const strong=document.createElement("strong");strong.textContent="COACHING NOTES";
  const p=document.createElement("p");p.textContent="This exercise currently uses written guidance. A verified demonstration video can be added when a suitable source is available.";
  placeholder.append(icon,strong,p);
  $("videoStage").replaceChildren(placeholder);
  $("videoCredit").textContent="No third-party demonstration video is loaded for this exercise.";
 }
 $("detailCues").replaceChildren();
 item.cues.forEach(cue=>{const li=document.createElement("li");li.textContent=cue;$("detailCues").append(li)});
 $("detailMistakes").textContent=item.mistakes;
 $("completeExercise").textContent=completed[item.id]?"COMPLETED ✓":"MARK COMPLETE ✓";
 if(window.innerWidth<820)$("exercisePlayer").scrollIntoView({behavior:"smooth",block:"start"});
}

function formatTime(seconds){return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`}
function stopTimer(){if(timer){clearInterval(timer);timer=null}}
function showTimer(){ $("timerDisplay").textContent=mode==="time"?formatTime(timerValue):String(timerValue)}
function startTimer(){
 if(timer){stopTimer();$("timerStart").textContent="RESUME";return}
 if(mode==="reps"){ $("timerDisplay").textContent="COMPLETE YOUR SET";$("timerStart").textContent="DONE";return}
 $("timerStart").textContent="PAUSE";
 timer=setInterval(()=>{
  timerValue=Math.max(0,timerValue-1);showTimer();
  if(timerValue===0){stopTimer();$("timerStart").textContent="FINISHED"}
 },1000);
}

$("timerStart").addEventListener("click",()=>{
 if(mode==="reps"){ $("timerDisplay").textContent="SET COMPLETE";$("timerStart").textContent="DONE";return}
 startTimer();
});
$("timerReset").addEventListener("click",()=>{
 stopTimer();timerValue=currentItems()[selected].duration;showTimer();$("timerStart").textContent="START";
});
$("timeMode").addEventListener("click",()=>{
 mode="time";$("timeMode").classList.add("active");$("repMode").classList.remove("active");selectExercise(selected);
});
$("repMode").addEventListener("click",()=>{
 mode="reps";$("repMode").classList.add("active");$("timeMode").classList.remove("active");selectExercise(selected);
});
$("completeExercise").addEventListener("click",()=>{
 const item=currentItems()[selected];
 completed[item.id]=!completed[item.id];
 localStorage.setItem("shanu-session-v2",JSON.stringify(completed));
 $("completeExercise").textContent=completed[item.id]?"COMPLETED ✓":"MARK COMPLETE ✓";
 renderCards();
});
$("nextExercise").addEventListener("click",()=>{
 selectExercise((selected+1)%currentItems().length);
});
$("resetChecklist").addEventListener("click",()=>{
 if(!confirm("Reset all exercise checkmarks saved on this device?"))return;
 completed={};localStorage.removeItem("shanu-session-v2");renderCards();selectExercise(selected);
});
document.querySelectorAll("[data-category]").forEach(button=>{
 button.addEventListener("click",()=>{
  category=button.dataset.category;selected=0;stopTimer();
  document.querySelectorAll("[data-category]").forEach(b=>b.classList.toggle("active",b===button));
  $("sessionLabel").textContent=library[category].title;
  renderCards();selectExercise(0);
 });
});

function showRest(){$("restDisplay").textContent=formatTime(restValue)}
function stopRest(){if(restTimer){clearInterval(restTimer);restTimer=null}}
$("restStart").addEventListener("click",()=>{
 if(restTimer){stopRest();$("restStart").textContent="RESUME";return}
 $("restStart").textContent="PAUSE";
 restTimer=setInterval(()=>{
  restValue=Math.max(0,restValue-1);showRest();
  if(restValue===0){stopRest();$("restStart").textContent="REST COMPLETE"}
 },1000);
});
$("restPlus").addEventListener("click",()=>{restValue+=15;showRest()});
$("restReset").addEventListener("click",()=>{stopRest();restValue=30;showRest();$("restStart").textContent="START REST"});

document.querySelectorAll("[data-category]").forEach(b=>b.classList.toggle("active",b.dataset.category===category));
$("sessionLabel").textContent=library[category].title;
renderCards();selectExercise(0);
