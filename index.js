window.addEventListener('DOMContentLoaded', (event) => {
  const targetContainerEl = document.getElementById("target-container");
  const targetCount = 1;
  const targetDuration = 2;
  const targetDiameter = 50;
  const spawnInterval = 750;
  let targetsDead = 0;
  let targetsHit = 0;
  let targetsMissed = 0;

  const gameStart = () => {
    spawnTarget(targetCount)
    setInterval(() => {
      spawnTarget(targetCount)
    }, spawnInterval)
  };

  const spawnTarget = (targetCount) => {
    for (let i = 0; i < targetCount; i++) {
      let target = document.createElement('div');
      target.className = "target medium";
      const {top, left} = getRandomPosition();
      target.style.top = top + "px";
      target.style.left = left + "px";
      target.style.width = targetDiameter + "px";
      target.style.height = targetDiameter + "px";
      target.style.animationDuration = (targetDuration / 2) + 's';
      // target.style = {...target.style, easyTarget}
      targetContainerEl.appendChild(target)
      setTimeout(() => {
        targetDied(target);
      }, targetDuration * 1000)
    }
  }

  const targetDied = (target) => {
    if (target.dataset.hit) return;
    target.remove();
    targetsDead++;
    console.log("targets dead: ", targetsDead);
  }

  const targetHit = (target) => {
    target.dataset.hit = true;
    target.remove();
    targetsHit++;
    console.log("targets hit: ", targetsHit);
  }

  const targetMiss = () => {
    targetsMissed++
    console.log("targets missed: ", targetsMissed);
  }

  const handleTargetClick = (event) => {
    if (event.target.id.includes("target-container")) {
      targetMiss()
    }
    if (!event.target.className.includes("target")) return;
    targetHit(event.target);
  }

  const getRandomPosition = () => {
    const {width, height} = targetContainerEl.getBoundingClientRect();
    const vw = width;
    const vh = height;
    const ew = targetDiameter;
    const eh = targetDiameter;
    const maxTop = (vh - eh);
    const maxLeft = (vw - ew);
    const top = getRandomInt(maxTop);
    const left = getRandomInt(maxLeft);
    return {top, left};
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  document.addEventListener("click", handleTargetClick)
  
  gameStart();
});



