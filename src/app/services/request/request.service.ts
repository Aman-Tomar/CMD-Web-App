import { Injectable } from '@angular/core';
import { TokenService } from '../token/token.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private tokenService: TokenService, private http: HttpClient) { }

  private getHeaders() : HttpHeaders {
    const token = this.tokenService.getToken();
    // const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjhjOTVkMWRlLWRjZWQtNGFlNy1iNGYyLWIzY2RmNmI1NDEzNCIsImp0aSI6ImRhYjA3NWJlLTIxMDItNGVjYS05MDdhLTZhNDA2Zjk2MjAyNSIsImF1ZCI6WyJib29rYmFybi1hcGN5ZWVoc2R5ZWNnN2g2LnNvdXRoZWFzdGFzaWEtMDEuYXp1cmV3ZWJzaXRlcy5uZXQiLCJib29rYmFybi1hcGN5ZWVoc2R5ZWNnN2g2LnNvdXRoZWFzdGFzaWEtMDEuYXp1cmV3ZWJzaXRlcy5uZXQiXSwiZXhwIjoxNzI1ODg1OTExLCJpc3MiOiJodHRwczovL2Jvb2tiYXJuLXVzZXJhdXRoLWFwaS1nY2VkaHVoc2Y2YnhmN2ZwLnNvdXRoZWFzdGFzaWEtMDEuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL1VzZXIifQ.t9UFouDu3V6aAqJshydhlEcvJUooRkOY2Da7xynZ2Q4";
    let headers = new HttpHeaders({
      'Content-Type' : 'application/json'
    });

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

  // POST request
  public post<T>(url: string, body: any, options: { headers? : HttpHeaders }  = {}): Observable<T> {
    var headers = this.getHeaders();
    headers = options.headers || headers;
    return this.http.post<T>(url, body, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // PUT request
  public put<T>(url: string, body: any): Observable<T> {
    const headers = this.getHeaders();
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