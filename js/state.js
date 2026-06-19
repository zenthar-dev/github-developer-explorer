const appState = {
  currentUser: null,
  repositories: [],
  filteredRepositories: [],
  languages: {},
  isLoading: false,
  error: null,
};

function setCurrentUser(user) {
  appState.currentUser = user;
}

function setRepositories(repositories) {
  appState.repositories = repositories;
  appState.filteredRepositories = repositories;
}

function setLanguages(languages) {
  appState.languages = languages;
}

function setLoading(isLoading) {
  appState.isLoading = isLoading;
}

function setError(errorMessage) {
  appState.error = errorMessage;
}

function sortRepositories(sortType) {
  const repositoriesCopy = [...appState.repositories];

  switch (sortType) {
    case "stars":
      appState.filteredRepositories = repositoriesCopy.sort(
        (a, b) => b.stargazers_count - a.stargazers_count
      );
      break;

    case "forks":
      appState.filteredRepositories = repositoriesCopy.sort(
        (a, b) => b.forks_count - a.forks_count
      );
      break;

    case "updated":
      appState.filteredRepositories = repositoriesCopy.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
      );
      break;

    case "name":
      appState.filteredRepositories = repositoriesCopy.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    default:
      appState.filteredRepositories = repositoriesCopy;
      break;
  }

  return appState.filteredRepositories;
}