import { HttpClient } from './http-client';

/**
 * Interceptors can process requests before they are sent, and responses
 * before they are returned to callers.
 */
export interface Interceptor {
  /**
   * Called with the request before it is sent. Request interceptors can modify and
   * return the request, or return a new one to be sent. If desired, the interceptor
   * may return a Response in order to short-circuit the HTTP request itself.
   *
   * @param request The request to be sent.
   * @returns The existing request, a new request or a response; or a Promise for any of these.
   */
  request?: (request: Request) => Request|Response|Promise<Request|Response>;

  /**
   * Handles errors generated by previous request interceptors. This function acts
   * as a Promise rejection handler. It may rethrow the error to propagate the
   * failure, or return a new Request or Response to recover.
   *
   * @param error The rejection value from the previous interceptor.
   * @returns The existing request, a new request or a response; or a Promise for any of these.
   */
  requestError?: (error: any) => Request|Response|Promise<Request|Response>;

  /**
   * Called with the response after it is received. Response interceptors can modify
   * and return the Response, or create a new one to be returned to the caller.
   *
   * @param response The response.
   * @returns The response; or a Promise for one.
   */
  response?: (response: Response, request?: Request) => Response|Promise<Response>;

  /**
   * Handles fetch errors and errors generated by previous interceptors. This
   * function acts as a Promise rejection handler. It may rethrow the error
   * to propagate the failure, or return a new Response to recover.
   *
   * @param error The rejection value from the fetch request or from a
   * previous interceptor.
   * @returns The response; or a Promise for one.
   */
  responseError?: (error: any, request?: Request, httpClient?: HttpClient) => Response|Promise<Response>;
}

export type ValidInterceptorMethodName = keyof Interceptor;

/**
 * The init object used to initialize a fetch Request.
 * See https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
 */
export interface RequestInit {
  /**
   * The request method, e.g., GET, POST.
   */
  method?: string;

  /**
   * Any headers you want to add to your request, contained within a Headers object or an object literal with ByteString values.
   */
  headers?: Headers|Object;

  /**
   * Any body that you want to add to your request: this can be a Blob, BufferSource, FormData,
   * URLSearchParams, ReadableStream, or USVString object.
   *
   * Note that a request using the GET or HEAD method cannot have a body.
   */
  body?: Blob|BufferSource|FormData|URLSearchParams|ReadableStream|string|null;

  /**
   * The mode you want to use for the request, e.g., cors, no-cors, same-origin, or navigate.
   * The default is cors.
   *
   * In Chrome the default is no-cors before Chrome 47 and same-origin starting with Chrome 47.
   */
  mode?: string;

  /**
   * The request credentials you want to use for the request: omit, same-origin, or include.
   * The default is omit.
   *
   * In Chrome the default is same-origin before Chrome 47 and include starting with Chrome 47.
   */
  credentials?: string;

  /**
   * The cache mode you want to use for the request: default, no-store, reload, no-cache, or force-cache.
   */
  cache?: string;

  /**
   * The redirect mode to use: follow, error, or manual.
   *
   * In Chrome the default is follow before Chrome 47 and manual starting with Chrome 47.
   */
  redirect?: string;

  /**
   * A USVString specifying no-referrer, client, or a URL. The default is client.
   */
  referrer?: string;

  /**
   * Contains the subresource integrity value of the request (e.g., sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=).
   */
  integrity?: string;

  /**
   * An AbortSignal to set request’s signal.
   */
  signal?: AbortSignal | null;
}

export interface RetryConfiguration {
  maxRetries: number;
  interval?: number;
  strategy?: number| ((retryCount: number) => number);
  minRandomInterval?: number;
  maxRandomInterval?: number;
  counter?: number;
  requestClone?: Request;
  doRetry?: (response: Response, request: Request) => boolean | Promise<boolean>;
  beforeRetry?: (request: Request, client: HttpClient) => Request | Promise<Request>;
}
