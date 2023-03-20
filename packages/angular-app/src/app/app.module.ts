import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LayoutProjectionModule } from '@layout-projection/angular';

import { AppComponent } from './app.component';
import { SampleBasicComponent } from './sample-basic.component';
import { SampleBorderRadiusComponent } from './sample-border-radius.component';
import { SampleNestedComponent } from './sample-nested.component';
import { SampleSharedElementComponent } from './sample-shared-element.component';
import { SampleStreamComponent } from './sample-stream.component';

@NgModule({
  declarations: [
    AppComponent,
    SampleBasicComponent,
    SampleSharedElementComponent,
    SampleStreamComponent,
    SampleBorderRadiusComponent,
    SampleNestedComponent,
  ],
  imports: [BrowserModule, LayoutProjectionModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
