import json
import os

os.chdir(os.path.dirname(__file__))
f1 = open('blocks.json', 'r', encoding='utf-8')
english:dict[str,str]=json.load(f1)
f1.close()
with open('pictures2.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    # 获取多图片的名字
    complex_names_dict = {}
    for i in data:
        if len(data[i]) > 2:
            complex_names_dict[i] = data[i]
    for i in data:
        # 墙上的没有图片
        if i.startswith("墙上的"):
            data[i] = ["none"]
            continue
        for j in complex_names_dict:
            if i.endswith(j):
                data[i] = complex_names_dict[j]
                break
                #print(i, "为复合名，属于",j)
        # 选择与名字相匹配的图片
        if len(data[i]) == 1:
            continue
        eng_name = english[i].replace(" ", "_")
        for j in data[i]:
            if eng_name in j:
                data[i] = [j]
                break
        else:
            print("找不到",eng_name)
    with open('pictures1.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)