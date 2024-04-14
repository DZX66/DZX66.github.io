function refresh(){
// 信息框模板
// <infobox img_src="" side_color="">content</infobox>
//根据标签名字获取标签
//特殊信息框：“现实人物”“先一起喊（接受shout参数）”
var pObjs = document.getElementsByTagName("infobox");
//var pObjs=document.getElementById("dv1").getElementsByTagName("p");
//循环遍历这个数组
for (var i = 0; i < pObjs.length; i++) {
    if(pObjs[i].innerHTML == "现实人物"){pObjs[i].innerHTML = "<table class=\"common-box\" style=\"margin: 10px 10%; width:80%; background: #FBFBFB; border-left: 10px solid orange;\"><tbody><tr><td style=\"padding: 2px 0 2px 0.5em\"><img src=\"https://img.moegirl.org.cn/common/thumb/b/bc/Commons-emblem-issue.svg/75px-Commons-emblem-issue.svg.png\" width=\"50\" height=\"49\"></td><td style=\"padding: 0.25em 0.5em\"><b>这是一个有关现存于世人物的条目。</b>编辑者不应对此条目所涉及的人物做出道德谴责，所有观点仅供参考，如觉得不妥，请联系编辑者修改或删除。</td></tr></tbody></table>"}else if(pObjs[i].innerHTML == "先一起喊"){pObjs[i].innerHTML = "<table class=\"common-box\" style=\"margin: 10px 10%; width:80%; background: #FBFBFB; border-left: 10px solid pink;\"><tbody><tr><td style=\"padding: 2px 0 2px 0.5em\"><img src=\"https://img.moegirl.org.cn/common/thumb/6/6f/Emo_%E3%82%8F%E3%81%84%E3%81%AE%E3%82%8F%E3%81%84%E3%81%AE.png/75px-Emo_%E3%82%8F%E3%81%84%E3%81%AE%E3%82%8F%E3%81%84%E3%81%AE.png\" width=\"37\" height=\"49\"></td><td style=\"padding: 0.25em 0.5em\">进条目啥都别说，先一起喊：<b><big><big><big>{text}</big></big></big></b></td></tr></tbody></table>".replace("{text}",pObjs[i].getAttribute("shout"))}else{
    pObjs[i].innerHTML = "<table class=\"common-box\" style=\"margin: 10px 10%; width:80%; background: #FBFBFB; border-left: 10px solid {color};\"><tbody><tr><td style=\"padding: 2px 0 2px 0.5em\"><img src=\"{img_src}\" width=\"50\" height=\"49\"></td><td style=\"padding: 0.25em 0.5em\">{text}</td></tr></tbody></table>".replace("{img_src}",pObjs[i].getAttribute("img_src")).replace("{color}",pObjs[i].getAttribute("side_color")).replace("{text}",pObjs[i].innerHTML);}
}}