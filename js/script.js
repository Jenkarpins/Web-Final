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
    console.error('Game name not found in URL.');
  }
  

  function renderAchievements(list) {
      const achievementsContainer = document.getElementById('achievements');
      achievementsContainer.innerHTML = '';

      list.forEach(ach => {
          const div = document.createElement('div');
          div.className = 'achievement';
          div.innerHTML = `
              <img src="${ach.icon || 'images/default-icon.png'}" alt="${ach.name} Icon">
              <div>
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
  }

  function updateProgressBar(progress) {
      const progressBar = document.getElementById('progress-bar-fill');
      const progressText = document.getElementById('progress-percentage');

      progressBar.style.width = progress + '%';
      progressText.innerText = progress.toFixed(0) + '%';
  }
});
