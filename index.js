window.addEventListener("DOMContentLoaded", () => {
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

  /**  How many targets to spawn at once. */
  const targetCount = 1;

  /** How long each target should display for
   *  before disappearing.
   */
  let targetDuration = 2;

  /** The size of each target. */
  let targetDiameter = 50;

  /** Interval between targets spawning. */
  let spawnInterval = 750;

  /** Whether or not the games boundaries should use the full
   *  screen or not.
   */
  let isFullscreen = true;

  /** The default screen width when fullscreen is disabled. */
  let screenWidth = '800px';

  /** The default screen height when fullscreen is disabled. */
  let screenHeight = '600px';

  /** Number of targets that were never clicked before 
   *  the target duration was reached. 
   */
  let deadTargets = 0;

  /** The number of clicks on targets. */
  let hits = 0;

  /** The number clicks that were not on a target. */
  let misses = 0;

  /** Whether or not the game is running */
  let running = false;

  /** Reference for the cuarrent spawn interval. */
  let spawnClock;

  /** Starts the game. */
  const startGame = () => {
    // If the game is running, do nothing.
    if (running) return;
    // If game is not running, start running it.
    running = true;
    // Reset scores
    deadTargets = 0;
    hits = 0;
    misses = 0;
    // Hide / show game elements for the running state.
    hideEl(controlsEl);
    hideEl(scoreBoardEl);
    hideEl(overlayEl)
    showEl(targetContainerEl)
    // Update game loop, with the new "running" state.
    updateLoop();
  };

  /** Stops the game. */
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

  const updateLoop = () => {
    // Clear the existing target spawner.
    if (spawnClock) clearInterval(spawnClock);
    // If the game is not running, do nothing else.
    if (!running) return;
    // Otherwise spawn new target(s) based on targetCount.
    spawnTarget(targetCount);
    // Start and save a new interval that will continue to spawn 
    // new targets until updateLoop is called again.
    spawnClock = setInterval(() => {
      spawnTarget(targetCount);
    }, spawnInterval);
  };

  /** Spawn new targets for the quanitity provided. */
  const spawnTarget = (targetCount) => {
    for (let i = 0; i < targetCount; i++) {
      let target = document.createElement("div");
      // Give the default "target" styling.
      target.className = "target";
      // Set the position of the target at a random location
      // within the "target-container" element.
      const { top, left } = getRandomPosition();
      target.style.top = top + "px";
      target.style.left = left + "px";
      // Set the targets w/h to the configured diameter.
      target.style.width = targetDiameter + "px";
      target.style.height = targetDiameter + "px";
      // Set the targets animation duration to the configured duration.
      target.style.animationDuration = targetDuration / 2 + "s";
      // Add target to the DOM.
      targetContainerEl.appendChild(target);
      // After the targets duration is up, 
      // mark it as a dead target, and remove
      // it from the dom.
      setTimeout(() => {
        targetDied(target);
      }, targetDuration * 1000);
    }
  };

  /** After the targets duration is up, 
   *  mark it as a dead target, and remove
   *  it from the dom.
   */
  const targetDied = (target) => {
    // If targetDied is called after
    // the game has already been stopped, do nothing.
    if (!running) return;
    // If the target has already been hit, do nothing.
    if (target.dataset.hit) return;
    // If the target has been marked as killed, 
    // meaning the target was alive when the 
    // game was stopped, then remove it, and do nothing else.
    if (target.dataset.killed) {
      target.remove();
      return;
    }
    // If the target was never hit or killed, and the game is 
    // running, remove the target, and tally up 1 dead target.
    target.remove();
    deadTargets++;
  };

  /** Event handle for when space button is pressed. 
   *  Starts / stops game.
   */
  const handleSpaceBtn = (event) => {
    if (event.code != "Space") return;
    event.preventDefault();
    running ? stopGame() : startGame();
  };

  /** Sets the target duration from an event. */
  const targetDurationChange = (event) => {
    targetDuration = event.target.value;
    targetDurationOutEl.textContent = event.target.value + "s";
  };

  /** Sets the target diameter from an event. */
  const targetDiameterChange = (event) => {
    targetDiameter = event.target.value;
    targetDiameterOutEl.textContent = event.target.value + "px";
  };
  
  /** Sets the spawn interval from an event. */
  const spawnIntervalChange = (event) => {
    spawnInterval = event.target.value;
    spawnIntervalOutEl.textContent = event.target.value + "ms";
  };

  /** Sets isFullscreen state from an event. */
  const handleFullscreenChange = (event) => {
    isFullscreen = event.target.checked;
    setResolution();
  }
  
  /** Sets the screenWidth state from an event. */
  const handleWidthChange = (event) => {
    screenWidth = event.target.value + "px";
    screenWidthOutEl.textContent = screenWidth;
    setResolution();
  }

  /** Sets the screenHeight state from an event. */  
  const handleHeightChange = (event) => {
    screenHeight = event.target.value + "px";
    screenHeightOutEl.textContent = screenHeight;
    setResolution();
  }

  /** Sets the resolution of the playing space for the game. */
  const setResolution = () => {
    // If fullscreen uses default 100vw, 100vh styles on the element.
    if (isFullscreen) {
      screenEl.style.width = "";
      screenEl.style.height = "";
    // Otherwise set the custom width/height from controls.
    } else {
      screenEl.style.width = screenWidth;
      screenEl.style.height = screenHeight;
    }
  }

  /** Handle target clicks and misses */
  const handleTargetClick = (event) => {
    // If the click is inside the target-container,
    //  but not on a target trigger a miss.
    if (running && event.target.id.includes("target-container")) {
      targetMiss();
    }
    // If the click was on a target, trigger a hit.
    if (!event.target.className.includes("target")) return;
    targetHit(event.target);
  };

  /** Sets new score to the DOM based on the current game state. */
  const setScoreboard = () => {
    let totalClicks = hits + misses;
    targetHitsOut.innerText = hits
    missedClicksOut.innerText = misses
    totalClicksOut.innerText = totalClicks
    accuracyOut.innerText = ((hits / totalClicks) || 0).toFixed(3);
    targetsLostOut.innerText = deadTargets;
  };

  /** Tally up 1 hit. Mark target as hit.
   *  Immediately remove target from the dom. 
   */
  const targetHit = (target) => {
    target.dataset.hit = true;
    target.remove();
    hits++;
  };

  /** Tally up 1 miss. */
  const targetMiss = () => {
    misses++;
  };
  
  /** Gets a random top, and left position
   *  that is within the target container,
   *  and will not bleed targets at their largest size
   *  outside of the container.
   */
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

  /** Gets a randon int between 0 and provided max */
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /** Hides an element. */
  const hideEl = (el) => {
    el.style.display = "none";
  }

  /** Shows an element assuming its default style
   *  shows element as visible. 
   */
  const showEl = (el) => {
    el.style.display = "";
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
