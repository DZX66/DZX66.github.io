//查询今天是否是特殊的日子，若有，将该日文案追加到公告后面
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1; // 月份从0开始，需要加1
const day = today.getDate();
if(month == 7 & day == 21){
    var text = "挨多☆米那桑(◦˙▽˙◦)，今天是柚子社♡大贤☆宗☆师「绫地宁宁」的纪念日07.21喵。将这条消息转发到十个群（笑），将会在「图书馆」遇到一位正在打☆磨桌角的宁宁的说(=^▽^=)♡，我试过了，是假的喵(。・`ω´・)，还会被骂柚♪子♪厨退群，苦亚西(◦`~´◦)，得磨，今天真的是绫地宁宁的纪念日07.21……（｀Δ´）ゞ，让我们一起为宁宁庆祝喵！Ciallo～(∠・ω< )⌒☆"}
if(month == 7 & day == 29){
    var text = "今天是7月29日，是千恋万花发行的{a}周年，将这个消息转发到5个群，下次回到乡下给外公帮忙你就会遇到白毛巫女，下流忍者，绿毛锉刀和黄毛留学生，我试过了，是假的，还会被群友骂柚子厨，但是今天真的是千恋万花{a}周年".replace(/{a}/g,String(year-2016))}
if(text!=undefined){
text = "<br/>"+text;
document.getElementById("announcement").innerHTML = document.getElementById("announcement").innerHTML + text}