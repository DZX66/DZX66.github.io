from bs4 import BeautifulSoup
import requests
import json
import os

os.chdir(os.path.dirname(__file__))
    
from selenium import webdriver
from selenium.webdriver import ChromeOptions
options = ChromeOptions()
prefs = {
    'profile.managed_default_content_settings.images': 2
}
options.add_experimental_option('prefs', prefs)
browser = webdriver.Chrome(options=options)
def get_img_url(name:str):
    '''根据name，访问https://zh.minecraft.wiki/w/{name}，重定向后，获取class为infobox-imagearea的div的下属第一个div'''
    url = f'https://zh.minecraft.wiki/w/{name}'
    try:
        browser.get(url)
        soup = BeautifulSoup(browser.page_source, 'html.parser')
        img_url = soup.find('div', class_='infobox-imagearea')
        img_url = img_url.find_all('img')
        res=[]
        for i in img_url:
            res.append(i.get('src')[:-6])
        return res
    except:
        return ["none"]

with open('pictures1.json','r',encoding='utf-8') as f:
    data = json.load(f)
    x=0
    for i in data:
        if len(data[i])>2:
            data[i] = get_img_url(i)
        x+=1
        print(f"{x}/{len(data)}",i)
    with open('pictures2.json','w',encoding='utf-8') as f:
        json.dump(data,f,ensure_ascii=False,indent=4)