function formatNumber(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return String(value);
}

function formatDate(dateString) {
  if (!dateString) {
    return "Not available";
  }

  const date = new Date(dateString);

  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getFallbackText(value, fallback = "Not available") {
  return value && String(value).trim() ? value : fallback;
}

function sanitizeUsername(username) {
  return username.trim();
}

function calculateLanguageBreakdown(repositories) {
  const languageCounts = repositories.reduce((accumulator, repo) => {
    if (!repo.language) {
      return accumulator;
    }

    accumulator[repo.language] = (accumulator[repo.language] || 0) + 1;
    return accumulator;
  }, {});

  const totalLanguageRepos = Object.values(languageCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  if (totalLanguageRepos === 0) {
    return [];
  }

  return Object.entries(languageCounts)
    .map(([language, count]) => ({
      language,
      count,
      percentage: Math.round((count / totalLanguageRepos) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);
}