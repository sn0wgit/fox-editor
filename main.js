window.onload = () => {
  let sideWindow;
  const themeList = ["md3light", "md3dark", "amoled", "mint"];
  const themeColors = ["#f2ecee", "#211f21", "#050b09", "#2b2b2b"];
  const themeButton = document.getElementById("fox-change-theme");
  const themeLink = document.getElementById("theme-link");
  const themeColor = document.getElementById("theme-color");
  const textarea = document.getElementById("katex-input");
  const output = document.getElementById("katex-output");
  const fullscreenButton = document.getElementById("fox-toggle-fullscreen");
  const openFileButton = document.getElementById("fox-open-file");
  const fileInputHTML = document.getElementById("file-input");
  const saveFileButton = document.getElementById("fox-save-file");
  const renameFileButton = document.getElementById("fox-rename-file");
  const printButton = document.getElementById("fox-print");
  const duoWindowButton = document.getElementById("fox-duowindow");
  const dialogNewFileName = document.getElementById("fox-new-filename");
  const dialogSettings = document.getElementById("fox-settings");
  const commonFileName = "New Document.katex";
  const welcomeMessage = `\\def\\fOX{f(O_X)}


\\htmlStyle{margin: 0 2.25em;}{\\LARGE\\textbf{Welcome to }\\href{https://github.com/sn0wgit/katex-editor}{\\bm\\fOX\\textbf{ editor}}\\textbf!}\\\\

\\htmlStyle{margin: 0 7.8em;}{\\text{Start writing math today!}}\\\\[0.5em]


{\\large\\textbf{Hints}}\\\\


\\htmlId{fox-open-file}{}\\text{ opens file from your device}\\\\

\\htmlId{fox-save-file}{}\\text{ saves file}\\\\

\\htmlId{fox-rename-file}{}\\text{ renames file}\\\\

\\htmlId{fox-print}{}\\text{ prints render (in some browsers}\\rightarrow\\text{saves as PDF)}\\\\

\\htmlId{fox-docs}{}\\text{ opens }\\href{https://katex.org/docs/supported}{\\KaTeX\\text{ documentation}}\\text{ in new tab}\\\\

\\htmlId{fox-duowindow}{}\\text{ opens render in new tab (useful for presentations or similar)}`;

  let fileName = localStorage.getItem("fox-filename") || commonFileName;
  if (fileName != commonFileName){
    document.title = fileName;
  }

  function renameFilePopup(){
    //dialogNewFileName.showModal();
    localStorage.setItem("fox-filename", prompt("Input new file name:"));
    updateFileName();
  }

  function updateFileName(){
    fileName = localStorage.getItem("fox-filename");
    document.title = fileName;
  }

  function setupTheme() {
    themeName = themeList[(themeList.indexOf(themeName) + 1) % themeList.length];
    localStorage.setItem("fox-theme", themeName);
    themeLink.setAttribute("href", `./themes/${themeName}.css`);
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
      localStorage.setItem("fox-filename", file.name || commonFileName);
      updateFileName();
      textarea.value = contents;
      updateOutput(contents, output);
    };
    reader.readAsText(file);
  }

  function saveFile() {
    let element = document.createElement('a');
    element.style.display = 'none';
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textarea.value));
    element.setAttribute('download', fileName);
  
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
  const newUser = localStorage.getItem("fox-theme") == null
  if (localStorage.getItem("fox-theme") == null){
    localStorage.setItem("fox-theme", themeList[0]);
  }
  let themeName = localStorage.getItem("fox-theme");
  themeLink.setAttribute("href", `./themes/${themeName}.css`);
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

  //Initialize rename button
  renameFileButton.addEventListener("click", renameFilePopup);

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
