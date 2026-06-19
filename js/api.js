async function handleGitHubResponse(response) {
  if (response.status === 404) {
    throw new Error("No GitHub user found. Please check the username.");
  }

  if (response.status === 403) {
    throw new Error("GitHub API rate limit reached. Please try again later.");
  }

  if (!response.ok) {
    throw new Error("Something went wrong while fetching GitHub data.");
  }

  return response.json();
}

async function fetchGitHubUser(username) {
  const cleanUsername = sanitizeUsername(username);

  if (!cleanUsername) {
    throw new Error("Please enter a GitHub username.");
  }

  const response = await fetch(API_ENDPOINTS.user(cleanUsername));
  return handleGitHubResponse(response);
}

async function fetchUserRepositories(username) {
  const cleanUsername = sanitizeUsername(username);

  if (!cleanUsername) {
    throw new Error("Please enter a GitHub username.");
  }

  const response = await fetch(API_ENDPOINTS.repositories(cleanUsername));
  return handleGitHubResponse(response);
}

async function fetchDeveloperData(username) {
  const user = await fetchGitHubUser(username);
  const repositories = await fetchUserRepositories(username);

  return {
    user,
    repositories,
  };
}