/**
 * Boolean data type processor. To access value, callback it.
 * It also accepts handler function as second argument to process value updates.
 * @param {boolean} val Default value
 * @param {function(value: boolean)} handler 
 * @returns 
 */
function toggle(val = false, handler = {}){
  /**
   * By default callback will revert value.
   * If you want to safely read value, pass in `true`.
   * Returns inner value.
   */
  return function(read = false){
    if (!read){
      val = !val
      handler(val);
    }
    return val
  }
}
  
window.onload = () => {
  let sideWindow;

  const themeList = ["md3light", "md3dark", "amoled", "mint"];
  const themeColors = ["#f2ecee", "#211f21", "#050b09", "#2b2b2b"];
  const settingsButton = document.getElementById("fox-settings-button");
  const themeButtons = document.querySelectorAll("dialog#fox-settings div.themes button");
  const themeLink = document.getElementById("theme-link");
  const themeColor = document.getElementById("theme-color");
  const textarea = document.getElementById("katex-input");
  const output = document.getElementById("katex-output");
  const userstyles = document.getElementById("fox-userstyles")
  const fullscreenButton = document.getElementById("fox-toggle-fullscreen");
  const openFileButton = document.getElementById("fox-open-file");
  const fetchFileButton = document.getElementById("fox-fetch-file");
  const fileInputHTML = document.getElementById("file-input");
  const saveFileButton = document.getElementById("fox-save-file");
  const renameFileButton = document.getElementById("fox-rename-file");
  const printButton = document.getElementById("fox-print");
  const duoWindowButton = document.getElementById("fox-duowindow");
  const dialogFileFetch = document.getElementById("fox-fetch");
  const dialogNewFileName = document.getElementById("fox-filename");
  const dialogSettings = document.getElementById("fox-settings");
  const settings_commaDecimalFlag = document.querySelector("input#commaDecimalFlag");
  const settings_displayMode = document.querySelector("input#displayMode");
  const settings_macros = document.querySelector("textarea#macros");
  const settings_userstyles = document.querySelector("textarea#userstyles");
  const commonFileName = "New Document.katex";
  const welcomeMessage = `\\htmlStyle{margin: 0 2.25em;}{\\LARGE\\textbf{Welcome to }\\href{https://github.com/sn0wgit/katex-editor}{\\bm\\fOX\\textbf{ editor}}\\textbf!}\\\\

\\htmlStyle{margin: 0 7.8em;}{\\text{Start writing math today!}}\\\\[0.5em]


{\\large\\textbf{Hints}}\\\\


\\htmlId{fox-open-file}{}\\text{ opens file from your device}\\\\

\\htmlId{fox-save-file}{}\\text{ saves file}\\\\

\\htmlId{fox-rename-file}{}\\text{ renames file}\\\\

\\htmlId{fox-print}{}\\text{ prints render (in some browsers}\\rightarrow\\text{saves as PDF)}\\\\

\\htmlId{fox-docs}{}\\text{ opens }\\href{https://katex.org/docs/supported}{\\KaTeX\\text{ documentation}}\\text{ in new tab}\\\\

\\htmlId{fox-duowindow}{}\\text{ opens render in new tab (useful for presentations or similar)}`;

  /**
   * Function to handle `commaDecimal` param changes 
   */
  function commaDecimal_update(res){
    localStorage.setItem("fox-commaDecimal", res)
    output.classList.toggle("fox-commaDecimal", res)
  }
  let commaDecimal = toggle(
    (localStorage.getItem("fox-commaDecimal") || "false").toLowerCase() == 'true',
    commaDecimal_update
  );
  commaDecimal_update(commaDecimal(true));

  /**
   * Function to handle `displayMode` param changes 
   */
  function displayMode_update(res){
    localStorage.setItem("fox-displayMode", res)
    updateOutput()
  }
  let displayMode = toggle(
    (localStorage.getItem("fox-displayMode") || "false").toLowerCase() == 'true',
    displayMode_update
  );
  if (displayMode(true)) {
    settings_displayMode.value = 'on'
  }

  /**
   * Function to handle `macros` param changes 
   */
  function updateMacros(newValue){
    macros = JSON.parse(newValue) || ""
    localStorage.setItem("fox-macros", newValue)
    updateOutput()
  }
  let macros = JSON.parse(localStorage.getItem("fox-macros")) || { "\\fOX": "f(O_X)" };

  /**
   * Function to handle `userCSS` param changes 
   */
  function updateUserCSS(newValue){
    userCSS = newValue
    localStorage.setItem("fox-userCSS", newValue)
    userstyles.innerText = "@scope (output){" + userCSS + "}"
    updateOutput()
  }
  let userCSS = localStorage.getItem("fox-userCSS") || ".katex-display{margin-block: 0;}";
  userstyles.innerText = "@scope (output){" + userCSS + "}"

  let fileName = localStorage.getItem("fox-filename") || commonFileName;
  if (fileName != commonFileName){
    document.title = fileName;
  }

  async function initFile(handledFile) {
    let file = await handledFile.getFile();
    const reader = new FileReader();
    console.log(handledFile.name, file);
    console.log(file instanceof File, file instanceof Blob);
    reader.onload = function(content) {
      localStorage.setItem("fox-filename", handledFile.name || commonFileName);
      updateFileName();
      textarea.value = content;
      localStorage.setItem("fox-value", textarea.value);
      updateOutput();
    };
    reader.readAsText(file);
  }
  
  if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
    launchQueue.setConsumer((launchParams) => {
      if (!launchParams.files.length) {
        return;
      }
      for (const fileHandle of launchParams.files) {
        initFile(fileHandle)
      }
    });
  }

  function renameFilePopup(){
    dialogNewFileName.getElementsByTagName("input")[0].value = fileName
    dialogNewFileName.showModal();
    function catchEnter(event){
      console.log(event)
      if (event.key === "Enter") {
        dialogNewFileName.close()
        updateFileName();
        localStorage.setItem("fox-filename", dialogNewFileName.getElementsByTagName("input")[0].value || commonFileName);
      }
    }
    dialogNewFileName.getElementsByTagName("input")[0].addEventListener("keypress", catchEnter)
    dialogNewFileName.querySelector("button#close").addEventListener("click", () => dialogNewFileName.close())
    dialogNewFileName.addEventListener("close", () => {
      dialogNewFileName.getElementsByTagName("input")[0].removeEventListener("input", catchEnter)
      dialogNewFileName.querySelector("button#close").removeEventListener("click", () => dialogNewFileName.close())
    })
  }

  function updateFileName(){
    fileName = localStorage.getItem("fox-filename");
    document.title = fileName;
  }

  function setupTheme(_themeName) {
    themeName = _themeName
    localStorage.setItem("fox-theme", _themeName);
    themeLink.setAttribute("href", `./themes/${_themeName}.css`);
    themeColor.setAttribute("content", themeColors[themeList.indexOf(themeName)])
  }

  function initDocument(content, name) {
    localStorage.setItem("fox-filename", name || commonFileName);
    updateFileName();
    textarea.value = content;
    localStorage.setItem("fox-value", textarea.value);
    updateOutput();
  }

  // https://stackoverflow.com/a/26298948
  function readSingleFile(e) {
    let file = e.target.files[0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.onload = (e) => initDocument(e.target.result, file.name)
    reader.readAsText(file);
  }

  function closeFetchDialog(){
    dialogFileFetch.querySelector("dialog#fox-fetch button").removeEventListener("click", closeFetchDialog)
    dialogFileFetch.close()
    fetchFile()
  }

  function openFetchDialog(){
    dialogFileFetch.showModal()
    dialogFileFetch.querySelector("dialog#fox-fetch button").addEventListener("click", closeFetchDialog)
  }

  async function processSrcFile(URL){
    const originalDocumentName = document.title
    document.title = "Loading..."
    try {
      await fetch(URL, {method: 'GET', headers: {'Accept': 'text/plain'}}).then(response => {
        if (!response.ok) {
          throw new Error(`Network or server error, status ${response.status}`);
        }
        return response.text(); 
      }).then(textData => {initDocument(
        textData,
        decodeURI(URL.split("/").pop())
      )}).catch(error => {
        console.error('Unexpected error:', error);
      });
    } catch (error) {
      console.error(error.message);
      document.title = originalDocumentName
    }
  }

  function fetchFile(){
    processSrcFile(document.querySelector("dialog#fox-fetch input[type='text']").value)
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

  function updateOutput(){
    if (!sideWindow || sideWindow.closed && !document.body.classList.contains("duowindow")){
      output.innerHTML = katex.renderToString(textarea.value, {
        output: "html",
        trust: true,
        macros,
        displayMode: displayMode(true)
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
    updateOutput();
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
      updateOutput();
    }
  }

  //Initialize settings
  function initializeSettings(){
    settings_commaDecimalFlag.checked = commaDecimal(true);
    settings_commaDecimalFlag.addEventListener("input", () => {commaDecimal()});
    settings_displayMode.checked = displayMode(true);
    settings_displayMode.addEventListener("input", () => {displayMode()});
    settings_macros.value = localStorage.getItem("fox-macros");
    settings_macros.addEventListener("input", () => {
      updateMacros(settings_macros.value)
    });
    settings_userstyles.value = localStorage.getItem("fox-userCSS");
    settings_userstyles.addEventListener("input", () => {
      updateUserCSS(settings_userstyles.value)
    });
  }

  initializeSettings()

  function openSettings(){
    dialogSettings.showModal()
    dialogSettings.querySelector("button#close").addEventListener("click", () => dialogSettings.close())
  }
  settingsButton.addEventListener("click", openSettings)

  //Initialize macros
  
  //Initialize themes
  const newUser = localStorage.getItem("fox-theme") == null
  if (localStorage.getItem("fox-theme") == null){
    localStorage.setItem("fox-theme", themeList[0]);
  }
  let themeName = localStorage.getItem("fox-theme");
  themeButtons.forEach((theme) => {
    theme.addEventListener(
      "click",
      () => setupTheme(theme.getAttribute("id"))
    )
  });
  themeLink.setAttribute("href", `./themes/${themeName}.css`);
  themeColor.setAttribute("content", themeColors[themeList.indexOf(themeName)]);

  //Initialize fullscreen button
  fullscreenButton.addEventListener("click", () => {
    document.body.classList.toggle("fullscreen");
    fullscreenButton.classList.toggle("active")
  });

  //Initialize file opening button
  openFileButton.addEventListener("click", () => fileInputHTML.click());
  fileInputHTML.addEventListener("change", readSingleFile);

  //Initialize file fetch button
  fetchFileButton.addEventListener("click", openFetchDialog);

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
    localStorage.setItem("fox-macros", JSON.stringify(macros))
    localStorage.setItem("fox-userCSS", userCSS)
    localStorage.setItem("fox-displayMode", displayMode(true))
  }
  textarea.value = localStorage.getItem("fox-value") || "";
  textarea.focus();

  //Initialize KaTeX
  updateOutput();
  textarea.addEventListener("input", () => {
    localStorage.setItem("fox-value", textarea.value);
    updateOutput()
  })
}
