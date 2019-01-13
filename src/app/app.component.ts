import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  public token: any = "";
  public channelArray: any[] = [];
  public selectedChannel: any = "";
  public selectedChannelHistory: any[] = [];
  public channelHistoryDownloadUrl: any = "";
  public isReadyJson: boolean = false;

  public config: any = {
    slackApiEndPoint : "https://slack.com/api/",
    channelList : "channels.list",
    channelsHistory : "channels.history"
  };

  ngOnInit() {

    this.channelArray = [];
    this.selectedChannel = "";
    this.selectedChannelHistory = [];
    this.channelHistoryDownloadUrl = "";

  }

  getChannelList() {

    this.channelArray = [];
    this.selectedChannel = "";
    this.selectedChannelHistory = [];

    // API : Channel List
    const headers = new HttpHeaders().set("Accept", "application/x-www-form-urlencoded");
    this.http.get(this.config.slackApiEndPoint + this.config.channelList + "?token=" + this.token , { headers })
      .subscribe((response: any) => {
        console.log(response);
        if(response.ok){
          this.channelArray = response.channels;
        }else{
          console.log(response);
          alert(" Invalid Token : "+ this.token )
        }
      },(err) => {
        console.log(err);
        alert(err);
      })
  }

  selectChannel(item){
    this.selectedChannelHistory = [];
    this.selectedChannel = item;
    this.getChannelHistory();
    this.isReadyJson = false;

    console.log(this.selectedChannel);
  }

  getChannelHistory(){

      const headers = new HttpHeaders().set("Accept", "application/x-www-form-urlencoded");
      this.http.get(this.config.slackApiEndPoint + this.config.channelsHistory +
        "?token=" + this.token +
        "&channel=" + this.selectedChannel.id, {headers})
        .subscribe((response: any) => {
          console.log(response);
          if (response.ok) {
            this.selectedChannelHistory = response.messages;
          } else {
            console.log(response);
          }
        }, (err) => {
          console.log(err);
        });
  }

  generateDownloadJsonUrl(){
    this.isReadyJson = true;
    let theJSON = JSON.stringify(this.selectedChannelHistory);
    let url = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.channelHistoryDownloadUrl = url;
  }

}
