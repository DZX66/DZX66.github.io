import json
import os

os.chdir(os.path.dirname(__file__))

with open('pictures3.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    for i in data:
        if len(data[i]) == 1:
            data[i] = data[i][0]
        else:
            raise ValueError(f"len(data[{i}])={len(data[i])}")
with open('pictures3.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)