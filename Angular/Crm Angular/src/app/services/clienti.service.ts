import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../interfaces/cliente';
import { ServerResponse } from '../interfaces/server-response';

@Injectable({
  providedIn: 'root',
})
export class ClientiService {
  private clientiSubject = new BehaviorSubject<any>(null);
  clienti$ = this.clientiSubject.asObservable();
  flag = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) {}

  getAll(page: number, size: number,sort: string) {
    return this.http.get<ServerResponse>(
      environment.pathApi +
        '/api/clienti?page=' +
        page +
        '&size=' +
        size +
        '&sort='+sort+',ASC'
    ).pipe(tap(data=>{
      this.clientiSubject.next(data.content);
    }));
  }

  elimina(id:number){
   return this.http.delete<Cliente>(environment.pathApi + "/api/clienti/" + id);
  }

  getById(id:number){
    return this.http.get<Cliente>(environment.pathApi + '/api/clienti/' + id)
  }

  comuniGetAll(){
    return this.http.get<ServerResponse>(environment.pathApi +"/api/comuni?page=0&size=20&sort=id,ASC");
  }

  modificaCliente(id:number, cliente:any){
    return this.http.put<Cliente>(environment.pathApi +"/api/clienti/"+id, cliente);
  }

  addCliente(cliente:any){
    return this.http.post<Cliente>(environment.pathApi + "/api/clienti",cliente).pipe(tap(val=>{

    }))
  }

  getTipiClienti(){
    return this.http.get<any>(environment.pathApi + "/api/clienti/tipicliente");
  }

  cercaNome(page: number, size: number, tipo: string, valore: string) {
    if (tipo == 'partita') {
      return this.http
        .get<ServerResponse>(
          environment.pathApi +
            '/api/clienti?page=' +
            page +
            '&size=' +
            size +
            '&sort=id,ASC'
        )
        .pipe(
          tap((clienti) => {
            const nuovo = clienti.content.filter(
              (cliente: { partitaIva: string }) => cliente.partitaIva === valore
            );
            this.clientiSubject.next(nuovo);
          })
        );
    } else if (tipo == 'ragione') {
      return this.http
        .get<any>(
          environment.pathApi + '/api/clienti/ragionesociale?nome=' + valore
        )
        .pipe(
          tap((clienti) => {
            this.clientiSubject.next(clienti.content);
          })
        );
    } else {
      return this.http
        .get<any>(
          environment.pathApi +
            '/api/clienti?page=' +
            page +
            '&size=' +
            size +
            '&sort=id,ASC'
        )
        .pipe(
          tap((clienti) => {
            const nuovo = clienti.content.filter(
              (cliente: { email: string }) => cliente.email === valore
            );
            this.clientiSubject.next(nuovo);
          })
        );
    }
  }


}
