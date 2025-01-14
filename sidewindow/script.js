window.onload = () => {
    const themeLink = document.getElementById("theme-link")
    if (localStorage.getItem("katex-theme") == null){
        localStorage.setItem("katex-theme", themeList[0]);
    }
    let themeName = localStorage.getItem("katex-theme");
    themeLink.setAttribute("href", `./${themeName}-mini.css`);
    document.body.innerHTML = katex.renderToString(localStorage.getItem("fox-value"), {
        output: "html",
        trust: true,
    });
};

window.onstorage = () => {
    document.body.innerHTML = katex.renderToString(localStorage.getItem("fox-value"), {
        output: "html",
        trust: true,
    });
}