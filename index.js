window.addEventListener("DOMContentLoaded", (event) => {
  const targetContainerEl = document.getElementById("target-container");
  const scoreBoardEl = document.getElementById("scoreboard");
  const targetCount = 1;
  let targetDuration = 2;
  let targetDiameter = 50;
  let spawnInterval = 750;
  let targetsDead = 0;
  let targetsHit = 0;
  let targetsMissed = 0;
  let running = false;
  let spawnClock;

  const targetDurationEl = document.getElementById("targetDuration");
  const targetDiameterEl = document.getElementById("targetDiameter");
  const spawnIntervalEl = document.getElementById("spawnInterval");
  const targetDurationOutEl = document.getElementById("targetDurationOut");
  const targetDiameterOutEl = document.getElementById("targetDiameterOut");
  const spawnIntervalOutEl = document.getElementById("spawnIntervalOut");
  const startGameBtn = document.getElementById("startGame");
  const stopGameBtn = document.getElementById("stopGame");

  const startGame = () => {
    if (running) return;
    running = true;
    updateLoop();
  };
  const stopGame = () => {
    running = false;
    const liveTargetEls = document.querySelectorAll(".target");
    liveTargetEls.forEach((el) => {
      el.dataset.killed = true;
    });
    targetContainerEl.innerHTML = "";
    updateLoop();
    setScoreboard();
  };
  const targetDurationChange = (event) => {
    targetDuration = event.target.value;
    targetDurationOutEl.textContent = event.target.value + "s";
  };
  const targetDiameterChange = (event) => {
    targetDiameter = event.target.value;
    targetDiameterOutEl.textContent = event.target.value + "px";
  };
  const spawnIntervalChange = (event) => {
    spawnInterval = event.target.value;
    spawnIntervalOutEl.textContent = event.target.value + "ms";
  };

  targetDurationEl.addEventListener("change", targetDurationChange);
  targetDiameterEl.addEventListener("change", targetDiameterChange);
  spawnIntervalEl.addEventListener("change", spawnIntervalChange);
  startGameBtn.addEventListener("click", startGame);
  stopGameBtn.addEventListener("click", stopGame);

  const setScoreboard = () => {
    scoreBoardEl.innerText = `Targets Hit: ${targetsHit}\n Shots Missed: ${targetsMissed}\n Accuracy: ${(
      targetsHit /
      (targetsHit + targetsMissed)
    ).toFixed(3)}`;
  };

  const updateLoop = () => {
    if (spawnClock) clearInterval(spawnClock);
    if (!running) return;
    spawnTarget(targetCount);
    spawnClock = setInterval(() => {
      spawnTarget(targetCount);
    }, spawnInterval);
  };

  const spawnTarget = (targetCount) => {
    for (let i = 0; i < targetCount; i++) {
      let target = document.createElement("div");
      target.className = "target";
      const { top, left } = getRandomPosition();
      target.style.top = top + "px";
      target.style.left = left + "px";
      target.style.width = targetDiameter + "px";
      target.style.height = targetDiameter + "px";
      target.style.animationDuration = targetDuration / 2 + "s";
      targetContainerEl.appendChild(target);
      setTimeout(() => {
        targetDied(target);
      }, targetDuration * 1000);
    }
  };

  const targetDied = (target) => {
    if (!running) return;
    if (target.dataset.hit) return;
    if (target.dataset.killed) {
      target.remove();
      return;
    }
    target.remove();
    targetsDead++;
    console.log("targets dead: ", targetsDead);
  };

  const targetHit = (target) => {
    target.dataset.hit = true;
    target.remove();
    targetsHit++;
    console.log("targets hit: ", targetsHit);
  };

  const targetMiss = () => {
    targetsMissed++;
    console.log("targets missed: ", targetsMissed);
  };

  const handleTargetClick = (event) => {
    if (event.target.id.includes("target-container")) {
      targetMiss();
    }
    if (!event.target.className.includes("target")) return;
    targetHit(event.target);
  };

  const getRandomPosition = () => {
    const { width, height } = targetContainerEl.getBoundingClientRect();
    const vw = width;
    const vh = height;
    const ew = targetDiameter;
    const eh = targetDiameter;
    const maxTop = vh - eh;
    const maxLeft = vw - ew;
    const top = getRandomInt(maxTop);
    const left = getRandomInt(maxLeft);
    return { top, left };
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  document.addEventListener("click", handleTargetClick);
});
