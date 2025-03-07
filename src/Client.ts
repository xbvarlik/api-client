import { RequestBuilder } from "./RequestBuilder";
import { RequestInterceptor } from "./types/RequestInterceptor";
import { ResponseInterceptor } from "./types/ResponseInterceptor";
import { buildQueryString } from "./Utils";

// The main ApiClient class
export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;
  private requestInterceptors: RequestInterceptor[];
  private responseInterceptors: ResponseInterceptor[];

  constructor(
    baseUrl: string,
    defaultHeaders: HeadersInit = {},
    requestInterceptors: RequestInterceptor[] = [],
    responseInterceptors: ResponseInterceptor[] = []
  ) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = defaultHeaders;
    this.requestInterceptors = requestInterceptors;
    this.responseInterceptors = responseInterceptors;
  }

  // Request builder factory methods
  public get<T>(path: string = "", id: string | number = "", params?: Record<string, any>): RequestBuilder<T> {
    const uri = `${path}/${id}`;
    return new RequestBuilder<T>(this, uri, { method: "GET" }, params);
  }

  public post<T>(endpoint: string = "", data: any): RequestBuilder<T> {
    return new RequestBuilder<T>(this, endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  public put<T>(path: string = "", id: string | number, data: any): RequestBuilder<T> {
    return new RequestBuilder<T>(this, `${path}/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  public delete<T>(path: string = "", id: string | number): RequestBuilder<T> {
    return new RequestBuilder<T>(this, `${path}/${id}`, { method: "DELETE" });
  }

  // Method to execute requests (used by RequestBuilder)
  public async executeRequest<T>(
    endpoint: string,
    options: RequestInit,
    params?: Record<string, any>,
    requestInterceptors: RequestInterceptor[] = [],
    responseInterceptors: ResponseInterceptor[] = []
  ): Promise<T> {
    // Fix URL construction
    let url = this.baseUrl;
    
    // Ensure baseUrl ends with / and endpoint doesn't start with / to avoid double slashes
    if (!url.endsWith('/') && !endpoint.startsWith('/')) {
      url += '/';
    } else if (url.endsWith('/') && endpoint.startsWith('/')) {
      // Remove leading slash from endpoint to avoid double slashes
      endpoint = endpoint.substring(1);
    }
    
    url += endpoint;
    
    // Add query parameters if any
    if (params) {
      const queryString = buildQueryString(params);
      if (queryString) {
        url += queryString;
      }
    }
    
    // Apply request interceptors
    let interceptedOptions = { ...options };
    for (const interceptor of [...this.requestInterceptors, ...requestInterceptors]) {
      interceptedOptions = interceptor.intercept(interceptedOptions, url);
    }
    
    // Make the request
    let response = await fetch(url, interceptedOptions);

    // Apply response interceptors
    for (const interceptor of [...this.responseInterceptors, ...responseInterceptors]) {
      response = await interceptor.intercept(response);
    }
    
    // Process the response
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json() as T;
  }
}

export default ApiClient;