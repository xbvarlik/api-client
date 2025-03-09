export interface ResponseInterceptor {
  intercept(response: Response): Promise<Response>;
  shouldRetry?: boolean;
}
