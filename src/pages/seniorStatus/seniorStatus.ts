import { Component } from '@angular/core';
import { NavController, Button } from 'ionic-angular';
import { BatteryPage } from '../battery/battery';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-seniorStatus',
  templateUrl: 'seniorStatus.html'
})
export class seniorStatus {
  //Displaying messages
  private message: any = '';
  private locationMessage: any = 'No motion detected since connection!';

  //room motion counts
  private bedroomCount = 0;
  private kitchenCount = 0;
  private diningCount = 0;
  private toiletCount = 0;
  private livingCount = 0;
  private countData = [this.kitchenCount, this.diningCount, this.livingCount, this.bedroomCount, this.toiletCount];

  //battery % counts
  private bedroomBat = 0;
  private kitchenBat = 0;
  private diningBat = 0;
  private toiletBat = 0;
  private livingBat = 0;

  //Fields for tracking times
  private intervalTimer;
  private timer = 0;
  private timerMins = 0;

  //MQTT connection etc fields
  private mqttStatus: string = 'Disconnected';
  private mqttClient: any = null;
  private messageToSend: string = 'Type your message here.';
  private topic: string = 'swen325/a3';
  private clientId: string = 'tennengabr123'; // this string must be unique to every client

  //Storing of sensor messages
  private sensorArray = [];
  private messageCount = 0; //Reset every 5 messages - 5 sensor messages for each iteration of MQTT messages

  constructor(public navCtrl: NavController) {
    this.connect();
  }

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top'
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        }
      }
    }
  };
  public pieChartLabels: Label[] = ['Kitchen', 'Dining Room', 'Living Room', 'Bedroom', 'Toilet'];
  public pieChartData: number[] = this.countData;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(255,0,0,0.5)',
        'rgba(0,255,0,0.5)',
        'rgba(0,0,255,0.8)',
        'rgba(0,122.5,122.5,0.6)',
        'rgba(122.5,0,122.5,0.4)'
      ]
    }
  ];

  private startTimer() {
    this.intervalTimer = setInterval(
      function() {
        this.timer++;
        if (this.timer / 60 == 1) {
          this.timer = 0;
          this.timerMins++;
        }
        if (this.timerMins == 5 && this.timer == 0) {
          this.alertFunction();
        }
      }.bind(this),
      1000
    );
  }

  private alertFunction() {
    alert('No motion has been detected in 5 minutes, the last motion detected was: ' + this.locationMessage);
    this.navCtrl.push(seniorStatus);
  }

  private loadBatteryPage() {
    this.navCtrl.push(BatteryPage, {
      kitchenBat: this.kitchenBat,
      livingBat: this.livingBat,
      diningBat: this.diningBat,
      toiletBat: this.toiletBat,
      bedroomBat: this.bedroomBat
    });
  }

  private resetTimer() {
    this.timer = 0;
    this.timerMins = 0;
  }

  public connect() {
    this.mqttStatus = 'Connecting...';
    this.mqttClient = new Paho.MQTT.Client('barretts.ecs.vuw.ac.nz', 8883, '/mqtt', this.clientId);

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    // connect the client
    console.log('Connecting to mqtt via websocket');
    this.mqttClient.connect({ timeout: 10, useSSL: false, onSuccess: this.onConnect, onFailure: this.onFailure });
  }

  public disconnect() {
    if (this.mqttStatus == 'Connected') {
      clearInterval(this.intervalTimer);
      this.timer = 0;
      this.mqttStatus = 'Disconnecting...';
      this.mqttClient.disconnect();
      this.mqttStatus = 'Disconnected';
    }
  }

  public sendMessage() {
    if (this.mqttStatus == 'Connected') {
      this.mqttClient.publish(this.topic, this.messageToSend);
    }
  }

  public onConnect = () => {
    console.log('Connected');
    this.startTimer();
    this.mqttStatus = 'Connected';
    // subscribe
    this.mqttClient.subscribe(this.topic);
  };

  public onFailure = responseObject => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  };

  public onConnectionLost = responseObject => {
    if (responseObject.errorCode !== 0) {
      this.mqttStatus = 'Disconnected';
    }
  };

  public onMessageArrived = message => {
    this.sensorArray.push(message.payloadString);
    this.message = message.payloadString;
    this.messageCount++;
    if (this.messageCount == 5) {
      console.log('Received message package');
      this.messageCount = 0;
      this.computeMessages();
    }
  };

  public computeMessages = () => {
    var motionDetected = false;
    var lastMotion = '';
    for (var i = this.sensorArray.length - 1; i > this.sensorArray.length - 6; i--) {
      var messageSplit = this.sensorArray[i].split(',');
      var time = messageSplit[0];
      var location = messageSplit[1];
      var motion = messageSplit[2];
      var battery = messageSplit[3];

      if (location == 'bedroom') {
        this.bedroomBat = battery;
        if (motion == 1) {
          this.bedroomCount++;
          lastMotion = 'Bedroom';
          motionDetected = true;
        }
      } else if (location == 'kitchen') {
        this.kitchenBat = battery;
        if (motion == 1) {
          this.kitchenCount++;
          lastMotion = 'Kitchen';
          motionDetected = true;
        }
      } else if (location == 'dining') {
        this.diningBat = battery;
        if (motion == 1) {
          this.diningCount++;
          lastMotion = 'Dining Room';
          motionDetected = true;
        }
      } else if (location == 'toilet') {
        this.toiletBat = battery;
        if (motion == 1) {
          this.toiletCount++;
          lastMotion = 'Bathroom';
          motionDetected = true;
        }
      } else if (location == 'living') {
        this.livingBat = battery;
        if (motion == 1) {
          this.livingCount++;
          lastMotion = 'Living Room';
          motionDetected = true;
        }
      }
    }

    if (motionDetected) {
      this.locationMessage = lastMotion;
      this.resetTimer();
      console.log('Motion detected in ' + location + ' resetting timer & updating last location with movement!');
      this.countData = [this.kitchenCount, this.diningCount, this.livingCount, this.bedroomCount, this.toiletCount];
      this.pieChartData = this.countData;
    }
  };
}
