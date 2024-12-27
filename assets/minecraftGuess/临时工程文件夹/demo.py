import json
import os

os.chdir(os.path.dirname(__file__))

with open('../blocks.json', 'r', encoding='utf-8') as f:
    pic_paths = json.load(f)
data=[]
for i in pic_paths:
    if pic_paths[i]!="none":
        data.append({"name":i,"english":pic_paths[i]["english"],"pic_path":pic_paths[i]["pic_path"]})
with open('final.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)