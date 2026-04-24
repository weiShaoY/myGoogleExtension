/**
 * 搜索组件配置文件
 * @description 包含搜索组件的显示路径和站点配置
 */

/**
 * 搜索组件配置
 * @description 定义搜索组件的显示路径和站点列表
 */
export const SearchConfig: {
  /**
   * 搜索组件显示的网站路径列表
   * @description 定义在哪些网站路径上显示搜索组件
   */
  displayOnPaths: SearchConfigType.displayOnPaths

  /**
   * 站点分组列表
   * @description 包含所有搜索引擎和网站的分组配置
   */
  siteGroups: SearchConfigType.SiteItem[]
} = {
  displayOnPaths: [
    'google.com/search',
    'baidu.com/s',
  ],
  siteGroups: [
    {
      name: 'Google',
      icon: 'search-site-search-google',
      hostname: 'google.com',
      inputId: 'APjFqb',
      searchUrl: 'https://www.google.com/search?q=',
    },
    {
      name: 'Baidu',
      icon: 'search-site-search-baidu',
      hostname: 'baidu.com',
      inputId: 'chat-textarea',
      searchUrl: 'https://www.baidu.com/s?wd=',
    },
    {
      name: '购物',
      icon: 'shop-jd',
      siteGroups: [
        {
          name: '京东',
          icon: 'search-site-shop-jd',
          hostname: 'jd.com',
          inputIndex: 1,
          searchUrl: 'https://search.jd.com/Search?keyword=',
        },
        {
          name: '淘宝',
          icon: 'search-site-shop-taoBao',
          hostname: 'taobao.com',
          inputId: 'q',
          searchUrl: 'https://s.taobao.com/search?q=',
        },
        {
          name: '咸鱼',
          icon: 'search-site-shop-xianYu',
          hostname: 'goofish.com',
          inputClass: 'input.search-input--WY2l9QD3',
          searchUrl: 'https://www.goofish.com/search?q=',
        },
        {
          name: '慢慢买',
          icon: 'search-site-shop-manManMai',
          hostname: 'manmanbuy.com',
          inputId: 'search-input',
          searchUrl: 'https://tool.manmanbuy.com/HistoryLowest.aspx?url=',
        },
      ],
    },

    {
      name: '开发',
      icon: 'dev-jueJin',
      siteGroups: [
        {
          name: '稀土掘金',
          icon: 'search-site-dev-jueJin',
          hostname: 'juejin.cn',
          inputClass: 'input.search-input',
          searchUrl: 'https://juejin.cn/search?query=',
        },
        {
          name: 'Csdn',
          icon: 'search-site-dev-csdn',
          hostname: 'csdn.net',
          inputId: 'keyword',
          searchUrl: 'https://so.csdn.net/so/search?q=',
        },
        {
          name: 'Iconfont',
          icon: 'search-site-dev-iconfont',
          hostname: 'iconfont.cn',
          inputId: 'J_suggest_input',
          searchUrl: 'https://www.iconfont.cn/search/index?q=',
        },
      ],
    },
    {
      name: '论坛',
      icon: 'forum-v2ex',
      siteGroups: [
        {
          name: 'V2EX',
          icon: 'search-site-forum-v2ex',
          hostname: 'v2ex.com',
          inputId: 'search',
          searchUrl: 'https://www.google.com/search?q=site:v2ex.com/t%20',
        },
        {
          name: 'Linux.do',
          icon: 'search-site-forum-linuxDo',
          hostname: 'linux.do',
          inputId: 'icon-search-input',
          searchUrl: 'https://linux.do/search?q=',
        },
      ],
    },

    {
      name: '成人',
      icon: 'av-javdb',
      siteGroups: [
        {
          name: 'javdb',
          icon: 'search-site-adult-javdb',
          hostname: 'javdb.com',
          inputId: 'video-search',
          searchUrl: 'https://javdb.com/search?q=',
        },
        {
          name: 'MissAV',
          icon: 'search-site-adult-missAV',
          hostname: 'missav.ai',
          inputClass: 'input.text-nord9',
          searchUrl: 'https://missav.ai/search/',
        },
        {
          name: 'javbus',
          icon: 'search-site-adult-javBus',
          hostname: 'javbus.com',
          inputClass: 'input.form-control',
          searchUrl: 'https://www.javbus.com/search/',
        },
        {
          name: 'btsow',
          icon: 'search-site-adult-btsow',
          hostname: 'btsow.com',
          inputId: 'search-input',
          searchUrl: 'https://btsow.lol/#/search/',
        },
      ],
    },
  ],

}
