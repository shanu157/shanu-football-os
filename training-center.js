const focusNames={
 football:"Football technique",
 dribbling:"Dribbling & ball mastery",
 passing:"Passing & first touch",
 strength:"Strength & coordination",
 mobility:"Mobility & recovery",
 speed:"Movement & agility"
};

const focusExercises={
 football:["Ball mastery","First touch","Passing practice","Dribbling"],
 dribbling:["Ball mastery","Inside-outside touches","Cone dribbling","Running with the ball"],
 passing:["Wall passing","First touch","Passing accuracy","Receiving on the move"],
 strength:["Glute bridge","Bird dog","Calf raises","Balance practice"],
 mobility:["Easy warm-up","Ankle mobility","Hip mobility","Cool-down"],
 speed:["Movement preparation","Controlled acceleration","Change of direction","Balance practice"]
};

const createButton=document.querySelector("#tcCreate");
createButton.addEventListener("click",()=>{
 const focus=document.querySelector("#tcFocus").value;
 const duration=document.querySelector("#tcDuration").value;
 const level=document.querySelector("#tcLevel").value;
 const exercises=focusExercises[focus];
 const count=duration==="10"?2:duration==="15"?3:duration==="20"?4:5;
 const selected=Array.from({length:count},(_,i)=>exercises[i%exercises.length]);
 const preview=document.querySelector("#tcPlanPreview");
 preview.innerHTML="";
 const title=document.createElement("strong");
 title.textContent=focusNames[focus]+" · "+duration+" MIN";
 const detail=document.createElement("p");
 detail.textContent=(level==="beginner"?"Beginner":"Comfortable")+" session · Adjust the plan to how you feel.";
 const list=document.createElement("ol");
 selected.forEach(name=>{
  const li=document.createElement("li");
  li.textContent=name;
  list.append(li);
 });
 const start=document.createElement("a");
 start.className="tc-primary";
 start.href="session-library.html?focus="+encodeURIComponent(focus)+"&duration="+duration+"&level="+level;
 start.textContent="START THIS WORKOUT →";
 preview.append(title,detail,list,start);
});
