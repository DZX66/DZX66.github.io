// 设置目标时间
const targetTime = new Date("2027-6-7");

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
        document.getElementById('countdown').innerText = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒";
    } else {
        // 倒计时结束
        clearInterval(intervalId);
        document.getElementById('countdown').innerText = "00:00";
    }
}

// 开始倒计时
const intervalId = setInterval(updateCountdown, 1000);