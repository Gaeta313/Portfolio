import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LoggedUser } from 'src/app/interfaces/logged-user';
import { ServerResponse } from 'src/app/interfaces/server-response';
import { User } from 'src/app/interfaces/user';

import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-utenti',
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.scss'],
})
export class UtentiComponent implements OnInit {
  utenti!: User[];
  utentiObj!: ServerResponse;
  subUtenti!: Subscription;
  caricamento: boolean = false;
  utenteLog!: LoggedUser;
  subUtenteLog!: Subscription;
  constructor(private usersSrv: UsersService, private authSrv: AuthService) {}

  ngOnInit(): void {
    this.caricamento = true;
    this.subUtenti = this.usersSrv.getAll(0, 20).subscribe((users) => {
      this.utenti = users.content;
      this.utentiObj = users;
      this.caricamento = false;
    });

    this.subUtenteLog = this.authSrv.user$.subscribe((user) => {
      this.utenteLog = user!;
    });
  }

  // gestione del paginator
  pageEvent(e: any) {
    this.caricamento = true;
    this.subUtenti?.unsubscribe();
    this.subUtenti = this.usersSrv
      .getAll(e.pageIndex, e.pageSize)
      .subscribe((users) => {
        this.utenti = users.content;
        this.caricamento = false;
      });
  }

  ngOnDestroy() {
    this.subUtenteLog?.unsubscribe();
    this.subUtenti?.unsubscribe();
  }
}
