document.addEventListener('DOMContentLoaded', function () {
  let achievementsData = [];

  const urlParams = new URLSearchParams(window.location.search);
  const gameName = urlParams.get('game');

  if (gameName) {
    fetch(`../data/achievements-${gameName}.json`)
      .then(response => response.json())
      .then(data => {
        achievementsData = data.achievements;
        renderAchievements(achievementsData);
        updateProgress(achievementsData);
      })
      .catch(error => console.error('Failed to load achievements:', error));
  } else {

    setupGameSearch();
  }

  function renderAchievements(list) {
    const achievementsContainer = document.getElementById('achievements');
    achievementsContainer.innerHTML = '';

    list.forEach(ach => {
      const div = document.createElement('div');
      div.className = 'achievement';
      if (ach.completed) div.classList.add('checked');

      div.innerHTML = `
        <img src="${ach.icon || 'images/default-icon.png'}" alt="${ach.name} Icon">
        <div class="achievement-info">
          <h3>${ach.name}</h3>
          <p>${ach.description}</p>
          <p><em>Difficulty: ${ach.difficulty}</em></p>
          <p class="percentage">${ach.completed ? 'Completed' : 'Not Completed'}</p>
        </div>
      `;

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = ach.completed;
      checkbox.addEventListener('change', function () {
        ach.completed = this.checked;
        if (this.checked) {
          div.classList.add('checked');
        } else {
          div.classList.remove('checked');
        }

        const statusText = div.querySelector('.percentage');
        if (statusText) {
          statusText.textContent = ach.completed ? 'Completed' : 'Not Completed';
        }

        updateProgress(achievementsData);
      });

      div.appendChild(checkbox);
      achievementsContainer.appendChild(div);
    });
  }

  function updateProgress(achievements) {
    const totalAchievements = achievements.length;
    const completedAchievements = achievements.filter(ach => ach.completed).length;
    const progressPercentage = (completedAchievements / totalAchievements) * 100;

    updateProgressBar(progressPercentage);

    const stats = document.getElementById("game-stats");
    if (stats) {
      stats.innerText = `${completedAchievements} of ${totalAchievements} achievements unlocked`;
    }

    const totalSpan = document.getElementById("total-achievements");
    const completedSpan = document.getElementById("completed-achievements");
    if (totalSpan) totalSpan.textContent = totalAchievements;
    if (completedSpan) completedSpan.textContent = completedAchievements;
  }

  function updateProgressBar(progress) {
    const progressBar = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-percentage');

    if (progressBar) progressBar.style.width = progress + '%';
    if (progressText) progressText.innerText = progress.toFixed(0) + '%';
  }

  function setupGameSearch() {
    const searchInput = document.getElementById("game-search");
    const cards = document.querySelectorAll('.modern-card');
    const gameCount = document.getElementById("game-count");
  
    if (!searchInput || !cards.length) return;
  
    function updateCount() {
      const visibleCards = [...cards].filter(card => !card.classList.contains("hidden"));
      if (gameCount) {
        gameCount.textContent = `Showing ${visibleCards.length} game${visibleCards.length !== 1 ? "s" : ""}`;
      }
    }
  
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      cards.forEach(card => {
        const name = card.dataset.title?.toLowerCase() || "";
        card.classList.toggle("hidden", !name.includes(term));
      });
      updateCount();
    });
  
    updateCount();
  }
  
  
});
