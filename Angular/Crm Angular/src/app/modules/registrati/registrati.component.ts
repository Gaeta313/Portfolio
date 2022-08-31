import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertErroriComponent } from 'src/app/components/alert-errori/alert-errori.component';

@Component({
  selector: 'app-registrati',
  templateUrl: './registrati.component.html',
  styleUrls: ['./registrati.component.scss'],
})
export class RegistratiComponent implements OnInit {
  form!: FormGroup;
  caricamento = false;
  constructor(private authSrv: AuthService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, [
        Validators.pattern('.+\\@.+\\.+[a-zA-Z0-9]{2,3}$'),
        Validators.required,
      ]),
      password: new FormControl(null, Validators.minLength(6)),
      nome: new FormControl(null),
      cognome: new FormControl(null),
      role: new FormControl(null, Validators.required),
    });
  }

  async submit() {
    this.caricamento = true;
    try {
     await lastValueFrom(this.authSrv.signup(this.form.value)).then((val) => {
        this.caricamento = false;
        const dialogRef = this.dialog.open(AlertErroriComponent, {
          width: '50%',
          data: {
            titolo: 'Registrazione avvenuta con successo !',
          },
        });
        this.form.reset();
      });
    } catch (err:any) {
      this.caricamento = false;
      console.log(err.message)
      const dialogRef = this.dialog.open(AlertErroriComponent, {
        width: '50%',
        data: {
          messaggio:
            err.message,
          titolo: 'Ops... Si è verificato un errore',
        },
      });
    }
  }
}
