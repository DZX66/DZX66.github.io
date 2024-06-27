import os
import ctypes
import traceback
import sys
import datetime
import json
import base64
import shutil
import subprocess
from Crypto.Cipher import AES
from typing import Literal,Union
from dateutil import parser

# str不是16的倍数那就补足为16的倍数
def add_to_16(message:str):
    while len(message) % 16 != 0:
        message = str(message)
        message += '\0'
    message = str(message)
    return message.encode('utf-8')  # 返回bytes


# 加密方法
def encrypt_oracle(message: str,key_pri: str):
    '''
    加密函数，传入明文 & 秘钥，返回密文；
    :param message: 明文
    :param key_pri: 秘钥
    :return:encrypted  密文
    '''
    # 初始化加密器
    aes = AES.new(add_to_16(key_pri), AES.MODE_ECB)
    # 将明文转为 bytes
    message_bytes = message.encode('utf-8')
    # 长度调整
    message_16 = add_to_16(message_bytes)
    #先进行aes加密
    encrypt_aes = aes.encrypt(message_16)
    #用base64转成字符串形式
    encrypt_aes_64 = base64.b64encode(encrypt_aes)
    return encrypt_aes_64.decode("utf-8")


# 解密方法
def decrypt_oralce(message,key_pri):
    '''
    解密函数，传入密文 & 秘钥，返回明文；
    :param message: 密文
    :param key_pri: 秘钥
    :return: encrypted 明文
    '''
    # 初始化加密器
    aes = AES.new(add_to_16(key_pri), AES.MODE_ECB)
    #优先逆向解密base64成bytes
    message_de64 = base64.b64decode(message)
    # 解密 aes
    message_de64_deaes = aes.decrypt(message_de64)
    message_de64_deaes_de = message_de64_deaes.decode('utf-8')
    message_de64_deaes_de = bytes(message_de64_deaes_de,'utf-8').decode('unicode_escape').encode('latin1').decode()
    message_de64_deaes_de = message_de64_deaes_de.replace("\x00","")[2:-1]
    return message_de64_deaes_de


def is_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False
    
