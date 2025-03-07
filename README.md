# API Client

A flexible HTTP client library with builder pattern and interception support for JavaScript and TypeScript applications.

## Installation

```bash
npm install api-client
```

## Features

- Builder pattern for easy configuration
- Request and response interception
- Timeout support
- Type-safe responses (TypeScript)
- URL path and query parameter handling

## Usage

### Basic Usage

```javascript
import { createApiClient } from 'api-client';
// Create a client
const client = createApiClient()
.withBaseUrl('https://api.example.com')
.withDefaultHeader('Content-Type', 'application/json')
.build();
// Make a GET request
client.get('users')
.execute()
.then(data => console.log(data))
.catch(error => console.error(error));
// Make a POST request
client.post('users', { name: 'John', email: 'john@example.com' })
.execute()
.then(data => console.log(data))
.catch(error => console.error(error));
```

### TypeScript Usage

```typescript
import { createApiClient } from 'api-client';

interface User {
  id: number;
  name: string;
  email: string;
}

// Create a client
const client = createApiClient()
  .withBaseUrl('https://api.example.com')
  .withDefaultHeader('Content-Type', 'application/json')
  .build();

// Make a GET request with type safety
client.get<User[]>('users')
  .execute()
  .then(users => {
    // TypeScript knows that users is User[]
    users.forEach(user => console.log(user.name));
  });

// Make a POST request with type safety
client.post<User>('users', { name: 'John', email: 'john@example.com' })
  .execute()
  .then(user => {
    // TypeScript knows that user is User
    console.log(user.id);
  });
```

### Adding Request Headers

```javascript
client.get('users')
  .withHeader('Authorization', 'Bearer token123')
  .execute();
```

### Setting Timeout

```javascript
client.get('users')
  .withTimeout(5000) // 5 seconds
  .execute();
```

### Using Interceptors

```javascript
// Request interceptor
const authInterceptor = {
  intercept: (request, url) => {
    request.headers = {
      ...request.headers,
      'Authorization': 'Bearer token123'
    };
    return request;
  }
};

// Response interceptor
const loggingInterceptor = {
  intercept: async (response) => {
    console.log(`Response status: ${response.status}`);
    return response;
  }
};

// Add interceptors to client
const client = createApiClient()
  .withBaseUrl('https://api.example.com')
  .withRequestInterceptor(authInterceptor)
  .withResponseInterceptor(loggingInterceptor)
  .build();
```

## Important Note on Response Types

**For JavaScript Users**: This library currently only supports JSON responses by default. If your API returns non-JSON responses (like plain text), you will need to modify the `Client.ts` file to handle different content types.

**For TypeScript Users**: You can specify any return type using generics, but be aware that the underlying implementation expects JSON responses. If your API returns non-JSON data, you'll need to modify the client implementation.

## API Reference

### ApiClientBuilder

- `withBaseUrl(url: string)`: Set the base URL for all requests
- `withDefaultHeader(name: string, value: string)`: Add a default header
- `withDefaultHeaders(headers: HeadersInit)`: Add multiple default headers
- `withRequestInterceptor(interceptor: RequestInterceptor)`: Add a request interceptor
- `withResponseInterceptor(interceptor: ResponseInterceptor)`: Add a response interceptor
- `build()`: Create the ApiClient instance

### ApiClient

- `get<T>(path?: string, id?: string | number, params?: Record<string, any>)`: Create a GET request
- `post<T>(endpoint?: string, data: any)`: Create a POST request
- `put<T>(path?: string, id: string | number, data: any)`: Create a PUT request
- `delete<T>(path?: string, id: string | number)`: Create a DELETE request

### RequestBuilder

- `withHeader(name: string, value: string)`: Add a header to the request
- `withTimeout(timeoutMs: number)`: Set a timeout for the request
- `withRequestInterceptor(interceptor: RequestInterceptor)`: Add a request interceptor
- `withResponseInterceptor(interceptor: ResponseInterceptor)`: Add a response interceptor
- `execute()`: Execute the request and return a promise with the response

## License

ISC

