function updateTextContent(elementId, value) {
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = value;
  }
}

function updateStatus(title, message, type = "info") {
  const statusCard = document.getElementById("statusCard");

  if (!statusCard) {
    return;
  }

  statusCard.className = `status-card status-card--${type}`;

  statusCard.innerHTML = `
    <h3 class="status-card__title">${title}</h3>
    <p class="status-card__message">${message}</p>
  `;
}

function renderUserStats(user, repositories) {
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks_count, 0);

  updateTextContent("publicRepos", formatNumber(user.public_repos));
  updateTextContent("followers", formatNumber(user.followers));
  updateTextContent("following", formatNumber(user.following));
  updateTextContent("totalStars", formatNumber(totalStars));
  updateTextContent("totalForks", formatNumber(totalForks));
}

function renderUserProfile(user) {
  const avatar = document.getElementById("userAvatar");
  const profileLink = document.getElementById("githubProfileLink");

  if (avatar) {
    avatar.src = user.avatar_url;
    avatar.alt = `${user.login}'s GitHub avatar`;
  }

  if (profileLink) {
    profileLink.href = user.html_url;
  }

  updateTextContent("userName", getFallbackText(user.name, user.login));
  updateTextContent("userUsername", `@${user.login}`);
  updateTextContent("userBio", getFallbackText(user.bio, "This developer has not added a bio yet."));
  updateTextContent("userLocation", `Location: ${getFallbackText(user.location)}`);
  updateTextContent("userCompany", `Company: ${getFallbackText(user.company)}`);
  updateTextContent("userBlog", `Website: ${getFallbackText(user.blog)}`);
  updateTextContent("userJoined", `Joined: ${formatDate(user.created_at)}`);
}

function renderDeveloperOverview(user, repositories) {
  const languageBreakdown = calculateLanguageBreakdown(repositories);

  renderUserProfile(user);
  renderUserStats(user, repositories);
  renderRepositories(repositories);
  renderLanguageBreakdown(languageBreakdown);
}

function createRepositoryCard(repo) {
  const repoDescription = getFallbackText(
    repo.description,
    "No description provided for this repository."
  );

  const repoLanguage = getFallbackText(repo.language, "Not specified");

  return `
    <article class="repo-card">
      <div class="repo-card__header">
        <h4 class="repo-card__title">${repo.name}</h4>
        <span class="repo-card__badge">${repo.visibility || "public"}</span>
      </div>

      <p class="repo-card__description">${repoDescription}</p>

      <div class="repo-card__meta">
        <span>Language: ${repoLanguage}</span>
        <span>Stars: ${formatNumber(repo.stargazers_count)}</span>
        <span>Forks: ${formatNumber(repo.forks_count)}</span>
        <span>Issues: ${formatNumber(repo.open_issues_count)}</span>
        <span>Updated: ${formatDate(repo.updated_at)}</span>
      </div>

      <a
        href="${repo.html_url}"
        class="repo-card__button"
        target="_blank"
        rel="noopener noreferrer"
      >
        View Repository
      </a>
    </article>
  `;
}

function renderRepositories(repositories) {
  const repositoriesGrid = document.getElementById("repositoriesGrid");

  if (!repositoriesGrid) {
    return;
  }

  if (!repositories.length) {
    repositoriesGrid.innerHTML = `
      <article class="repo-empty-card">
        <h4>No public repositories found</h4>
        <p>This developer does not have any public repositories.</p>
      </article>
    `;
    return;
  }

  repositoriesGrid.innerHTML = repositories
    .map((repo) => createRepositoryCard(repo))
    .join("");
}

function renderSortedRepositories(sortType) {
  const sortedRepositories = sortRepositories(sortType);
  renderRepositories(sortedRepositories);
}

function createLanguageItem(languageData) {
  return `
    <div class="language-item">
      <div class="language-item__header">
        <span class="language-item__name">${languageData.language}</span>
        <span class="language-item__percentage">${languageData.percentage}%</span>
      </div>

      <div class="language-item__track">
        <div
          class="language-item__bar"
          style="width: ${languageData.percentage}%"
        ></div>
      </div>
    </div>
  `;
}

function renderLanguageBreakdown(languageBreakdown) {
  const languageList = document.getElementById("languageList");

  if (!languageList) {
    return;
  }

  if (!languageBreakdown.length) {
    languageList.innerHTML = `
      <p class="empty-text">
        No language data available for this developer.
      </p>
    `;
    return;
  }

  languageList.innerHTML = languageBreakdown
    .map((languageData) => createLanguageItem(languageData))
    .join("");
}

function renderEmptyRepositories(message = "Search for a GitHub username to view public repositories here.") {
  const repositoriesGrid = document.getElementById("repositoriesGrid");

  if (!repositoriesGrid) {
    return;
  }

  repositoriesGrid.innerHTML = `
    <article class="repo-empty-card">
      <h4>No repositories loaded</h4>
      <p>${message}</p>
    </article>
  `;
}

function renderEmptyLanguageBreakdown(message = "Language usage will appear after searching a developer.") {
  const languageList = document.getElementById("languageList");

  if (!languageList) {
    return;
  }

  languageList.innerHTML = `
    <p class="empty-text">${message}</p>
  `;
}

function clearDeveloperData() {
  updateTextContent("publicRepos", "0");
  updateTextContent("followers", "0");
  updateTextContent("following", "0");
  updateTextContent("totalStars", "0");
  updateTextContent("totalForks", "0");

  updateTextContent("userName", "Developer Name");
  updateTextContent("userUsername", "@username");
  updateTextContent(
    "userBio",
    "Search for a GitHub user to view their bio and profile details."
  );
  updateTextContent("userLocation", "Location: Not available");
  updateTextContent("userCompany", "Company: Not available");
  updateTextContent("userBlog", "Website: Not available");
  updateTextContent("userJoined", "Joined: Not available");

  const avatar = document.getElementById("userAvatar");
  const profileLink = document.getElementById("githubProfileLink");

  if (avatar) {
    avatar.src = "";
    avatar.alt = "GitHub user avatar";
  }

  if (profileLink) {
    profileLink.href = "#";
  }

  renderEmptyRepositories();
  renderEmptyLanguageBreakdown();
}