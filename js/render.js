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
}