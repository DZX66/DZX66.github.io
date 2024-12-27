import json
import os

os.chdir(os.path.dirname(__file__))
with open('blocks.json', 'r', encoding='utf-8') as f:
    english = json.load(f)
    for i in english:
        english[i] = english[i].replace(" ", "_")
glasses=['/images/thumb/White_Stained_Glass_JE3_BE3.png/150px-White_Stained_Glass_JE3_BE3.png',
'/images/thumb/Light_Gray_Stained_Glass_JE3_BE3.png/150px-Light_Gray_Stained_Glass_JE3_BE3.png',
'/images/thumb/Gray_Stained_Glass_JE3_BE3.png/150px-Gray_Stained_Glass_JE3_BE3.png',
'/images/thumb/Black_Stained_Glass_JE3_BE3.png/150px-Black_Stained_Glass_JE3_BE3.png',
'/images/thumb/Brown_Stained_Glass_JE3_BE3.png/150px-Brown_Stained_Glass_JE3_BE3.png',
'/images/thumb/Red_Stained_Glass_JE4_BE4.png/150px-Red_Stained_Glass_JE4_BE4.png',
'/images/thumb/Orange_Stained_Glass_JE3_BE3.png/150px-Orange_Stained_Glass_JE3_BE3.png',
'/images/thumb/Yellow_Stained_Glass_JE3_BE3.png/150px-Yellow_Stained_Glass_JE3_BE3.png',
'/images/thumb/Lime_Stained_Glass_JE3_BE3.png/150px-Lime_Stained_Glass_JE3_BE3.png',
'/images/thumb/Green_Stained_Glass_JE3_BE3.png/150px-Green_Stained_Glass_JE3_BE3.png',
'/images/thumb/Cyan_Stained_Glass_JE3_BE3.png/150px-Cyan_Stained_Glass_JE3_BE3.png',
'/images/thumb/Light_Blue_Stained_Glass_JE3_BE3.png/150px-Light_Blue_Stained_Glass_JE3_BE3.png',
'/images/thumb/Blue_Stained_Glass_JE4_BE4.png/150px-Blue_Stained_Glass_JE4_BE4.png',
'/images/thumb/Purple_Stained_Glass_JE3_BE3.png/150px-Purple_Stained_Glass_JE3_BE3.png',
'/images/thumb/Magenta_Stained_Glass_JE3_BE3.png/150px-Magenta_Stained_Glass_JE3_BE3.png',
'/images/thumb/Pink_Stained_Glass_JE3_BE3.png/150px-Pink_Stained_Glass_JE3_BE3.png',
'/images/thumb/White_Stained_Glass_Pane_JE3_BE2.png/150px-White_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Light_Gray_Stained_Glass_Pane_JE3_BE2.png/150px-Light_Gray_Stained_Glass_Pane_JE3_BE2.png',   
'/images/thumb/Gray_Stained_Glass_Pane_JE3_BE2.png/150px-Gray_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Black_Stained_Glass_Pane_JE3_BE2.png/150px-Black_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Brown_Stained_Glass_Pane_JE3_BE2.png/150px-Brown_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Red_Stained_Glass_Pane_JE4_BE3.png/150px-Red_Stained_Glass_Pane_JE4_BE3.png',
'/images/thumb/Orange_Stained_Glass_Pane_JE3_BE2.png/150px-Orange_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Yellow_Stained_Glass_Pane_JE3_BE2.png/150px-Yellow_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Lime_Stained_Glass_Pane_JE3_BE2.png/150px-Lime_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Green_Stained_Glass_Pane_JE3_BE2.png/150px-Green_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Cyan_Stained_Glass_Pane_JE3_BE2.png/150px-Cyan_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Light_Blue_Stained_Glass_Pane_JE3_BE2.png/150px-Light_Blue_Stained_Glass_Pane_JE3_BE2.png',   
'/images/thumb/Blue_Stained_Glass_Pane_JE4_BE3.png/150px-Blue_Stained_Glass_Pane_JE4_BE3.png',
'/images/thumb/Purple_Stained_Glass_Pane_JE3_BE2.png/150px-Purple_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Magenta_Stained_Glass_Pane_JE3_BE2.png/150px-Magenta_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/Pink_Stained_Glass_Pane_JE3_BE2.png/150px-Pink_Stained_Glass_Pane_JE3_BE2.png',
'/images/thumb/White_Terracotta_JE1_BE1.png/150px-White_Terracotta_JE1_BE1.png',
'/images/thumb/Light_Gray_Terracotta_JE1_BE1.png/150px-Light_Gray_Terracotta_JE1_BE1.png',
'/images/thumb/Gray_Terracotta_JE1_BE1.png/150px-Gray_Terracotta_JE1_BE1.png',
'/images/thumb/Black_Terracotta_JE1_BE1.png/150px-Black_Terracotta_JE1_BE1.png',
'/images/thumb/Brown_Terracotta_JE1_BE1.png/150px-Brown_Terracotta_JE1_BE1.png',
'/images/thumb/Red_Terracotta_JE1_BE1.png/150px-Red_Terracotta_JE1_BE1.png',
'/images/thumb/Orange_Terracotta_JE1_BE1.png/150px-Orange_Terracotta_JE1_BE1.png',
'/images/thumb/Yellow_Terracotta_JE1_BE1.png/150px-Yellow_Terracotta_JE1_BE1.png',
'/images/thumb/Lime_Terracotta_JE1_BE1.png/150px-Lime_Terracotta_JE1_BE1.png',
'/images/thumb/Green_Terracotta_JE1_BE1.png/150px-Green_Terracotta_JE1_BE1.png',
'/images/thumb/Cyan_Terracotta_JE1_BE1.png/150px-Cyan_Terracotta_JE1_BE1.png',
'/images/thumb/Light_Blue_Terracotta_JE1_BE1.png/150px-Light_Blue_Terracotta_JE1_BE1.png',
'/images/thumb/Blue_Terracotta_JE1_BE1.png/150px-Blue_Terracotta_JE1_BE1.png',
'/images/thumb/Purple_Terracotta_JE1_BE1.png/150px-Purple_Terracotta_JE1_BE1.png',
'/images/thumb/Magenta_Terracotta_JE1_BE1.png/150px-Magenta_Terracotta_JE1_BE1.png',
'/images/thumb/Pink_Terracotta_JE1_BE1.png/150px-Pink_Terracotta_JE1_BE1.png',
'/images/thumb/Potted_Dandelion_JE3_BE2.png/150px-Potted_Dandelion_JE3_BE2.png',
'/images/thumb/Potted_Poppy_JE3_BE2.png/150px-Potted_Poppy_JE3_BE2.png',
'/images/thumb/Potted_Blue_Orchid_JE3_BE2.png/150px-Potted_Blue_Orchid_JE3_BE2.png',
'/images/thumb/Potted_Allium_JE3_BE2.png/150px-Potted_Allium_JE3_BE2.png',
'/images/thumb/Potted_Azure_Bluet_JE3_BE2.png/150px-Potted_Azure_Bluet_JE3_BE2.png',
'/images/thumb/Potted_Red_Tulip_JE3_BE2.png/150px-Potted_Red_Tulip_JE3_BE2.png',
'/images/thumb/Potted_Orange_Tulip_JE3_BE2.png/150px-Potted_Orange_Tulip_JE3_BE2.png',
'/images/thumb/Potted_White_Tulip_JE3_BE2.png/150px-Potted_White_Tulip_JE3_BE2.png',
'/images/thumb/Potted_Pink_Tulip_JE3_BE2.png/150px-Potted_Pink_Tulip_JE3_BE2.png',
'/images/thumb/Potted_Oxeye_Daisy_JE3_BE2.png/150px-Potted_Oxeye_Daisy_JE3_BE2.png',
'/images/thumb/Potted_Cornflower_JE2_BE1.png/150px-Potted_Cornflower_JE2_BE1.png',
'/images/thumb/Potted_Lily_of_the_Valley_JE2_BE1.png/150px-Potted_Lily_of_the_Valley_JE2_BE1.png',
'/images/thumb/Potted_Wither_Rose_JE2_BE1.png/150px-Potted_Wither_Rose_JE2_BE1.png',
'/images/thumb/Potted_Torchflower_JE2_BE1.png/150px-Potted_Torchflower_JE2_BE1.png',
'/images/thumb/Potted_Closed_Eyeblossom_JE1_BE1.png/150px-Potted_Closed_Eyeblossom_JE1_BE1.png',
'/images/thumb/Potted_Open_Eyeblossom_JE1_BE1.png/150px-Potted_Open_Eyeblossom_JE1_BE1.png',
'/images/thumb/Potted_Oak_Sapling_JE3_BE2.png/150px-Potted_Oak_Sapling_JE3_BE2.png',
'/images/thumb/Potted_Spruce_Sapling_JE3_BE2.png/150px-Potted_Spruce_Sapling_JE3_BE2.png',
'/images/thumb/Potted_Birch_Sapling_JE3_BE2.png/150px-Potted_Birch_Sapling_JE3_BE2.png',
'/images/thumb/Potted_Jungle_Sapling_JE3_BE2.png/150px-Potted_Jungle_Sapling_JE3_BE2.png',
'/images/thumb/Potted_Acacia_Sapling_JE3_BE2.png/150px-Potted_Acacia_Sapling_JE3_BE2.png',
'/images/thumb/Potted_Dark_Oak_Sapling_JE3_BE2.png/150px-Potted_Dark_Oak_Sapling_JE3_BE2.png',
'/images/thumb/Potted_Cherry_Sapling_JE3_BE1.png/150px-Potted_Cherry_Sapling_JE3_BE1.png',
'/images/thumb/Potted_Pale_Oak_Sapling_JE1_BE1.png/150px-Potted_Pale_Oak_Sapling_JE1_BE1.png',
'/images/thumb/Potted_Mangrove_Propagule_JE2_BE1.png/150px-Potted_Mangrove_Propagule_JE2_BE1.png',
'/images/thumb/Potted_Azalea_JE2_BE1.png/150px-Potted_Azalea_JE2_BE1.png',
'/images/thumb/Potted_Flowering_Azalea_JE2_BE1.png/150px-Potted_Flowering_Azalea_JE2_BE1.png',
'/images/thumb/Potted_Red_Mushroom_JE3_BE2.png/150px-Potted_Red_Mushroom_JE3_BE2.png',
'/images/thumb/Potted_Brown_Mushroom_JE3_BE2.png/150px-Potted_Brown_Mushroom_JE3_BE2.png',
'/images/thumb/Potted_Crimson_Fungus_JE2_BE1.png/150px-Potted_Crimson_Fungus_JE2_BE1.png',
'/images/thumb/Potted_Warped_Fungus_JE2_BE1.png/150px-Potted_Warped_Fungus_JE2_BE1.png',
'/images/thumb/Potted_Crimson_Roots_JE2_BE1.png/150px-Potted_Crimson_Roots_JE2_BE1.png',
'/images/thumb/Potted_Warped_Roots_JE2_BE1.png/150px-Potted_Warped_Roots_JE2_BE1.png',
'/images/thumb/Potted_Fern_JE3_BE2.png/150px-Potted_Fern_JE3_BE2.png',
'/images/thumb/Potted_Dead_Bush_JE3_BE2.png/150px-Potted_Dead_Bush_JE3_BE2.png',
'/images/thumb/Potted_Cactus_JE4.png/150px-Potted_Cactus_JE4.png',
'/images/thumb/Potted_Bamboo_JE2_BE1.png/150px-Potted_Bamboo_JE2_BE1.png',]
with open('pictures3.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    for i in data:
        if i.endswith("盆栽"):
            for j in glasses:
                if english[i] in j:
                    data[i] = j
                    print(i, j)
                    break
with open('pictures3.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)