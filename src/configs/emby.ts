/**
 *  Emby 配置
 */
export const EmbyConfig: {
  request: EmbyConfigType.Request
} = {
  request: {
    url: 'http://192.168.0.3',
    port: '8096',
    userId: '2409e0a7f21047ba9c74b41be14c6729',
    deviceName: 'Chrome macOS',
    deviceId: 'a6f53c21-ff50-4ccd-a6ba-94f5f4830e87',
    clientVersion: '4.8.11.0',
    token: '8713e19e82f64fd3a50207b0321f3538',
    language: 'zh-cn',
    queryParams: {
      SearchTerm: '',
      Recursive: true,
      Fields: 'PrimaryImageAspectRatio,PremiereDate,ProductionYear',
      EnableUserData: false,
      GroupProgramsBySeries: true,
      Limit: 30,
    },
  },
}
