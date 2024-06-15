 if(document.documentElement.clientWidth <= 736){
        document.getElementById("article-block").style.width = '100%';
        document.getElementById("left").style.marginTop = '0';
        document.getElementById("left").style.width = '300px';
        document.getElementById("main").style.width = '100%';
        document.getElementById("aside").style.width = '98%';
        document.getElementById("aside").style.position = 'fixed';
        document.getElementById("aside").style.marginLeft = '0';
        document.getElementById("aside").style.top = 'auto';
        document.getElementById("aside").style.bottom = '0';
        document.getElementById("aside").style.zIndex = '15';
        document.getElementById("aside").style.height = '70%';
        document.getElementById("aside").style.display = 'none';
        document.getElementById("float-toc-trigger").style.marginRight = '-1.5rem';
        document.getElementById("sidenav-header-close").style.display = 'block';
}
function open_info(){
document.body.style.overflow = 'hidden';
document.getElementById("black_backdrop").style.display = 'block';
document.getElementById("aside").style.display = 'block';
var pObjs = document.getElementsByClassName("content-link");
for (var i = 0; i < pObjs.length; i++) {
pObjs[i].setAttribute("onclick",'close_info();return true');
}
}

function close_info(){
document.body.style.overflow = 'auto';
document.getElementById("black_backdrop").style.display = 'none';
document.getElementById("aside").style.display = 'none';
}