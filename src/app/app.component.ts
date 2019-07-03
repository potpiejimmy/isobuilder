import { Component } from '@angular/core';
import * as BigInt from "big-integer";
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  version = environment.version;
  msgs = [];
  
  bmp0 = []; bmp1 = []; bmps = [];
  _result: string = "0100";
  _msgtype: string = "0100";
  _parsing: boolean = false;

  isodef = {
     2: {label:"TRACK2PAN", lenlen:2},
     3: {label:"AKZ", len:3},
     4: {label:"AMOUNT", len:6},
     6: {label:"AMOUNT ACQ", len:6},
     7: {label:"DATETIME", len:5},
    11: {label:"TRANSACT NO.", len:3},
    12: {label:"TIME", len:3},
    13: {label:"DATE", len:2},
    14: {label:"EXPIRYDATE", len:2},
    16: {label:"DATE EXCH. RATE", len:2},
    18: {label:"MERCHANTTYPE", len:2},
    20: {label:"COUNTRYCODE", len:2},
    22: {label:"ENTRYMODE", len:2},
    23: {label:"CARDSEQNO", len:2},
    24: {label:"NETWORKID", len:2},
    25: {label:"CONDITIONCODE", len:1},
    26: {label:"MAXPIN", len:1},
    27: {label:"MAXLEN AZREF", len:1},
    28: {label:"ACQUIRER CHARGE", len:5},
    30: {label:"ISSUER CHARGE", len:4},
    32: {label:"ACQUIRER ID", lenlen:2},
    33: {label:"COMPID", lenlen:2},
    34: {label:"TRACK3PAN", lenlen:2},
    35: {label:"TRACK2", lenlen:2},
    36: {label:"SOURCE ACCOUNT", len:5},
    37: {label:"REF NO.", len:6},
    38: {label:"AZREF", len:3, len_emv:6, alpha_emv:true},
    39: {label:"RC", len:1, len_emv:2, alpha_emv:true},
    41: {label:"ATMID", len:4, len_emv:8, alpha_emv:true},
    42: {label:"BANKCODE", len:8, len_emv:15, alpha_emv:true},
    43: {label:"ATMLOCATION", len:40, alpha:true},
    47: {label:"ACQ ACCT DTA", lenlen:3},
    49: {label:"COUNTRYKEY", len:2},
    51: {label:"CURRENCYCODE ISSUER", len:2},
    52: {label:"PAC", len:8},
    53: {label:"SECURITYDATA", len:8},
    54: {label:"SURCHARGE AMOUNT", lenlen:3},
    55: {label:"CHIPDATA", lenlen:3},
    57: {label:"SESSIONKEY", lenlen:3},
    58: {label:"ALT AMOUNT", lenlen:3},
    59: {label:"AUTH ID", lenlen:3},
    60: {label:"ACQ ACCOUNT", lenlen:3},
    61: {label:"ONLINE TIME", lenlen:3},
    62: {label:"TELCODATA", lenlen:3},
    63: {label:"RETRY COUNTER", lenlen:3},
    64: {label:"MAC", len:8},
   110: {label:"SECURITY DATA", lenlen:4},
   128: {label:"MAC2", len:8}
  }

  constructor() {
  }

  bmp0Change(bmp) {
    this.bmp0 = bmp;
    if (bmp[0]!=1) this.bmp1 = [];
    this.build();
  }

  bmp1Change(bmp) {
    this.bmp1 = bmp;
    this.build();
  }

  bmpChange(event) {
    this.bmps[event.no] = event.val;
    setTimeout(()=>this.build(), 0);
  }

  fieldLabel(no: string): string {
    return this.isodef[no] ? this.isodef[no].label : '?';
  }

  bitmapToHex(bmp, offset=0) {
    let res = new Array(64).fill('0');
    for (let i in bmp) {
      res[bmp[i]-1-offset] = '1';
    }
    return BigInt('1'+res.join(""),2).toString(16).substr(1);
  }

  hexToBitmap(hex, offset=0) {
    let bmp = [];
    let res = BigInt('1'+hex, 16).toString(2).substr(1);
    for (let i=0; i<64; i++) {
      if (res.charAt(i)=='1') bmp.push(i+offset+1);
    }
    return bmp;
  }

  build() {
    if (this._parsing) return;
    let res = this.msgtype;
    res += this.bitmapToHex(this.bmp0);
    if (this.bmp0[0]==1) res += this.bitmapToHex(this.bmp1,64);
    for (let i in this.bmp0) {
      if (this.bmp0[i]>1 && this.bmps[this.bmp0[i]]) res += this.bmps[this.bmp0[i]];
    }
    if (this.bmp0[0]==1) {
      for (let i in this.bmp1) {
        if (this.bmps[this.bmp1[i]]) res += this.bmps[this.bmp1[i]];
      }
    }
    this._result = res;
    this.msgs = [];
  }

  parse(msg) {
    this._parsing = true;
    let offset = 0;
    this._msgtype = msg.substr(offset,4);
    offset += 4;
    this.bmp0 = this.hexToBitmap(msg.substr(offset,16));
    offset += 16;
    if (this.bmp0[0]==1) {
      this.bmp1 = this.hexToBitmap(msg.substr(offset,16), 64);
      offset += 16;
    }
    for (let i in this.bmp0) {
      let no = this.bmp0[i];
      if (no>1 && this.isodef[no]) {
        offset = this.parseField(msg, offset, no);
      }
    }
    if (this.bmp0[0]==1) {
      for (let i in this.bmp1) {
        let no = this.bmp1[i];
        if (this.isodef[no]) {
          offset = this.parseField(msg, offset, no);
        }
      }
    } else {
      this.bmp1 = [];
    }
    this.msgs = [];
    if (offset != msg.length) {
      this.msgs.push({severity:'error', summary:'Invalid message', detail:'Invalid message length, expected length is '+offset/2});
    } else {
      this.msgs.push({severity:'success', summary:'Message okay', detail:'Message successfully parsed'});
    }
    setTimeout(()=>this._parsing = false, 500);
  }

  get emv(): boolean { // EMV AKZ ...3 or international (ECI)
    return (this.bmps[3] && this.bmps[3].endsWith('3')) || this._msgtype && this._msgtype.startsWith('01');
  }

  parseField(msg: string, offset: number, no: number) {
    let len = this.emv && this.isodef[no].len_emv ? this.isodef[no].len_emv : this.isodef[no].len;
    if (this.isodef[no].lenlen) {
      len = msg.substr(offset, this.isodef[no].lenlen*2);
      len = parseInt(len.replace(/[fF]/g,''));
      len += this.isodef[no].lenlen;
    }
    this.bmps[no] = msg.substr(offset, len*2);
    offset += len*2;
    return offset;
  }

  get msgtype() {
    return this._msgtype;
  }

  set msgtype(t) {
    this._msgtype = t;
    this.build();
  }

  get result() {
    return this._result;
  }

  set result(msg: string) {
    this._result = msg;
    this.parse(msg);
  }
}
