import { Component } from '@angular/core';
import * as BigInt from "big-integer";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  bmp0 = []; bmp1 = []; bmps = [];
  _result: string;
  msgtype: string = "0100";

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
    38: {label:"AZREF", len:3},
    39: {label:"RC", len:1},
    41: {label:"ATMID", len:4},
    42: {label:"BANKCODE", len:8},
    43: {label:"ATMLOCATION", len:20},
    47: {label:"ACQ ACCT DTA", lenlen:3},
    49: {label:"COUNTRYKEY", len:2},
    51: {label:"CURRENCYCODE ISSUER", len:2},
    52: {label:"PAC", len:4},
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
  }

  bmp1Change(bmp) {
    this.bmp1 = bmp;
  }

  bmpChange(event) {
    this.bmps[event.no] = event.val;
  }

  fieldLabel(no: string): string {
    return this.isodef[no] ? this.isodef[no].label : '?';
  }

  bitmapToHex(bmp, offset=0) {
    let res = BigInt(Math.pow(2,64));
    for (let i in bmp) {
      res = res.plus(Math.pow(2,64+offset-bmp[i]));
    }
    return res.toString(16).substr(1);
  }

  get result() {
    let res = this.msgtype;
    res += this.bitmapToHex(this.bmp0);
    if (this.bmp0[0]==1) res += this.bitmapToHex(this.bmp1,64);
    for (let i in this.bmp0) {
      if (this.bmp0[i]>1) res += this.bmps[this.bmp0[i]];
    }
    if (this.bmp0[0]==1) {
      for (let i in this.bmp1) {
        res += this.bmps[this.bmp1[i]];
      }
    }
    return res;
  }
}
