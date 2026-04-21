/**
 * 基础 HTTP 请求工具
 * @description 封装浏览器插件的网络请求方法
 */

/**
 * HTTP 请求配置接口
 */
export type HttpRequestConfig = {

  /** 请求方法 */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'

  /** 请求 URL */
  url: string

  /** 请求头 */
  headers?: Record<string, string>

  /** 请求参数（GET 会自动转换为查询字符串） */
  params?: Record<string, any>

  /** 请求体（仅 POST/PUT 有效） */
  data?: any

  /** 超时时间（毫秒） */
  timeout?: number

  /** 响应类型 */
  responseType?: 'json' | 'text'
}

/**
 * HTTP 响应接口
 */
export type HttpResponse<T = any> = {

  /** 响应状态码 */
  status: number

  /** 响应状态文本 */
  statusText: string

  /** 响应数据 */
  data: T

  /** 响应头 */
  headers: Record<string, string>
}

/**
 * 构建查询字符串
 * @param params 查询参数对象
 * @returns 编码后的查询字符串
 */
function buildQueryString(params: Record<string, any>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
    .join('&')
}

/**
 * 基础 HTTP 请求方法
 * @param config 请求配置
 * @returns Promise<HttpResponse<T>>
 */
export async function request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
  const {
    method,
    url,
    headers = {
    },
    params,
    data,
    timeout = 10000,
    responseType = 'json',
  } = config

  // 构建完整 URL（包含查询参数）
  let fullUrl = url

  if (params && Object.keys(params).length > 0) {
    const queryString = buildQueryString(params)

    fullUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
  }

  // 构建请求配置
  const requestConfig: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  // 添加请求体（仅 POST/PUT）
  if (data && (method === 'POST' || method === 'PUT')) {
    requestConfig.body = JSON.stringify(data)
  }

  // 创建 AbortController 用于超时控制
  const controller = new AbortController()

  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(fullUrl, {
      ...requestConfig,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    let responseData: any

    if (responseType === 'text') {
      responseData = await response.text()
    }
    else {
      responseData = await response.json()
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries()),
    }
  }
  catch (error: any) {
    clearTimeout(timeoutId)

    if (error.name === 'AbortError') {
      throw new Error('请求超时')
    }

    throw error
  }
}

/**
 * GET 请求
 * @param url 请求 URL
 * @param config 额外配置
 * @returns Promise<HttpResponse<T>>
 */
export function get<T = any>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
  return request<T>({
    method: 'GET',
    url,
    ...config,
  })
}

/**
 * POST 请求
 * @param url 请求 URL
 * @param data 请求数据
 * @param config 额外配置
 * @returns Promise<HttpResponse<T>>
 */
export function post<T = any>(url: string, data?: any, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>> {
  return request<T>({
    method: 'POST',
    url,
    data,
    ...config,
  })
}
