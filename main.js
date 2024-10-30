window.onload = (event) => {
  const textarea = document.getElementById("katex-code");
  textarea.focus();
  textarea.value = `\\displaystyle

e=\\sum^\\infin_{n=0}\\cfrac1{n!}\\Leftrightarrow\\Big(1+\\cfrac1x\\Big)^x`;
  const output = document.getElementById("output");
  output.innerHTML = katex.renderToString(textarea.value);
  textarea.addEventListener("input", () => {
    output.innerHTML = katex.renderToString(textarea.value);
  })
  
  const themes = ["md3light", "md3dark", "mint", "primer"];
  const themebutton = document.getElementById("theme");
  let currentThemeName = (localStorage.getItem("katex-theme") !== "null") ? localStorage.getItem("katex-theme") : themes[0];
  localStorage.setItem("katex-theme", currentThemeName);
  console.log(currentThemeName);
  const currentTheme = document.getElementById("theme-link");
  currentTheme.setAttribute("href", `./${currentThemeName}.css`);
  themebutton.addEventListener("click", () => {
    currentThemeName = themes[(themes.indexOf(currentThemeName) + 1) % themes.length];
    localStorage.setItem("katex-theme", currentThemeName);
    currentTheme.setAttribute("href", `./${currentThemeName}.css`);
  });

  const fullscreenButton = document.getElementById("fullscreen");
  fullscreenButton.addEventListener("click", () => {
    document.body.classList.toggle("fullscreen");
  });
}
