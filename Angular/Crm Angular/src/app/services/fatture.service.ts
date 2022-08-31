import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fattura } from '../interfaces/fattura';
import { ServerResponse } from '../interfaces/server-response';

@Injectable({
  providedIn: 'root'
})
export class FattureService {
  flag = new BehaviorSubject<boolean>(true);
  constructor(private http: HttpClient) { }

  getByIdCliente(page:number,size:number,sort:string,id:number){
    return this.http.get<ServerResponse>(environment.pathApi + "/api/fatture/cliente/"+id+"?page="+page+"&size="+size+"&sort="+sort+",ASC");
  }

  getStati(){
    return this.http.get<any>(environment.pathApi + "/api/statifattura?page=0&size=20&sort=id,ASC");
  }

  addFattura(fattura:any){
    return this.http.post<Fattura>(environment.pathApi +"/api/fatture", fattura);
  }

  getbyId(id:number){
    return this.http.get<Fattura>(environment.pathApi +"/api/fatture/"+id);
  }

  modifica(id:number,fattura:any){
    return this.http.put<Fattura>(environment.pathApi +"/api/fatture/"+id, fattura);
  }

  elimina(id:number){
    return this.http.delete<Fattura>(environment.pathApi +"/api/fatture/"+id)
  }

  getAll(page:number, size: number,sort: string){
    return this.http.get<ServerResponse>(environment.pathApi + "/api/fatture?page="+page+"&size="+size+"&sort="+sort+",ASC")
  }

  getbyStato(page:number, size: number,sort: string, stato:number){
    return this.http.get<ServerResponse>(environment.pathApi + "/api/fatture/stato/"+stato+"?page="+page+"&size="+size+"&sort="+sort+",ASC")
  }

  getByDataBetween(page:number, size: number,sort: string, data1:string, data2:string){
    return this.http.get<ServerResponse>(environment.pathApi + "/api/fatture/data/?from="+data1+"&to="+data2+"&page="+page+"&size="+size+"&sort="+sort+",ASC")
  }

  getByImportoBetween(page:number, size: number,sort: string, valore1:number, valore2:number){
    return this.http.get<ServerResponse>(environment.pathApi + "/api/fatture/importo/?from="+valore1+"&to="+valore2+"&page="+page+"&size="+size+"&sort="+sort+",ASC");
  }

}
