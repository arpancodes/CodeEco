let theme = localStorage.getItem("theme") || null;

if (theme == null) {
  setTheme("dark");
} else {
  setTheme(theme);
}

let themeDots = document.getElementsByClassName("theme-dot");

for (var i = 0; themeDots.length > i; i++) {
  themeDots[i].addEventListener("click", function () {
    let mode = this.dataset.mode;
    console.log("Option clicked:", mode);
    setTheme(mode);
  });
}

function setTheme(mode) {
  if (mode == "light") {
    document.getElementById("theme-style").href = "light-theme.css";
  }

  if (mode == "dark") {
    document.getElementById("theme-style").href = "dark-theme.css";
  }

  localStorage.setItem("theme", mode);
}
