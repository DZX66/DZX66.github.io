document.getElementById("2").addEventListener(
"keydown",function(event){
if(event.key === "Enter"){
sure();event.preventDefault();}});

function sure(){
try{
    var akey=document.getElementById("2").value;
    while(akey.length%16!=0){akey+="\0"};
    var key=CryptoJS.enc.Utf8.parse(akey);
    const mode=CryptoJS.mode.ECB;
    const padding=CryptoJS.pad.Pkcs7;
    var decryptedText=CryptoJS.AES.decrypt(document.getElementById("code").innerHTML,key,{mode,padding});
    var a=decodeURIComponent(CryptoJS.enc.Utf8.stringify(decryptedText).replace(/\\x/g,"%"));
    document.getElementById("1").innerHTML=a;
    if(document.getElementById("1").innerHTML.slice(2,8)=="locked"){
        document.getElementById("tip").innerHTML="";
        document.getElementById("1").innerHTML=document.getElementById("1").innerHTML.replace(/\\n/g,"").slice(8,-1);
        document.getElementById("1").innerHTML=document.getElementById("1").innerHTML.replace(/\\'/g,"'");
        refresh();
        generateCatalog(".article", ".dir");
    }else{
        const currentTime = new Date();
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const seconds = currentTime.getSeconds();
        document.getElementById("1").innerHTML="["+hours+":"+minutes+":"+seconds+"]密码错误！";}}
catch(error){
    console.log(error);
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    document.getElementById("1").innerHTML="["+hours+":"+minutes+":"+seconds+"]密码错误！";
}}