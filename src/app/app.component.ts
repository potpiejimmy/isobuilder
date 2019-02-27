import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  bitmap = [];
  selectedValues = [];
  constructor() {
    for (let i=0; i<64; i++) this.bitmap[i] = i+1;
  }
  bmpClicked() {
    let numsel = [];
    for (let i in this.selectedValues) numsel.push(parseInt(i));
    numsel.sort();
    console.log(this.selectedValues);
  }
}
