window.onload = (event) => {
  const themes = ["md3light", "md3dark", "mint"];
  const themebutton = document.getElementById("theme");
  let currentThemeName = (localStorage.getItem("katex-theme") !== "null") ? localStorage.getItem("katex-theme") : themes[0];
  localStorage.setItem("katex-theme", currentThemeName);
  console.log(currentThemeName);
  const currentTheme = document.getElementById("theme-link");
  currentTheme.setAttribute("href", `/${currentThemeName}.css`);
  const textarea = document.getElementById("katex-code");
  const output = document.getElementById("output");
  textarea.focus();
  themebutton.addEventListener("click", () => {
    currentThemeName = themes[(themes.indexOf(currentThemeName) + 1) % themes.length];
    localStorage.setItem("katex-theme", currentThemeName);
    console.log(currentThemeName);
    currentTheme.setAttribute("href", `/${currentThemeName}.css`);
  });
  textarea.addEventListener("input", () => {
    console.log(textarea.value)
    output.innerHTML = katex.renderToString(textarea.value);
  })
}