import json
import os

os.chdir(os.path.dirname(__file__))

pic_paths={}
with open('pictures3.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    for i in data:
        if data[i]!="none":
            if data[i] not in pic_paths:
                pic_paths[data[i]]=[i]
            else:
                pic_paths[data[i]].append(i)
for i in pic_paths:
    if len(pic_paths[i])>1:
        print(pic_paths[i])
