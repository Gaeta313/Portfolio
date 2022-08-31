import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LoggedUser } from 'src/app/interfaces/logged-user';
import { ClientiService } from 'src/app/services/clienti.service';
import { FattureService } from 'src/app/services/fatture.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user!: LoggedUser | null;
  subUser!: Subscription;
  constructor(
    private authSrv: AuthService,
    private clientiSrv: ClientiService,
    private fattureSrv: FattureService
  ) {}

  ngOnInit(): void {
    this.subUser = this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
  }

  logout() {
    this.authSrv.logout();
  }

  // imposta le opzioni di visualizzazione di default(nel caso non siano corrette) per la pagina cliente
  default() {
    this.clientiSrv.flag.next(true);
  }

  defaultFat() {
    this.fattureSrv.flag.next(true);
  }

  ngonDestroy() {
    this.subUser?.unsubscribe();
  }
}
