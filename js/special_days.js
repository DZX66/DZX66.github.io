//查询昨天和今天是否是特殊的日子，若有，在该日文案随机选择一个，追加到公告后面
function generateRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const today = new Date();
const yesterday = new Date();
yesterday.setDate(today.getDate() - 1); // 设置为前一天的日期

function findSpecialDay(year, month, day) {
    if (month == 5 & day == 14) {
        var text = ["{t}天是5月14日，是<a href='https://zh.moegirl.org.cn/%E5%8F%A4%E6%98%8E%E5%9C%B0%E6%81%8B' target='_blank'>古明地恋</a>之日，将此消息转发到5个群并说14句古明地恋我好喜欢你啊，便可以将恋恋带到现世陪你过一天。我试过了，是假的，还会被群友骂沙币车万滚出二次元，但{t}天真的是5月14日，真的是古明地恋之日。", "{t}天五月十四号，是一年一度的<a href='https://zh.moegirl.org.cn/%E5%8F%A4%E6%98%8E%E5%9C%B0%E6%81%8B' target='_blank'>恋恋</a>日，把这条消息转发五个群，恋恋就会拳打阿燐脚踢阿空，带着觉大人一起来见你。我试过了，是假的，还会被恋恋抓走挂在地灵殿门口做装饰，但{t}天真的是恋恋日。"]
    }
    if (month == 7 & day == 21) {
        var text = ["挨多☆米那桑(◦˙▽˙◦)，{t}天是柚子社♡大贤☆宗☆师「<a href='https://zh.moegirl.org.cn/%E7%BB%AB%E5%9C%B0%E5%AE%81%E5%AE%81' target='_blank'>绫地宁宁</a>」的纪念日07.21喵。将这条消息转发到十个群（笑），将会在「图书馆」遇到一位正在打☆磨桌角的宁宁的说(=^▽^=)♡，我试过了，是假的喵(。・`ω´・)，还会被骂柚♪子♪厨退群，苦亚西(◦`~´◦)，得磨，{t}天真的是绫地宁宁的纪念日07.21……（｀Δ´）ゞ，让我们一起为宁宁庆祝喵！Ciallo～(∠・ω< )⌒☆"]
    }
    if (month == 7 & day == 29) {
        var text = ["{t}天是7月29日，是<a href='https://zh.moegirl.org.cn/%E5%8D%83%E6%81%8B%E4%B8%87%E8%8A%B1' target='_blank'>千恋万花</a>发行的{a}周年，将这个消息转发到5个群，下次回到乡下给外公帮忙你就会遇到白毛巫女，下流忍者，绿毛锉刀和黄毛留学生，我试过了，是假的，还会被群友骂柚子厨，但是{t}天真的是千恋万花{a}周年".replace(/{a}/g, String(year - 2016))]
    }
    if (month == 8 & day == 7) {
        var text = ["博丽神社、八云邸、永远亭、是非曲直厅各方代表，及人间之里村民自治委员会在此极其沉痛的向全稗田府，全人里全乡各族人民宣告：稗田家优秀的领导者，久经考验的忠诚的封建主义战士，幻想乡杰出的文学家、历史学家、拳击运动员，我们敬爱的<a href='https://zh.moegirl.org.cn/%E7%A8%97%E7%94%B0%E9%98%BF%E6%B1%82' target='_blank'>稗田阿求</a>同志于2024年8月7日0时因先天性身体衰弱导致多脏器衰竭，经长期多方精心治疗，终因病情恶化，医治无效，与稗田府内不幸逝世，享年30岁。<br/>根据阿求同志生前遗愿，葬礼将在人间之里举行。由当代博丽巫女、本居小铃、上白泽慧音组成治丧委员会。追悼大会在人间之里稗田宅内举行。<br/>追悼仪式当日，上午，稗田宅礼堂庄严肃穆，哀乐低回。稗田阿求同志的遗体安卧在鲜花翠柏丛中，正厅上方悬挂着黑底白字的横幅“沉痛悼念穗田阿求同志” 横幅下方是阿求同志的遗像<br/>上午9时许，博丽灵梦，上白泽慧音、本居小铃、射命丸文、洩矢诹访子、二岩揣藏、孙美天、小野小町等人，在哀乐声中缓步来到阿求同志的遗体前进行默哀。<br/>天狗社2024年8月7日0时12分电<br/><img src='https://i0.hdslb.com/bfs/new_dyn/568db02530ca4f3ae4121ad9e4e090783546642703714312.jpg' style='width:80%'/>"]
    }
    if (text != undefined) {
        text = "<br/>" + text[generateRandomInt(0, text.length - 1)];
        return text
    } else { return null }
}
text_yesterday = findSpecialDay(today.getFullYear(), today.getMonth() + 1, today.getDate())
text_today = findSpecialDay(yesterday.getFullYear(), yesterday.getMonth() + 1, yesterday.getDate())
if (text_yesterday != null) { document.getElementById("announcement").innerHTML = document.getElementById("announcement").innerHTML + text_yesterday.replace(/{t}/g, "昨") }
if (text_today != null) { document.getElementById("announcement").innerHTML = document.getElementById("announcement").innerHTML + text_today.replace(/{t}/g, "今") }