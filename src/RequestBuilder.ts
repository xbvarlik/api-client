import { ApiClient } from "./Client";
import { RequestInterceptor } from "./types/RequestInterceptor";
import { ResponseInterceptor } from "./types/ResponseInterceptor";

// Request Builder class

export class RequestBuilder<T> {
  private client: ApiClient;
  private endpoint: string;
  private options: RequestInit;
  private params?: Record<string, any>;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(client: ApiClient, endpoint: string, options: RequestInit, params?: Record<string, any>) {
    this.client = client;
    this.endpoint = endpoint;
    this.options = options;
    this.params = params;
  }

  public withRequestInterceptor(interceptor: RequestInterceptor): RequestBuilder<T> {
    this.requestInterceptors.push(interceptor);
    return this;
  }

  public withResponseInterceptor(interceptor: ResponseInterceptor): RequestBuilder<T> {
    this.responseInterceptors.push(interceptor);
    return this;
  }

  public withHeader(name: string, value: string): RequestBuilder<T> {
    const headers = this.options.headers as Record<string, string> || {};
    this.options.headers = {
      ...headers,
      [name]: value
    };
    return this;
  }

  public withTimeout(timeoutMs: number): RequestBuilder<T> {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeoutMs);
    this.options.signal = controller.signal;
    return this;
  }

  public async execute(): Promise<T> {
    return this.client.executeRequest<T>(
      this.endpoint,
      this.options,
      this.params,
      this.requestInterceptors,
      this.responseInterceptors
    );
  }
}
