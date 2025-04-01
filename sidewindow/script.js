window.onload = () => {
    const themeLink = document.getElementById("theme-link")
    if (localStorage.getItem("fox-theme") == null){
        localStorage.setItem("fox-theme", themeList[0]);
    }
    let themeName = localStorage.getItem("fox-theme");
    themeLink.setAttribute("href", `/fox-editor/themes/${themeName}-mini.css`);
    document.body.innerHTML = katex.renderToString(localStorage.getItem("fox-value"), {
        output: "html",
        trust: true,
    });
};

window.onstorage = () => {
    if (!document.getElementById("theme-link").getAttribute("href").includes(localStorage.getItem("fox-theme"))){
        /* if #theme-link[href*="%theme_name%"] is false, than update theme css*/
        document.getElementById("theme-link").setAttribute("href", `./${localStorage.getItem("fox-theme")}-mini.css`);
        /* otherwise that means that input is changed, so render have to be updated */
    } else {
        document.body.innerHTML = katex.renderToString(localStorage.getItem("fox-value"), {
            output: "html",
            trust: true,
        });
    }
}