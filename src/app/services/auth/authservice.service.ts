import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Login } from '../../models/Login/login.model';
@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private http:HttpClient) { }

  private authBaseUrl=environment.authBaseUrl;

  login(loginData: Login) {
    return this.http.post<any>(`${this.authBaseUrl}/User/Login`, loginData);
  }


}
