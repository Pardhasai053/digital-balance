const screens=[...document.querySelectorAll(".screen")];
const toast=document.getElementById("toast");
const fatigueChecks=[...document.querySelectorAll("#fatigue input[type=checkbox]")];
const fatigueScore=document.getElementById("fatigueScore");
const fatigueLabel=document.getElementById("fatigueLabel");
const fatigueHint=document.getElementById("fatigueHint");
let selectedPersona="Academic Achiever";

function show(id){screens.forEach(s=>s.classList.toggle("active",s.id===id));window.scrollTo(0,0)}
function notify(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)}
function updatePersonaUI(){
  const pill=document.getElementById("personaBtn");
  if(pill) pill.textContent=selectedPersona==="Faculty"?"👩‍🏫 Faculty":selectedPersona==="Gaming & Entertainment Student"?"🎮 Gaming & Entertainment":"🎓 Academic Achiever";
  const planner=document.querySelector('[data-go="breaks"]');
  if(planner){
    planner.dataset.go=selectedPersona==="Faculty"?"facultyPlanner":"breaks";
    const label=planner.querySelector("b");
    if(label) label.innerHTML=selectedPersona==="Faculty"?"Faculty Well-being<br>Planner":"Study Break<br>Planner";
    const icon=planner.querySelector("span");
    if(icon) icon.textContent=selectedPersona==="Faculty"?"🗓️":"📚";
  }
}
function calculateFatigue(){
  const count=fatigueChecks.filter(x=>x.checked).length;
  const levels=["Low","Medium","High"];
  const level=count===0?"Low":count<=2?"Medium":"High";
  const score=count===0?15:count===1?35:count===2?55:count===3?72:count===4?88:100;
  document.querySelectorAll(".level").forEach(x=>x.classList.toggle("selected",x.dataset.level===level));
  fatigueScore.textContent=score+"%";
  fatigueLabel.textContent=level+" fatigue";
  fatigueHint.textContent=count===0?"No symptoms selected. Keep taking regular breaks.":count<=2?"A few symptoms are present. Try a short break and eye rest.":"Several symptoms are present. Take a longer break and reduce screen exposure.";
}

document.addEventListener("click",e=>{
  const go=e.target.closest("[data-go]");
  if(go){show(go.dataset.go);return}
  const level=e.target.closest(".level");
  if(level){
    const wanted=level.dataset.level;
    fatigueChecks.forEach((box,i)=>box.checked=wanted==="Medium"?i<2:wanted==="High"?i<4:false);
    calculateFatigue();
    notify("Symptoms updated for "+wanted+" fatigue");
  }
  const persona=e.target.closest(".persona-choice");
  if(persona){
    selectedPersona=persona.dataset.persona;
    updatePersonaUI();
    document.querySelectorAll(".persona-choice").forEach(x=>x.classList.toggle("selected",x===persona));
  }
  if(e.target.closest(".icon-btn")) notify("You're all caught up ✨");
});

fatigueChecks.forEach(box=>box.addEventListener("change",calculateFatigue));

document.getElementById("loginForm").addEventListener("submit",e=>{
  e.preventDefault();
  show("persona");
  notify("Login successful — choose your profile");
});

document.getElementById("createAccount").addEventListener("click",()=>show("signup"));
document.getElementById("signupForm").addEventListener("submit",e=>{
  e.preventDefault();
  show("persona");
  notify("Account created — choose your profile");
});
document.getElementById("continuePersona").addEventListener("click",()=>{
  updatePersonaUI();
  show("home");
  notify("Welcome to your Digital Balance home 🏠");
});

document.getElementById("facultyStart").addEventListener("click",()=>{
  notify("10-minute break reminder started 🔔");
  document.getElementById("facultyStart").textContent="Break Reminder Active";
});

document.getElementById("startFocus").addEventListener("click",()=>{
  notify("Focus session started — 25 minutes. Stay focused! 🎯");
  document.getElementById("startFocus").textContent="Focus Session Active";
});
document.getElementById("suggestions").addEventListener("click",()=>notify("Try a 5-minute eye rest, drink water and step away from the screen."));
document.getElementById("personaBtn").addEventListener("click",()=>show("persona"));
document.getElementById("navProfile").addEventListener("click",()=>{
  // Profile button should open the Profile/Persona screen
  // instead of opening a planner.
  document.querySelectorAll(".persona-choice").forEach(choice=>{
    choice.classList.toggle(
      "selected",
      choice.dataset.persona === selectedPersona
    );
  });

  updatePersonaUI();
  show("persona");
  notify("Profile opened 👤");
});

calculateFatigue();
updatePersonaUI();
