import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AmplifyAngularModule, AmplifyService } from 'aws-amplify-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Media } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AmplifyAngularModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    
    SplashScreen,
    AmplifyService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Media,
    File
  ]
})
export class AppModule {}