def update_index(is_show_all:bool=True):
    '''更新页面索引 
    @is_show_all: 是否显示读取到的页面'''
    print("正在更新页面索引...")
    res = {}
    for dir in os.listdir("pages"):
        with open(os.path.join("pages",dir,"attribute.json"),"r",encoding="utf-8") as f:
            datar = json.load(f)
        if is_show_all:
            print("标题：{0}\t是否上锁：{1}\t标签：{2}".format(datar["title"],str(datar["is_locked"]),str(datar["tags"])))
        res[datar["title"]] = datar
    datar = json.dumps(res, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
    with open("index.json","w",encoding="utf-8") as f:
        f.write(datar)
    print("完成 共"+str(len(res))+"个项目")

def edit_page():
    '''操作页面'''
    
    while True:
        update_index(False)
        with open("index.json","r",encoding="utf-8") as f:
            data:dict[str,dict[Literal["title","tags","is_locked","create_time","last_edit_time","tip"],Union[str,bool,list[str]]]] = json.load(f)
        
        m = 0
        ordered_data:dict[int,dict[Literal["title","tags","is_locked","create_time","last_edit_time","tip"],Union[str,bool,list[str]]]] = {}
        for i in data:
            m += 1
            ordered_data[m] = data[i]
        print("="*5)
        for i in ordered_data:
            print(str(i) + "\t" + ordered_data[i]["title"] + "\t" + ordered_data[i]["last_edit_time"])
        print("="*5)
        cmd = ""
        while True:
            cmd = input("选择一项（按0撤回）：")
            try:
                cmd = int(cmd)
                if cmd == 0:
                    return -1
                elif cmd < 0 or cmd > m:
                    raise ValueError
                else:
                    break
            except ValueError:
                print("输入不符合要求")
        title = ordered_data[cmd]["title"]
        dir = os.path.join("pages",title)
        is_locked = ordered_data[cmd]["is_locked"]
        if is_locked:
            tip = ordered_data[cmd]["tip"]
        tags = ordered_data[cmd]["tags"]
        create_time = ordered_data[cmd]["create_time"]
        latest_edit_time = ordered_data[cmd]["last_edit_time"]
        print()
        while True:
            print()
            print("当前位置：页面管理 -> " + title)
            print("目标路径：" + dir)
            print("标题：" + title)
            print("是否上锁：" + ("是" if is_locked else "否"))
            if is_locked:
                print("密码提示:" + tip)
            print("创建时间：" + create_time)
            print("最后一次修改时间：" + latest_edit_time)
            o = ""
            for i in tags:
                o += i+" "
            print("标签：" + o)
            print("="*10)
            print("0.返回上一级")
            print("1.修改标题")
            print("2.上锁/解锁")
            print("3.修改标签")
            print("4.修改内容")
            print("5.查看内容")
            print("6.删除页面")
            if is_locked:
                print("7.修改密码提示")
            print("="*10)
            cmd = input("输入指令：")
            print()
            if cmd == "0":
                break
            elif cmd == "1":
                ntitle = ""
                while ntitle == "":
                    ntitle = input("新标题：")
                    ndir = os.path.join("pages",ntitle)
                    if ntitle == "":
                        print("不能为空！")
                    if os.path.exists(ndir):
                        print("该页面已存在！")
                        ntitle = ""
                os.mkdir(ndir)
                shutil.copyfile(os.path.join(dir,"content.html"),os.path.join(ndir,"content.html"))
                shutil.copyfile(os.path.join(dir,"attribute.json"),os.path.join(ndir,"attribute.json"))
                with open(os.path.join(ndir,"attribute.json"),"r",encoding="utf-8") as f:
                    attributes:dict[Literal["title","tags","is_locked","create_time","last_edit_time"],Union[str,bool,list[str]]] = json.load(f)
                attributes["title"] = ntitle
                datar = json.dumps(attributes, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                with open(os.path.join(ndir,"attribute.json"),"w",encoding="utf-8") as f:
                    f.write(datar)
                os.remove(os.path.join(dir,"content.html"))
                os.remove(os.path.join(dir,"attribute.json"))
                os.remove(dir)
                title = ntitle
                dir = ndir
            elif cmd == "2":
                with open(os.path.join(dir,"content.html"),"r",encoding="utf-8") as f:
                    org_content = f.read()
                if is_locked:
                    while True:
                        password = input("请输入密码：")
                        try:
                            content = decrypt_oralce(org_content,password)
                            if content[:6] != "locked":
                                raise ValueError
                        except Exception:
                            print("密码错误")
                        else:
                            content = content[6:]
                            break
                    with open(os.path.join(dir,"content.html"),"w",encoding="utf-8") as f:
                        f.write(content)
                    with open(os.path.join(dir,"attribute.json"),"r",encoding="utf-8") as f:
                        attributes:dict[Literal["title","tags","is_locked","create_time","last_edit_time"],Union[str,bool,list[str]]] = json.load(f)
                    attributes["is_locked"] = False
                    datar = json.dumps(attributes, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                    with open(os.path.join(dir,"attribute.json"),"w",encoding="utf-8") as f:
                        f.write(datar)
                    is_locked = False
                else:
                    password = ""
                    while password == "":
                        password = input("设置密码：")
                        if password == "":
                            print("不能为空！")
                    r = encrypt_oracle("locked"+org_content,password)
                    with open(os.path.join(dir,"content.html"),"w",encoding="utf-8") as f:
                        f.write(r)
                    with open(os.path.join(dir,"attribute.json"),"r",encoding="utf-8") as f:
                        attributes:dict[Literal["title","tags","is_locked","create_time","last_edit_time"],Union[str,bool,list[str]]] = json.load(f)
                    attributes["is_locked"] = True
                    datar = json.dumps(attributes, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                    with open(os.path.join(dir,"attribute.json"),"w",encoding="utf-8") as f:
                        f.write(datar)
                    is_locked = True
            elif cmd == "4":
                with open(os.path.join("pages",title,"content.html"),"r",encoding="utf-8") as f:
                    org_content = f.read()
                with open(os.path.join("pages",title,"attribute.json"),"r",encoding="utf-8") as f:
                    attributes:dict[Literal["title","tags","is_locked","create_time","last_edit_time"],Union[str,bool,list[str]]] = json.load(f)
                if attributes["is_locked"]:
                    while True:
                        password = input("请输入密码：")
                        try:
                            content = decrypt_oralce(org_content,password)
                            if content[:6] != "locked":
                                raise ValueError
                        except Exception:
                            print("密码错误")
                        else:
                            content = content[6:]
                            break
                else:
                    content = org_content
                f = open("temp.html","w",encoding="utf-8")
                f.write(html.format(title=title,date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),create=create_time,tags=o,content="\n<!-- 请在以下输入代码 -->\n"+content+"\n<!-- 请在以上输入代码 -->\n"))
                f.close()
                os.system('start "" "D:/Microsoft VS Code/Code.exe" temp.html')
                print("请修改后保存")
                os.system("pause")
                now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                f = open("temp.html","r",encoding="utf-8")
                res = f.readlines()[2:-2]
                f.close()
                os.remove("temp.html")
                r = ""
                for i in res:
                    r += i
                r = r[:-1]
                if is_locked:
                    r = encrypt_oracle("locked"+r,password)
                with open(os.path.join("pages",title,"content.html"),"w",encoding="utf-8") as f:
                    f.write(r)
                if is_locked:
                    datar = json.dumps({"title":title,"tags":attributes["tags"],"is_locked":attributes["is_locked"],"create_time":attributes["create_time"],"last_edit_time":now,"tip":tip}, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                else:
                    datar = json.dumps({"title":title,"tags":attributes["tags"],"is_locked":attributes["is_locked"],"create_time":attributes["create_time"],"last_edit_time":now}, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                with open(os.path.join("pages",title,"attribute.json"),"w",encoding="utf-8") as f:
                    f.write(datar)
                latest_edit_time = now
            elif cmd == "5":
                with open(os.path.join("pages",title,"content.html"),"r",encoding="utf-8") as f:
                    org_content = f.read()
                with open(os.path.join("pages",title,"attribute.json"),"r",encoding="utf-8") as f:
                    attributes:dict[Literal["title","tags","is_locked","create_time","last_edit_time"],Union[str,bool,list[str]]] = json.load(f)
                if attributes["is_locked"]:
                    while True:
                        password = input("请输入密码：")
                        try:
                            content = decrypt_oralce(org_content,password)
                            if content[:6] != "locked":
                                raise ValueError
                        except Exception:
                            print("密码错误")
                        else:
                            content = content[6:]
                            break
                else:
                    content = org_content
                f = open("temp.html","w",encoding="utf-8")
                f.write(html.format(title=title,date=latest_edit_time,content=content,create=create_time,tags=o))
                f.close()
                os.system('start temp.html')
                os.system("pause")
                os.remove("temp.html")
            elif cmd == "6":
                while True:
                    confirm = input("确定要删除吗，此操作不可逆（本地）！(y/n)：")
                    if confirm == "y":
                        confirm = True
                        break
                    elif confirm == "n":
                        confirm = False
                        break
                if confirm:
                    shutil.rmtree(dir)
                    break
def new_page():
    '''新建页面'''
    global html
    title = ""
    while title == "":
        title = input("标题（按0撤回）：")
        if title == "0":
            return -1
        dir = os.path.join("pages",title)
        if title == "":
            print("不能为空！")
        if os.path.exists(dir):
            print("该页面已存在！")
            title = ""
    tags = []
    while True:
        tag = input("标签（按0结束）：")
        if tag == "0":
            break
        else:
            if tag == "" or tag == " ":
                print("不能为空")
            else:
                tags.append(tag)
    while True:
        locked = input("是否上锁(y/n)：")
        if locked == "y":
            locked = True
            password = ""
            while password == "":
                password = input("密码：")
                if password == "":
                    print("不能为空！")
            tip = input("密码提示：")
            break
        elif locked == "n":
            locked = False
            break
    o = ""
    for i in tags:
        o += i+" "
    f = open("temp.html","w",encoding="utf-8")
    f.write(html.format(title=title,date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),create=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),tags=o,content="\n<!-- 请在以下输入代码 -->\n\n\n<!-- 请在以上输入代码 -->\n"))
    f.close()
    os.system('start "" "D:/Microsoft VS Code/Code.exe" temp.html')
    print("请修改后保存")
    os.system("pause")
    f = open("temp.html","r",encoding="utf-8")
    res = f.readlines()[2:-2]
    f.close()
    os.remove("temp.html")
    r = ""
    for i in res:
        r += i
    os.mkdir(dir)
    if locked:
        r = encrypt_oracle("locked"+r,password)
    with open(os.path.join(dir,"content.html"),"w",encoding="utf-8") as f:
        f.write(r)
    datar = json.dumps({"title":title,"tags":tags,"is_locked":locked,"create_time":datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),"last_edit_time":datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),"tip":tip if locked else ""}, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
    with open(os.path.join(dir,"attribute.json"),"w",encoding="utf-8") as f:
        f.write(datar)

def apply():
    '''部署网站'''
    global html,page,index_html
    update_index(False)
    # 删除原有文件
    print("删除原有文件...")
    folder_path = "../pages"
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f'Failed to delete {file_path}. Reason: {e}')
    print("创建文件...")
    # 创建文件
    with open("index.json","r",encoding="utf-8") as f:
        data:dict[str,dict[Literal["title","tags","is_locked","create_time","last_edit_time","tip"],Union[str,bool,list[str]]]] = json.load(f)
    for i in data:
        with open(os.path.join("../pages/",data[i]["title"]+".html"),"w",encoding="utf-8") as f:
            tag = ""
            for o in data[i]["tags"]:
                tag+=o+" "
            if data[i]["is_locked"]:
                with open(os.path.join("pages",data[i]["title"],"content.html"),"r",encoding="utf-8") as f1:
                    f.write(html.format(title=data[i]["title"],date=data[i]["last_edit_time"],create=data[i]["create_time"],tags=tag,content='<div id="inputer"><p>这个文档被加密了，需要密码...</p><p id="code" style="display:none;">{base64}</p><p>密码提示:<span id="tip">{tip}</span></p><br/><span>密码：</span><input type="password" name="password" id="password"><button onclick="submit_password();">确定</button></div><div id="content"></div></div><script src="../system/crypto-js.min.js"></script>'.format(tip=data[i]["tip"],base64=f1.read())))
            else:
                with open(os.path.join("pages",data[i]["title"],"content.html"),"r",encoding="utf-8") as f1:
                    f.write(html.format(title=data[i]["title"],date=data[i]["last_edit_time"],create=data[i]["create_time"],tags=tag,content=f1.read()))
    # 创建索引
    print("创建索引...")
    with open("../blogs.html","w",encoding="utf-8") as f:
        f.write('<!DOCTYPE html><html lang="zh-CN"><head><title>所有页面 - 柳下回声</title><link rel="stylesheet" type="text/css" href="style.css?version=1"><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"></head><body><h1>所有页面</h1><p>最后一次更新时间：{date}</p><hr><ul style="list-style-type: none;">'.format(date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        for i in data:
            tag = ""
            for o in data[i]["tags"]:
                tag+=o+" "
            f.write(page.format(title=data[i]["title"],locked="已加密" if data[i]["is_locked"] else "公开",date=data[i]["last_edit_time"],tags=tag))
        f.write("</ul></body></html>")
    # 创建主页
    print("创建主页...")
    # 最新页面
    latest = ""
    edit_times_dict = {}
    for i in data:
        edit_times_dict[parser.parse(data[i]["last_edit_time"]).timestamp()] = i # 以时间戳为键
    edit_times_list = []
    for i in edit_times_dict:
        edit_times_list.append(i)
    edit_times_list.sort(reverse=True)
    edit_times_list = edit_times_list[:5]
    for i in edit_times_list:
        tag = ""
        for o in data[edit_times_dict[i]]["tags"]:
            tag+=o+" "
        latest += page.format(title=data[edit_times_dict[i]]["title"],locked="已加密" if data[edit_times_dict[i]]["is_locked"] else "公开",date=data[edit_times_dict[i]]["last_edit_time"],tags=tag)
    # 官方文档
    offical = ""
    for i in data:
        if "官方文档" in data[i]["tags"]:
            tag = ""
            for o in data[i]["tags"]:
                tag+=o+" "
            offical += page.format(title=data[i]["title"],locked="已加密" if data[i]["is_locked"] else "公开",date=data[i]["last_edit_time"],tags=tag)
    # 小工具
    tools = ""
    for i in data:
        if "小工具" in data[i]["tags"]:
            tag = ""
            for o in data[i]["tags"]:
                tag+=o+" "
            tools += page.format(title=data[i]["title"],locked="已加密" if data[i]["is_locked"] else "公开",date=data[i]["last_edit_time"],tags=tag)
    # 写入文件
    pre_index_html = index_html.format(latest=latest,offical=offical,tools=tools)
    with open("../index.html","w",encoding="utf-8") as f:
        f.write(pre_index_html)
    print("完成")
if __name__=="__main__":
    if is_admin():
        try:
            # 修正工作目录
            print(__file__)
            if "Temp" not in __file__:
                os.chdir(os.path.dirname(os.path.abspath(__file__)))
            # 检查工作环境
            r = subprocess.Popen("git config user.name", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, creationflags=0x08000000)
            res = str(str(r.communicate()[0],"gbk").encode("utf-8"),"utf-8").replace("\n","")
            if res == "":
                print("git用户名未配置！请cmd运行git config user.name [username]！")
            else:
                print("你好，{0}！".format(res))
            r = subprocess.Popen("git config user.email", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, creationflags=0x08000000)
            res = str(str(r.communicate()[0],"gbk").encode("utf-8"),"utf-8").replace("\n","")
            if res == "":
                print("git邮箱未配置！请cmd运行git config user.email [email]！")
            else:
                print("邮箱：{0}".format(res))
            
            ver_style="7"
            ver_template="10"
            ver_self_adaption="6"
            ver_decode="4"
            # 基础页面
            html = '<!DOCTYPE html><html lang="zh-CN"><head><title>{{title}} - 柳下回声</title><link rel="stylesheet" type="text/css" href="../style.css?version={ver_style}"><link rel="stylesheet" href="../prism.css"/><script src="../template.js?version={ver_template}"></script><script src="../prism.js"></script><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"><meta name="referrer" content="no-referrer"></head><body><div id="left"><div class="card"><a href="../index.html"><img src="https://cdnjson.com/images/2024/04/30/icon89fa04bb001fc658.png" style="max-width: 100%;" title="主页"></a><a href="../blogs.html"><button style="float: right;margin-right: 1px;">返回</button></a></div><div class="card">距离2027年高考只剩：<span id="countdown"></span></div></div><main id="main"><div class="title"><h1 style="margin-bottom: 0;">{{title}}</h1></div><div id="article-block" class="card"><div class="article" id="article">{{content}}</div></div><aside class="card" id="aside"><div class="sidenav-header-close" id="sidenav-header-close"><button class="__button-1c6bqbn-eflsmd n-button n-button--default-type n-button--small-type n-button--secondary" tabindex="0" type="button" title="关闭" onclick="close_info()"><span class="n-button__icon" style="margin: 0px;"><div class="n-icon-slot" role="none"><span class="icon xicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-x"><path d="M18 6l-12 12"></path><path d="M6 6l12 12"></path></svg></span></div></span><div aria-hidden="true" class="n-base-wave"></div></button></div><span>最后一次编辑时间：{{date}}</span><br><span>创建时间：{{create}}</span><br><span>标签：{{tags}}</span><hr><a href="https://github.com/DZX66/DZX66.github.io/blob/main/system/pages/{{title}}/content.html" target="_blank">源文件</a><br><a href="https://github.com/DZX66/DZX66.github.io/commits/main/system/pages/{{title}}/content.html" target="_blank">编辑历史</a><hr><h3>目录</h3><div class="dir"></div></aside></main></body><script>apply_template();generateCatalog(".article", ".dir");apply_prism();</script><div id="float-toc-container"><button id="float-toc-trigger" title="目录" class="content-botton" onclick="open_info()"><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-list"><path d="M9 6l11 0"></path><path d="M9 12l11 0"></path><path d="M9 18l11 0"></path><path d="M5 6l0 .01"></path><path d="M5 12l0 .01"></path><path d="M5 18l0 .01"></path></svg></span></button></div><div class="backdrop" id="black_backdrop" onclick="close_info()"></div><script src="../decode.js?version={ver_decode}"></script><script src="../self-adaption.js?version={ver_self_adaption}"></script><script src="../countdown.js"></script></html>'.format(ver_style=ver_style,ver_template=ver_template,ver_self_adaption=ver_self_adaption,ver_decode=ver_decode)
            # 主页
            index_html = '<!DOCTYPE html><html lang="zh-CN"><head><title>柳下回声</title><link rel="stylesheet" type="text/css" href="style.css?version={ver_style}"><link rel="stylesheet" href="prism.css"/><script src="template.js?version={ver_template}"></script><script src="prism.js"></script><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"><meta name="referrer" content="no-referrer"><style>.card{{{{width: 100%;}}}}</style></head><body><div class="card" style="text-align: center;"><img src="https://cdnjson.com/images/2024/04/30/icon89fa04bb001fc658.png" style="max-width: 100%;" title="主页"></div><div class="card">距离2027年高考只剩：<span id="countdown"></span></div><div class="card"><img src="https://i0.hdslb.com/bfs/new_dyn/5f38ca4098f7d3f27198d632caea1f1172204242.jpg" title="头图" width="40%" class="left" id="head_img"/><div style="display: flow-root;" id="head_text"><h2>欢迎来到柳下回声！</h2><p>本网站<b>柳下回声</b>是一个以wiki为运作模式的个人博客小网站，用于记录某些事件或观点，或者提供某些服务。本网站用纯html+css+js制作以及python辅助管理，页面样式参考了多个网站。本网站托管于<a href="https://github.com/DZX66/DZX66.github.io" target="_blank">GitHub Pages</a>，图片多来源于各种图床。</p><p>图源：<a href="https://baike.baidu.com/item/%E9%A5%BF%E6%AE%8D%EF%BC%9A%E6%98%8E%E6%9C%AB%E5%8D%83%E9%87%8C%E8%A1%8C/63539762" target="_blank">饿殍：明末千里行</a></p></div></div><div class="card"><h2>最新页面</h2><a href="blogs.html">所有页面</a><ul style="list-style-type: none;">{{latest}}</ul></div><div class="card"><h2>官方文档</h2><ul style="list-style-type: none;">{{offical}}</ul></div><div class="card"><h2>小工具</h2><ul style="list-style-type: none;">{{tools}}</ul></div></body><script src="countdown.js"></script><script>if(document.documentElement.clientWidth <= 736){{{{document.getElementById("head_img").style.width = "98%";document.getElementById("head_text").style.display = "inline-block";}}}}</script></html>'.format(ver_style=ver_style,ver_template=ver_template)
            # 一个条目
            page = "<li><div class='head'><a href='pages/{title}.html'>{title}</a></div><div class='foot'> {locked} 更新时间：{date} 标签：{tags}</div></li>"
            while True:
                print()
                cmd = None
                print("工作目录：",os.getcwd())
                print("="*10)
                print("这是网站后台")
                print("1.页面管理")
                print("2.网站部署")
                print("="*10)
                cmd = input("输入指令：")
                print()
                if cmd == "1":
                    while True:
                        print()
                        print("当前位置：页面管理")
                        print("="*10)
                        print("0.返回上一级")
                        print("1.操作已有页面")
                        print("2.更新页面索引")
                        print("3.创建页面")
                        print("="*10)
                        cmd = input("输入指令：")
                        print()
                        if cmd == "0":
                            break
                        elif cmd == "1":
                            edit_page()
                        elif cmd == "2":
                            update_index()
                        elif cmd == "3":
                            new_page()
                elif cmd == "2":
                    apply()
                elif cmd.startswith("git"):
                    print("这里不是cmd！请按win+r输入cmd回车！")
        except Exception as e:
            traceback.print_exc()
            input()
    else:
        ctypes.windll.shell32.ShellExecuteW(None,"runas",sys.executable,__file__,None,1)