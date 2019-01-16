import { Component } from '@angular/core';
import { NavController, Platform, AlertController ,ModalController } from 'ionic-angular';
import { AmplifyService }  from 'aws-amplify-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Http } from '@angular/http';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];

  constructor(public navCtrl: NavController, 
    public amplify:AmplifyService,
    private media: Media,
    private file: File,
    private http: Http,
    public alertCtrl: AlertController ,
    public platform: Platform,
    public modalCtrl: ModalController) {
 
  }

  getAudioList() {
    if(localStorage.getItem("audiolist")) {
      this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      console.log(this.audioList);
    }
  }

  ionViewWillEnter() {
    this.getAudioList();
    //this.loadResults();
  }
  
  loadResults(filename){
    filename = filename.split('.').slice(0, -1).join('.');
    console.log(filename);
    let apiName = 'ComprehendOutput';
    let path = '/comprehendoutput2'; 
    let myInit = { // OPTIONAL
        headers: {}, // OPTIONAL
        response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
        queryStringParameters: {  // OPTIONAL
          filename: filename
        }
    }
    this.amplify.api().get(apiName, path, myInit).then(response => {

      
      let results = response["data"];
      let count = results["Count"];
            
      if (count == 0){
        
        let alert = this.alertCtrl.create({
          title: filename,
          message: 'file not ready yet',
          buttons: ['Dismiss']
        });
        alert.present();
        
      }else{
        let item = results["Items"][0];
        
        const myModal = this.modalCtrl.create('ResultPage', { 'item':item });
        myModal.onDidDismiss(modalData=>{ });
        myModal.present(); 

      }
        
    }).catch(error => {
        console.log(error.response)
    });
    
    
  }

  startRecord() {
    if (this.platform.is('ios')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.3gp';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      console.log(this.filePath);
      this.audio = this.media.create(this.filePath);
    }
    this.audio.startRecord();
    this.recording = true;
  }

  stopRecord() {
    this.audio.stopRecord();
    console.log(this.audio.getDuration());
    let data = { filename: this.fileName };
    this.audioList.push(data);
    localStorage.setItem("audiolist", JSON.stringify(this.audioList));
    this.recording = false;
    this.getAudioList();
  }

	//upload audio
  uploadAudio(filename,idx) {
    
    let filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '');
    console.log(filePath);
    this.file.readAsArrayBuffer('file://'+filePath,filename)
      .then( body => {
        this.amplify.storage().put(filename, body,{contentType : 'video/3gpp' } )        
        .then(() => {
            console.log('Audio uploaded');
          })
          .catch(err => {
            console.log('Audio uploaded' + JSON.stringify(err));
          });
      })
      .catch(err => console.log(JSON.stringify(err)));
    
  }
  
}
