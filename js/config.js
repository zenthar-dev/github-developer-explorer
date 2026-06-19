const GITHUB_API_BASE_URL = "https://api.github.com";

const API_ENDPOINTS = {
  user: (username) => `${GITHUB_API_BASE_URL}/users/${username}`,
  repositories: (username) =>
    `${GITHUB_API_BASE_URL}/users/${username}/repos?per_page=100&sort=updated`,
};