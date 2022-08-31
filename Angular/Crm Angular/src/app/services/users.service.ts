import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ServerResponse } from '../interfaces/server-response';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  getAll(page:number,size:number){
    return this.http.get<ServerResponse>(environment.pathApi + "/api/users?page="+page +"&size=" +size);
  }
}
