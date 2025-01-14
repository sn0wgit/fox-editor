window.onload = () => {
  let sideWindow;
  const themeList = ["md3light", "md3dark", "amoled", "mint"];
  const themeColors = ["#f2ecee", "#211f21", "#2b2b2b"];
  const themeButton = document.getElementById("change-theme");
  const themeLink = document.getElementById("theme-link");
  const themeColor = document.getElementById("theme-color");
  const textarea = document.getElementById("katex-input");
  const output = document.getElementById("katex-output");
  const fullscreenButton = document.getElementById("toggle-fullscreen");
  const openFileButton = document.getElementById("open-file");
  const fileInputHTML = document.getElementById("file-input");
  const saveFileButton = document.getElementById("save-file");
  const printButton = document.getElementById("print");
  const duoWindowButton = document.getElementById("duowindow");
  const welcomeMessage = `\\textbf{\\LARGE{\\text{Welcome to }\\KaTeX\\text{ editor!}}}\\\\

\\normalsize\\text{Start writing math today!}\\\\

\\text{Useful links: }
\\href{https://katex.org/docs/supported}{\\text{\\KaTeX~documentation}}, \\href{https://github.com/sn0wgit/katex-editor}{
  \\text{Project on}~
  \\includegraphics[height=0.9em, width=0.9em, alt=GitHub]{https://github.com/fluidicon.png}
}

\\\\[1em]

\\footnotesize\\text{🤫 You can use \\textbf{Print} feauture to print the document content}`

  function setupTheme() {
    themeName = themeList[(themeList.indexOf(themeName) + 1) % themeList.length];
    localStorage.setItem("katex-theme", themeName);
    themeLink.setAttribute("href", `./${themeName}.css`);
    themeColor.setAttribute("content", themeColors[themeList.indexOf(themeName)])
  }

  // https://stackoverflow.com/a/26298948
  function readSingleFile(e) {
    let file = e.target.files[0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function(e) {
      let contents = e.target.result;
      textarea.value = contents;
      updateOutput(contents, output);
    };
    reader.readAsText(file);
  }

  function saveFile() {
    let element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textarea.value));
    element.setAttribute('download', "New Document.katex");
  
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function updateOutput(input, output){
    localStorage.setItem("fox-value", input);
    if (!sideWindow || sideWindow.closed && !document.body.classList.contains("duowindow")){
      output.innerHTML = katex.renderToString(input, {
        output: "html",
        trust: true,
      });
    }
  }

  function print(){
    output.innerHTML = katex.renderToString(textarea.value, {
      output: "html",
      trust: true,
    });
    window.print();
  }

  function sideWindowClosed(){
    sideWindow.removeEventListener("beforeunload", sideWindowClosed);
    duoWindowButton.classList.remove("active");
    document.body.classList.remove("duowindow");
    updateOutput(textarea.value, output);
  }

  function openSideWindow(){
    if (!sideWindow || sideWindow.closed && !document.body.classList.contains("duowindow")) {
      sideWindow = window.open("./sidewindow/", "sidewindow", 'height=600px,width=800px');
      sideWindow.addEventListener("beforeunload", sideWindowClosed)
      
      duoWindowButton.classList.add("active");
      document.body.classList.add("duowindow");
    } else {
      sideWindow = sideWindow.close();
      duoWindowButton.classList.remove("active");
      document.body.classList.remove("duowindow");
      updateOutput(textarea.value, output);
    }
  }
  
  //Initialize themes
  const newUser = localStorage.getItem("katex-theme") == null
  if (localStorage.getItem("katex-theme") == null){
    localStorage.setItem("katex-theme", themeList[0]);
  }
  let themeName = localStorage.getItem("katex-theme");
  themeLink.setAttribute("href", `./${themeName}.css`);
  themeButton.addEventListener("click", () => setupTheme(), false);

  //Initialize fullscreen button
  fullscreenButton.addEventListener("click", () => {
    document.body.classList.toggle("fullscreen");
    fullscreenButton.classList.toggle("active")
  });

  //Initialize file opening button
  openFileButton.addEventListener("click", () => fileInputHTML.click());
  fileInputHTML.addEventListener("change", readSingleFile);

  //Initialize download button
  saveFileButton.addEventListener("click", saveFile);

  //Initialize print button
  printButton.addEventListener("click", print);

  //Initialize duowindow button
  duoWindowButton.addEventListener("click", openSideWindow);

  //Initialize input area
  if (newUser){
    localStorage.setItem("fox-value", welcomeMessage);
  }
  textarea.value = localStorage.getItem("fox-value") || "";
  textarea.focus();

  //Initialize KaTeX
  updateOutput(textarea.value, output);
  textarea.addEventListener("input", () => updateOutput(textarea.value, output))
}
