import { ApiClient } from "./Client";
import { RequestInterceptor } from "./types/RequestInterceptor";
import { ResponseInterceptor } from "./types/ResponseInterceptor";

// Client Builder class

export class ApiClientBuilder {
  private baseUrl: string = "";
  private defaultHeaders: HeadersInit = {};
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  public withBaseUrl(baseUrl: string): ApiClientBuilder {
    this.baseUrl = baseUrl;
    return this;
  }

  public withDefaultHeader(name: string, value: string): ApiClientBuilder {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      [name]: value
    };
    return this;
  }

  public withDefaultHeaders(headers: HeadersInit): ApiClientBuilder {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      ...headers
    };
    return this;
  }

  public withRequestInterceptor(interceptor: RequestInterceptor): ApiClientBuilder {
    this.requestInterceptors.push(interceptor);
    return this;
  }

  public withResponseInterceptor(interceptor: ResponseInterceptor): ApiClientBuilder {
    this.responseInterceptors.push(interceptor);
    return this;
  }

  public build(): ApiClient {
    if (!this.baseUrl) {
      throw new Error("Base URL is required");
    }

    return new ApiClient(
      this.baseUrl,
      this.defaultHeaders,
      this.requestInterceptors,
      this.responseInterceptors
    );
  }
}

// Factory function to create a client builder
export function createApiClient(): ApiClientBuilder {
  return new ApiClientBuilder();
}
