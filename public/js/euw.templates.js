/**
 * EUW 模板定义文件
 * 
 * 每个模板是一个对象，包含：
 * - params: 参数定义，key 为参数名，value 为 { type, required?, default?, description? }
 * - render: 渲染函数，接收参数对象并返回 HTML 字符串，可以用module.exports.templates.模板名.render调用其他模板
 * - description?: 模板描述（可选）
 */


// 辅助函数：获取当前日期组件
const getCurrentDate = () => {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate()
  };
};

module.exports = {
  templates: {
    // ---------- 基础信息框模板（可被其他模板继承调用） ----------
    infobox: {
      params: {
        img_src: { type: 'string', required: true, description: '左侧图标 URL' },
        side_color: { type: 'string', required: true, description: '左侧边框颜色（如 orange, blue, red, pink, green）' },
        width: { type: 'string', default: '50', description: '图片宽度' },
        height: { type: 'string', default: '50', description: '图片高度' },
        content: { type: 'string', required: true, description: '信息框内显示的 HTML 内容' }
      },
      description: '基础信息框模板，其他信息框模板通过调用此模板实现继承',
      render: ({ img_src, side_color, width, height, content }) => {
        return `<table class="common-box" style="margin: 10px 10%; width:80%; background: #FBFBFB; border-left: 10px solid ${side_color};">
          <tbody><tr>
            <td style="padding: 2px 0 2px 0.5em"><img src="${img_src}" width="${width}" height="${height}" alt=""></td>
            <td style="padding: 0.25em 0.5em">${content}</td>
          </tr></tbody>
        </table>`;
      }
    },

    // ---------- 预设信息框：现实人物 ----------
    infobox_real_person: {
      params: {},
      description: '现存于世人物提示框',
      render: () => {
        return module.exports.templates.infobox.render({
          img_src: 'https://img.moegirl.org.cn/common/thumb/b/bc/Commons-emblem-issue.svg/75px-Commons-emblem-issue.svg.png',
          side_color: 'orange',
          width: '50',
          height: '49',
          content: '<b>这是一个有关现存于世人物的条目。</b>内容可能不准确或含有偏见，仅供参考。理解万岁！'
        });
      }
    },

    // ---------- 预设信息框：先一起喊 ----------
    infobox_shout: {
      params: {
        shout: { type: 'string', required: true, description: '喊话内容' }
      },
      description: '先一起喊提示框',
      render: ({ shout }) => {
        return module.exports.templates.infobox.render({
          img_src: 'https://img.moegirl.org.cn/common/thumb/6/6f/Emo_%E3%82%8F%E3%81%84%E3%81%AE%E3%82%8F%E3%81%84%E3%81%AE.png/75px-Emo_%E3%82%8F%E3%81%84%E3%81%AE%E3%82%8F%E3%81%84%E3%81%AE.png',
          side_color: 'pink',
          width: '37',
          height: '49',
          content: `进条目啥都别说，先一起喊：<b><big><big><big>${shout}</big></big></big></b>`
        });
      }
    },

    // ---------- 预设信息框：多图警告 ----------
    infobox_many_images: {
      params: {},
      description: '多图警告框',
      render: () => {
        return module.exports.templates.infobox.render({
          img_src: 'https://img.moegirl.org.cn/common/thumb/2/26/Nuvola_apps_important_blue.svg/75px-Nuvola_apps_important_blue.svg.png',
          side_color: 'blue',
          width: '50',
          height: '44',
          content: '这个条目包含了较多的图片，这可能会导致访问速度变慢，阅读体验变差，请耐心等待！<span class="heimu">服务器是GitHub的</span>'
        });
      }
    },

    // ---------- 预设信息框：官方文档 ----------
    infobox_official_doc: {
      params: {},
      description: '官方文档提示框',
      render: () => {
        return module.exports.templates.infobox.render({
          img_src: 'https://img.moegirl.org.cn/common/thumb/3/3f/Commons-emblem-success.svg/113px-Commons-emblem-success.svg.png',
          side_color: 'green',
          width: '50',
          height: '50',
          content: '这个文档是<b>柳下回声</b>的<b>官方文档</b>，这意味着它与本网站的运作有所关联，一般情况下，本页面不宜频繁更改。'
        });
      }
    },

    // ---------- 预设信息框：转载声明 ----------
    infobox_repost: {
      params: {},
      description: '转载声明框',
      render: () => {
        return module.exports.templates.infobox.render({
          img_src: 'https://img.moegirl.org.cn/common/thumb/2/26/Nuvola_apps_important_blue.svg/75px-Nuvola_apps_important_blue.svg.png',
          side_color: 'blue',
          width: '50',
          height: '44',
          content: '<b>此内容的著作权不属于柳下回声</b>，编辑者仅以介绍为目的进行引用。<br/>另请编辑者注意：最好与原作者取得同意后再转载。'
        });
      }
    },

    // ---------- 预设信息框：冒犯他人 ----------
    infobox_offensive: {
      params: {},
      description: '内容可能冒犯他人警告框',
      render: () => {
        return module.exports.templates.infobox.render({
          img_src: 'https://img.moegirl.org.cn/common/thumb/b/b1/Gnome-emblem-important.svg/75px-Gnome-emblem-important.svg.png',
          side_color: 'red',
          width: '50',
          height: '50',
          content: '<b class="stress">此页面包含冒犯他人的内容。</b><br/>随意提及可能会导致他人的<b>厌恶</b>。'
        });
      }
    },

    // ---------- 预设信息框：页内查找提示 ----------
    infobox_page_search: {
      params: {},
      description: '提示使用页内查找功能',
      render: () => {
        return module.exports.templates.infobox.render({
          img_src: 'https://img.moegirl.org.cn/common/thumb/5/5c/Ambox_glass_green.svg/38px-Ambox_glass_green.svg.png',
          side_color: 'green',
          width: '50',
          height: '50',
          content: '<b>本页面内容较多，您可以使用浏览器的页内查找功能 <span style="color:green;">Ctrl + F</span> (Windows/Linux) / <span style="color:green;">⌘ + F</span> (MacOS) / <span style="color:green;">右上角三个点 -> 查找页面内容/在网页上查找</span> (手机端) 查找所需要的信息。</b><br/>如果未能获取理想的搜索结果，可以尝试提取搜索项中的关键文本。'
        });
      }
    },

    // ---------- 预设信息框：施工中 ----------
    infobox_under_construction: {
      params: {},
      description: '页面施工中提示',
      render: () => {
        return module.exports.templates.infobox.render({
          img_src: 'https://img.moegirl.org.cn/common/thumb/2/26/Nuvola_apps_important_blue.svg/75px-Nuvola_apps_important_blue.svg.png',
          side_color: 'blue',
          width: '50',
          height: '50',
          content: '<b>这个页面正在施工中。</b><br/>您所看到的页面未必是最新，可能存在内容缺失。'
        });
      }
    },

    // ---------- 预设信息框：长期更新 ----------
    infobox_long_term_update: {
      params: {},
      description: '内容需长期更新提示',
      render: () => {
        return module.exports.templates.infobox.render({
          img_src: 'https://img.moegirl.org.cn/common/thumb/1/19/Ambox_currentevent.svg/75px-Ambox_currentevent.svg.png',
          side_color: 'blue',
          width: '50',
          height: '50',
          content: '<b>此页面中存在需要长期更新的内容，现存条目中内容未必是最新。</b>'
        });
      }
    },

    // ---------- 黑幕模板 ----------
    heimu: {
      params: {
        text: { type: 'string', required: true, description: '鼠标悬停前隐藏的文字' },
        title: { type: 'string', default: "你知道的太多了", description: '鼠标移上去悬浮的文字' }
      },
      description: '生成黑幕效果（鼠标悬停显示文字）',
      render: ({ text, title }) => `<span class="heimu" title="${title.replace(/"/g, '&quot;')}">${text}</span>`
    },

    // ---------- 网易云音乐外链播放器 ----------
    wyy: {
      params: {
        id: { type: 'string', required: true, description: '网易云歌曲ID（纯数字）或包含数字的链接' },
        auto: { type: 'number', default: 0, description: '是否自动播放：1 或 0' }
      },
      description: '嵌入网易云音乐外链播放器（iframe）',
      render: ({ id, auto }) => {
        let songId = id;
        if (id.startsWith('https')) {
          const matches = id.match(/\d+/g);
          songId = matches && matches[1] ? matches[1] : '';
        }
        return `<iframe title="网易云音乐" frameborder="no" border="0" marginwidth="0" marginheight="0" width="330" height="86" src="https://music.163.com/outchain/player?type=2&id=${songId}&auto=${auto}&height=66"></iframe>`;
      }
    },

    // ---------- 自制音频播放器 ----------
    music: {
      params: {
        src: { type: 'string', required: true, description: '音频文件链接' },
        title: { type: 'string', default: '音频', description: '显示标题' },
        img: { type: 'string', default: '', description: '封面图片链接' },
        loop: { type: 'string', default: '0', description: '是否循环播放：1 或 0' }
      },
      description: '生成一个带封面的 HTML5 音频播放器（需配合全局播放器 JS）',
      render: ({ src, title, img, loop }) => {
        return `<div class="player player-mid f-cb f-pr">
          <div class="cover cover-sm f-pr">
            <img id="cover" src="${img}">
            <div class="mask"></div>
            <div id="play" class="bg play-bg" data-action="play" onclick="play_music();"></div>
            <div id="pause" class="bg pause-bg f-hide" data-action="pause" onclick="pause_music();"></div>
          </div>
          <div id="mid-ctrl" class="ctrlBox" style="width: 225px;">
            <div class="f-pr m_t">
              <i data-action="home" class="bg logo"></i>
              <div id="mtitle" class="mtitle" style="width: 201px;">
                <marquee scrollamount="2" onmouseover="this.stop()" onmouseout="this.start()">${title}</marquee>
              </div>
            </div>
            <div id="bar" class="bar" style="width: 181px;">
              <div class="played j-flag" style="width: 0%;"><span class="bg thumb j-flag"></span></div>
            </div>
          </div>
          <span id="time" class="time">- 00:00</span>
        </div>
        <audio id="audio" src="${src}"${loop === '1' ? ' loop' : ''}></audio>`;
      }
    },

    // ---------- 百度搜索链接 ----------
    baidu: {
      params: {
        wd: { type: 'string', required: true, description: '搜索关键词' }
      },
      description: '生成指向百度搜索的链接',
      render: ({ wd }) => `<a href="https://www.baidu.com/s?wd=${encodeURIComponent(wd)}" target="_blank">${wd}</a>`
    },

    // ---------- 萌娘百科链接 ----------
    moegirl: {
      params: {
        page: { type: 'string', required: true, description: '萌娘百科页面名（URL 部分）' }
      },
      description: '生成指向萌娘百科的链接',
      render: ({ page }) => `<a href="https://zh.moegirl.org.cn/${page}" target="_blank">${page} - 萌娘百科</a>`
    },

    // ---------- B站视频链接 ----------
    bilibili: {
      params: {
        bv: { type: 'string', required: true, description: '视频 BV 号' },
        title: { type: 'string', description: '自定义链接文字，默认为 BV 号' }
      },
      description: '生成指向 Bilibili 视频的链接',
      render: ({ bv, title }) => {
        const displayText = title ? `${title} (${bv})` : bv;
        return `<a href="https://www.bilibili.com/video/${bv}" target="_blank">${displayText}</a>`;
      }
    },

    // ---------- 居中图片（带说明） ----------
    img_center: {
      params: {
        src: { type: 'string', required: true, description: '图片链接' },
        title: { type: 'string', description: '图片标题（鼠标悬停）' },
        width: { type: 'string', description: '宽度（如 300px）' },
        height: { type: 'string', description: '高度（如 200px）' },
        desc: { type: 'string', description: '图片下方说明文字' }
      },
      description: '生成居中显示的图片，可点击放大，带说明文字',
      render: ({ src, title, width, height, desc }) => {
        const imgTitle = title || desc || '';
        const widthAttr = width ? ` width="${width}"` : '';
        const heightAttr = height ? ` height="${height}"` : '';
        return `<figure class="container">
          <a href="${src}" target="_blank">
            <img src="${src}" title="${imgTitle}"${widthAttr}${heightAttr}>
          </a>
          <figcaption>${desc || ''}</figcaption>
        </figure>`;
      }
    },

    // ---------- 日期组件 ----------
    year: {
      params: {},
      description: '输出当前年份（四位数）',
      render: () => String(getCurrentDate().year)
    },
    month: {
      params: {},
      description: '输出当前月份（1-12）',
      render: () => String(getCurrentDate().month)
    },
    day: {
      params: {},
      description: '输出当前日期（1-31）',
      render: () => String(getCurrentDate().day)
    },

    external_link: {
      params: {
        url: { type: 'string', required: true, description: '外部链接' },
        display: { type: 'string', default: '', description: '显示名称' }
      },
      description: '生成外部链接',
      render: ({ url, display }) => `<a target="_blank" href="${url}">${display || url}</a>`
    },
    star: {
      params: {},
      description: "生成星号",
      render: () => '*'
    },
    underline: {
      params: {},
      description: "生成下划线",
      render: () => '_'
    },
    arrow_right: {
      params: {},
      description: "生成右箭头",
      render: () => '>'
    },
    sup: {
      params: {
        text: { type: 'string', required: true, description: '需要上标的文字' },
      },
      description: '上标',
      render: ({ text }) => `<sup>${text}</sup>`
    },
  }
};