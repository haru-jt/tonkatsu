// =========================
// FufuMate v2
// =========================

const rewards = [
  {
    name: "🍰 スイーツ",
    point: 100
  },
  {
    name: "🍖 焼肉",
    point: 300
  },
  {
    name: "🚗 ドライブ",
    point: 500
  }
];

// =========================
// データ読み込み
// =========================

let data;

try {

  data = JSON.parse(
    localStorage.getItem("fufumate")
  );

} catch {

  data = null;
}

if (!data) {

  data = {

    familyPoints: 0,

    husbandPoints: 0,

    wifePoints: 0,

    tasks: [],

    shopping: [],

    thanks: [],

    streak: 0,

    lastCompletedDate: null

  };

}

// =========================
// 保存
// =========================

function save() {

  localStorage.setItem(
    "fufumate",
    JSON.stringify(data)
  );

}

// =========================
// ナビゲーション
// =========================

function showPage(pageId) {

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });

  document
    .getElementById(pageId)
    .classList.add("active");

}

// =========================
// 家事追加
// =========================

function addTask() {

  const title =
    document
      .getElementById("taskTitle")
      .value
      .trim();

  const owner =
    document
      .getElementById("taskOwner")
      .value;

  const point =
    parseInt(
      document
        .getElementById("taskPoint")
        .value
    ) || 10;

  if (!title) {

    alert("家事名を入力してください");

    return;

  }

  data.tasks.push({

    id: Date.now(),

    title,

    owner,

    point,

    done: false,

    createdAt:
      new Date().toISOString()

  });

  document.getElementById(
    "taskTitle"
  ).value = "";

  render();

}

// =========================
// 家事完了
// =========================

function completeTask(id) {

  const task =
    data.tasks.find(
      t => t.id === id
    );

  if (!task) return;

  if (task.done) return;

  task.done = true;

  data.familyPoints += task.point;

  if (task.owner === "husband") {

    data.husbandPoints += task.point;

  }

  else if (
    task.owner === "wife"
  ) {

    data.wifePoints += task.point;

  }

  else {

    data.husbandPoints +=
      Math.ceil(task.point / 2);

    data.wifePoints +=
      Math.floor(task.point / 2);

  }

  updateStreak();

  render();

}

// =========================
// 家事削除
// =========================

function deleteTask(id) {

  data.tasks =
    data.tasks.filter(
      t => t.id !== id
    );

  render();

}

// =========================
// 連続達成記録
// =========================

function updateStreak() {

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  if (
    data.lastCompletedDate !==
    today
  ) {

    data.streak++;

    data.lastCompletedDate =
      today;

  }

}

// =========================
// 買い物追加
// =========================

function addShopping() {

  const item =
    document
      .getElementById(
        "shoppingInput"
      )
      .value
      .trim();

  if (!item) return;

  data.shopping.push({

    id: Date.now(),

    name: item

  });

  document
    .getElementById(
      "shoppingInput"
    )
    .value = "";

  render();

}

// =========================
// 買い物削除
// =========================

function removeShopping(id) {

  data.shopping =
    data.shopping.filter(
      i => i.id !== id
    );

  render();

}

// =========================
// 感謝メッセージ
// =========================

function sendThanks() {

  const text =
    document
      .getElementById(
        "thanksInput"
      )
      .value
      .trim();

  if (!text) return;

  data.thanks.unshift({

    text,

    date:
      new Date()
        .toLocaleString()

  });

  document
    .getElementById(
      "thanksInput"
    )
    .value = "";

  render();

}

// =========================
// ご褒美交換
// =========================

function exchangeReward(point) {

  if (
    data.familyPoints < point
  ) {

    alert(
      "ポイント不足です"
    );

    return;

  }

  data.familyPoints -= point;

  alert(
    "ご褒美を交換しました🎉"
  );

  render();

}

// =========================
// 支え合い指数
// =========================

function scoreCalc() {

  const pointScore =
    Math.floor(
      data.familyPoints / 10
    );

  const thankScore =
    data.thanks.length * 2;

  const total =
    pointScore + thankScore;

  return Math.min(
    total,
    100
  );

}

// =========================
// HTMLエスケープ
// =========================

function escapeHtml(text) {

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

}

// =========================
// 手動更新
// =========================

function refreshData() {

  const latest =
    JSON.parse(
      localStorage.getItem(
        "fufumate"
      )
    );

  if (latest) {

    data = latest;

    render();

  }

}

// =========================
// 完了済み整理
// =========================

function resetCompletedTasks() {

  if (
    !confirm(
      "完了済み家事を削除しますか？"
    )
  ) {
    return;
  }

  data.tasks =
    data.tasks.filter(
      t => !t.done
    );

  render();

}

// =========================
// 描画
// =========================

function render() {

  document.getElementById(
    "husbandPoints"
  ).textContent =
    data.husbandPoints;

  document.getElementById(
    "wifePoints"
  ).textContent =
    data.wifePoints;

  const score =
    scoreCalc();

  document.getElementById(
    "supportScore"
  ).textContent =
    score + "%";

  const bar =
    document.getElementById(
      "progressBar"
    );

  if (bar) {

    bar.style.width =
      score + "%";

  }

  // 家事一覧

  const taskList =
    document.getElementById(
      "taskList"
    );

  if (taskList) {

    taskList.innerHTML =
      data.tasks.map(task => `

<div class="task ${task.owner}">

  <div class="task-info">

    <div class="task-title">
      ${escapeHtml(task.title)}
    </div>

    <div class="task-point">
      ${task.point} pt
    </div>

  </div>

  <div>

    ${
      task.done
      ?
      "✅"
      :
      `<button class="btn-success"
      onclick="completeTask(${task.id})">
      完了
      </button>`
    }

    <button
      class="btn-danger"
      onclick="deleteTask(${task.id})">

      削除

    </button>

  </div>

</div>

      `).join("");

  }

  // 今日の家事

  const todayTasks =
    document.getElementById(
      "todayTasks"
    );

  if (todayTasks) {

    const activeTasks =
      data.tasks.filter(
        t => !t.done
      );

    todayTasks.innerHTML =
      activeTasks.length

      ?

      activeTasks
        .slice(0, 5)
        .map(task => `

<div class="task ${task.owner}">
  ${escapeHtml(task.title)}
</div>

        `)
        .join("")

      :

      `
      <div class="task">
      🎉 今日の家事は完了です
      </div>
      `;

  }

  // 買い物

  const shoppingList =
    document.getElementById(
      "shoppingList"
    );

  if (shoppingList) {

    shoppingList.innerHTML =
      data.shopping.map(item => `

<div class="reward">

  <span>
    ${escapeHtml(item.name)}
  </span>

  <button
   class="btn-danger"
   onclick="removeShopping(${item.id})">

   削除

  </button>

</div>

      `).join("");

  }

  // ご褒美

  const rewardList =
    document.getElementById(
      "rewardList"
    );

  if (rewardList) {

    rewardList.innerHTML =
      rewards.map(reward => `

<div class="reward">

  <span>

  ${reward.name}

  (${reward.point}pt)

  </span>

  <button
   class="btn-success"
   onclick="exchangeReward(${reward.point})">

   交換

  </button>

</div>

      `).join("");

  }

  // 感謝

  const thanksList =
    document.getElementById(
      "thanksList"
    );

  if (thanksList) {

    thanksList.innerHTML =
      data.thanks.map(msg => `

<div class="thanks-item">

❤️
${escapeHtml(msg.text)}

<br>

<small>
${msg.date}
</small>

</div>

      `).join("");

  }

  save();

}

// =========================
// 初期化
// =========================

render();