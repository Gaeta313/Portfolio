import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertErroriComponent } from 'src/app/components/alert-errori/alert-errori.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild('f', { static: true }) form!: any;
  caricamento: boolean = false;

  constructor(private authSrv: AuthService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  async submit() {
    this.caricamento = true;
    try {
      await lastValueFrom(this.authSrv.login(this.form.value)).then((val) => {
        this.caricamento = false;
      });
    } catch (err: any) {
      this.caricamento = false;
      const dialogRef = this.dialog.open(AlertErroriComponent, {
        width: '50%',
        data: {
          messaggio:
            'Errore nella richiesta, verifica i campi inseriti e riprova',
          titolo: 'Ops... Si è verificato un errore',
        },
      });
    }
  }
}
