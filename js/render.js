function updateTextContent(elementId, value) {
  const element = document.getElementById(elementId);

  if (element) {
    element.textContent = value;
  }
}

function updateStatus(title, message) {
  updateTextContent("statusCard", "");

  const statusCard = document.getElementById("statusCard");

  if (!statusCard) {
    return;
  }

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
  renderUserProfile(user);
  renderUserStats(user, repositories);
  renderRepositories(repositories);
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