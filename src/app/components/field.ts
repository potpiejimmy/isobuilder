import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';

@Component({
    selector: 'isofield',
    templateUrl: './field.html'
})
export class IsoFieldComponent implements OnInit {

    _val: string;

    @Input()
    def: any;

    @Input()
    no: Number;

    @Output()
    onChange = new EventEmitter<any>();

    ngOnInit(): void {
        this.val = '';
    }

    mask(): string {
        if (!this.def) return '';
        return 'aa'.repeat(this.def.len);
    }

    lengthField(): string {
        if (!this.def || !this.def.lenlen) return '';
        let len = this._val ? Math.round(this._val.length/2) : 0;
        let lens = ("" + (Math.pow(10, this.def.lenlen) + len)).substr(1);
        return "f" + lens.split("").join("f");
    }

    get val() {
        return this._val;
    }

    set val(v) {
        this._val = v;
        let e = this.lengthField();
        e += v.replace(/_/g,'');
        if (e.length%2) e += '0';
        if (this.def && this.def.len) {
            while (e.length < this.def.len*2) e += '00';
        }
        this.onChange.emit({no:this.no, val:e});
    }
}
