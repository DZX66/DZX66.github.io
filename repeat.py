#encoding=utf-8
print("注意：不会自动添加标点符号，需手动添加")
intro=input("前言：")
repeat=""
while repeat=="" or repeat==None or "[replace]" not in repeat:
    repeat=input("重复模板（使用[replace]来代替要替换的字符）：")
    if repeat=="" or repeat==None:
        print("不能为空")
    elif "[replace]" not in repeat:
        print("必须包含[replace]")
end=input("结语：")
body=[]
while True:
    res=input(repeat+"（输入quit结束，按回车确定）：")
    if res=="quit":
        break
    elif res=="" or res==None:
        print("不能为空")
    else:
        body.append(res)
print("\n=====结果=====\n")
result = []
result.append(intro)
for i in body:
    result.append(repeat.replace("[replace]",i))
result.append(end)
result="".join(result)
print(result)
print()
input("")