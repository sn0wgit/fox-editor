window.onload = () => {
  const themeList = ["md3light", "md3dark", "mint"];
  const themeButton = document.getElementById("change-theme");
  const themeLink = document.getElementById("theme-link");
  const textarea = document.getElementById("katex-input");
  const output = document.getElementById("katex-output");
  const fullscreenButton = document.getElementById("toggle-fullscreen");
  const downloadButton = document.getElementById("save-file");
  const defaultValue = `\\displaystyle

e=\\sum^\\infin_{n=0}\\cfrac1{n!}\\Leftrightarrow\\lim_{x\\rightarrow\\infin}\\Big(1+\\cfrac1x\\Big)^x`

  function setupTheme() {
    themeName = themeList[(themeList.indexOf(themeName) + 1) % themeList.length];
    localStorage.setItem("katex-theme", themeName);
    themeLink.setAttribute("href", `./${themeName}.css`);
  }

  function download() {
    var element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textarea.value));
    element.setAttribute('download', "New Document.katex");
  
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function updateOutput(input, output){
    output.innerHTML = katex.renderToString(input, {
      output: "html",
      trust: true,
    });
  }
  
  //Initialize themes
  if (localStorage.getItem("katex-theme") == null){
    localStorage.setItem("katex-theme", themeList[0]);
  }
  let themeName = localStorage.getItem("katex-theme");
  themeLink.setAttribute("href", `./${themeName}.css`);
  themeButton.addEventListener("click", () => setupTheme());

  //Initialize fullscreen button
  fullscreenButton.addEventListener("click", () => {
    document.body.classList.toggle("fullscreen");
    fullscreenButton.classList.toggle("active")
  });

  //Initialize download button
  downloadButton.addEventListener("click", () => download());

  //Initialize input area
  if (textarea.value == ""){
    textarea.value = defaultValue;
  };
  textarea.focus();

  //Initialize KaTeX
  updateOutput(textarea.value, output);
  textarea.addEventListener("input", () => updateOutput(textarea.value, output))
}
