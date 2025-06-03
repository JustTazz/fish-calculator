const container = document.getElementById("fish-container");
const counts = {};

fetch("fish.json")
  .then((response) => response.json())
  .then((fishData) => {
    fishData.forEach((fish, index) => {
      counts[index] = 0;

      const btn = document.createElement("div");
      btn.classList.add("fish-button");
      btn.style.position = "relative";

      const isFishShiny = isShiny(fish.nom);

      btn.innerHTML = `
        <div style="display: flex; gap: 10px;">
          <img src="src/img/${getImageName(fish.nom)}.png" alt="${fish.nom}"
            style="width: 32px; height: 32px; border-radius: 20px; background-color: ${
              isFishShiny ? "gold" : "transparent"
            };">
          <div>
            <div class="fish-name" style="${
              isFishShiny
                ? "color: gold;text-shadow: 1px 1px 2px black; font-weight: bold;"
                : ""
            }">${fish.nom}</div>
            <div class="fish-stats">Golds: ${fish.golds} | XP: ${fish.xp}</div>
          </div>
        </div>

        <div style="margin-top: 8px; display: flex; gap: 8px;">
          <button class="minus-btn" style="padding: 2px 8px;">-</button>
          <div class="count-badge">0</div>
          <button class="plus-btn" style="padding: 2px 8px;">+</button>
        </div>
      `;

      const plusBtn = btn.querySelector(".plus-btn");
      const minusBtn = btn.querySelector(".minus-btn");
      const countBadge = btn.querySelector(".count-badge");

      plusBtn.addEventListener("click", () => {
        counts[index]++;
        countBadge.textContent = counts[index];
        btn.classList.add("selected");
        updateResult(fishData);
      });

      minusBtn.addEventListener("click", () => {
        if (counts[index] > 0) {
          counts[index]--;
          countBadge.textContent = counts[index];
          if (counts[index] === 0) {
            btn.classList.remove("selected");
          }
          updateResult(fishData);
        }
      });

      container.appendChild(btn);
    });

    updateResult(fishData);
  })
  .catch((err) => {
    console.error("Erreur chargement JSON:", err);
  });

function isShiny(name) {
  return name.toLowerCase().startsWith("shiny");
}

function getImageName(name) {
  if (isShiny(name)) {
    return name.toLowerCase().replace("shiny ", "").replace(/ /g, "_");
  }
  return name.toLowerCase().replace(/ /g, "_");
}

function updateResult(fishData) {
  let totalXP = 0;
  let totalGolds = 0;
  let totalFish = 0;

  const summaryLines = [];

  fishData.forEach((fish, index) => {
    const count = counts[index];
    if (count > 0) {
      const gold = fish.golds * count;
      const xp = fish.xp * count;
      totalGolds += gold;
      totalXP += xp;
      totalFish += count;

      const isFishShiny = isShiny(fish.nom);
      summaryLines.push(`
        <div style="display: flex; justify-content: space-between; gap: 10px; margin: 4px 0; align-items: center;">
          <span style="display: flex; align-items: center; gap: 6px;">
            <img src="src/img/${getImageName(fish.nom)}.png" alt="${fish.nom}" 
              style="width: 24px; height: 24px; border-radius: 20px; background-color: ${
                isFishShiny ? "gold" : "transparent"
              };">
            <strong style="${
              isFishShiny ? "color: gold; text-shadow: 1px 1px 2px black;" : ""
            }">${fish.nom}</strong> x${count}
          </span>
          <span>
            <img src="src/img/gold_icon.png" alt="Gold" style="width: 16px; height:text-shadow: 1px 1px 2px black; 16px; vertical-align: middle;">
            ${gold} |
            <img src="src/img/xp.svg" alt="XP" style="width: 16px; height: 16px;text-shadow: 1px 1px 2px black; vertical-align: middle;">
            ${xp}
          </span>
        </div>
      `);
    }
  });

  const result = document.getElementById("result");
  result.innerHTML = `
    <img src="src/img/xp.svg" alt="XP" style="width: 20px; height: 20px; vertical-align: middle;">
    <span id="xp-text">${totalXP}</span> |
    <img src="src/img/gold_icon.png" alt="Gold" style="width: 20px; height:  1px 1px 2px black; vertical-align: middle;">
    <span id="gold-text">${totalGolds}</span>
  `;

  const summary = document.getElementById("summary");
  if (totalFish > 0) {
    summary.innerHTML = `
      <h3>I caught ${totalFish}🐟${totalFish > 1 ? "" : ""} :</h3>
      <p>I won 
        <img src="src/img/xp.svg" alt="XP" style="width: 20px; height: 20px ; vertical-align: middle;"> <strong>${totalXP}</strong> and 
        <img src="src/img/gold_icon.png" alt="Gold" style="width: 20px; height: 20px; vertical-align: middle;"> <strong>${totalGolds}</strong> 
      </p>
      <div style="margin-top: 10px;">${summaryLines.join("")}</div>
    `;
  } else {
    summary.innerHTML = "";
  }
}
document.getElementById("scroll-to-summary").addEventListener("click", () => {
  document.getElementById("summary-container").scrollIntoView({
    behavior: "smooth",
  });
});
