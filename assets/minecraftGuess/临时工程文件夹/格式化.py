import os
os.chdir(os.path.dirname(__file__))
f1=open("blocks.json","w",encoding="utf-8")
with open("blocks.txt","r",encoding="utf-8") as f:
    for i in f.readlines():
        if i!="\n":
            a = i[:-1].replace("\t"," ")
            blocks=a.split(" ")
            chinese=blocks[-1]
            english=" ".join(blocks[:-1])
            print(f"\"{chinese}\":\"{english}\",",file=f1)
f1.close()