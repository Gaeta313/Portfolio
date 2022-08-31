import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { Cliente } from 'src/app/interfaces/cliente';
import { Fattura } from 'src/app/interfaces/fattura';
import { ServerResponse } from 'src/app/interfaces/server-response';
import { Dialog } from 'src/app/modules/clienti/clienti.component';
import { ClientiService } from 'src/app/services/clienti.service';
import { FattureService } from 'src/app/services/fatture.service';
import { AlertErroriComponent } from '../alert-errori/alert-errori.component';
import { AlertFatturaComponent } from '../alert-fattura/alert-fattura.component';

@Component({
  templateUrl: './fatture-cliente.component.html',
  styleUrls: ['./fatture-cliente.component.scss'],
})
export class FattureClienteComponent implements OnInit {
  cliente!: Cliente;
  subCliente!: Subscription;
  idCliente!: number;
  subId!: Subscription;
  fatture!: Fattura[];
  fattureObj!: ServerResponse;
  subFatture!: Subscription;
  subFlag!: Subscription;
  tabella: boolean = false;
  barraRicercaFlag: boolean = false;
  tipoRicerca!: string;
  valoreRicerca!: string;
  mostraNascondi: boolean = true;
  caricamento: boolean = false;
  pageIndex: number = 0;
  pageSize: number = 20;
  sort: string = 'id';
  displayedColumns: string[] = [
    'numeroFattura',
    'anno',
    'importo',
    'stato',
    'actions',
  ];
  constructor(
    private clientiSrv: ClientiService,
    private router: Router,
    private route: ActivatedRoute,
    private fattureSrv: FattureService,
    public dialog: MatDialog
  ) {}
// sottoscrizione ad una variabile per visualizzare o nascondere il componente figlio
  ngOnInit(): void {
    this.subFlag = this.fattureSrv.flag.subscribe((val) => {
      this.mostraNascondi = val;
      this.aggiorna();
    });
  }

  // questa funzione alterna la vista da griglia a tabella
  getTabella() {
    this.tabella = !this.tabella;
    if (this.tabella) {
      localStorage.setItem('tabella', JSON.stringify(this.tabella));
    } else {
      localStorage.removeItem('tabella');
    }
  }

  // questa funziona mostra la tabella, o la griglia, in base alle preferenze, ed aggiorna
  //la lista fatture ogni volta che avviene una modifica
  aggiorna() {
    let dato = localStorage.getItem('tabella');
    if (dato) {
      this.tabella = true;
    } else {
      this.tabella = false;
    }
    this.caricamento = true;
    this.subId?.unsubscribe();
    this.subId = this.route.params.subscribe((params) => {
      this.idCliente = params['id'];
      this.subFatture?.unsubscribe();
      this.subFatture = this.fattureSrv
        .getByIdCliente(
          this.pageIndex,
          this.pageSize,
          this.sort,
          this.idCliente
        )
        .subscribe((fatture) => {
          this.fattureObj = fatture;
          this.fatture = fatture.content;
        });
      this.subCliente?.unsubscribe();
      this.subCliente = this.clientiSrv
        .getById(this.idCliente)
        .subscribe((cliente) => {
          this.cliente = cliente;
          this.caricamento = false;
        });
    });
  }

  elimina(id: number) {
    lastValueFrom(this.fattureSrv.elimina(id)).then((val) => {
      const dialogRef = this.dialog.open(AlertErroriComponent, {
        width: '50%',
        data: {
          titolo: 'Fattura eliminata con successo !',
        },
      });
      this.aggiorna();
    });
  }

  //apre il dialog info cliente
  openDialog(cliente: Cliente) {
    const dialogRef = this.dialog.open(Dialog, {
      width: '50%',
      data: { cliente: cliente },
    });
  }

  // sorting selezionato dall'utente
  sortby(string: string) {
    this.sort = string;
    this.aggiorna();
  }
  //questa funzione riporta alla pagina padre clienti, rendendolo nuovamente visibile
  annulla() {
    this.clientiSrv.flag.next(true);
    this.router.navigate(['./clienti']);
  }

  // gestione del paginator
  pageEvent(e: any) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.aggiorna();
  }

  // nasconde il genitore e mostra il figlio
  mostraENascondi() {
    this.fattureSrv.flag.next(false);
  }

  //apre allert di conferma eliminazione fattura, e riceve la risposta
  openAlert(id: number) {
    const dialogRef = this.dialog.open(AlertFatturaComponent, {
      width: '50%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      const scelta = result;
      if (scelta) {
        this.elimina(id);
      }
    });
  }

  ngOnDestroy() {
    this.subCliente?.unsubscribe();
    this.subFatture?.unsubscribe();
    this.subFlag?.unsubscribe();
    this.subId?.unsubscribe();
  }
}
