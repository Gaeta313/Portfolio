import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom, Subscription } from 'rxjs';
import { AlertErroriComponent } from 'src/app/components/alert-errori/alert-errori.component';
import { AlertFatturaComponent } from 'src/app/components/alert-fattura/alert-fattura.component';
import { Fattura } from 'src/app/interfaces/fattura';
import { ServerResponse } from 'src/app/interfaces/server-response';

import { ClientiService } from 'src/app/services/clienti.service';
import { FattureService } from 'src/app/services/fatture.service';

@Component({
  selector: 'app-fatture',
  templateUrl: './fatture.component.html',
  styleUrls: ['./fatture.component.scss'],
})
export class FattureComponent implements OnInit {
  fatture!: Fattura[];
  fattureObj!: ServerResponse;
  subFatture!: Subscription;
  subFlag!: Subscription;
  pageIndex: number = 0;
  pageSize: number = 20;
  sort: string = 'id';
  caricamento: boolean = false;
  mostraNascondi: boolean = true;
  tabella: boolean = false;
  displayedColumns: string[] = [
    'numeroFattura',
    'anno',
    'intestatario',
    'importo',
    'stato',
    'actions',
  ];
  barraRicercaFlag: string = '';
  statoFlag: number = 0;
  valoreRicerca1!: number;
  valoreRicerca2!: number;

  data1!: Date;
  data2!: Date;
  data1String!: string;
  data2String!: string;

  constructor(
    private fattureSrv: FattureService,
    private clientiSrv: ClientiService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.subFlag = this.fattureSrv.flag.subscribe((val) => {
      this.mostraNascondi = val;
      this.aggiorna();
    });
  }

  // visualizza tabella o griglia in base alle preferenze utente
  // mantiene la lista fatture aggiornata dopo ogni modifica, gestisce la paginazione per funzionare in
  // base ai filtri ricevuti(ricerche,stati-fatture,ordinamenti vari)
  // gestisce gli errori nelle chiamate dovute ai campi di ricerca mal compilati
  async aggiorna() {
    let dato = localStorage.getItem('tabella');
    if (dato) {
      this.tabella = true;
    } else {
      this.tabella = false;
    }
    if (this.barraRicercaFlag == '') {
      if (this.statoFlag == 0) {
        this.caricamento = true;
        this.subFatture?.unsubscribe();
        this.subFatture = this.fattureSrv
          .getAll(this.pageIndex, this.pageSize, this.sort)
          .subscribe((fatture) => {
            this.fatture = fatture.content;
            this.fattureObj = fatture;
            this.caricamento = false;
          });
      } else {
        this.caricamento = true;
        this.subFatture?.unsubscribe();
        this.subFatture = this.fattureSrv
          .getbyStato(this.pageIndex, this.pageSize, this.sort, this.statoFlag)
          .subscribe((fatture) => {
            this.fatture = fatture.content;
            this.fattureObj = fatture;
            this.caricamento = false;
          });
      }
    } else {
      if (this.barraRicercaFlag == 'data') {
        this.statoFlag = 0;
        this.caricamento = true;
        try {
          await lastValueFrom(
            this.fattureSrv.getByDataBetween(
              this.pageIndex,
              this.pageSize,
              this.sort,
              this.data1String,
              this.data2String
            )
          ).then((fatture) => {
            this.fatture = fatture.content;
            this.fattureObj = fatture;
            this.caricamento = false;
          });
        } catch (e) {
          this.caricamento = false;
          this.barraRicercaFlag = '';
          const dialogRef = this.dialog.open(AlertErroriComponent, {
            width: '50%',
            data: {
              titolo: 'Ops... Si è verificato un errore',
              messaggio:
                "Il formato delle date inserite non è corretto, ti invitiamo a verificarne la correttezza, e scegliere le date mediante l'apposito selettore",
            },
          });
        }
      }
      if (this.barraRicercaFlag == 'importo') {
        this.statoFlag = 0;
        this.caricamento = true;
        try {
          await lastValueFrom(
            this.fattureSrv.getByImportoBetween(
              this.pageIndex,
              this.pageSize,
              this.sort,
              this.valoreRicerca1,
              this.valoreRicerca2
            )
          ).then((fatture) => {
            this.fatture = fatture.content;
            this.fattureObj = fatture;
            this.caricamento = false;
          });
        } catch (err) {
          this.caricamento = false;
          this.barraRicercaFlag = '';
          const dialogRef = this.dialog.open(AlertErroriComponent, {
            width: '50%',
            data: {
              titolo: 'Ops... Si è verificato un errore',
              messaggio:
                'Gli importi inseriti non sono corretti, possono essere isneriti solo numeri maggiori di 0',
            },
          });
        }
      }
    }
  }

  // visualizza le fatture per stato (Pagate, non pagate, tutte)
  visualizzaStato(stato: number) {
    this.barraRicercaFlag = '';
    this.statoFlag = stato;
    this.aggiorna();
  }

  // sorting deciso dall'utente
  sortby(string: string) {
    this.sort = string;
    this.aggiorna();
  }

  // abilita la visualizzazione della pagina fatture cliente(rotta interna di cliente) per mostrare tutte le fatture del
  //cliente partendo dalla singola fattura
  // senza questa funzione la rotta cliente/fattureCliente/#, visualizzerebbe solo la pagina cliente
  abilita() {
    this.clientiSrv.flag.next(false);
  }

  //alterna vista grliglia/tabella
  getTabella() {
    this.tabella = !this.tabella;
    if (this.tabella) {
      localStorage.setItem('tabella', JSON.stringify(this.tabella));
    } else {
      localStorage.removeItem('tabella');
    }
  }

  // gestione parametri del paginator
  pageEvent(e: any) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.aggiorna();
  }

  // nasconde il parent per mostrare il form fatture
  mostraENascondi() {
    this.fattureSrv.flag.next(false);
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

  // gestione delle ricerche
  cerca() {
    this.pageIndex = 0;
    if (this.barraRicercaFlag == 'data') {
      try {
        this.data1String =
          this.data1.getDate() +
          '.' +
          (this.data1.getMonth() + 1) +
          '.' +
          this.data1.getFullYear();
        this.data2String =
          this.data2.getDate() +
          '.' +
          (this.data2.getMonth() + 1) +
          '.' +
          this.data2.getFullYear();
        this.aggiorna();
      } catch (e) {
        this.barraRicercaFlag = '';
        const dialogRef = this.dialog.open(AlertErroriComponent, {
          width: '50%',
          data: {
            titolo: 'Ops... Si è verificato un errore',
            messaggio:
              "Il formato delle date inserite non è corretto, ti invitiamo a verificarne la correttezza, e scegliere le date mediante l'apposito selettore",
          },
        });
      }
    }
    if (this.barraRicercaFlag == 'importo') {
      this.aggiorna();
    }
  }

  // reset risultato ricerche
  reset() {
    this.barraRicercaFlag = '';
    this.statoFlag = 0;
    this.aggiorna();
  }

  // alert conferma eliminazione fattura
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
    this.subFatture?.unsubscribe();
    this.subFlag?.unsubscribe();
  }
}
