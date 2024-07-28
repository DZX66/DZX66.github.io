if(document.getElementById("password")){
  document.getElementById("password").addEventListener(
  "keydown",function(event){
    if(event.key === "Enter"){
    submit_password();
    event.preventDefault();}});
  const tip_base64 = btoa(encodeURIComponent(document.getElementById("tip").innerText));
  if(getCookie(tip_base64)){
  document.getElementById("password").value = getCookie(tip_base64);
  submit_password();
  }
}else{
apply_template();generateCatalog(".article", ".dir");apply_prism();
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

function submit_password(){
try{
    var skey=document.getElementById("password").value;
    var akey=skey;
    while(akey.length%16!=0){akey+="\0"};
    var key=CryptoJS.enc.Utf8.parse(akey);
    const mode=CryptoJS.mode.ECB;
    const padding=CryptoJS.pad.Pkcs7;
    var decryptedText=CryptoJS.AES.decrypt(document.getElementById("code").innerHTML,key,{mode,padding});
    var a=decodeURIComponent(CryptoJS.enc.Utf8.stringify(decryptedText).replace(/\\x/g,"%"));
    document.getElementById("content").innerHTML=a;
    if(document.getElementById("content").innerHTML.slice(2,8)=="locked"){
        const tip_base64 = btoa(encodeURIComponent(document.getElementById("tip").innerText));
        document.getElementById("inputer").outerHTML="";
        document.getElementById("content").innerHTML=document.getElementById("content").innerHTML.replace(/\\n/g,"\n").slice(8,-1);
        document.getElementById("content").innerHTML=document.getElementById("content").innerHTML.replace(/\\'/g,"'");
        document.getElementById("content").innerHTML=document.getElementById("content").innerHTML.replace(/\n/g,"");
        apply_template();
        apply_prism();
        generateCatalog(".article", ".dir");
        // 自动保存密码
        document.cookie="{tip}={password}; expires=Thu, 18 Dec 2043 12:00:00 GMT; path=/".replace("{password}",skey).replace("{tip}",tip_base64);
    }else{
        throw new Error("结果不以locked开头")}}
catch(error){
    console.log(error);
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    document.getElementById("content").innerHTML="["+hours+":"+minutes+":"+seconds+"]密码错误！";
}}