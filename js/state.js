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