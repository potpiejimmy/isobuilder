import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';

@Component({
  selector: 'bmp',
  templateUrl: './bmp.html'
})
export class BmpComponent implements OnInit {
    bitmap = [];
    
    @Input()
    selectedValues = [];

    @Input()
    startNo = 1;

    @Output()
    onChange = new EventEmitter<any[]>();

    constructor() {
    }

    ngOnInit(): void {
        for (let i=0; i<64; i++) this.bitmap[i] = this.startNo + i;
    }
    
    bmpClicked() {
        this.selectedValues.sort((a,b)=>a-b);
        this.onChange.emit(this.selectedValues);
    }
}
