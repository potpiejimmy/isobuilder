import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';

@Component({
    selector: 'isofield',
    templateUrl: './field.html'
})
export class IsoFieldComponent implements OnInit {

    _val: string;
    _parsing: boolean = false;

    @Input()
    def: any;

    @Input()
    no: Number;

    @Input()
    emv: boolean;

    @Output()
    onChange = new EventEmitter<any>();

    ngOnInit(): void {
    }

    @Input()
    set init(init) {
        if (this._parsing) return;
        let v = '';
        if (init) {
            v = init;
            if (this.def && this.def.lenlen) {
                // remove length field:
                v = v.substr(this.def.lenlen*2);
            }
        }
        this._val = v;
        setTimeout(()=>this.emitVal(v),0);
    }

    mask(): string {
        if (!this.def) return '';
        return 'aa'.repeat(this.len);
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
        this._parsing = true;
        this._val = v;
        this.emitVal(v);
        setTimeout(()=>this._parsing = false, 500);
    }

    get len(): number {
        if (!this.def || !this.def.len) return;
        return this.emv && this.def.len_emv ? this.def.len_emv : this.def.len;
    }

    get valAlpha(): string {
        return this.ebcdicHexToAscii(this.val);
    }

    emitVal(v) {
        let e = this.lengthField();
        e += v.replace(/_/g,'');
        if (e.length%2) e += '0';
        if (this.len) {
            while (e.length < this.len*2) e += this.def.alpha ? '40' : '00';
        }
        this.onChange.emit({no:this.no, val:e});
    }


    // util:

    e2a = [
        0,  1,  2,  3,156,  9,134,127,151,141,142, 11, 12, 13, 14, 15,
       16, 17, 18, 19,157,133,  8,135, 24, 25,146,143, 28, 29, 30, 31,
      128,129,130,131,132, 10, 23, 27,136,137,138,139,140,  5,  6,  7,
      144,145, 22,147,148,149,150,  4,152,153,154,155, 20, 21,158, 26,
       32,160,161,162,163,164,165,166,167,168, 91, 46, 60, 40, 43, 33,
       38,169,170,171,172,173,174,175,176,177, 93, 36, 42, 41, 59, 94,
       45, 47,178,179,180,181,182,183,184,185,124, 44, 37, 95, 62, 63,
      186,187,188,189,190,191,192,193,194, 96, 58, 35, 64, 39, 61, 34,
      195, 97, 98, 99,100,101,102,103,104,105,196,197,198,199,200,201,
      202,106,107,108,109,110,111,112,113,114,203,204,205,206,207,208,
      209,126,115,116,117,118,119,120,121,122,210,211,212,213,214,215,
      216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,
      123, 65, 66, 67, 68, 69, 70, 71, 72, 73,232,233,234,235,236,237,
      125, 74, 75, 76, 77, 78, 79, 80, 81, 82,238,239,240,241,242,243,
       92,159, 83, 84, 85, 86, 87, 88, 89, 90,244,245,246,247,248,249,
       48, 49, 50, 51, 52, 53, 54, 55, 56, 57,250,251,252,253,254,255
      ];
    
    ebcdicHexToAscii (hexstring: string): string {
        return this.ebcdicToAscii(Buffer.from(hexstring, 'hex'));
    }
    
    ebcdicToAscii (buf: Buffer): string {
        for (let i=0; i<buf.length; i++) buf[i] = this.e2a[buf[i]];
        return buf.toString();
    }
    
    asciiToEbcdic(input: string): Buffer {
        let result = [];
        for (let i=0; i<input.length; i++) {
            for (let j=0; j<this.e2a.length; j++) {
                if (this.e2a[j] == input.charCodeAt(i)) result.push(j);
            }
        }
        return Buffer.from(result);
    }
}
