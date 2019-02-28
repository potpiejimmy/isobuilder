import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

// PrimeNG
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';

// App
import { AppComponent } from './app.component';
import { BmpComponent } from './components/bmp';
import { IsoFieldComponent } from './components/field';

@NgModule({
  declarations: [
    AppComponent,
    BmpComponent,
    IsoFieldComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    // PrimeNG
    CheckboxModule,
    CardModule,
    InputMaskModule,
    InputTextModule,
    KeyFilterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
