const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gameScreen = document.getElementById("game");
const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOver");

const scoreEl = document.getElementById("score");
const moneyEl = document.getElementById("money");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");

const loveEl = document.getElementById("love");
const wealthEl = document.getElementById("wealth");
const homeEl = document.getElementById("home");
const healthEl = document.getElementById("health");

const missionText = document.getElementById("missionText");
const finalScore = document.getElementById("finalScore");

let gameRunning = false;

let score = 0;
let money = 30;
let lives = 3;
let level = 1;

let speed = 4;
let shield = false;

let love = 0;
let wealth = 0;
let home = 0;
let health = 0;

let objects = [];
let particles = [];

let lastTime = 0;
let spawnTimer = 0;

const keys = {
  left: false,
  right: false,
  up: false,
  down: false
};

const player = {
  x: 400,
  y: 300,
  width: 38,
  height: 50
};

function resize() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  if (player.x > canvas.width) {
    player.x = canvas.width / 2;
  }

  if (player.y > canvas.height) {
    player.y = canvas.height / 2;
  }
}

window.addEventListener("resize", resize);

function startGame() {

  menu.style.display = "none";
  gameOverScreen.style.display = "none";
  gameScreen.style.display = "block";

  score = 0;
  money = 30;
  lives = 3;
  level = 1;

  speed = 4;
  shield = false;

  love = 0;
  wealth = 0;
  home = 0;
  health = 0;

  objects = [];
  particles = [];

  resize();

  player.x = canvas.width / 2;
  player.y = canvas.height / 2;

  updateUI();

  gameRunning = true;

  lastTime = performance.now();

  requestAnimationFrame(gameLoop);
}

function gameOver() {

  gameRunning = false;

  finalScore.textContent = score;

  gameOverScreen.style.display = "flex";
}

function updateUI() {

  scoreEl.textContent = score;
  moneyEl.textContent = money;
  livesEl.textContent = lives;
  levelEl.textContent = level;

  loveEl.textContent = love;
  wealthEl.textContent = wealth;
  homeEl.textContent = home;
  healthEl.textContent = health;

  if (love < 3) {
    missionText.textContent = "Consigue 3 energías de Amor ❤️";
  }
  else if (wealth < 3) {
    missionText.textContent = "Consigue 3 energías de Dinero 💰";
  }
  else if (home < 3) {
    missionText.textContent = "Consigue 3 energías de Hogar 🏠";
  }
  else if (health < 3) {
    missionText.textContent = "Consigue 3 energías de Salud 🩺";
  }
  else {
    missionText.textContent = "🌟 ¡Equilibrio energético conseguido!";
  }
}

function spawnObject() {

  const positive = Math.random() < 0.72;

  let data;

  if (positive) {

    const types = [
      ["❤️", "love", 20],
      ["💰", "wealth", 25],
      ["🏠", "home", 30],
      ["🩺", "health", 35]
    ];

    data = types[Math.floor(Math.random() * types.length)];

  } else {

    const negatives = [
      ["⚡", "negative", -20],
      ["😡", "negative", -25],
      ["💀", "negative", -35],
      ["🌪️", "negative", -30]
    ];

    data = negatives[Math.floor(Math.random() * negatives.length)];
  }

  objects.push({

    emoji: data[0],
    type: data[1],
    value: data[2],

    x: Math.random() * canvas.width,
    y: -50,

    size: 32,

    speed: 1.5 + level * 0.25 + Math.random() * 1.5
  });
}

function createParticle(x, y, text) {

  particles.push({
    x,
    y,
    text,
    life: 1,
    velocity: -1
  });
}

