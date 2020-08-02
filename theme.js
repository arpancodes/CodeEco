let theme = localStorage.getItem("theme") || null;

if (theme == null) {
  setTheme("dark");
} else {
  setTheme(theme);
}

let themeBtn = document.getElementsById("theme-btn");


themeBtn.addEventListener('click', function () {
    let mode = this.dataset.mode;
    console.log("Option clicked:", mode);
    setTheme(mode);
  })

function setTheme(mode) {
  if (mode == "light") {
    document.getElementById("theme-style").href = "light-theme.css";
    document.getElementById("theme-btn").textContent = "Dark Theme";
    document.getElementById("theme-btn").dataset.mode = "dark";
  }

  if (mode == "dark") {
    document.getElementById("theme-style").href = "dark-theme.css";
    document.getElementById("theme-btn").textContent = "Light Theme";
    document.getElementById("theme-btn").dataset.mode = "light";
  }

  localStorage.setItem("theme", mode);
}
