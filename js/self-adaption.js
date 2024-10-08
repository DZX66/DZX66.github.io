if (document.documentElement.clientWidth <= 736) {
    document.getElementById("article-block").style.width = '100%';
    document.getElementById("left").style.marginTop = '0';
    document.getElementById("left").style.width = '100%';
    document.getElementById("left").style.textAlign = 'center';
    document.getElementById("main").style.width = '100%';
    document.getElementById("aside").style.width = '98%';
    document.getElementById("aside").style.position = 'fixed';
    document.getElementById("aside").style.marginLeft = '0';
    document.getElementById("aside").style.top = 'auto';
    document.getElementById("aside").style.bottom = '0';
    document.getElementById("aside").style.zIndex = '15';
    document.getElementById("aside").style.height = '70%';
    document.getElementById("float-toc-trigger").style.marginRight = '-1.5rem';
    document.getElementById("sidenav-header-close").style.display = 'block';
}
function open_info() {
    document.body.style.overflow = 'hidden';
    document.getElementById("black_backdrop").style.display = 'block';
    document.getElementById("aside").classList.add("active");
    document.getElementById("aside").style.display = 'block';
    document.getElementById("aside").style.backgroundColor = 'rgba(255, 255, 255, 1)';
    if (document.getElementById("main").hasAttribute("catalog_written")) {
        if (!document.getElementById("main").hasAttribute("onclick_corrected")) {
            document.getElementById("main").setAttribute("onclick_corrected", "true");
            var pObjs = document.getElementsByClassName("content-link");
            for (var i = 0; i < pObjs.length; i++) {
                pObjs[i].setAttribute("onclick", 'close_info();return true');
            }
        }
    }
}

function close_info() {
    document.body.style.overflow = 'auto';
    document.getElementById("aside").classList.remove("active");
    document.getElementById("black_backdrop").style.display = 'none';
}