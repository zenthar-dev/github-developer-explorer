const searchForm = document.getElementById("searchForm");
const usernameInput = document.getElementById("usernameInput");
const sortReposSelect = document.getElementById("sortRepos");

async function handleDeveloperSearch(event) {
  event.preventDefault();

  const username = sanitizeUsername(usernameInput.value);

  if (!username) {
    clearDeveloperData();
    updateStatus(
      "Username Required",
      "Please enter a GitHub username before searching.",
      "warning"
    );
    return;
  }

  try {
    setLoading(true);
    setError(null);

    clearDeveloperData();

    updateStatus(
      "Fetching Profile",
      "Please wait while we fetch GitHub developer data...",
      "loading"
    );

    const { user, repositories } = await fetchDeveloperData(username);

    setCurrentUser(user);
    setRepositories(repositories);
    setLanguages(calculateLanguageBreakdown(repositories));

    renderDeveloperOverview(user, repositories);

    updateStatus(
      "Profile Loaded",
      `${user.login}'s GitHub profile, repositories, and language insights are now visible.`,
      "success"
    );
  } catch (error) {
    setError(error.message);
    clearDeveloperData();

    updateStatus("Unable to Load Profile", error.message, "error");
  } finally {
    setLoading(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (searchForm) {
    searchForm.addEventListener("submit", handleDeveloperSearch);
  }

  if (sortReposSelect) {
  sortReposSelect.addEventListener("change", (event) => {
    renderSortedRepositories(event.target.value);
  });
}

  console.log("GitHub Developer Explorer initialized");
});