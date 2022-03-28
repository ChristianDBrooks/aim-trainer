window.addEventListener("DOMContentLoaded", (event) => {
  const controlsEl = document.getElementById("controls");
  const scoreBoardEl = document.getElementById("scoreboard");  
  const screenEl = document.getElementById("screen");
  const targetContainerEl = document.getElementById("target-container");
  const overlayEl = document.getElementById("overlay");
  const targetDurationEl = document.getElementById("targetDuration");
  const targetDiameterEl = document.getElementById("targetDiameter");
  const spawnIntervalEl = document.getElementById("spawnInterval");
  const screenWidthEl = document.getElementById("screenWidth");
  const screenHeightEl = document.getElementById("screenHeight");
  const targetDurationOutEl = document.getElementById("targetDurationOut");
  const targetDiameterOutEl = document.getElementById("targetDiameterOut");
  const spawnIntervalOutEl = document.getElementById("spawnIntervalOut");
  const fullscreenEl = document.getElementById("fullscreen");
  const screenWidthOutEl = document.getElementById("screenWidthOut");
  const screenHeightOutEl = document.getElementById("screenHeightOut");
  const targetHitsOut = document.getElementById("targetHits");
  const missedClicksOut = document.getElementById("missedClicks");
  const totalClicksOut = document.getElementById("totalClicks");
  const accuracyOut = document.getElementById("accuracy");
  const targetsLostOut = document.getElementById("targetsLost");
  const targetCount = 1;
  let targetDuration = 2;
  let targetDiameter = 50;
  let spawnInterval = 750;
  let isFullscreen = true;
  let screenWidth = '800px';
  let screenHeight = '600px';
  let targetDurationT = 2;
  let targetDiameterT = 50;
  let spawnIntervalT = 750;
  let deadTargets = 0;
  let hits = 0;
  let misses = 0;
  let running = false;
  let spawnClock;

  const hideEl = (el) => {
    el.style.display = "none";
  }

  const showEl = (el) => {
    el.style.display = "";
  }

  const handleSpaceBtn = (event) => {
    if (event.code != "Space") return;
    event.preventDefault();
    running ? stopGame() : startGame();
  };

  const startGame = () => {
    if (running) return;
    running = true;
    // Caputures settings to be used for duration of game.
    // If controls are changed, no affect is
    // taken until next game start.
    targetDurationT = targetDuration;
    targetDiameterT = targetDiameter;
    spawnIntervalT = spawnInterval;
    deadTargets = 0;
    hits = 0;
    misses = 0;
    hideEl(controlsEl);
    hideEl(scoreBoardEl);
    hideEl(overlayEl)
    showEl(targetContainerEl)
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
    showEl(controlsEl);
    showEl(scoreBoardEl);
    showEl(overlayEl)
    hideEl(targetContainerEl)
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

  const handleFullscreenChange = (event) => {
    isFullscreen = event.target.checked;
    setResolution();
  }

  const handleWidthChange = (event) => {
    screenWidth = event.target.value + "px";
    screenWidthOutEl.textContent = screenWidth;
    setResolution();
  }

  const handleHeightChange = (event) => {
    screenHeight = event.target.value + "px";
    screenHeightOutEl.textContent = screenHeight;
    setResolution();
  }

  const setResolution = () => {
    if (isFullscreen) {
      screenEl.style.width = "";
      screenEl.style.height = "";
    } else {
      screenEl.style.width = screenWidth;
      screenEl.style.height = screenHeight;
    }

  }

  const handleTargetClick = (event) => {
    if (running && event.target.id.includes("target-container")) {
      targetMiss();
    }
    if (!event.target.className.includes("target")) return;
    targetHit(event.target);
  };

  const setScoreboard = () => {
    let totalClicks = hits + misses;
    targetHitsOut.innerText = hits
    missedClicksOut.innerText = misses
    totalClicksOut.innerText = totalClicks
    accuracyOut.innerText = ((hits / totalClicks) || 0).toFixed(3);
    targetsLostOut.innerText = deadTargets;
  };

  const updateLoop = () => {
    if (spawnClock) clearInterval(spawnClock);
    if (!running) return;
    spawnTarget(targetCount);
    spawnClock = setInterval(() => {
      spawnTarget(targetCount);
    }, spawnIntervalT);
  };

  const spawnTarget = (targetCount) => {
    for (let i = 0; i < targetCount; i++) {
      let target = document.createElement("div");
      target.className = "target";
      const { top, left } = getRandomPosition();
      target.style.top = top + "px";
      target.style.left = left + "px";
      target.style.width = targetDiameterT + "px";
      target.style.height = targetDiameterT + "px";
      target.style.animationDuration = targetDurationT / 2 + "s";
      targetContainerEl.appendChild(target);
      setTimeout(() => {
        targetDied(target);
      }, targetDurationT * 1000);
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
    deadTargets++;
  };

  const targetHit = (target) => {
    target.dataset.hit = true;
    target.remove();
    hits++;
  };

  const targetMiss = () => {
    misses++;
  };

  const getRandomPosition = () => {
    const { width, height } = targetContainerEl.getBoundingClientRect();
    const vw = width;
    const vh = height;
    const ew = targetDiameterT;
    const eh = targetDiameterT;
    const maxTop = vh - eh;
    const maxLeft = vw - ew;
    const top = getRandomInt(maxTop);
    const left = getRandomInt(maxLeft);
    return { top, left };
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  targetDurationEl.addEventListener("input", targetDurationChange);
  targetDiameterEl.addEventListener("input", targetDiameterChange);
  spawnIntervalEl.addEventListener("input", spawnIntervalChange);
  fullscreenEl.addEventListener("change", handleFullscreenChange);
  screenWidthEl.addEventListener("input", handleWidthChange);
  screenHeightEl.addEventListener("input", handleHeightChange);
  document.addEventListener("mousedown", handleTargetClick);
  document.addEventListener("keydown", handleSpaceBtn);
  hideEl(targetContainerEl)
});
