/* eslint-disable */
/**
 * Generated API client (illustrative). Mirrors `openapi-generator`'s
 * `typescript-angular` output: an `@Injectable` service that uses `HttpClient`
 * and issues requests against logical paths. Because Qavo's base-URL interceptor
 * (`@qavo/http`) prefixes the configured `/api/v{n}` and the auth/trace
 * interceptors enrich the request, the generated client stays free of base-URL,
 * auth and correlation concerns — they are centralized.
 */
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PageUserDto, UserDto } from './models';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private readonly http = inject(HttpClient);

  listUsers(page = 0, size = 20): Observable<PageUserDto> {
    return this.http.get<PageUserDto>('/users', { params: { page, size } });
  }

  getUser(id: string): Observable<UserDto> {
    return this.http.get<UserDto>(`/users/${id}`);
  }
}
