document.querySelectorAll(".post-show-btn").forEach((btn) => {
  const body = btn.parentElement.querySelector(".post-body");
  const snippet = btn.parentElement.querySelector(".post-snippet");
  body.style.display = "none";
  let isExpanded = false;

  btn.addEventListener("click", () => {
    if (isExpanded) {
      snippet.style.display = "block";
      btn.textContent = "Show more";
      body.style.display = "none";
      isExpanded = false;
    } else {
      snippet.style.display = "none";
      body.style.display = "block";
      btn.textContent = "Show less";
      isExpanded = true;
    }
  });
});
