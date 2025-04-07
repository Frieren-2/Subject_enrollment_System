document.addEventListener("DOMContentLoaded", function () {
  const statsSection = document.querySelector(".stats-section");
  const departmentSection = document.querySelector(".department-section");
  const toggleBtn = document.getElementById("toggleView");
  const tabsContainer = document.querySelector(".sticky-tabs");

  // Initialize position
  let lastScrollTop = 0;
  updateStickyElements();

  // Handle scroll events
  window.addEventListener("scroll", function () {
    updateStickyElements();
  });

  // Handle toggle button
  toggleBtn.addEventListener("click", function () {
    departmentSection.classList.toggle("expanded");
    this.querySelector("i").classList.toggle("bx-collapse-alt");
    this.querySelector("i").classList.toggle("bx-expand-alt");
  });

  function updateStickyElements() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const statsHeight = statsSection.offsetHeight;

    if (scrollTop > statsHeight) {
      tabsContainer.classList.add("is-sticky");
      statsSection.classList.add("is-fixed");
    } else {
      tabsContainer.classList.remove("is-sticky");
      statsSection.classList.remove("is-fixed");
    }

    lastScrollTop = scrollTop;
  }
});