function updateParticles() {

  for (let i = particles.length - 1; i >= 0; i--) {

    const p = particles[i];

    p.y += p.velocity;
    p.life -= 0.025;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {

  ctx.font = "bold 18px Arial";
  ctx.textAlign = "center";

  for (const p of particles) {

    ctx.globalAlpha = p.life;

    ctx.fillStyle = "white";

    ctx.fillText(
      p.text,
      p.x,
      p.y
    );
  }

  ctx.globalAlpha = 1;
}

function drawBackground() {

  ctx.fillStyle = "#102238";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // calles

  ctx.fillStyle = "#1c3148";

  for (let x = 0; x < canvas.width; x += 130) {

    ctx.fillRect(
      x,
      0,
      55,
      canvas.height
    );
  }

  for (let y = 0; y < canvas.height; y += 130) {

    ctx.fillRect(
      0,
      y,
      canvas.width,
      55
    );
  }

  // casas

  for (let x = 20; x < canvas.width; x += 180) {

    for (let y = 70; y < canvas.height; y += 170) {

      ctx.fillStyle = "#34506a";

      ctx.fillRect(
        x,
        y,
        90,
        65
      );

      ctx.fillStyle = "#d5b25c";

      ctx.beginPath();

      ctx.moveTo(x - 8, y);
      ctx.lineTo(x + 45, y - 35);
      ctx.lineTo(x + 98, y);

      ctx.fill();

      ctx.fillStyle = "#8ed1ff";

      ctx.fillRect(
        x + 15,
        y + 18,
        18,
        18
      );

      ctx.fillRect(
        x + 57,
        y + 18,
        18,
        18
      );
    }
  }
}

function drawPlayer() {

  ctx.save();

  ctx.translate(
    player.x,
    player.y
  );

  // cabeza

  ctx.fillStyle = "#f0c6a4";

  ctx.beginPath();

  ctx.arc(
    0,
    -25,
    14,
    0,
    Math.PI * 2
  );

  ctx.fill();

  // cuerpo

  ctx.fillStyle = "#2477d4";

  ctx.fillRect(
    -17,
    -10,
    34,
    38
  );

  // piernas

  ctx.fillStyle = "#202c3d";

  ctx.fillRect(
    -13,
    28,
    10,
    22
  );

  ctx.fillRect(
    3,
    28,
    10,
    22
  );

  // escudo

  if (shield) {

    ctx.strokeStyle = "#66eaff";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      38,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  }

  ctx.restore();
}

function collision(o) {

  return (

    Math.abs(o.x - player.x) < 38 &&
    Math.abs(o.y - player.y) < 48

  );
}

function collect(o) {

  if (o.type === "negative") {

    if (shield) {

      shield = false;

      createParticle(
        player.x,
        player.y,
        "🛡️ BLOQUEADO"
      );

      return;
    }

    lives--;

    score = Math.max(
      0,
      score - 10
    );

    createParticle(
      player.x,
      player.y,
      "⚠️ -ENERGÍA"
    );

  } else {

    score += o.value;

    money += Math.ceil(
      o.value / 5
    );

    if (o.type === "love") love++;
    if (o.type === "wealth") wealth++;
    if (o.type === "home") home++;
    if (o.type === "health") health++;

    createParticle(
      player.x,
      player.y,
      "+" + o.value
    );
  }

  level =
    1 +
    Math.floor(score / 150);

  updateUI();

  if (lives <= 0) {
    gameOver();
  }
}

function update(dt) {

  let dx = 0;
  let dy = 0;

  if (keys.left) dx--;
  if (keys.right) dx++;
  if (keys.up) dy--;
  if (keys.down) dy++;

  const length =
    Math.hypot(dx, dy) || 1;

  player.x +=
    (dx / length) *
    speed *
    60 *
    dt;

  player.y +=
    (dy / length) *
    speed *
    60 *
    dt;

  player.x = Math.max(
    25,
    Math.min(
      canvas.width - 25,
      player.x
    )
  );

  player.y = Math.max(
    60,
    Math.min(
      canvas.height - 60,
      player.y
    )
  );

  spawnTimer += dt;

  const interval =
    Math.max(
      0.35,
      0.9 - level * 0.04
    );

  if (spawnTimer > interval) {

    spawnTimer = 0;

    spawnObject();
  }

  for (
    let i = objects.length - 1;
    i >= 0;
    i--
  ) {

    const o = objects[i];

    o.y +=
      o.speed *
      60 *
      dt;

    if (collision(o)) {

      collect(o);

      objects.splice(i, 1);

      continue;
    }

    if (
      o.y >
      canvas.height + 50
    ) {

      objects.splice(i, 1);
    }
  }

  updateParticles();
}

function drawObjects() {

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const o of objects) {

    ctx.font =
      o.size + "px Arial";

    ctx.fillText(
      o.emoji,
      o.x,
      o.y
    );
  }
}

function gameLoop(time) {

  if (!gameRunning) {
    return;
  }

  const dt =
    Math.min(
      0.033,
      (time - lastTime) / 1000
    );

  lastTime = time;

  drawBackground();

  update(dt);

  drawObjects();

  drawPlayer();

  drawParticles();

  requestAnimationFrame(
    gameLoop
  );
}


// BOTONES

document
  .getElementById("playBtn")
  .addEventListener(
    "click",
    startGame
  );

document
  .getElementById("restartBtn")
  .addEventListener(
    "click",
    startGame
  );


// TIENDA

document
  .getElementById("speedBtn")
  .addEventListener(
    "click",
    () => {

      if (money >= 20) {

        money -= 20;
        speed += 1;

        updateUI();
      }
    }
  );

document
  .getElementById("lifeBtn")
  .addEventListener(
    "click",
    () => {

      if (money >= 50) {

        money -= 50;
        lives++;

        updateUI();
      }
    }
  );

document
  .getElementById("shieldBtn")
  .addEventListener(
    "click",
    () => {

      if (money >= 80) {

        money -= 80;
        shield = true;

        updateUI();
      }
    }
  );


// TECLADO

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "ArrowLeft" ||
      event.key === "a"
    ) keys.left = true;

    if (
      event.key === "ArrowRight" ||
      event.key === "d"
    ) keys.right = true;

    if (
      event.key === "ArrowUp" ||
      event.key === "w"
    ) keys.up = true;

    if (
      event.key === "ArrowDown" ||
      event.key === "s"
    ) keys.down = true;
  }
);

document.addEventListener(
  "keyup",
  event => {

    if (
      event.key === "ArrowLeft" ||
      event.key === "a"
    ) keys.left = false;

    if (
      event.key === "ArrowRight" ||
      event.key === "d"
    ) keys.right = false;

    if (
      event.key === "ArrowUp" ||
      event.key === "w"
    ) keys.up = false;

    if (
      event.key === "ArrowDown" ||
      event.key === "s"
    ) keys.down = false;
  }
);


// CONTROLES TÁCTILES

function control(id, direction) {

  const button =
    document.getElementById(id);

  button.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      keys[direction] = true;
    }
  );

  button.addEventListener(
    "pointerup",
    () => {

      keys[direction] = false;
    }
  );

  button.addEventListener(
    "pointerleave",
    () => {

      keys[direction] = false;
    }
  );

  button.addEventListener(
    "pointercancel",
    () => {

      keys[direction] = false;
    }
  );
}

control("left", "left");
control("right", "right");
control("up", "up");
control("down", "down");

resize();
