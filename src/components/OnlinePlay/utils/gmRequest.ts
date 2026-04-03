/**
 * 发送 GET 请求
 * @param url - 请求的 URL
 * @returns 返回包含响应数据的 Promise 对象，响应类型由泛型 T 指定
 */
export function gmGet(url: string): Promise<GMType.HttpResponse> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      onload: (response: GMType.HttpResponse) => resolve(response),
      onerror: error => reject(error),
    })
  })
}

/**
 * 发送 POST 请求
 * @param url - 请求的 URL
 * @param data - 请求的数据
 * @returns 返回包含响应数据的 Promise 对象，响应类型由泛型 T 指定
 */
export function gmPost(
  url: string,
  data?: Record<string, any>,
): Promise<GMType.HttpResponse> {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'POST',
      data: data ? new URLSearchParams(data).toString() : '',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      url,
      onload: (response: GMType.HttpResponse) => resolve(response),
      onerror: error => reject(error),
    })
  })
}
