// Interceptor interfaces

export interface RequestInterceptor {
  intercept(request: RequestInit, url: string): RequestInit;
}
