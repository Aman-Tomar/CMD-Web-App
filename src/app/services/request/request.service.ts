import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private tokenService: TokenService, private http: HttpClient) { }



  private getHeaders(contentType: string = ''): HttpHeaders {
    const token = this.tokenService.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
  // GET request
  public get<T>(url: string, params?: HttpParams): Observable<T> {
    const headers = this.getHeaders();
    return this.http.get<T>(url, { headers, params }).pipe(
      catchError(this.handleError) 
    );
  }




  public post<T>(url: string, body: any): Observable<T> {
    let headers = this.getHeaders();
    return this.http.post<T>(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  
  
  public put<T>(url: string, body: any): Observable<T> {
    let headers = this.getHeaders();
    return this.http.put<T>(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }


  // DELETE request
  public delete<T>(url: string): Observable<T> {
    const headers = this.getHeaders();
    return this.http.delete<T>(url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Error handler
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}