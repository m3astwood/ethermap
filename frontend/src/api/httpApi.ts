import { type Observable, switchMap } from 'rxjs'
import { fromFetch } from 'rxjs/fetch'

interface Config {
  baseUrl?: string
  responseType?: 'json' | 'text'
}

export class Api {
  config: Config

  constructor(config: Config = {}) {
    this.config = {
      responseType: 'json',
      ...config
    }
  }

  fetch(url: string, method: string, opts, data?): Observable<any> {
    const baseURL = opts?.baseURL ?? this.config?.baseUrl ?? ''
    const responseType = opts?.responseType ?? this.config.responseType
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...opts?.headers
    })

    if(baseURL) {
      url = url.replace(/^(?!.*\/\/)\/?/, `${baseURL}`);
    }

    return fromFetch(url, {
      method,
      headers,
      ...(data ? { body: JSON.stringify(data) } : {}),
      ...(opts?.mode ? { mode: opts.mode } : {}),
      ...(opts?.credentials ? { credentials: opts.credentials } : {}),
      ...(opts?.cache ? { cache: opts.cache } : {}),
      ...(opts?.redirect ? { redirect: opts.redirect } : {}),
      ...(opts?.referrer ? { referrer: opts.referrer } : {}),
      ...(opts?.referrerPolicy ? { referrerPolicy: opts.referrerPolicy } : {}),
      ...(opts?.integrity ? { integrity: opts.integrity } : {}),
      ...(opts?.keepalive ? { keepalive: opts.keepalive } : {}),
      ...(opts?.signal ? { signal: opts.signal } : {}),
    }).pipe(switchMap(res => res[responseType]()))
  }

  get = (url: string, opts?) => this.fetch(url, 'GET', opts)
  options = (url: string, opts?) => this.fetch(url, 'OPTION', opts)
  delete = (url: string, opts?) => this.fetch(url, 'DELETE', opts);
  head = (url: string, opts?) => this.fetch(url, 'HEAD', opts);
  post = (url: string, data, opts?) => this.fetch(url, 'POST', opts, data);
  put = (url: string, data, opts?) => this.fetch(url, 'PUT', opts, data);
  patch = (url: string, data, opts?) => this.fetch(url, 'PATCH', opts, data);
}

export const api = new Api({ baseUrl: 'http://localhost:3000/'})
