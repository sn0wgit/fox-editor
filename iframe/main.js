async function processSrcFile(srcFile){
    try {
        const response = await fetch(srcFile, {method: 'GET', headers: {'Accept': 'text/plain'}}).then(response => {
            if (!response.ok) {
                throw new Error(`Ошибка сети или сервера, статус: ${response.status}`);
            }
            return response.text(); 
        }).then(textData => {render(textData)}).catch(error => {
            console.error('oops:', error);
        });
    } catch (error) {
        console.error(error.message);
    }
}
function render(appendedText){
    const url = new URL(window.location.href);
    const query = url.searchParams.get("q");
    const srcFile = url.searchParams.get("src");
    if (srcFile != "null" && appendedText == ""){
        processSrcFile(srcFile)
    }
    console.log(query);
    const code = (query == null) ? appendedText : query + appendedText;
    console.log(code);
    const color = url.searchParams.get("color");
    const background = url.searchParams.get("background");
    const output = document.getElementById("output");
    output.innerHTML = katex.renderToString(code, {
        output: "html",
        trust: true,
    });
    if (color != "null"){
        output.style.color = `#${color}`;
    }
    if (background != "null"){
        output.style.backgroundColor = `#${background}`;
    }
}

window.onload = (event) => {
    render("")
}