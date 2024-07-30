window.onload = (event) => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("q");
    const color = url.searchParams.get("color");
    const background = url.searchParams.get("background");
    const output = document.getElementById("output");
    output.innerHTML = katex.renderToString(code);
    if (color != "null"){
        output.style.color = `#${color}`;
    }
    if (background != "null"){
        output.style.backgroundColor = `#${background}`;
    }
}