import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { LoggedUser } from 'src/app/interfaces/logged-user';
import { ClientiService } from 'src/app/services/clienti.service';
import { FattureService } from 'src/app/services/fatture.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user!: LoggedUser | null;
  sub!: Subscription;
  constructor(
    private authSrv: AuthService,
    private fattureSrv: FattureService,
    private clientiSrv: ClientiService
  ) {}

  ngOnInit(): void {
    this.sub = this.authSrv.user$.subscribe((user) => {
      this.user = user;
    });
  }

  default() {
    this.clientiSrv.flag.next(true);
  }

  defaultFat() {
    this.fattureSrv.flag.next(true);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
