document.getElementById("2").addEventListener(
"keydown",function(event){
if(event.key === "Enter"){
sure();event.preventDefault();}});
if(getCookie("password")){
document.getElementById("2").value = getCookie("password");
sure();
}
function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

function sure(){
try{
    var skey=document.getElementById("2").value;
    var akey=skey;
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
        apply_prism();
        generateCatalog(".article", ".dir");
        // 自动保存密码
        document.cookie="password={password}; expires=Thu, 18 Dec 2043 12:00:00 GMT".replace("{password}",skey);
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