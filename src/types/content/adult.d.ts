/**
 * 成人内容配置类型
 */
namespace AdultConfigType {
  type EmbyRequest = {

    /**
     * Emby 服务器的 URL。
     * @example "http://192.168.0.5"
     */
    url: string

    /**
     * Emby 服务器的端口号。
     * @example "8096"
     */
    port: string

    /**
     * Emby 服务器用户 ID。
     * @example "2409e0a7f21047ba9c74b41be14c6729"
     */
    userId: string

    /**
     * 发起请求的设备名称。
     * @example "Chrome macOS"
     */
    deviceName: string

    /**
     * 发起请求设备的 ID。
     * @example "a6f53c21-ff50-4ccd-a6ba-94f5f4830e87"
     */
    deviceId: string

    /**
     * Emby 客户端的版本号。
     * @example "4.8.11.0"
     */
    clientVersion: string

    /**
     * 用户的认证令牌。
     * @example "8713e19e82f64fd3a50207b0321f3538"
     */
    token: string

    /**
     * Emby 服务器使用的语言代码。
     * @example "zh-cn"
     */
    language: string

    /**
     * 发送到 Emby 服务器的查询字符串参数。
     */
    queryParams: RequestQueryParams
  }
  type EmbyResponse = {
    TotalRecordCount: number

    StartIndex: number

    Items: {
      Id: string
      ServerId: string
      Name: string
      PremiereDate?: string
      ProductionYear?: number
      PrimaryImageAspectRatio?: number

      // 其他可能的字段
      [key: string]: any
    }
  }
}
