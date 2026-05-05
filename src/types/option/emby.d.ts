// /**
//  * Emby 配置类型
//  */
// namespace EmbyType {

//   /**
//    * Emby 请求配置类型
//    * @description 连接 Emby 服务器所需的全部请求参数配置
//    */
//   type Request = {

//     /**
//      * Emby 服务器的基础 URL
//      * @description 服务器的访问地址，不包含端口号
//      * @example "http://192.168.0.3"
//      */
//     url: string

//     /**
//      * Emby 服务器的端口号
//      * @description 服务器的访问端口，默认为 8096
//      * @example "8096"
//      */
//     port: string

//     /**
//      * 服务器使用的语言代码
//      * @description 影响 Emby API 返回的语言
//      * @example "zh-cn"
//      */
//     language: string

//     /**
//      * 服务器用户 ID
//      * @description Emby 服务器用户的唯一标识
//      * @example "705ae9fe2a814cb9bfb4133f2def52e6"
//      */
//     userId: string

//     /**
//      * 用户的认证令牌
//      * @description 用于 Emby API 认证的令牌
//      * @example "1d454f71e9e14cb0acebf66834d77044"
//      */
//     token: string

//     /**
//      * 客户端设备名称（自定义）
//      * @description 用于向 Emby 服务器标识当前网页客户端
//      * @example "Chrome macOS"
//      */
//     deviceName: string

//     /**
//      * 客户端设备唯一ID（自定义）
//      * @description 用于区分不同访问者，自行生成 UUID 即可
//      * @example "e8b45a84-0a7e-4481-906a-3b0555555e0a"
//      */
//     deviceId: string

//     /**
//      * 客户端版本号（自定义）
//      * @description 标识当前网页工具的版本，非 Emby 服务端版本
//      * @example "4.9.3.0"
//      */
//     clientVersion: string

//     /**
//      * 查询参数
//      * @description 请求 Emby 媒体库时的默认查询参数
//      */
//     queryParams: {

//       /**
//        * 搜索关键词
//        * @description 用于在 Emby 媒体库中搜索内容
//        */
//       SearchTerm: string

//       /**
//        * 需要额外返回的媒体信息字段（逗号分隔）
//        * @description 控制 API 返回的字段内容
//        */
//       Fields: string

//       /**
//        * 是否递归查询子目录
//        * @description 搜索时是否包含子目录
//        */
//       Recursive: boolean

//       /**
//        * 是否返回用户数据（收藏/观看记录等）
//        * @description 控制是否返回用户相关的元数据
//        */
//       EnableUserData: boolean

//       /**
//        * 是否按剧集系列分组
//        * @description 搜索结果是否按剧集系列进行分组
//        */
//       GroupProgramsBySeries: boolean

//       /**
//        * 单次请求最大返回数量
//        * @description 限制 API 返回的结果数量
//        */
//       Limit: number
//     }
//   }

//   /**
//    * Emby 媒体库 API 响应标准格式
//    * @description 符合 Emby /Items 端点返回的分页列表结构
//    */
//   type Response = {

//     /**
//      * 符合条件的总记录数
//      * @description 匹配搜索条件的媒体项总数
//      */
//     TotalRecordCount: number

//     /**
//      * 当前页起始索引
//      * @description 分页查询的起始位置
//      */
//     StartIndex: number

//     /**
//      * 当前返回条目数量
//      */
//     ItemsLength: number

//     /**
//      * 媒体项数组
//      * @description 匹配搜索条件的媒体项列表
//      */
//     Items: {

//       /**
//        * 媒体唯一ID
//        * @description Emby 系统中的媒体唯一标识
//        */
//       Id: string

//       /**
//        * 所属服务器ID
//        * @description 媒体所属的 Emby 服务器标识
//        */
//       ServerId: string

//       /**
//        * 媒体名称/标题
//        * @description 媒体的显示名称
//        */
//       Name: string

//       /**
//        * 首映日期
//        * @description 媒体的发布日期
//        */
//       PremiereDate?: string

//       /**
//        * 制作年份
//        * @description 媒体的制作年份
//        */
//       ProductionYear?: number

//       /**
//        * 封面图宽高比
//        * @description 媒体封面图片的宽高比例
//        */
//       PrimaryImageAspectRatio?: number

//       /**
//        * 媒体类型（Movie / Episode / Series 等）
//        * @description 媒体的类型分类
//        */
//       Type?: string

//       /**
//        * 海报图片ID
//        * @description 媒体海报图片的唯一标识
//        */
//       PrimaryImageItemId?: string

//       /**
//        * 其他扩展字段
//        * @description Emby API 可能返回的其他未明确定义的字段
//        */
//       [key: string]: any
//     }[]
//   }

// }
