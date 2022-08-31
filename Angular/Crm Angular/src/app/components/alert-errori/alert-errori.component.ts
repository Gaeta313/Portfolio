import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-errori',
  templateUrl: './alert-errori.component.html',
})
export class AlertErroriComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AlertErroriComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

}
