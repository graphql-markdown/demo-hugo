// GraphQL-Markdown emits field/argument names as self links (`href="#"`).
// Point each one at the heading that contains it so the name works as a
// permalink, and tag deprecated badges so they can be styled distinctly.
document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll("article :is(h3, h4, h5)[id] > a[href='#']")
    .forEach((link) => {
      link.href = `#${link.parentElement.id}`;
      link.classList.add("gqlmd-permalink");
    });
  document.querySelectorAll(".gqlmd-badge").forEach((badge) => {
    if (badge.textContent.trim() === "deprecated") {
      badge.classList.add("gqlmd-badge-deprecated");
    }
  });
});
