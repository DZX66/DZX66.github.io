function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
// 应用用户自定义样式
var background = getCookie("config_background");
if(background){
if(background=="user"){
// 用户上传的图片
// 浏览器本地数据库
console.log(indexedDB);// window.indexedDB
let addFile;//添加文件的方法
// 打开数据库
const request = indexedDB.open('background_image', 2);
request.onerror = function (event) {
console.error('数据库打开报错');
}
request.onupgradeneeded = function (event) {
const db = event.target.result;
console.log('数据库需要升级');
// 创建一个对象存储空间
db.createObjectStore('imgStore', { keyPath: 'id', autoIncrement: false });
console.log('对象存储表创建成功');
}
request.onsuccess = function (event) {
const db = event.target.result;
console.log('数据库打开成功');
let getFile = function(){
// 连接数据库的表
const transaction = db.transaction(['imgStore'], 'readonly');
const objectStore = transaction.objectStore('imgStore');
// 获取数据
const re = objectStore.get(1);
re.onsuccess = function (event) {
console.log(re.result);
if(re.result!=undefined){

document.documentElement.style.setProperty("--background","url("+URL.createObjectURL(re.result.data)+")");
}
}
}
getFile()
}
}else{
if(background.startsWith("url")){
// 用户指定的网址
const background_img = document.createElement("img");
background_img.src = background.slice(4,-1);
background_img.style.display = "none";
document.head.appendChild(background_img);}
document.documentElement.style.setProperty("--background",background);
}}
if(getCookie("config_link_color")){
document.documentElement.style.setProperty("--link-color",getCookie("config_link_color"))
}
if(getCookie("config_link_color_hover")){
document.documentElement.style.setProperty("--link-color-hover",getCookie("config_link_color_hover"))
}
if(getCookie("config_theme_color")){
document.documentElement.style.setProperty("--theme-color",getCookie("config_theme_color"))
}
if(getCookie("config_theme_color_secondary")){
document.documentElement.style.setProperty("--theme-color-secondary",getCookie("config_theme_color_secondary"))
}
if(getCookie("config_foot_color")){
document.documentElement.style.setProperty("--foot-color",getCookie("config_foot_color"))
}
function apply_template() {

// 检查重定向
const url = new URL(window.location.href);
// 使用URLSearchParams读取参数
var source = url.searchParams.get('from');
if(source){
document.getElementById("article-block").innerHTML = "<span class='subtitle'>（重定向自[["+source+"]]）</span>" + document.getElementById("article-block").innerHTML;
// 删除url中的from参数
url.searchParams.delete("from");
url.search=url.searchParams.toString();
history.replaceState(null,"",url.href);
}

    // 二级模板处理
    // 特殊信息框（继承自infobox）：“现实人物”“先一起喊（接受shout参数）”“多图警告”“官方文档”

    var pObjs = document.getElementsByTagName("infobox");

    for (var i = 0; i < pObjs.length; i++) {
        if (pObjs[i].innerHTML == "现实人物") {
            pObjs[i].setAttribute("img_src", "https://img.moegirl.org.cn/common/thumb/b/bc/Commons-emblem-issue.svg/75px-Commons-emblem-issue.svg.png");
            pObjs[i].setAttribute("side_color", "orange");
            pObjs[i].setAttribute("width", "50"); pObjs[i].setAttribute("height", "49");
            pObjs[i].innerHTML = "<b>这是一个有关现存于世人物的条目。</b>所有内容仅供参考。理解万岁！";
        }
        else if (pObjs[i].innerHTML == "先一起喊") {
            pObjs[i].setAttribute("img_src", "https://img.moegirl.org.cn/common/thumb/6/6f/Emo_%E3%82%8F%E3%81%84%E3%81%AE%E3%82%8F%E3%81%84%E3%81%AE.png/75px-Emo_%E3%82%8F%E3%81%84%E3%81%AE%E3%82%8F%E3%81%84%E3%81%AE.png");
            pObjs[i].setAttribute("side_color", "pink");
            pObjs[i].setAttribute("width", "37"); pObjs[i].setAttribute("height", "49");
            pObjs[i].innerHTML = "进条目啥都别说，先一起喊：<b><big><big><big>{text}</big></big></big></b>".replace("{text}", pObjs[i].getAttribute("shout"));
        }
        else if (pObjs[i].innerHTML == "多图警告") {
            pObjs[i].setAttribute("img_src", "https://img.moegirl.org.cn/common/thumb/2/26/Nuvola_apps_important_blue.svg/75px-Nuvola_apps_important_blue.svg.png");
            pObjs[i].setAttribute("side_color", "blue");
            pObjs[i].setAttribute("width", "50"); pObjs[i].setAttribute("height", "44");
            pObjs[i].innerHTML = "这个条目包含了较多的图片，这可能会导致访问速度变慢，阅读体验变差，请耐心等待！<span class=\"heimu\">服务器是GitHub的</span>";
        }
        else if (pObjs[i].innerHTML == "官方文档") {
            pObjs[i].setAttribute("img_src", "https://img.moegirl.org.cn/common/thumb/3/3f/Commons-emblem-success.svg/113px-Commons-emblem-success.svg.png");
            pObjs[i].setAttribute("side_color", "green");
            pObjs[i].setAttribute("width", "50"); pObjs[i].setAttribute("height", "50");
            pObjs[i].innerHTML = "这个文档是<b>柳下回声</b>的<b>官方文档</b>，这意味着它与本网站的运作有所关联，一般情况下，本页面不宜频繁更改。";
        }
        else if (pObjs[i].innerHTML == "转载") {
            pObjs[i].setAttribute("img_src", "https://img.moegirl.org.cn/common/thumb/2/26/Nuvola_apps_important_blue.svg/75px-Nuvola_apps_important_blue.svg.png");
            pObjs[i].setAttribute("side_color", "blue");
            pObjs[i].setAttribute("width", "50"); pObjs[i].setAttribute("height", "44");
            pObjs[i].innerHTML = "<b>此内容的著作权不属于柳下回声</b>，编辑者仅以介绍为目的进行引用。<br/>另请编辑者注意：最好与原作者取得同意后再转载。";
        }
        else if (pObjs[i].innerHTML == "冒犯他人") {
            pObjs[i].setAttribute("img_src", "https://img.moegirl.org.cn/common/thumb/b/b1/Gnome-emblem-important.svg/75px-Gnome-emblem-important.svg.png");
            pObjs[i].setAttribute("side_color", "red");
            pObjs[i].setAttribute("width", "50"); pObjs[i].setAttribute("height", "50");
            pObjs[i].innerHTML = "<b class=\"stress\">此页面包含冒犯他人的内容。</b><br/>柳下回声仅以介绍为目的而提及。随意提及可能会导致他人的<b>厌恶</b>。<br/>同时也请编辑者注意，不要使用<b>极度不中立</b>的言论向读者喊话。";
        }
        else if (pObjs[i].innerHTML == "页内查找") {
            pObjs[i].setAttribute("img_src", "https://img.moegirl.org.cn/common/thumb/5/5c/Ambox_glass_green.svg/38px-Ambox_glass_green.svg.png");
            pObjs[i].setAttribute("side_color", "green");
            pObjs[i].setAttribute("width", "50"); pObjs[i].setAttribute("height", "50");
            pObjs[i].innerHTML = "<b>本页面内容较多，您可以使用浏览器的页内查找功能 <span style=\"color:green;\">Ctrl + F</span> (Windows/Linux) / <span style=\"color:green;\">⌘ + F</span> (MacOS) / <span style=\"color:green;\">右上角三个点 -> 查找页面内容/在网页上查找</span> (手机端) 查找所需要的信息。</b><br/>如果未能获取理想的搜索结果，可以尝试提取搜索项中的关键文本。";
        }
        else if (pObjs[i].innerHTML == "施工中") {
            pObjs[i].setAttribute("img_src", "https://img.moegirl.org.cn/common/thumb/2/26/Nuvola_apps_important_blue.svg/75px-Nuvola_apps_important_blue.svg.png");
            pObjs[i].setAttribute("side_color", "blue");
            pObjs[i].setAttribute("width", "50"); pObjs[i].setAttribute("height", "50");
            pObjs[i].innerHTML = "<b>这个页面正在施工中。</b><br/>您所看到的页面未必是最新，可能存在内容缺失。";
        }
        else if (pObjs[i].innerHTML == "长期更新") {
            pObjs[i].setAttribute("img_src", "https://img.moegirl.org.cn/common/thumb/1/19/Ambox_currentevent.svg/75px-Ambox_currentevent.svg.png");
            pObjs[i].setAttribute("side_color", "blue");
            pObjs[i].setAttribute("width", "50"); pObjs[i].setAttribute("height", "50");
            pObjs[i].innerHTML = "<b>此页面中存在需要长期更新的内容，现存条目中内容未必是最新。</b>";
        }
    }

    // 一级模板处理
    // 年月日
    // <year></year><month></month><day></day>
    today = new Date();
    var pObjs = document.getElementsByTagName("year");
    for (var i = 0; i < pObjs.length; i++) {
        pObjs[i].innerHTML = today.getFullYear()
    }
    var pObjs = document.getElementsByTagName("month");
    for (var i = 0; i < pObjs.length; i++) {
        pObjs[i].innerHTML = today.getMonth() + 1
    }
    var pObjs = document.getElementsByTagName("day");
    for (var i = 0; i < pObjs.length; i++) {
        pObjs[i].innerHTML = today.getDate()
    }

    // 网易云外链播放器
    //<wyy [auto="1"/"0"]>歌曲id/完整的歌曲链接</wyy>
    var pObjs = document.getElementsByTagName("wyy");
    if (pObjs.length > 3) {
        // 防止外链播放器过多导致卡顿
        for (var i = 0; i < pObjs.length; i++) {
            if (pObjs[i].innerHTML.startsWith("https")) { pObjs[i].innerHTML = pObjs[i].innerHTML.match(/\d+/g)[1] }
            if (pObjs[i].getAttribute("auto") == null) { pObjs[i].setAttribute("auto", "0") }
            pObjs[i].innerHTML = '<iframe title="网易云音乐" frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 loading="lazy" id="wyy_' + i + '" osrc="https://music.163.com/outchain/player?type=2&id=' + pObjs[i].innerHTML + '&auto=' + pObjs[i].getAttribute("auto")+ '&height=66"></iframe><button id="wyy_button_' + i + '" type="button" onclick="document.getElementById(\'wyy_' + i + '\').setAttribute(\'src\',document.getElementById(\'wyy_' + i + '\').getAttribute(\'osrc\'));document.getElementById(\'wyy_button_' + i + '\').outerHTML=\'\';">加载音乐</button>'
        }
    } else {
        for (var i = 0; i < pObjs.length; i++) {
            if (pObjs[i].innerHTML.startsWith("https")) { pObjs[i].innerHTML = pObjs[i].innerHTML.match(/\d+/g)[1] }
            if (pObjs[i].getAttribute("auto") == null) { pObjs[i].setAttribute("auto", "0") }
            pObjs[i].innerHTML = '<iframe title="网易云音乐" frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="https://music.163.com/outchain/player?type=2&id=' + pObjs[i].innerHTML + '&auto=' + pObjs[i].getAttribute("auto")+ '&height=66"></iframe>'
        }
    }

    // 自制音频播放器
    // <music src="音频链接" title="音频标题" img="图片链接" loop="1"/"0"></music>
    var pObjs = document.getElementsByTagName("music");
    for (var i = 0; i < pObjs.length; i++) {
        var title = pObjs[i].getAttribute("title");
        if (title == null) { title = "音频" }
        var img = pObjs[i].getAttribute("img");
        if (img == null) { img = "" }
        if (pObjs[i].getAttribute("loop") == null) {loop = "0"} else {loop = "1"}
        pObjs[i].innerHTML = '<div class="player player-mid f-cb f-pr"><div class="cover cover-sm f-pr"><img id="cover" src="'+img+'"><div class="mask"></div><div id="play" class="bg play-bg" data-action="play" onclick="play_music();"></div><div id="pause" class="bg pause-bg f-hide" data-action="pause" onclick="pause_music();"></div></div><div id="mid-ctrl" class="ctrlBox" style="width: 225px;"><div class="f-pr m_t"><i data-action="home" class="bg logo"></i><div id="mtitle" class="mtitle" style="width: 201px;"><marquee scrollamount="2" onmouseover="this.stop()" onmouseout="this.start()">'+title+'</marquee></div></div><div id="bar" class="bar" style="width: 181px;"><div class="played j-flag" style="width: 0.862466%;"><span class="bg thumb j-flag"></span></div></div></div><span id="time" class="time">- 00:00</span></div><audio id="audio" src="'+pObjs[i].getAttribute("src")+'" loop="'+loop+'"></audio>';
    }
if(document.getElementById("audio")){
setInterval(function(){
    var audio = document.getElementById("audio");
    var bar = document.getElementById("bar");
    var time = document.getElementById("time");
    bar.onclick = function(e){
        var x = e.clientX - bar.getBoundingClientRect().left;
        var percent = x / bar.offsetWidth;
        audio.currentTime = percent * audio.duration;
    }
    audio.ontimeupdate = function(){
        var percent = audio.currentTime / audio.duration;
        bar.children[0].style.width = percent * 100 + "%";
        var min = parseInt(audio.currentTime / 60);
        var sec = parseInt(audio.currentTime % 60);
        time.innerHTML = "- " + (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);
        if(audio.currentTime == audio.duration){
            document.getElementById("play").classList.remove("f-hide");
            document.getElementById("pause").classList.add("f-hide");
        }
    }
},1000);
}




    // 外部链接跳转

    // 百度搜索
    // <baidu>搜索关键词</baidu>
    var pObjs = document.getElementsByTagName("baidu");
    for (var i = 0; i < pObjs.length; i++) {
        pObjs[i].innerHTML = '<a href="https://www.baidu.com/s?wd=' + pObjs[i].innerHTML + '" target="_blank">' + pObjs[i].innerHTML + '</a>'
    }

    // 萌娘百科
    // <moegirl>页面名称（url中的）</moegirl>
    var pObjs = document.getElementsByTagName("moegirl");
    for (var i = 0; i < pObjs.length; i++) {
        pObjs[i].innerHTML = '<a href="https://zh.moegirl.org.cn/' + pObjs[i].innerHTML + '" target="_blank">' + pObjs[i].innerHTML + ' - 萌娘百科</a>'
    }

    // B站(接受bv号)
    // <bilibili title="标题（可选）">bv号</bilibili>
    var pObjs = document.getElementsByTagName("bilibili");
    for (var i = 0; i < pObjs.length; i++) {
        var title = pObjs[i].innerHTML;
        if (pObjs[i].hasAttribute("title")) { title = pObjs[i].getAttribute("title") + "(" + pObjs[i].innerHTML + ")"; }
        pObjs[i].innerHTML = '<a href="https://www.bilibili.com/video/' + pObjs[i].innerHTML + '" target="_blank">' + title + '</a>'
    }

    // 所有pre加上line-numbers类
    var pObjs = document.getElementsByTagName("pre");
    for (var i = 0; i < pObjs.length; i++) {
        pObjs[i].className = pObjs[i].className + " line-numbers"
    }

    // 信息框模板
    // <infobox img_src="" side_color="" height="50" width="50">content</infobox>
    var pObjs = document.getElementsByTagName("infobox");
    for (var i = 0; i < pObjs.length; i++) {
        var content = "<table class=\"common-box\" style=\"margin: 10px 10%; width:80%; background: #FBFBFB; border-left: 10px solid {color};\"><tbody><tr><td style=\"padding: 2px 0 2px 0.5em\"><img src=\"{img_src}\" width=\"{width}\" height=\"{height}\"></td><td style=\"padding: 0.25em 0.5em\">{text}</td></tr></tbody></table>".replace("{img_src}", pObjs[i].getAttribute("img_src")).replace("{color}", pObjs[i].getAttribute("side_color")).replace("{text}", pObjs[i].innerHTML);
        if (pObjs[i].getAttribute("width") != null) { content = content.replace("{width}", pObjs[i].getAttribute("width")) }
        else { content = content.replace("{width}", "50") }
        if (pObjs[i].getAttribute("height") != null) { content = content.replace("{height}", pObjs[i].getAttribute("height")) }
        else { content = content.replace("{height}", "50") }
        pObjs[i].innerHTML = content;
    }

    // 居中图片模板
    // <img_center img_src="" title="" width="" height="">description</img_center>
    var pObjs = document.getElementsByTagName("img_center");
    for (var i = 0; i < pObjs.length; i++) {
        if (pObjs[i].getAttribute("title") != null) { var title = pObjs[i].getAttribute("title") }
        else { var title = pObjs[i].innerHTML; }
        var content = "<figure class=\"container\"><a href=\"{src}\" target=\"_blank\"><img src=\"{src}\" title=\"{title}\" width=\"{width}\" height=\"{height}\"></a><figcaption>{description}</figcaption></figure>".replace(/{src}/g, pObjs[i].getAttribute("img_src")).replace("{title}", title).replace("{description}", pObjs[i].innerHTML);
        if (pObjs[i].getAttribute("width") != null) { content = content.replace("{width}", pObjs[i].getAttribute("width")) }
        else { content = content.replace("{width}", "") }
        if (pObjs[i].getAttribute("height") != null) { content = content.replace("{height}", pObjs[i].getAttribute("height")) }
        else { content = content.replace("{height}", "") }
        pObjs[i].innerHTML = content;
    }

    // 注释及外部链接模板
    // <refer>内容</refer>
    document.getElementById("article").innerHTML = document.getElementById("article").innerHTML + "<h2 id=\"references-title\">注释及外部链接</h2><ol id=\"references\"></ol>";
    var ol = document.getElementById("references");
    var pObjs = document.getElementsByTagName("refer");
    if (pObjs.length == 0) {
        document.getElementById("references-title").outerHTML = "";
        document.getElementById("references").outerHTML = "";
    }
    for (var i = 0; i < pObjs.length; i++) {
        var content = "<li><a href=\"#cite-{id}\">↑</a>&nbsp;<span id=\"ref-{id}\">{content}</span></li>".replace(/{id}/g, i + 1).replace("{content}", pObjs[i].innerHTML);
        pObjs[i].innerHTML = "<sup id=\"cite-{id}\"><a href=\"#ref-{id}\">[{id}]</a></sup>".replace(/{id}/g, i + 1);
        ol.innerHTML = ol.innerHTML + content;
    }

    // 鼠标悬浮的提示框

    // 外部函数返回一个闭包
    /**
     * @param {Element} fixedValue - 固定参数.
     * @returns {function}
     */
    function createButtonHandler(fixedValue) {
        // 内部函数是一个闭包，可以访问fixedValue参数
        return function () {
            const targetRect = fixedValue.getBoundingClientRect();
            const floatingBox = fixedValue.appendChild(document.createElement("div"));
            floatingBox.className = "referbox";
            floatingBox.style.display = 'block';
            const tail = floatingBox.appendChild(document.createElement("div"));
            tail.className = "tooltipTail"
            const content = floatingBox.appendChild(document.createElement("div"));
            content.className = "tooltipContent"
            content.innerHTML = document.getElementById(fixedValue.children[0].id.replace("cite", "ref")).innerHTML
            var restWidth = document.documentElement.clientWidth - targetRect.left;
            if (restWidth < floatingBox.offsetWidth && document.documentElement.clientWidth > 350) {
                var boxWidth = floatingBox.offsetWidth;
                floatingBox.style.left = targetRect.left - 11 - (boxWidth - restWidth) + 'px';
                tail.style.left = 15 + (boxWidth - restWidth) + 'px';
            } else {
                floatingBox.style.left = targetRect.left - 11 + 'px';
            }
            floatingBox.style.top = fixedValue.offsetTop - floatingBox.offsetHeight + 'px';
            fixedValue.addEventListener('mouseleave', function handle() {
                floatingBox.outerHTML = "";
                fixedValue.removeEventListener("mouseleave", handle)
            });
        }
    }

    var pObjs = document.getElementsByTagName("refer");
    for (var i = 0; i < pObjs.length; i++) {
        pObjs[i].addEventListener('mouseenter', createButtonHandler(pObjs[i]));
    }

    // 手机端refer链接不跳转
    if (document.documentElement.clientWidth <= 736) {
        var pObjs = document.getElementsByTagName("refer");
        for (var i = 0; i < pObjs.length; i++) {
            pObjs[i].children[0].children[0].setAttribute("href", "javascript:void(0);")
        }
    }
}
function generateCatalog(articleSelector, dirSelector) {
    //自动生成目录
    // 对于未解密的文档，不执行函数
    if (document.getElementById("inputer")) { return false; }
    // 获取文章元素和目录容器元素
    const article = document.querySelector(articleSelector);
    const catalogs = document.querySelector(dirSelector);
    // 获取层级关系
    var numbers = []
    const titles = article.querySelectorAll("h2,h3,h4,h5")
    let h2 = 0;
    let h3 = 0;
    let h4 = 0;
    let h5 = 0;
    for (var i = 0; i < titles.length; i++) {
        if (titles[i].tagName == "H2") {
            h2++;
            h3 = 0;
            h4 = 0;
            h5 = 0;
            numbers.push(String(h2));
        } else if (titles[i].tagName == "H3") {
            h3++;
            h4 = 0;
            h5 = 0;
            numbers.push(String(h2) + "." + String(h3));
        } else if (titles[i].tagName == "H4") {
            h4++;
            h5 = 0;
            numbers.push(String(h2) + "." + String(h3) + "." + String(h4));
        } else if (titles[i].tagName == "H5") {
            h5++;
            numbers.push(String(h2) + "." + String(h3) + "." + String(h4) + "." + String(h5));
        }
    }
    // 在文章元素内获取所有标题元素
    const articleHeadings = article.querySelectorAll('h1, h2, h3, h4, h5');

    // 遍历文章标题，生成目录
    articleHeadings.forEach(function (heading, index) {
        // 获取标题级别
        const headingLevel = heading.tagName.toLowerCase().replace('h', '');
        // 获取标题文本
        const headingName = heading.innerText.trim();
        let anchorName = heading.id;

        // 如果标题没有ID，则创建数字ID
        if (!anchorName) {
            anchorName = 'section-' + (index + 1);
            heading.id = anchorName; // 将数字ID赋值给标题的ID属性
        }

        // 设置不同级别标题的左边距
        let paddingLeft = 5 + (headingLevel - 1) * 5; // 5px起始值，每级标题增加5px内边距
        // 创建目录条目
        const catalogItem = document.createElement('div');
        catalogItem.innerHTML = `<a href="#${anchorName}" class="content-link"><div class="catalog catalog-${headingLevel}" name="${anchorName}"><span style="padding-left: ${paddingLeft}px;" class="content-text"><span class="number">${numbers[index]}</span>${headingName}</span></div></a>`;
        catalogs.appendChild(catalogItem);
    });
    // 说明已生成了目录
    document.getElementById("main").setAttribute("catalog_written", "true");
    // 监听滚动事件，自动更新目录高亮
    window.addEventListener('scroll', function () {
        const currentScroll = window.scrollY;
        let currentHeading = null;

        // 找到当前正在阅读的章节标题
        for (let i = articleHeadings.length - 1; i >= 0; i--) {
            const heading = articleHeadings[i];
            const headingOffset = heading.offsetTop;
            if (headingOffset <= currentScroll + 60) {
                currentHeading = heading;
                break;
            }
        }

        // 更新目录高亮
        const anchorName = currentHeading ? currentHeading.id : '';
        const activeCatalog = document.querySelector(`.catalog[name="${anchorName}"]`);
        if (activeCatalog) {
            // 移除所有已激活的目录条目的激活状态
            document.querySelectorAll('.catalog-active').forEach(function (item) {
                item.classList.remove('catalog-active');
            });
            // 将当前活动的目录条目添加激活状态
            activeCatalog.classList.add('catalog-active');

            // 滚动目录，使当前章节可见
            catalogs.scrollTop = activeCatalog.offsetTop - catalogs.offsetTop;
        }
    });
}

// 音乐播放器js部分
function play_music() {
        document.getElementById('play').classList.add('f-hide');
        document.getElementById('pause').classList.remove('f-hide');
        document.getElementById('audio').play();
    }
function pause_music() {
        document.getElementById('play').classList.remove('f-hide');
        document.getElementById('pause').classList.add('f-hide');
        document.getElementById('audio').pause();
    }
