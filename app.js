const rewards = [
 {name:"🍰 スイーツ",point:100},
 {name:"🍖 焼肉",point:300},
 {name:"🚗 ドライブ",point:500}
];

let data =
JSON.parse(localStorage.getItem("fufumate"))
||
{
 husbandPoints:0,
 wifePoints:0,
 tasks:[],
 shopping:[],
 thanks:[]
};

function save(){
 localStorage.setItem(
  "fufumate",
  JSON.stringify(data)
 );
}

function showPage(id){

 document
 .querySelectorAll(".page")
 .forEach(p=>p.classList.remove("active"));

 document
 .getElementById(id)
 .classList.add("active");
}

function addTask(){

 const title =
 taskTitle.value.trim();

 if(!title) return;

 data.tasks.push({
   id:Date.now(),
   title,
   owner:taskOwner.value,
   point:Number(taskPoint.value),
   done:false
 });

 taskTitle.value="";

 render();
}

function completeTask(id){

 const task =
 data.tasks.find(
  t=>t.id===id
 );

 if(!task || task.done) return;

 task.done=true;

 if(task.owner==="husband"){
  data.husbandPoints+=task.point;
 }

 else if(task.owner==="wife"){
  data.wifePoints+=task.point;
 }

 else{

  data.husbandPoints+=
   Math.floor(task.point/2);

  data.wifePoints+=
   Math.floor(task.point/2);
 }

 render();
}

function deleteTask(id){

 data.tasks =
 data.tasks.filter(
  t=>t.id!==id
 );

 render();
}

function addShopping(){

 const item =
 shoppingInput.value.trim();

 if(!item) return;

 data.shopping.push({
  id:Date.now(),
  name:item
 });

 shoppingInput.value="";

 render();
}

function removeShopping(id){

 data.shopping =
 data.shopping.filter(
  i=>i.id!==id
 );

 render();
}

function sendThanks(){

 const msg =
 thanksInput.value.trim();

 if(!msg) return;

 data.thanks.unshift({
   text:msg,
   date:new Date().toLocaleString()
 });

 thanksInput.value="";

 render();
}

function exchangeReward(point){

 if(data.husbandPoints < point){
   alert("ポイント不足");
   return;
 }

 data.husbandPoints -= point;

 alert("交換しました🎉");

 render();
}

function supportScore(){

 if(data.tasks.length===0){
  return 0;
 }

 const done =
 data.tasks.filter(
  t=>t.done
 ).length;

 return Math.round(
  done/data.tasks.length*100
 );
}

function render(){

 husbandPoints.textContent =
 data.husbandPoints;

 wifePoints.textContent =
 data.wifePoints;

 supportScore.textContent =
 window.supportScore();

 taskList.innerHTML =
 data.tasks.map(task=>`

<div class="task ${task.owner}
${task.done?'done':''}">

<div>

<div>

${
 task.owner==="husband"
 ? "👨"
 : task.owner==="wife"
 ? "👩"
 : "👨‍👩‍👧‍👦"
}

${task.title}

</div>

<div class="small">
${task.point} pt
</div>

</div>

<div>

${
task.done
?
"✅"
:
`<button onclick="completeTask(${task.id})">
完了
</button>`
}

<button
onclick="deleteTask(${task.id})">
🗑
</button>

</div>

</div>

`).join("");

 todayTasks.innerHTML =
 data.tasks
 .filter(t=>!t.done)
 .slice(0,5)
 .map(t=>`
<div class="task ${t.owner}">
${t.title}
</div>
`).join("");

 shoppingList.innerHTML =
 data.shopping.map(item=>`

<div class="reward">

<span>
${item.name}
</span>

<button
onclick="removeShopping(${item.id})">
削除
</button>

</div>

`).join("");

 rewardList.innerHTML =
 rewards.map(r=>`

<div class="reward">

<span>
${r.name}
 (${r.point}pt)
</span>

<button
onclick="
exchangeReward(${r.point})
">
交換
</button>

</div>

`).join("");

 thanksList.innerHTML =
 data.thanks.map(t=>`

<div class="thanks-item">

❤️ ${t.text}

<br>

<small>
${t.date}
</small>

</div>

`).join("");

 save();
}

render();