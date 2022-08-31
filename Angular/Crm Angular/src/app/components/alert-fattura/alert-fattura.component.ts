import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-fattura',
  templateUrl: './alert-fattura.component.html',
})
export class AlertFatturaComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<AlertFatturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
