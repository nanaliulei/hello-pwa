// Test PWA badge api.
document.addEventListener('DOMContentLoaded', ()=> {
  const badgeVal = document.getElementById('badgeVal');
  // Click event handler for Set button.
  document.getElementById('butSet').addEventListener('click', () => {
    const val = parseInt(badgeVal.value, 10);
    if (isNaN(val)) {
      navigator.setAppBadge();
      return;
    }
    navigator.setAppBadge(val);
  });

  // Click event handler for Clear button.
  document.getElementById('butClear').addEventListener('click', () => {
    navigator.clearAppBadge();
  });

  // On page load, set the badge to a simple flag.
  window.addEventListener('load', () => {
    const val = parseInt(badgeVal.value, 10);
    if (isNaN(val)) {
      navigator.setAppBadge();
      return;
    }
    navigator.setAppBadge(val);
  });
})