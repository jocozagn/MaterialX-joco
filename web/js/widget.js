(function () {
  var trip = document.getElementById("trip-type");
  var returnWrap = document.getElementById("return-wrap");
  var datepicker = document.querySelector(".searchForm__datepicker");
  var returnInput = document.getElementById("return_date");

  function syncTripType() {
    var isRound = trip && trip.value === "round_trip";
    if (returnWrap) returnWrap.hidden = !isRound;
    if (datepicker) datepicker.classList.toggle("is-oneway", !isRound);
    if (returnInput) returnInput.required = !!isRound;
  }

  if (trip) {
    trip.addEventListener("change", syncTripType);
    syncTripType();
  }

  var promoToggle = document.getElementById("promo-toggle");
  var promoModal = document.getElementById("promo-modal");
  var promoLabel = document.getElementById("promo-label");
  var promoInput = document.getElementById("promo_code");
  var promoCancel = document.getElementById("promo-cancel");
  var promoContinue = document.getElementById("promo-continue");

  function closePromo() {
    if (promoModal) promoModal.hidden = true;
    if (promoToggle) promoToggle.setAttribute("aria-expanded", "false");
  }

  if (promoToggle && promoModal) {
    promoToggle.addEventListener("click", function () {
      var open = promoModal.hidden;
      promoModal.hidden = !open;
      promoToggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && promoInput) promoInput.focus();
    });
  }

  if (promoCancel) promoCancel.addEventListener("click", closePromo);

  if (promoContinue) {
    promoContinue.addEventListener("click", function () {
      if (promoLabel && promoInput) {
        promoLabel.textContent = promoInput.value.trim() || "Promo code";
      }
      closePromo();
    });
  }

  document.addEventListener("click", function (e) {
    if (!promoModal || promoModal.hidden) return;
    var root = document.querySelector(".promoCode");
    if (root && !root.contains(e.target)) closePromo();
  });

  var form = document.getElementById("search-form");
  var toast = document.getElementById("toast");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (toast) toast.hidden = false;
    });
  }
})();
