import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { LoggedUser } from '../interfaces/logged-user';
import { User } from '../interfaces/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authSubject = new BehaviorSubject<null|LoggedUser>(null);
  user$= this.authSubject.asObservable();
  JwtHelper = new JwtHelperService();


  constructor(private http:HttpClient, private router:Router) {
    this.controlToken()
   }

  login(user:User){
    return this.http.post<LoggedUser>(environment.pathApi +"/api/auth/login",user).pipe(tap(user=>{
      this.authSubject.next(user)
      localStorage.setItem("user",JSON.stringify(user));
      this.router.navigate(['/'])
    }));
  }

  signup(user: User){
    return this.http.post(environment.pathApi+"/api/auth/signup", user).pipe(tap(val=>{
    }));
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  controlToken() {
    let userJson = localStorage.getItem('user');
    if (!userJson) {
      return;
    }
    const user: LoggedUser = JSON.parse(userJson);
    if (this.JwtHelper.isTokenExpired(user.accessToken)) {
      this.logout();
    } else {
      this.authSubject.next(user);
    }
  }

}
