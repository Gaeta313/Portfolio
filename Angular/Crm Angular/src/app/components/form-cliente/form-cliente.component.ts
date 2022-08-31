import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { ClientiService } from 'src/app/services/clienti.service';
import { AlertErroriComponent } from '../alert-errori/alert-errori.component';

@Component({
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss'],
})
export class FormClienteComponent implements OnInit {
  comuni!: any[];
  subComuni!: Subscription;
  form!: FormGroup;
  provincia: string = 'Napoli';
  tipiCliente!: any[];
  subTipiCliente!: Subscription;
  subCliente!: Subscription;
  subRoute!: Subscription;
  semaforo = false;
  titolo = 'Nuovo Cliente';
  nomePulsante = 'Crea';
  idCliente = 0;
  constructor(
    private clientiSrv: ClientiService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.subComuni = this.clientiSrv.comuniGetAll().subscribe((data) => {
      this.comuni = data.content;
    });
    this.subTipiCliente = this.clientiSrv.getTipiClienti().subscribe((data) => {
      this.tipiCliente = data;
    });
    this.form = new FormGroup({
      ragioneSociale: new FormControl(null, Validators.required),
      partitaIva: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('.+\\@.+\\.+[a-zA-Z0-9]{2,3}$'),
      ]),
      tipoCliente: new FormControl(null, Validators.required),
      pec: new FormControl(null),
      telefono: new FormControl(null),
      nomeContatto: new FormControl(null),
      cognomeContatto: new FormControl(null),
      telefonoContatto: new FormControl(null),
      emailContatto: new FormControl(null, [
        Validators.required,
        Validators.pattern('.+\\@.+\\.+[a-zA-Z0-9]{2,3}$'),
      ]),
      indirizzoSedeOperativa: new FormGroup({
        via: new FormControl(null),
        civico: new FormControl(null),
        cap: new FormControl(null),
        localita: new FormControl(null),
        comune: new FormGroup({
          id: new FormControl(1),
          nome: new FormControl(null, Validators.required),
          provincia: new FormGroup({
            id: new FormControl(1),
            nome: new FormControl(null),
          }),
        }),
      }),
    });

    this.subRoute = this.route.params.subscribe((params) => {
      if (params['id'] != 0) {
        this.idCliente = params['id'];
        this.titolo = 'Modifica Cliente';
        this.nomePulsante = 'Modifica';
        this.subCliente = this.clientiSrv
          .getById(params['id'])
          .subscribe((cliente) => {
            this.form = new FormGroup({
              ragioneSociale: new FormControl(
                cliente?.ragioneSociale,
                Validators.required
              ),
              partitaIva: new FormControl(cliente?.partitaIva, [
                Validators.required,
              ]),
              email: new FormControl(cliente?.email, Validators.required),
              tipoCliente: new FormControl(
                cliente?.tipoCliente,
                Validators.required
              ),
              pec: new FormControl(cliente?.pec),
              telefono: new FormControl(cliente?.telefono),
              nomeContatto: new FormControl(cliente?.nomeContatto),
              cognomeContatto: new FormControl(cliente?.cognomeContatto),
              telefonoContatto: new FormControl(cliente?.telefonoContatto),
              emailContatto: new FormControl(
                cliente?.emailContatto,
                Validators.required
              ),
              indirizzoSedeOperativa: new FormGroup({
                via: new FormControl(cliente.indirizzoSedeOperativa?.via),
                civico: new FormControl(cliente.indirizzoSedeOperativa?.civico),
                cap: new FormControl(cliente.indirizzoSedeOperativa?.cap),
                localita: new FormControl(
                  cliente.indirizzoSedeOperativa?.localita
                ),
                comune: new FormGroup({
                  id: new FormControl(
                    cliente.indirizzoSedeOperativa?.comune.id
                  ),
                  nome: new FormControl(
                    cliente.indirizzoSedeOperativa?.comune.nome,
                    Validators.required
                  ),
                  provincia: new FormGroup({
                    id: new FormControl(
                      cliente.indirizzoSedeOperativa?.comune.provincia.id
                    ),
                    nome: new FormControl(
                      cliente.indirizzoSedeOperativa?.comune?.provincia.nome
                    ),
                  }),
                }),
              }),
            });
            this.semaforo = true;
          });
      } else {
        this.semaforo = true;
      }
    });
  }

  //chiude la scheda form senza effettuare modifiche
  annulla() {
    this.clientiSrv.flag.next(true);
    this.router.navigate(['./clienti']);
  }

  // gestisce la select del comune e associa la provincia corretta
  onSelect(e: any) {
    if (e && e != '') {
      const comune = this.comuni.find((comune) => comune.nome == e);
      this.form
        .get('indirizzoSedeOperativa')
        ?.get('comune')
        ?.get('provincia')
        ?.get('nome')
        ?.setValue(comune.provincia.nome);
    }
  }

  submit() {
    if (this.idCliente == 0) {
      const cliente = this.form.value;
      cliente.indirizzoSedeOperativa.comune = this.comuni.find(
        (comune) =>
          comune.nome === this.form.value.indirizzoSedeOperativa.comune.nome
      );
      cliente.dataInserimento = new Date();
      lastValueFrom(this.clientiSrv.addCliente(cliente)).then((val) => {
        this.clientiSrv.flag.next(true);
        const dialogRef = this.dialog.open(AlertErroriComponent, {
          width: '50%',
          data: {
            titolo: 'Cliente creato con successo !',
          },
        });
        this.router.navigate(['./clienti']);
      });
    } else {
      const cliente = this.form.value;
      cliente.indirizzoSedeOperativa.comune = this.comuni.find(
        (comune) =>
          comune.nome === this.form.value.indirizzoSedeOperativa.comune.nome
      );
      cliente.dataUltimoContatto = new Date();
      lastValueFrom(
        this.clientiSrv.modificaCliente(this.idCliente, cliente)
      ).then((val) => {
        this.clientiSrv.flag.next(true);
        const dialogRef = this.dialog.open(AlertErroriComponent, {
          width: '50%',
          data: {
            titolo: 'Cliente modificato con successo !',
          },
        });
        this.router.navigate(['./clienti']);
      });
    }
  }

  ngonDestroy() {
    this.subCliente?.unsubscribe();
    this.subComuni?.unsubscribe();
    this.subRoute?.unsubscribe();
    this.subTipiCliente?.unsubscribe();
  }
}
