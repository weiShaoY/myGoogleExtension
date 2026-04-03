/**
 *  在线播放配置
 */
export const onlinePlayConfig: {
  siteList: OnlinePlayConfigType.SiteItem[]
} = {
  siteList: [
    {
      isVisible: true,
      name: 'JavDB',
      icon: 'content-adult-site-javdb',
      hostname: 'javdb.com',
      searchUrl: '/search?q={{code}}',
      fetchType: 'parser',
      domQuery: {
        linkQuery: '.movie-list>.item:first-child>a',
        titleQuery: '.video-title',
      },
    },
    {
      isVisible: true,
      name: 'MISSAV',
      icon: 'content-adult-site-missav',
      hostname: 'missav.ws',
      searchUrl: '/{{code}}/',
      fetchType: 'get',
      domQuery: {
        subQuery: '.space-y-2 a.text-nord13[href="https://missav.ws/chinese-subtitle"]',
        leakQuery: '.order-first div.rounded-md a[href]:last-child',
      },
    },
    {
      isVisible: true,
      name: 'JavBus',
      icon: 'content-adult-site-javBus',
      hostname: 'javbus.com',
      searchUrl: '/{{code}}',
      fetchType: 'get',
      domQuery: {
      },
    },

    {
      isVisible: true,
      name: 'Jable',
      icon: 'content-adult-site-jable',
      hostname: 'jable.tv',
      searchUrl: '/videos/{{code}}/',
      fetchType: 'get',
      domQuery: {
        subQuery: '.info-header',
        leakQuery: '.info-header',
      },
    },

    // / /////////////  njav 改成了 123av ////////////////
    {
      isVisible: true,
      name: '123av',
      icon: 'content-adult-site-njav',
      hostname: '123av.com',
      searchUrl: '/zh/search?keyword={{code}}',
      fetchType: 'parser',

      // strictParser: true,
      domQuery: {
        linkQuery: `.detail>a[href*='v/']`,
        titleQuery: `.detail>a[href*='v/']`,
      },
    },
    {
      isVisible: true,
      name: 'Supjav',
      icon: 'content-adult-site-supjav',
      hostname: 'supjav.com',
      searchUrl: '/zh/?s={{code}}',
      fetchType: 'parser',
      domQuery: {
        linkQuery: `.posts.clearfix>.post>a.img[title]`,
        titleQuery: `h3>a[rel="bookmark"][itemprop="url"]`,
      },
    },
    {
      isVisible: true,
      name: 'NETFLAV',
      icon: 'content-adult-site-netflav',
      hostname: 'netflav5.com',
      searchUrl: '/search?type=title&keyword={{code}}',
      fetchType: 'parser',
      domQuery: {
        linkQuery: '.grid_0_cell>a[href^=\'/video?\']',
        titleQuery: '.grid_0_cell>a[href^=\'/video?\'] .grid_0_title',
      },
    },
    {
      isVisible: true,
      name: 'BestJP',
      icon: 'content-adult-site-bestjavporn',
      hostname: 'bestjavporn.com',
      searchUrl: '/search/{{code}}',
      fetchType: 'parser',
      domQuery: {
        linkQuery: 'article.thumb-block>a',
        titleQuery: 'article.thumb-block>a',
      },
    },
    {
      isVisible: true,
      name: 'JAVMENU',
      icon: 'content-adult-site-javmenu',
      hostname: 'javmenu.com',
      searchUrl: '/{{code}}',
      fetchType: 'get',
      domQuery: {
        videoQuery: 'a.ncontent-adult-site-link[aria-controls=\'pills-0\']',
      },
    },
    {
      isVisible: true,
      name: 'Jav.Guru',
      icon: 'content-adult-site-javGuru',
      hostname: 'jav.guru',
      searchUrl: '/?s={{code}}',
      fetchType: 'parser',
      domQuery: {
        linkQuery: '.imgg>a[href]',
        titleQuery: '.inside-article>.grid1 a[title]',
      },
    },
    {
      isVisible: true,
      name: 'JAVMOST',
      icon: 'content-adult-site-javmost',
      hostname: 'javmost.cx',
      searchUrl: '/search/{{code}}/',
      fetchType: 'parser',
      domQuery: {
        linkQuery: '#content .card a#MyImage',
        titleQuery: '#content .card-block .card-title',
      },
    },
    {
      isVisible: true,
      name: 'HAYAV',
      icon: 'content-adult-site-hayav',
      hostname: 'hayav.com',
      searchUrl: '/video/{{code}}/',
      fetchType: 'get',
      domQuery: {
      },
    },
    {
      isVisible: true,
      name: 'AvJoy',
      icon: 'content-adult-site-avjoy',
      hostname: 'avjoy.me',
      searchUrl: '/search/videos/{{code}}',
      fetchType: 'parser',
      domQuery: {
        titleQuery: `#wrapper .row .content-info span.content-title`,
        linkQuery: `#wrapper .row a[href^="/video/"]`,
      },
    },

    // {
    //   isVisible: true,
    //   name: 'JAVFC2',
    //   icon: 'content-adult-site-javfc2',
    //   hostname: 'javfc2.net',
    //   searchUrl: '/?s={{code}}',
    //   fetchType: 'parser',
    //   domQuery: {
    //     linkQuery: 'article.loop-video>a[href]',
    //     titleQuery: 'article.loop-video .entry-header',
    //   },
    // },
    {
      isVisible: true,
      name: 'paipancon-(FC2)',
      icon: 'content-adult-site-paipancon',
      hostname: 'paipancon.com',
      searchUrl: '/search/{{code}}',
      fetchType: 'parser',
      domQuery: {
        linkQuery: 'div.col>div.card>a[href]',
        titleQuery: 'div.card img.card-img-top',
      },
    },
    {
      isVisible: true,
      name: 'GGJAV',
      icon: 'content-adult-site-ggjav',
      hostname: 'ggjav.com',
      searchUrl: '/main/search?string={{code}}',
      fetchType: 'parser',
      domQuery: {
        listIndex: 1,
        titleQuery: 'div.columns.large-3.medium-6.small-12.item.float-left>div.item_title>a.gray_a',
        linkQuery: 'div.columns.large-3.medium-6.small-12.item.float-left>div.item_title>a.gray_a',
      },
    },
    {
      isVisible: true,
      name: 'AV01',
      icon: 'content-adult-site-av01',
      hostname: 'av01.tv',
      searchUrl: '/cn/search?q={{code}}',
      fetchType: 'parser',
      domQuery: {
        linkQuery: 'div.well>a[href^=\'/video/\']',
        titleQuery: 'div.well>a[href^=\'/video/\']',
      },
    },
    {
      isVisible: true,
      name: 'highporn',
      icon: 'content-adult-site-highporn',
      hostname: 'highporn.net',
      searchUrl: '/search/videos?search_query={{code}}',
      fetchType: 'parser',
      domQuery: {
        linkQuery: '.well>a[href]',
        titleQuery: '.well>a[href]>span.video-title',
      },
    },
    {
      isVisible: true,
      name: 'evojav',
      icon: 'content-adult-site-evojav',
      hostname: 'evojav.pro',
      searchUrl: '/video/{{code}}/',
      fetchType: 'get',
      domQuery: {
      },
    },
    {
      isVisible: true,
      name: '18av',
      icon: 'content-adult-site-18av',
      hostname: '18av.mm-cg.com',
      searchUrl: '/zh/fc_search/all/{{code}}/1.html',
      fetchType: 'parser',
      domQuery: {
        linkQuery: '.posts h3>a[href]',
        titleQuery: '.posts h3>a[href]',
      },
    },

    // {
    //   isVisible: true,
    //   name: 'JAVLib',
    //   icon: 'content-adult-site-javlib',
    //   hostname: 'javlibrary.com',
    //   searchUrl: '/cn/vl_searchbyid.php?keyword={{code}}',
    //   fetchType: 'false',
    //   domQuery: {
    //     linkQuery: '.videothumblist .video[id]:first-child>a',
    //     titleQuery: '.videothumblist .video[id]:first-child>a>div.id',
    //   },
    // },
  ],

}
