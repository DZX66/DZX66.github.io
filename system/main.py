import os
import ctypes
import traceback
import sys
import datetime
import json
import base64
import shutil
import subprocess
import hashlib
from Crypto.Cipher import AES
from typing import Literal,Union
from dateutil import parser

def log(message:str):
    '''向缓存中写入信息'''
    with open(PATH_LOG,"a+",encoding="utf-8") as f:
        f.write(message+"\n")

def confirm(message:str):
    '''询问yes/no'''
    while True:
        res = input(message+"(y/n)：")
        if res == "y":
            return True
        elif res == "n":
            return False
        
def add_to_16(message:str):
    '''str不是16的倍数那就补足为16的倍数'''
    while len(message) % 16 != 0:
        message = str(message)
        message += '\0'
    message = str(message)
    return message.encode('utf-8')  # 返回bytes


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

def edit_index(title:str,last_edit_time:Union[str,int]=-1,create_time:Union[str,int]=-1,is_locked:Union[bool,int]=-1,tag:Union[tuple,list,int]=-1,tip:Union[str,int]=-1,mode:int=0):
    '''修改缓存索引
    @title: 页面标题
    @last_edit_time: 最后一次编辑时间（-1表示不修改）
    @create_time: 创建时间（-1表示不修改）
    @is_locked: 是否上锁（-1表示不修改）
    @tag: 标签元组（-1表示不修改）
    @tip: 密码提示（-1表示不修改）
    @mode: 模式，0表示修改；1表示删除；2表示新增'''
    if not os.path.exists(PATH_INDEX):
        raise FileNotFoundError("程序尝试修改索引，但索引文件不存在："+PATH_INDEX)
    with open(PATH_INDEX,"r",encoding="utf-8") as f:
        index = json.load(f)
    if mode == 0:
        if last_edit_time != -1:
            index[title]["last_edit_time"] = last_edit_time
        if create_time != -1:
            index[title]["create_time"] = create_time
            print("警告：创建时间从逻辑上来说不允许被修改。")
        if is_locked != -1:
            index[title]["is_locked"] = is_locked
            if (is_locked == False) and ("tip" in index[title]):
                print("由于解锁了页面，密码提示被自动删除。")
                del index[title]["tip"]
        if tag != -1:
            if isinstance(tag,list): #如果tag是list类型
                tag = tuple(tag)
            index[title]["tags"] = tag
        if tip != -1:
            if not index[title]["is_locked"]:
                print("警告：修改了密码提示，但此页面{0}没有上锁。".format(title))
            index[title]["tip"] = tip
    elif mode == 1:
        if last_edit_time != -1 or is_locked != -1 or tag != -1 or tip != -1:
            print("警告：尝试删除{0}，但设置了冗余的参数。".format(title))
        if title in index:
            del index[title]
        else:
            print("警告：不存在{0}，但不影响程序正常运行。".format(title))
    elif mode == 2:
        if last_edit_time == -1 or create_time == -1 or is_locked == -1 or tag == -1 or (tip == -1 and is_locked):
            raise ValueError("参数设定不完整，无法创建{0}项。".format(title))
        index[title] = {"title":title,"last_edit_time":last_edit_time,"create_time":create_time,"is_locked":is_locked,"tags":tag}
        if tip != -1:
            index[title]["tip"] = tip
    with open(PATH_INDEX,"w",encoding="utf-8") as f:
        f.write(json.dumps(index, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False))
    
