import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the ResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {
  item:any;
  transcript:any;
  keyPhrases:any;
  sentiment:any;
  sentimentResult:any;
  sentimentScore:any;
  keyPhrasesArray:string[]=[];  

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,) {
    this.item = navParams.get('item');
    this.transcript = this.item.transcript.S;
    this.keyPhrases = JSON.parse(this.item.keyPhrases.S);
    this.sentiment = JSON.parse(this.item.sentiment.S);
    this.sentimentResult = this.sentiment.Sentiment;
    this.sentimentScore = this.sentiment.SentimentScore;
    console.log(this.keyPhrases);
    
    for (let i = 0; i < this.keyPhrases.length;i++){
      this.keyPhrasesArray.push(JSON.stringify(this.keyPhrases[i]));
    }
    console.log(this.keyPhrasesArray);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
