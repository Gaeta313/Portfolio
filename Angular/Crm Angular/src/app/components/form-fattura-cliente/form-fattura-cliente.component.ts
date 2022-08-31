import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { FattureService } from 'src/app/services/fatture.service';
import { AlertErroriComponent } from '../alert-errori/alert-errori.component';

@Component({
  templateUrl: './form-fattura-cliente.component.html',
  styleUrls: ['./form-fattura-cliente.component.scss'],
})
export class FormFatturaClienteComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  idCliente!: number;
  stati!: any[];
  subRoute!: Subscription;
  subStati!: Subscription;
  titolo: string = 'Nuova Fattura';
  nomePulsante: string = 'Crea';

  constructor(
    private route: ActivatedRoute,
    private fattureSrv: FattureService,
    private router: Router,
    public dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.subStati = this.fattureSrv.getStati().subscribe((stati) => {
      this.stati = stati.content;
    });
    this.subRoute = this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.idCliente = params['idCliente'];
      this.form = new FormGroup({
        numero: new FormControl(null, [Validators.required, Validators.min(0)]),
        importo: new FormControl(null, [
          Validators.required,
          Validators.min(0),
        ]),
        anno: new FormControl({
          value: new Date().getFullYear(),
          disabled: true,
        }),
        data: new FormControl({ value: new Date(), disabled: true }),
        cliente: new FormGroup({
          id: new FormControl(this.idCliente),
        }),
        stato: new FormGroup({
          nome: new FormControl(null, Validators.required),
        }),
      });
      if (this.id != 0) {
        this.titolo = 'Modifica Fattura';
        this.nomePulsante = 'Modifica';
        lastValueFrom(this.fattureSrv.getbyId(this.id)).then((fattura) => {
          this.form = new FormGroup({
            numero: new FormControl(
              { value: fattura.numero, disabled: true },
              Validators.required
            ),
            importo: new FormControl(
              { value: fattura.importo, disabled: true },
              Validators.required
            ),
            anno: new FormControl({ value: fattura.anno, disabled: true }),
            data: new FormControl({ value: fattura.data, disabled: true }),
            cliente: new FormGroup({
              id: new FormControl(this.idCliente),
            }),
            stato: new FormGroup({
              nome: new FormControl(fattura.stato.nome),
            }),
          });
        });
      }
    });
  }

  // chiude la scheda form senza effettuare modifiche
  annulla() {
    this.fattureSrv.flag.next(true);
  }

  submit() {
    const fattura = this.form.getRawValue();
    if (fattura.stato.nome == 'NON PAGATA') {
      fattura.stato.id = 2;
    } else {
      fattura.stato.id = 1;
    }
    if (this.id == 0) {
      lastValueFrom(this.fattureSrv.addFattura(fattura)).then((val) => {
        this.fattureSrv.flag.next(true);
        const dialogRef = this.dialog.open(AlertErroriComponent, {
          width: '50%',
          data: {
            titolo: 'Fattura creata con successo !',
          },
        });
      });
    } else {
      lastValueFrom(this.fattureSrv.modifica(this.id, fattura)).then((val) => {
        this.fattureSrv.flag.next(true);
        const dialogRef = this.dialog.open(AlertErroriComponent, {
          width: '50%',
          data: {
            titolo: 'Fattura modificata con successo !',
          },
        });
      });
    }
  }

  ngonDestroy() {
    this.subRoute?.unsubscribe();
    this.subStati?.unsubscribe();
  }
}
