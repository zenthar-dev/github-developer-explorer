const searchForm = document.getElementById("searchForm");
const usernameInput = document.getElementById("usernameInput");

async function handleDeveloperSearch(event) {
  event.preventDefault();

  const username = usernameInput.value;

  try {
    setLoading(true);
    setError(null);
    updateStatus("Fetching Profile", "Please wait while we fetch GitHub developer data...");

    const { user, repositories } = await fetchDeveloperData(username);

    setCurrentUser(user);
    setRepositories(repositories);

    renderDeveloperOverview(user, repositories);

    updateStatus(
      "Profile Loaded",
      `${user.login}'s GitHub profile and basic statistics are now visible.`
    );
  } catch (error) {
    setError(error.message);
    updateStatus("Unable to Load Profile", error.message);
  } finally {
    setLoading(false);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (searchForm) {
    searchForm.addEventListener("submit", handleDeveloperSearch);
  }

  console.log("GitHub Developer Explorer initialized");
});