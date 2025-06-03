const container = document.getElementById("fish-container");
const counts = {};

fetch("fish.json")
  .then((response) => response.json())
  .then((fishData) => {
    fishData.forEach((fish, index) => {
      counts[index] = 0;

      const fishNameNormalized = fish.nom
        .toLowerCase()
        .replace(/^shiny\s+/, "")
        .replace(/ /g, "_");

      const btn = document.createElement("div");
      btn.classList.add("fish-button");
      btn.style.position = "relative";

      btn.innerHTML = `
        <div style="display: flex; gap: 10px;">
          <img src="src/img/${fishNameNormalized}.png" alt="${
        fish.nom
      }" style="width: 32px; height: 32px; background-color: ${
        fish.nom.toLowerCase().startsWith("shiny") ? "yellow" : "transparent"
      }; border-radius: 20px;">
          <div>
            <div class="fish-name">${fish.nom}</div>
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

function updateResult(fishData) {
  let totalXP = 0;
  let totalGolds = 0;

  fishData.forEach((fish, index) => {
    totalXP += fish.xp * counts[index];
    totalGolds += fish.golds * counts[index];
  });

  const result = document.getElementById("result");
  result.innerHTML = `
    <img src="src/img/xp.svg" alt="XP" style="width: 25px; height: 25px; vertical-align: middle;">
    <span id="xp-text">${totalXP}</span> |
    <img src="src/img/gold_icon.png" alt="Gold" style="width: 25px; height: 25px; vertical-align: middle;">
    <span id="gold-text">${totalGolds}</span>
  `;
}
