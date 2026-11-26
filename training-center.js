const focusNames = {
  football: "Football technique",
  dribbling: "Dribbling & ball mastery",
  passing: "Passing & first touch",
  strength: "Strength & coordination",
  mobility: "Mobility & recovery",
  speed: "Movement & agility"
};

const focusExercises = {
  football: ["Ball mastery", "First touch", "Passing practice", "Dribbling"],
  dribbling: ["Ball mastery", "Inside-outside touches", "Cone dribbling", "Running with the ball"],
  passing: ["Wall passing", "First touch", "Passing accuracy", "Receiving on the move"],
  strength: ["Glute bridge", "Bird dog", "Calf raises", "Balance practice"],
  mobility: ["Easy warm-up", "Ankle mobility", "Hip mobility", "Cool-down"],
  speed: ["Movement preparation", "Controlled acceleration", "Change of direction", "Balance practice"]
};

const $ = id => document.getElementById(id);
const API = "https://oss.exercisedb.dev/api/v1/exercises";
const planKey = "shanu_custom_training_plans_v2";

let exerciseDatabase = [];
let currentPlan = [];

function createPlan() {
  const focus = $("tcFocus").value;
  const duration = $("tcDuration").value;
  const level = $("tcLevel").value;
  const exercises = focusExercises[focus];
  const count = duration === "10" ? 2 : duration === "15" ? 3 : duration === "20" ? 4 : 5;

  currentPlan = exercises.slice(0, count);

  const preview = $("tcPlanPreview");
  preview.replaceChildren();

  const title = document.createElement("strong");
  title.textContent = focusNames[focus] + " · " + duration + " MIN";

  const detail = document.createElement("p");
  detail.textContent = level + " session · Adjust the session to your comfort.";

  const list = document.createElement("ol");

  currentPlan.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    list.append(li);
  });

  const actions = document.createElement("div");
  actions.className = "tc-plan-actions";

  const start = document.createElement("a");
  start.className = "tc-primary";
  start.href = "session-library.html?focus=" +
    encodeURIComponent(focus) + "&duration=" + duration + "&level=" + level;
  start.textContent = "START WORKOUT →";

  const save = document.createElement("button");
  save.className = "tc-secondary";
  save.type = "button";
  save.textContent = "SAVE MY PLAN";
  save.addEventListener("click", savePlan);

  actions.append(start, save);
  preview.append(title, detail, list, actions);
}

function savePlan() {
  if (!currentPlan.length) return;

  const plans = JSON.parse(localStorage.getItem(planKey) || "[]");
  plans.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    focus: $("tcFocus").value,
    duration: $("tcDuration").value,
    level: $("tcLevel").value,
    exercises: currentPlan
  });

  localStorage.setItem(planKey, JSON.stringify(plans.slice(0, 30)));
  renderSavedPlans();
  alert("Your training plan has been saved on this device.");
}

function renderSavedPlans() {
  const target = $("tcSavedPlans");
  if (!target) return;

  target.replaceChildren();

  let plans = [];
  try {
    plans = JSON.parse(localStorage.getItem(planKey) || "[]");
  } catch {
    plans = [];
  }

  if (!plans.length) {
    const empty = document.createElement("p");
    empty.textContent = "Your saved training plans will appear here.";
    target.append(empty);
    return;
  }

  plans.forEach(plan => {
    const card = document.createElement("article");
    card.className = "tc-saved-card";

    const heading = document.createElement("strong");
    heading.textContent = focusNames[plan.focus] || plan.focus;

    const info = document.createElement("p");
    info.textContent = plan.duration + " minutes · " + plan.level;

    const details = document.createElement("p");
    details.textContent = (plan.exercises || []).join(" · ");

    const remove = document.createElement("button");
    remove.className = "tc-secondary";
    remove.type = "button";
    remove.textContent = "DELETE";
    remove.addEventListener("click", () => {
      const updated = plans.filter(item => item.id !== plan.id);
      localStorage.setItem(planKey, JSON.stringify(updated));
      renderSavedPlans();
    });

    card.append(heading, info, details, remove);
    target.append(card);
  });
}

/* EXERCISE ANIMATION API */
function getExerciseList(data) {
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    for (const key of ["data", "exercises", "results", "items"]) {
      if (Array.isArray(data[key])) return data[key];
    }
  }
  return [];
}

function renderExerciseAnimations() {
  const target = $("tcAnimationResults");
  if (!target) return;

  const query = ($("tcAnimationSearch")?.value || "").toLowerCase().trim();
  const category = $("tcAnimationCategory")?.value || "all";

  target.replaceChildren();

  const matches = exerciseDatabase.filter(exercise => {
    const name = String(exercise.name || "").toLowerCase();
    const muscles = (exercise.targetMuscles || []).join(" ").toLowerCase();
    const body = (exercise.bodyParts || []).join(" ").toLowerCase();
    const text = name + " " + muscles + " " + body;

    const matchesSearch = !query || text.includes(query);

    const matchesCategory = category === "all" ||
      text.includes(category);

    return matchesSearch && matchesCategory;
  }).slice(0, 24);

  if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "tc-api-message";
    empty.textContent = exerciseDatabase.length
      ? "No matching demonstrations. Try another search."
      : "Exercise demonstrations are not available right now.";
    target.append(empty);
    return;
  }

  matches.forEach(exercise => {
    const card = document.createElement("article");
    card.className = "tc-animation-card";

    const image = document.createElement("img");
    image.loading = "lazy";
    image.alt = "Animated demonstration of " + exercise.name;
    image.src = exercise.gifUrl || "";
    image.onerror = () => {
      image.style.display = "none";
    };

    const heading = document.createElement("h3");
    heading.textContent = exercise.name || "Exercise";

    const muscles = document.createElement("p");
    muscles.textContent = "TARGET: " +
      (exercise.targetMuscles || []).join(", ");

    const equipment = document.createElement("p");
    equipment.textContent = "EQUIPMENT: " +
      (exercise.equipments || []).join(", ");

    const instructions = document.createElement("ol");

    (exercise.instructions || []).slice(0, 5).forEach(step => {
      const li = document.createElement("li");
      li.textContent = String(step).replace(/^Step:\d+\s*/i, "");
      instructions.append(li);
    });

    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = "VIEW INSTRUCTIONS";
    details.append(summary, instructions);

    card.append(image, heading, muscles, equipment, details);
    target.append(card);
  });
}

async function loadExerciseAnimations() {
  const status = $("tcApiStatus");
  if (!status) return;

  status.textContent = "Connecting to exercise demonstration library…";

  try {
    const response = await fetch(API + "?limit=100");

    if (!response.ok) {
      throw new Error("Exercise API returned " + response.status);
    }

    const data = await response.json();
    exerciseDatabase = getExerciseList(data);

    if (!exerciseDatabase.length) {
      throw new Error("No exercise records returned");
    }

    status.textContent =
      exerciseDatabase.length + " demonstrations loaded · ExerciseDB / AscendAPI";

    renderExerciseAnimations();
  } catch (error) {
    console.warn("Exercise animation API:", error);
    status.textContent =
      "The animation service could not connect. Check your internet connection or try again later.";
  }
}

$("tcCreate")?.addEventListener("click", createPlan);
$("tcAnimationSearch")?.addEventListener("input", renderExerciseAnimations);
$("tcAnimationCategory")?.addEventListener("change", renderExerciseAnimations);
$("tcApiRetry")?.addEventListener("click", loadExerciseAnimations);

renderSavedPlans();
loadExerciseAnimations();
