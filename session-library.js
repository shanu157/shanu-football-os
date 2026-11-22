const exercises = {
 football: {
  eyebrow: "BALL CONTROL & TECHNIQUE",
  title: "Football skills",
  description: "Build confident control and accurate technique.",
  items: [
   ["Ball mastery","⚽","ball","8–12 min","Easy","Practise toe taps, inside touches and gentle sole rolls. Keep the ball close."],
   ["Passing & first touch","👟","float","8–12 min","Easy","Pass against a wall or with a partner. Receive calmly and look up before passing."],
   ["Dribbling","🏃","run","8–12 min","Easy–moderate","Use a few cones or markers. Change direction with control and use both feet."]
  ]
 },
 strength: {
  eyebrow: "CONTROL & COORDINATION",
  title: "Strength & athleticism",
  description: "Build basic movement control with comfortable technique.",
  items: [
   ["Glute bridge","🧍","strength","2 sets · 8 reps","Easy","Lie comfortably, bend knees and lift hips gently. Stop if uncomfortable."],
   ["Bird dog","🐕","float","2 sets · 6 each side","Easy","From hands and knees, extend opposite arm and leg while keeping balance."],
   ["Calf raises","🦶","strength","2 sets · 8 reps","Easy","Hold a stable support and rise slowly onto your toes, then lower with control."]
  ]
 },
 mobility: {
  eyebrow: "MOVEMENT & RECOVERY",
  title: "Mobility & reset",
  description: "Move gently and recover without forcing a stretch.",
  items: [
   ["Ankle mobility","🦶","stretch","1–2 min","Gentle","Move each ankle through a comfortable range without forcing it."],
   ["Hip mobility","🧘","stretch","1–2 min","Gentle","Use slow, comfortable hip movements. Avoid bouncing or forcing range."],
   ["Easy cool-down","🌿","float","5–8 min","Gentle","Walk easily, breathe calmly and use comfortable stretches after activity."]
  ]
 }
};

const storageKey = "shanu-session-checklist-v1";
let completed = {};
try { completed = JSON.parse(localStorage.getItem(storageKey) || "{}") || {}; }
catch { completed = {}; }

const cards = document.querySelector("#exerciseCards");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
let category = "football";

function updateProgress() {
 const total = Object.values(exercises).reduce((n,c) => n+c.items.length,0);
 const count = Object.values(completed).filter(Boolean).length;
 progressText.textContent = `${count} / ${total} completed`;
 progressBar.style.width = `${count/total*100}%`;
}

function render() {
 const data = exercises[category];
 document.querySelector("#categoryEyebrow").textContent = data.eyebrow;
 document.querySelector("#categoryTitle").textContent = data.title;
 document.querySelector("#categoryDescription").textContent = data.description;
 cards.replaceChildren();

 data.items.forEach((item,index) => {
  const [name,emoji,motion,duration,difficulty,description] = item;
  const id = `${category}-${index}`;
  const article = document.createElement("article");
  article.className = "exercise-card";

  const stage = document.createElement("div");
  stage.className = "motion-stage";
  stage.dataset.motion = motion;
  const figure = document.createElement("span");
  figure.className = "motion-emoji";
  figure.textContent = emoji;
  stage.append(figure);

  const title = document.createElement("h3");
  title.textContent = `${String(index+1).padStart(2,"0")} · ${name}`;
  const detail = document.createElement("p");
  detail.textContent = description;
  const meta = document.createElement("div");
  meta.className = "exercise-meta";
  meta.textContent = `${duration} · ${difficulty}`;

  const label = document.createElement("label");
  label.className = "exercise-check";
  const input = document.createElement("input");
  input.type = "checkbox";
  input.checked = !!completed[id];
  const text = document.createElement("span");
  text.textContent = "Completed";
  input.addEventListener("change", () => {
   completed[id] = input.checked;
   localStorage.setItem(storageKey, JSON.stringify(completed));
   updateProgress();
  });
  label.append(input,text);
  article.append(stage,title,meta,detail,label);
  cards.append(article);
 });
 updateProgress();
}

document.querySelectorAll("[data-category]").forEach(button => {
 button.addEventListener("click", () => {
  category = button.dataset.category;
  document.querySelectorAll("[data-category]").forEach(b =>
   b.classList.toggle("active",b === button));
  render();
 });
});

document.querySelector("#resetChecklist").addEventListener("click", () => {
 if (!confirm("Reset all exercise checkmarks on this device?")) return;
 completed = {};
 localStorage.removeItem(storageKey);
 render();
});

render();
