import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }    from '@angular/forms';

// PrimeNG
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

// App
import { AppComponent } from './app.component';
import { BmpComponent } from './components/bmp';
import { IsoFieldComponent } from './components/field';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    BmpComponent,
    IsoFieldComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    // PrimeNG
    CheckboxModule,
    CardModule,
    InputMaskModule,
    InputTextModule,
    KeyFilterModule,
    MessagesModule,
    MessageModule,
    // Remark: because you havent defined any routes, I have to pass an empty
    // route collection to forRoot, as the first parameter is mandatory.
    RouterModule.forRoot([]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
