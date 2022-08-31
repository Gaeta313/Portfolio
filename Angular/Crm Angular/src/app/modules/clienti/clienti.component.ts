import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { AlertErroriComponent } from 'src/app/components/alert-errori/alert-errori.component';
import { Cliente } from 'src/app/interfaces/cliente';
import { ServerResponse } from 'src/app/interfaces/server-response';
import { ClientiService } from 'src/app/services/clienti.service';
import { FattureService } from 'src/app/services/fatture.service';

@Component({
  selector: 'app-clienti',
  templateUrl: './clienti.component.html',
  styleUrls: ['./clienti.component.scss'],
})
export class ClientiComponent implements OnInit {
  clientiObj!: ServerResponse;
  clienti!: Cliente[];
  clienti$ = this.clientiSrv.clienti$;
  subClienti!: Subscription;
  caricamento: boolean = false;
  valoreRicerca: string = '';
  tipoRicerca: string = 'email';
  pageIndex: number = 0;
  pageSize: number = 20;
  subFlag!: Subscription;
  mostraNascondi = true;
  displayedColumns: string[] = ['NomeCognome', 'email', 'actions'];
  tabella: Boolean = false;
  sort: string = 'id';
  barraRicercaFlag: boolean = false;

  constructor(
    private clientiSrv: ClientiService,
    public dialog: MatDialog,
    public route: ActivatedRoute,
    private fattureSrv: FattureService
  ) {}


  ngOnInit(): void {
    this.subFlag = this.clientiSrv.flag.subscribe((val) => {
      if (val) {
        this.aggiorna();
      }
      this.mostraNascondi = val;
    });
    this.aggiorna();
  }

  // tipo di sort scelto dall'utente
  sortby(value: string) {
    this.sort = value;
    this.aggiorna();
  }

  //mantiene la lista clienti aggiornata per ogni modifica
  aggiorna() {
    this.subClienti?.unsubscribe();
    let dato = localStorage.getItem('tabella');
    if (dato) {
      this.tabella = true;
    } else {
      this.tabella = false;
    }
    this.caricamento = true;
    this.subClienti = this.clientiSrv
      .getAll(this.pageIndex, this.pageSize, this.sort)
      .subscribe((clienti) => {
        this.clienti = clienti.content;
        this.clientiObj = clienti;
        this.caricamento = false;
      });
  }

  // alterna la vista da griglia a tabella
  getTabella() {
    this.tabella = !this.tabella;
    if (this.tabella) {
      localStorage.setItem('tabella', JSON.stringify(this.tabella));
    } else {
      localStorage.removeItem('tabella');
    }
  }
// imposta le opzioni di visualizzazione di default di fattureCliente(rotta interna ), nel caso non siano corrette
  default() {
    this.fattureSrv.flag.next(true);
  }

  // nasconde clienti e mostra la rotta interna(fattureCliente)
  mostraENascondi() {
    this.clientiSrv.flag.next(false);
  }

  //gestione del paginator
  pageEvent(e: any) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.caricamento = true;
    this.subClienti?.unsubscribe();
    this.subClienti = this.clientiSrv
      .getAll(e.pageIndex, e.pageSize, this.sort)
      .subscribe((clienti) => {
        this.clienti = clienti.content;
        this.caricamento = false;
      });
  }

  // gestione delle ricerche effettuate dall'utente
  cerca() {
    this.valoreRicerca =this.valoreRicerca.trim();
    this.subClienti?.unsubscribe();
    this.caricamento = true;
    lastValueFrom(
      this.clientiSrv.cercaNome(
        0,
        this.clientiObj.totalElements,
        this.tipoRicerca,
        this.valoreRicerca
      )
    ).then((data) => {
      this.caricamento = false;
    });
    this.subClienti = this.clientiSrv.clienti$.subscribe((val) => {
      this.clienti = val;
    });
    this.valoreRicerca = '';
  }
  reset() {
    this.aggiorna();
  }


  // dialog info cliente
  openDialog(cliente: Cliente) {
    const dialogRef = this.dialog.open(Dialog, {
      width: '50%',
      data: { cliente: cliente },
    });
  }

  // allert conferma eliminazione cleinte, e gestione risposta ricevuta
  openAlert(id: number) {
    const dialogRef = this.dialog.open(Alert, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      const scelta = result;
      if (scelta) {
        lastValueFrom(this.clientiSrv.elimina(id)).then((result) => {
          const dialogRef = this.dialog.open(AlertErroriComponent, {
            width: '50%',
            data: {
              titolo: 'Cliente eliminato con successo !',
                },
          });
          this.aggiorna();
        });
      }
    });
  }

  ngOnDestroy() {
    this.subClienti?.unsubscribe();
    this.subFlag?.unsubscribe();
  }
}

//dialog info clienti
@Component({
  selector: 'app-dialog',
  templateUrl: './dialogClienti.html',
  styleUrls: ['./dialog.scss'],
})
export class Dialog {
  constructor(
    public dialogRef: MatDialogRef<Dialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}

// dialog conferma eliminazione
@Component({
  selector: 'app-alert',
  templateUrl: './alert.html',
})
export class Alert {
  constructor(public dialogRef: MatDialogRef<Alert>) {}
}
