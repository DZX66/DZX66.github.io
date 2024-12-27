import json
import os

os.chdir(os.path.dirname(__file__))

with open('pictures3.json', 'r', encoding='utf-8') as f:
    pic_paths = json.load(f)
with open('blocks.json', 'r', encoding='utf-8') as f:
    english = json.load(f)
data=[]
for i in pic_paths:
    if pic_paths[i]!="none":
        data.append({"name":i,"english":english[i],"pic_path":pic_paths[i]})
with open('final.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)