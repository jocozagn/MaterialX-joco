(function () {
  function hideLoader() {
    var el = document.getElementById("initial-spinner");
    if (!el) return;
    el.classList.add("is-done");
    el.setAttribute("aria-busy", "false");
    window.setTimeout(function () {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    }, 400);
  }

  if (document.readyState === "complete") {
    window.setTimeout(hideLoader, 900);
  } else {
    window.addEventListener("load", function () {
      window.setTimeout(hideLoader, 900);
    });
  }

  var trip = document.getElementById("trip-type");
  var ret = document.querySelector(".kiu-return");
  var dates = document.querySelector(".kiu-dates");
  if (trip && ret) {
    var syncReturn = function () {
      var isRound = trip.value === "round";
      ret.hidden = !isRound;
      if (dates) dates.classList.toggle("is-oneway", !isRound);
      var input = ret.querySelector("input");
      if (input) input.required = isRound;
    };
    trip.addEventListener("change", syncReturn);
    syncReturn();
  }

  var form = document.getElementById("search-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var existing = form.parentNode.querySelector(".kiu-toast");
      if (existing) existing.remove();
      var toast = document.createElement("p");
      toast.className = "kiu-toast";
      toast.textContent =
        "Design demo — search is not connected to a live booking API.";
      form.parentNode.appendChild(toast);
    });
  }

  var newsletter = document.getElementById("newsletter-form");
  if (newsletter) {
    newsletter.addEventListener("submit", function (e) {
      e.preventDefault();
      var result = document.getElementById("newsletter-result");
      if (result) result.hidden = false;
    });
  }

  // Enable booking frame interaction (mirrors original iframe hover behavior)
  var section = document.querySelector(".booking-section");
  if (section) {
    section.classList.add("is-using");
  }
})();
