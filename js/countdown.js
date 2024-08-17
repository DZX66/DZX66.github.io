function countdown(id,target){
// 设置目标时间
const targetTime = new Date(target);

// 更新倒计时函数
function updateCountdown() {
    const currentTime = new Date().getTime();
    const timeLeft = targetTime - currentTime;

    if (timeLeft >= 0) {
        const days = Math.floor(timeLeft / 1000 / 86400);
        const hours = Math.floor((timeLeft / 1000 % 86400) / 3600);
        const minutes = Math.floor((timeLeft / 1000 % 3600) / 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        // 格式化显示时间
        document.getElementById(id).innerText = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
    } else {
        // 倒计时结束
        clearInterval(intervalId);
        document.getElementById(id).innerText = "00:00";
    }
}

// 开始倒计时
const intervalId = setInterval(updateCountdown, 1000);}
countdown("countdown","2027-6-7")
countdown("countdown1",Date.parse("2024/8/19 8:00"))