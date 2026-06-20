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

// Navigation & Mobile Drawer Elements
const sidebar = document.getElementById("mainSidebar");
const menuOverlay = document.getElementById("menuOverlay");
const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const navLinks = document.querySelectorAll(".sidebar__link");
const sections = document.querySelectorAll("#overview, #profile, #repositories, #languages, #status");

function openMobileMenu() {
  document.body.classList.add("sidebar-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";

  const activeLink = sidebar ? sidebar.querySelector(".sidebar__link.active") : null;
  if (activeLink) {
    activeLink.focus();
  }
}

function closeMobileMenu() {
  document.body.classList.remove("sidebar-open");
  if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  if (menuToggle) menuToggle.focus();
}

function updateActiveLink(activeLink) {
  navLinks.forEach(link => {
    link.classList.remove("active");
  });
  if (activeLink) {
    activeLink.classList.add("active");
  }
}

function highlightSectionFromHash() {
  const hash = window.location.hash;
  if (hash) {
    let activeHash = hash;
    if (hash === "#profile" || hash === "#languages") {
      activeHash = "#overview";
    }
    const matchingLink = document.querySelector(`.sidebar__link[href="${activeHash}"]`);
    if (matchingLink) {
      updateActiveLink(matchingLink);
      const targetSection = document.querySelector(hash);
      if (targetSection) {
        setTimeout(() => {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }, 100);
      }
    }
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

  // Hamburger menu toggle click
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.contains("sidebar-open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Close menu on clicking overlay
  if (menuOverlay) {
    menuOverlay.addEventListener("click", closeMobileMenu);
  }

  // Close menu on clicking close button
  if (menuClose) {
    menuClose.addEventListener("click", closeMobileMenu);
  }

  // Escape key navigation listener
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("sidebar-open")) {
      closeMobileMenu();
    }
  });

  // Handle smooth scroll and active link click updates
  navLinks.forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        if (document.body.classList.contains("sidebar-open")) {
          closeMobileMenu();
        }

        updateActiveLink(link);

        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

        history.pushState(null, null, targetId);
      }
    });
  });

  // Highlight hash section on load
  highlightSectionFromHash();

  // Scroll spy active highlighting with IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        let activeId = id;
        if (id === "profile" || id === "languages") {
          activeId = "overview";
        }
        const matchingLink = document.querySelector(`.sidebar__link[href="#${activeId}"]`);
        if (matchingLink) {
          updateActiveLink(matchingLink);
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Watch hashchange event
  window.addEventListener("hashchange", () => {
    let hash = window.location.hash;
    if (hash === "#profile" || hash === "#languages") {
      hash = "#overview";
    }
    const matchingLink = document.querySelector(`.sidebar__link[href="${hash}"]`);
    if (matchingLink) {
      updateActiveLink(matchingLink);
    }
  });

  console.log("GitHub Developer Explorer initialized");
});