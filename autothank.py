#encoding=utf-8
fans=input("粉丝数（按回车确定）：")
thanks=[]
while True:
    res=input("感谢（输入quit结束，按回车确定）：")
    if res=="quit":
        break
    elif res=="" or res==None:
        print("不能为空")
    else:
        thanks.append(res)
print("\n=====结果=====\n")
result = []
result.append(fans+"粉了[呜米_打call]，")
index=1
for i in thanks:
    if index== len(thanks):
        result.append("最后")
    result.append("感谢"+i+("，" if index!= len(thanks) else "[呜米_KiraKira]"))
    index+=1
result="".join(result)
print(result)
print()
input("")