def update_index(is_show_all:bool=True):
    '''更新页面索引 
    @is_show_all: 是否显示读取到的页面'''
    print("正在更新页面索引...")
    res = {}
    for dir in os.listdir("pages"):
        if os.path.exists(os.path.join("pages",dir,"attribute.json")):
            with open(os.path.join("pages",dir,"attribute.json"),"r",encoding="utf-8") as f:
                datar = json.load(f)
            if is_show_all:
                print("标题：{0}\t是否上锁：{1}\t标签：{2}".format(datar["title"],str(datar["is_locked"]),str(datar["tags"])))
            res[datar["title"]] = datar
        else:
            print("警告：pages目录下"+dir+"中不存在attribute.json文件！")
    datar = json.dumps(res, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
    with open(PATH_INDEX,"w",encoding="utf-8") as f:
        f.write(datar)
    print("完成 共"+str(len(res))+"个项目")

def edit_page():
    '''操作页面'''
    
    while True:
        with open(PATH_INDEX,"r",encoding="utf-8") as f:
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
                    raise ValueError("超出范围")
                else:
                    break
            except ValueError as e:
                print(f"输入不符合要求：{e}")
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
            tag_string = ""
            for i in tags:
                tag_string += i+" "
            print("标签：" + tag_string)
            print("="*10)
            print("0.返回上一级")
            print("1.修改标题")
            if "重定向页面" not in tags:
                if "独立页面" not in tags:
                    print("2.上锁/解锁")
                print("3.修改标签")
                print("4.修改内容")
                print("5.查看内容")
            print("6.删除页面")
            if is_locked:
                print("7.修改密码提示")
            if "重定向页面" not in tags:
                print("8.创建此页面的重定向页面")
            print("="*10)
            cmd = input("输入指令：")
            print()
            if cmd == "0":
                break
            elif cmd == "1":
                # 修改标题
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
                # 更新attribute.json中的title项
                with open(os.path.join(ndir,"attribute.json"),"r",encoding="utf-8") as f:
                    attributes:dict[Literal["title","tags","is_locked","create_time","last_edit_time"],Union[str,bool,list[str]]] = json.load(f)
                attributes["title"] = ntitle
                datar = json.dumps(attributes, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                with open(os.path.join(ndir,"attribute.json"),"w",encoding="utf-8") as f:
                    f.write(datar)
                os.remove(os.path.join(dir,"content.html"))
                os.remove(os.path.join(dir,"attribute.json"))
                os.rmdir(dir)
                # 更新索引
                edit_index(title,mode=1)
                edit_index(ntitle,latest_edit_time,create_time,is_locked,tags,(-1 if not is_locked else tip),2)
                log("页面[[{0}]]重命名为[[{1}]]".format(title,ntitle))
                # 更新title和dir变量
                title = ntitle
                dir = ndir
            elif cmd == "2" and "重定向页面" not in tags and "独立页面" not in tags:
                # 上锁/解锁
                with open(os.path.join(dir,"content.html"),"r",encoding="utf-8") as f:
                    org_content = f.read()
                if is_locked:
                    #解锁
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
                        attributes:dict[Literal["title","tags","is_locked","create_time","last_edit_time","tip"],Union[str,bool,list[str]]] = json.load(f)
                    attributes["is_locked"] = False
                    del attributes["tip"]
                    datar = json.dumps(attributes, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                    with open(os.path.join(dir,"attribute.json"),"w",encoding="utf-8") as f:
                        f.write(datar)
                    is_locked = False
                    # 更新索引
                    edit_index(title,is_locked=False)
                    log("解锁了页面[[{0}]]".format(title))
                else:
                    #上锁
                    password = ""
                    while password in ("","0"):
                        password = input("设置密码：")
                        if password == "":
                            print("不能为空！")
                        if password == "0":
                            print("非法的密码：\"0\"被用于取消操作。")
                    tip = input("密码提示：")
                    if tip == "":
                        tip = "【无密码提示的页面：{0}】".format(title)
                        print("空的密码提示将被替换为：【无密码提示的页面：{0}】".format(title))
                        print("因为密码提示是“自动输入密码”功能的依据。")
                        os.system("pause")
                    r = encrypt_oracle("locked"+org_content,password)
                    with open(os.path.join(dir,"content.html"),"w",encoding="utf-8") as f:
                        f.write(r)
                    with open(os.path.join(dir,"attribute.json"),"r",encoding="utf-8") as f:
                        attributes:dict[Literal["title","tags","is_locked","create_time","last_edit_time"],Union[str,bool,list[str]]] = json.load(f)
                    attributes["is_locked"] = True
                    attributes["tip"] = tip
                    datar = json.dumps(attributes, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                    with open(os.path.join(dir,"attribute.json"),"w",encoding="utf-8") as f:
                        f.write(datar)
                    is_locked = True
                    # 更新索引
                    edit_index(title,is_locked=True,tip=tip)
                    log("上锁了页面[[{0}]]".format(title))
            elif cmd == "4" and "重定向页面" not in tags:
                # 修改内容
                with open(os.path.join("pages",title,"content.html"),"r",encoding="utf-8") as f:
                    org_content = f.read()
                with open(os.path.join("pages",title,"attribute.json"),"r",encoding="utf-8") as f:
                    attributes:dict[Literal["title","tags","is_locked","create_time","last_edit_time"],Union[str,bool,list[str]]] = json.load(f)
                is_cancelled = False
                if attributes["is_locked"]:
                    while True:
                        password = input("请输入密码（按0取消）：")
                        if password == "0":
                            is_cancelled =True
                            break
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
                if not is_cancelled:
                    f = open("temp.html","w",encoding="utf-8")
                    if "独立页面" in attributes["tags"]:
                        f.write(content)
                    else:
                        f.write(html.format(title=title,date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),create=create_time,tags=tag_string,content="\n<!-- 请在以下输入代码 -->\n"+content+"\n<!-- 请在以上输入代码 -->\n"))
                    f.close()
                    os.system('start "" "D:/Microsoft VS Code/Code.exe" temp.html')
                    print("请修改后保存")
                    while True:
                        os.system("pause")
                        f = open("temp.html","r",encoding="utf-8")
                        res = f.readlines()[2:-2]
                        f.close()
                        r = ""
                        for i in res:
                            r += i
                        r = r[:-1] # 去除末尾\n
                        if is_locked:
                            try:
                                r = encrypt_oracle("locked"+r,password)
                                break
                            except ValueError as e:
                                print(f"加密失败，{e}。请尝试修改长度！")
                        else:
                            break
                    os.remove("temp.html")
                    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    with open(os.path.join("pages",title,"content.html"),"w",encoding="utf-8") as f:
                        f.write(r)
                    if is_locked:
                        datar = json.dumps({"title":title,"tags":attributes["tags"],"is_locked":attributes["is_locked"],"create_time":attributes["create_time"],"last_edit_time":now,"tip":tip}, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                    else:
                        datar = json.dumps({"title":title,"tags":attributes["tags"],"is_locked":attributes["is_locked"],"create_time":attributes["create_time"],"last_edit_time":now}, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
                    with open(os.path.join("pages",title,"attribute.json"),"w",encoding="utf-8") as f:
                        f.write(datar)
                    latest_edit_time = now
                    # 更新索引
                    edit_index(title,latest_edit_time)
                    message = "修改了页面[[{0}]]".format(title)
                    with open(PATH_LOG,"r",encoding="utf-8") as f:
                        res = f.readlines()
                    if not (message+"\n" in res or "创建页面[[{0}]]\n".format(title) in res):
                        # 创建记录会覆盖修改记录，多个修改记录会合并
                        log(message)
            elif cmd == "5" and "重定向页面" not in tags:
                # 查看内容
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
                if "独立页面" in attributes["tags"]:
                    f.write(content)
                else:
                    f.write(html.format(title=title,date=latest_edit_time,content=content,create=create_time,tags=tag_string))
                f.close()
                os.system('start temp.html')
                os.system("pause")
                os.remove("temp.html")
            elif cmd == "6":
                # 删除页面
                is_confirm = confirm("确定要删除吗，此操作不可逆（本地）！")
                if is_confirm:
                    try:
                        shutil.rmtree(dir)
                    except Exception:
                        traceback.print_exc()
                        print("无法删除，请手动删除",dir)
                    # 更新索引
                    log("删除了页面[[{0}]]".format(title))
                    edit_index(title,mode=1)
                    break
            elif cmd == "7" and is_locked:
                # 修改密码提示
                tip = input("密码提示：")
                if tip == "":
                    tip = "【无密码提示的页面：{0}】".format(title)
                    print("空的密码提示将被替换为：【无密码提示的页面：{0}】".format(title))
                    print("因为密码提示是“自动输入密码”功能的依据。")
                    os.system("pause")
                with open(os.path.join(dir,"attribute.json"),"w",encoding="utf-8") as f:
                    f.write(json.dumps({"title":title,"tags":tags,"is_locked":is_locked,"create_time":create_time,"last_edit_time":latest_edit_time,"tip":tip}, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False))
                # 更新索引
                edit_index(title,tip=tip)
                log("修改了[[{0}]]的密码提示".format(title))
            elif cmd == "8" and "重定向页面" not in tags:
                # 创建重定向页面
                # 获取rtitle
                rtitle = ""
                while rtitle == "":
                    rtitle = input("重定向自：")
                    rdir = os.path.join("pages",rtitle)  # 获取rdir
                    if rtitle == "":
                        print("不能为空！")
                    if os.path.exists(rdir):
                        print(f"[[{rtitle}]]已存在！")
                        rtitle = ""
                    try:
                        os.mkdir(rdir)
                    except OSError as e:
                        print(f"标题不符合要求（请检查是否包含\\ / : * ? \" < > |）：{e}")
                        rtitle = ""
                    else:
                        os.rmdir(rdir)
                os.mkdir(rdir)
                with open(os.path.join(rdir,"content.html"),"w",encoding="utf-8") as f:
                    f.write(title)
                rattributes = {"title":rtitle,"tags":["重定向页面"],"is_locked":False,"create_time":datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),"last_edit_time":datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
                with open(os.path.join(rdir,"attribute.json"),"w",encoding="utf-8") as f:
                    f.write(json.dumps(rattributes, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False))
                # 写入缓存
                edit_index(rtitle,rattributes["last_edit_time"],rattributes["create_time"],False,["重定向页面"],-1 ,2)
                log(f"创建重定向页面[[{rtitle}]]，重定向至[[{title}]]")
def new_page():
    '''新建页面'''
    global html
    # 获取title
    title = ""
    while title == "":
        title = input("标题（按0撤回）：")
        dir = os.path.join("pages",title)  # 获取dir
        if title == "0":
            return -1
        if title == "":
            print("不能为空！")
        if os.path.exists(dir):
            print("该页面已存在！")
            title = ""
        try:
            os.mkdir(dir)
        except OSError as e:
            print(f"标题不符合要求（请检查是否包含\\ / : * ? \" < > |）：{e}")
            title = ""
        else:
            os.rmdir(dir)
    # 获取tags
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
    # 是否为独立页面
    is_independent = confirm("是否为独立页面")
    if not is_independent:
        # 获取是否上锁
        locked = confirm("是否上锁")
        if locked:
            password = ""
            while password in ("","0"):
                password = input("密码：")
                if password == "":
                    print("不能为空！")
                if password == "0":
                    print("非法的密码：\"0\"被用于取消操作。")
            tip = input("密码提示：")
            if tip == "":
                tip = "【无密码提示的页面：{0}】".format(title)
                print("空的密码提示将被替换为：【无密码提示的页面：{0}】".format(title))
                print("因为密码提示是“自动输入密码”功能的依据。")
                os.system("pause")
    else:
        locked = False
        tags.append("独立页面")
    # tags合为一个字符串
    o = ""
    for i in tags:
        o += i+" "
    # 打开临时页面，获取代码
    f = open("temp.html","w",encoding="utf-8")
    if not is_independent:
        f.write(html.format(title=title,date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),create=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),tags=o,content="\n<!-- 请在以下输入代码 -->\n\n\n<!-- 请在以上输入代码 -->\n"))
    else:
        pass
    f.close()
    os.system('start "" "D:/Microsoft VS Code/Code.exe" temp.html')
    print("请修改后保存")
    while True:
        os.system("pause")
        f = open("temp.html","r",encoding="utf-8")
        if is_independent:
            res = f.readlines()
        else:
            res = f.readlines()[2:-2]
        f.close()
        r = ""
        for i in res:
            r += i
        r = r[:-1] # 去除末尾\n
        if locked:
            try:
                r = encrypt_oracle("locked"+r,password)
            except Exception as e:
                print(f"加密失败：{e}，请修改长度后重试")
            else:
                break
        else:
            break
    os.remove("temp.html")
    # 写入数据
    os.mkdir(dir)
    with open(os.path.join(dir,"content.html"),"w",encoding="utf-8") as f:
        f.write(r)
    if locked:
        attributes = {"title":title,"tags":tags,"is_locked":locked,"create_time":datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),"last_edit_time":datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),"tip":tip}
    else:
        attributes = {"title":title,"tags":tags,"is_locked":locked,"create_time":datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),"last_edit_time":datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
    datar = json.dumps(attributes, sort_keys=True, indent=4, separators=(',', ': '),ensure_ascii=False)
    with open(os.path.join(dir,"attribute.json"),"w",encoding="utf-8") as f:
        f.write(datar)
    # 写入缓存
    edit_index(title,attributes["last_edit_time"],attributes["create_time"],locked,tags,(-1 if not locked else tip),2)
    log("创建页面[[{0}]]".format(title))
def apply():
    '''部署网站'''
    global html,page,index_html,redirect_html
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
    with open(PATH_INDEX,"r",encoding="utf-8") as f:
        data:dict[str,dict[Literal["title","tags","is_locked","create_time","last_edit_time","tip"],Union[str,bool,list[str]]]] = json.load(f)
    for i in data:
        with open(os.path.join("../pages/",data[i]["title"]+".html"),"w",encoding="utf-8") as f:
            with open(os.path.join("pages",data[i]["title"],"content.html"),"r",encoding="utf-8") as f1:
                # 判断是否为重定向页面
                if "重定向页面" in data[i]["tags"]:
                    f.write(redirect_html.format(title=f1.read(),source=data[i]["title"]))
                # 判断是否为独立页面
                elif "独立页面" in data[i]["tags"]:
                    f.write(f1.read())
                else:
                    tag = ""
                    for o in data[i]["tags"]:
                        tag+=o+" "
                    if data[i]["is_locked"]:
                        f.write(html.format(title=data[i]["title"],date=data[i]["last_edit_time"],create=data[i]["create_time"],tags=tag,content='<div id="inputer"><p>这个文档被加密了，需要密码...</p><p id="code" style="display:none;">{base64}</p><p>密码提示:<span id="tip">{tip}</span></p><br/><span>密码：</span><input type="password" name="password" id="password"><button onclick="submit_password();">确定</button></div><div id="content"></div></div><script src="../js/crypto-js.min.js"></script>'.format(tip=data[i]["tip"],base64=f1.read())))
                    else:
                        f.write(html.format(title=data[i]["title"],date=data[i]["last_edit_time"],create=data[i]["create_time"],tags=tag,content=f1.read()))
    # 创建索引
    print("创建索引...")
    with open("../blogs.html","w",encoding="utf-8") as f:
        f.write('<!DOCTYPE html><html lang="zh-CN"><head><title>所有页面 - 柳下回声</title><link rel="stylesheet" type="text/css" href="style.css?version=1"><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="utf-8"></head><body><h1>所有页面</h1><p><a href="index.html">主页面</a></p><p>最后一次更新时间：{date}</p><hr><ul style="list-style-type: none;">'.format(date=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        for i in data:
            if "重定向页面" not in data[i]["tags"]:
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
        if "重定向页面" not in data[i]["tags"]:
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
    # 创建404页面
    with open("../404.html","w",encoding="utf-8") as f:
        f.write(html_404)
    print("完成")
    # 修改信息汇总
    with open(PATH_LOG,"r",encoding="utf-8") as f:
        logs = f.readlines()
    print("="*5)
    for i in logs:
        print("- "+i[:-1])
    print("="*5)
    if confirm("修改是否完成，可以提交？"):
        print("请为每项操作填写注释，可留空。")
        print()
        for i in range(len(logs)):
            res = input(logs[i][:-1]+": ")
            if res == "":
                logs[i] = logs[i][:-1]
            else:
                logs[i] = logs[i][:-1]+": "+res
        is_system_edited = confirm("是否进行系统级修改（包括模板）？")
        if is_system_edited:
            print("请对照git更改记录手动填写。")
            if len(logs) >= 2:
                summary = "操作了多个页面，进行了系统级优化："
            else:
                if len(logs) == 0:
                    summary = "进行了系统级优化："
                else:
                    summary = logs[0] + "，并进行了系统级优化："
        else:
            if len(logs) >= 2:
                summary = "操作了多个页面："
            else:
                if len(logs) == 1:
                    summary = logs[0]
                else:
                    summary = ""
                    print("警告：无效的操作。")
        print()
        print("="*5)
        print(summary)
        if not (len(logs) == 1 and is_system_edited):
            for i in logs:
                print("- "+i)
        print("="*5)
        print("请复制上述内容至“消息”。")
        with open(PATH_LOG,"w",encoding="utf-8") as f:
            pass  # 清空缓存
        
if __name__=="__main__":
    if is_admin():
        try:
            # 修正工作目录
            print("__file__:",__file__)
            if "Temp" not in __file__:  # 如果不以exe形式运行
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
            # 设置缓存
            PATH_LOCAL = os.getenv("LOCALAPPDATA")
            PATH_CACHE = os.path.join(PATH_LOCAL,"echos_under_willow")
            PATH_INDEX = os.path.join(PATH_CACHE,"index.json")
            PATH_LOG = os.path.join(PATH_CACHE,"log.txt")
            if not os.path.exists(PATH_CACHE):
                print("欢迎来到柳下回声的后台！")
                print("即将创建缓存目录：",PATH_CACHE)
                os.system("pause")
                os.mkdir(PATH_CACHE)
                update_index()
            if not os.path.exists(PATH_LOG):
                f = open(PATH_LOG,"w",encoding="utf-8")
                f.close()
            # 获取文件版本
            print("获取js/css文件版本...")
            with open("../js/template.js","r",encoding="utf-8") as f:
                ver_template = hashlib.md5(f.read().encode("utf-8")).hexdigest()[:8]
                print("template.js:",ver_template)
            with open("../js/decode.js","r",encoding="utf-8") as f:
                ver_decode = hashlib.md5(f.read().encode("utf-8")).hexdigest()[:8]
                print("decode.js:",ver_decode)
            with open("../js/special_days.js","r",encoding="utf-8") as f:
                ver_sp_days = hashlib.md5(f.read().encode("utf-8")).hexdigest()[:8]
                print("special_days.js:",ver_sp_days)
            with open("../js/self-adaption.js","r",encoding="utf-8") as f:
                ver_self_adaption = hashlib.md5(f.read().encode("utf-8")).hexdigest()[:8]
                print("self-adaption.js:",ver_self_adaption)
            with open("../js/countdown.js","r",encoding="utf-8") as f:
                ver_countdown = hashlib.md5(f.read().encode("utf-8")).hexdigest()[:8]
                print("countdown.js:",ver_countdown)
            with open("../style.css","r",encoding="utf-8") as f:
                ver_style = hashlib.md5(f.read().encode("utf-8")).hexdigest()[:8]
                print("style.css:",ver_style)
            print("版本获取完成。")
            announcement = '距离2027年高考只剩：<span id="countdown"></span><br/>手机端可以点击右侧的按钮打开目录！<br/>现在可以在<a href="https://dzx66.github.io/pages/%E8%87%AA%E5%AE%9A%E4%B9%89%E8%AE%BE%E7%BD%AE.html">这个页面</a>自定义背景和其他样式了！'
            with open("page_models/index.html","r",encoding="utf-8") as f:
                content = f.readlines()
                res = ""
                for i in range(len(content)):
                    res += content[i].strip()
                res = res.replace("../../","")
                index_html = res.format(ver_style=ver_style,ver_template=ver_template,announcement=announcement,ver_sp_days=ver_sp_days,ver_countdown=ver_countdown)
            with open("page_models/basic.html","r",encoding="utf-8") as f:
                content = f.readlines()
                res = ""
                for i in range(len(content)):
                    res += content[i].strip()
                res = res.replace("../../","../")
                html = res.format(ver_style=ver_style,ver_template=ver_template,ver_self_adaption=ver_self_adaption,ver_decode=ver_decode,announcement=announcement,ver_sp_days=ver_sp_days,ver_countdown=ver_countdown)
            with open("page_models/404.html","r",encoding="utf-8") as f:
                content = f.readlines()
                res = ""
                for i in range(len(content)):
                    res += content[i].strip()
                html_404 = res.format(ver_style=ver_style,ver_template=ver_template,ver_self_adaption=ver_self_adaption,announcement=announcement,ver_sp_days=ver_sp_days,ver_countdown=ver_countdown)
            with open("page_models/redirect.html","r",encoding="utf-8") as f:
                content = f.readlines()
                res = ""
                for i in range(len(content)):
                    res += content[i].strip()
                redirect_html = res
            # 一个条目
            page = "<li><div class='head'><a href='pages/{title}.html'>{title}</a></div><div class='foot'> {locked} 更新时间：{date} 标签：{tags}</div></li>"
            while True:
                print()
                cmd = None
                print("工作目录：",os.getcwd())
                print("="*10)
                print("这是网站后台")
                with open(PATH_LOG,"r",encoding="utf-8") as f:
                    logs = f.readlines()
                    if logs != []:
                        print("[!]有未应用的更改。")
                        print("="*5)
                        for i in logs:
                            print("- "+i[:-1])
                        print("="*5)
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