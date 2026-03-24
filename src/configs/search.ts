/**
 *  搜索组件配置
 */
export const SearchConfig: {
  siteList: SearchConfigType.SiteItem[]
} = {
  siteList: [
    {
      name: 'Google',
      icon: 'google',
      hostname: 'google.com',
      inputId: 'APjFqb',
      searchUrl: 'https://www.google.com/search?q=',
    },
    {
      name: 'Baidu',
      icon: 'baidu',
      hostname: 'baidu.com',
      inputId: 'chat-textarea',
      searchUrl: 'https://www.baidu.com/s?wd=',
    },
    {
      name: '开发',
      icon: 'dev-jueJin',
      siteList: [
        {
          name: '稀土掘金',
          icon: 'dev-jueJin',
          hostname: 'juejin.cn',
          inputClass: 'input.search-input',
          searchUrl: 'https://juejin.cn/search?query=',
        },
        {
          name: 'Csdn',
          icon: 'dev-csdn',
          hostname: 'csdn.net',
          inputId: 'keyword',
          searchUrl: 'https://so.csdn.net/so/search?q=',
        },
        {
          name: 'Iconfont',
          icon: 'dev-iconfont',
          hostname: 'iconfont.cn',
          inputId: 'J_suggest_input',
          searchUrl: 'https://www.iconfont.cn/search/index?q=',
        },
      ],
    },
    {
      name: '论坛',
      icon: 'forum-v2ex',
      siteList: [
        {
          name: 'V2EX',
          icon: 'forum-v2ex',
          hostname: 'v2ex.com',
          inputId: 'search',
          searchUrl: 'https://www.google.com/search?q=site:v2ex.com/t%20',
        },
        {
          name: 'Linux.do',
          icon: 'forum-linuxDo',
          hostname: 'linux.do',
          inputId: 'icon-search-input',
          searchUrl: 'https://linux.do/search?q=',
        },
      ],
    },
    {
      name: '购物',
      icon: 'shop-jd',
      siteList: [
        {
          name: '京东',
          icon: 'shop-jd',
          hostname: 'jd.com',
          inputIndex: 1,
          searchUrl: 'https://search.jd.com/Search?keyword=',
        },
        {
          name: '淘宝',
          icon: 'shop-taobao',
          hostname: 'taobao.com',
          inputId: 'q',
          searchUrl: 'https://s.taobao.com/search?q=',
        },
        {
          name: '咸鱼',
          icon: 'shop-goofish',
          hostname: 'goofish.com',
          inputClass: 'input.search-input--WY2l9QD3',
          searchUrl: 'https://www.goofish.com/search?q=',
        },
        {
          name: '慢慢买',
          icon: 'shop-manmanbuy',
          hostname: 'manmanbuy.com',
          inputId: 'search-input',
          searchUrl: 'https://tool.manmanbuy.com/HistoryLowest.aspx?url=',
        },
      ],
    },

    {
      name: '成人',
      icon: 'av-javdb',
      siteList: [
        {
          name: 'javdb',
          icon: 'av-javdb',
          hostname: 'javdb.com',
          inputId: 'video-search',
          searchUrl: 'https://javdb.com/search?q=',
        },
        {
          name: 'missav',
          icon: 'av-missav',
          hostname: 'missav.ws',
          inputClass: 'input.text-nord9',
          searchUrl: 'https://missav.ws/search/',
        },
        {
          name: 'javbus',
          icon: 'av-javBus',
          hostname: 'javbus.com',
          inputClass: 'input.form-control',
          searchUrl: 'https://www.javbus.com/search/',
        },
        {
          name: 'btsow',
          icon: 'av-btsow',
          hostname: 'btsow.com',
          inputId: 'search-input',
          searchUrl: 'https://btsow.lol/#/search/',
        },
      ],
    },
  ],

}
