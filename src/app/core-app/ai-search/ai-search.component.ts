import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getMaxListeners } from 'process';
import { AppService } from 'src/app/app.service';
import { BreadcrumbService } from 'src/app/misc/breadcrumb/breadcrumb.service';
import { Socket } from 'ngx-socket-io';
import { MessageUtil } from 'src/app/helpers/messages'
import { generateReport } from 'src/app/model/clientInfo';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WaitlistPopupComponent } from './waitlist-popup/waitlist-popup.component';
import { gptChat } from 'src/app/model/productModel';
import { Clipboard } from '@angular/cdk/clipboard';
import { BarController, BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';

@Component({
  selector: 'app-ai-search',
  templateUrl: './ai-search.component.html',
  styleUrls: ['./ai-search.component.scss'],
})
export class AiSearchComponent implements OnInit {
  loading: boolean = false;

  listFilter: any = [];
  errorList: boolean = false;
  form: FormGroup;
  chatForm: FormGroup;
  showChat: boolean = false;
  name: any;

  chatList: any = [];
  list: any = [];

  basicList: any = [];
  customList: any = []

  totalList: any = []

  queryLoading: boolean = false
  queryError: boolean = false
  dataSet: any;
  store: any;
  isdata: boolean = true;

  loadingTextArray = ['Firing up Natural Language Model...', 'Connecting to Database...', 'Understanding Report Context...', 'Configuring Query/Reponse Semantics...'];
  loadingText: string = '';

  suggestion = [
    { name: "Find the most followed artist and their country" },
    { name: "Retrieve all songs that are playable and longer than 3 minutes" },
    // {name: "Show the total number of tracks in the database from each artist"},
    // {name: "Retrieve the top 5 longest songs in the US top songs"},
    // {name: "find the total number of explicit tracks by each artist who has more than 500000 followers and sort them in ascending order"},
  ]

  finalAnswer: any;
  reportLoading: boolean | undefined;
  newTitle: any;
  canSend: boolean = true;
  copied!: number;
  isNew: boolean = true;
  pageloading: boolean = false;

  constructor(
    private breadcrumb: BreadcrumbService,
    private fb: FormBuilder,
    private clipboard: Clipboard,
    // private socket: Socket,
    private app: AppService,
    private dialog: MatDialog
  ) {
    let history;
    this.breadcrumb.breadcrumbObs$.subscribe((item) => {
      history = item;
    });

    
    this.breadcrumb.updateBreadcrumb({
      parent: 'DataeGPT',
      parentLink: 'ai-search',
      children: [],
    });

    this.form = this.fb.group({
      reportname: ['', Validators.required],
    });
    this.chatForm = this.fb.group({
      message: ['', Validators.required],
    });
    this.name = this.app.helperService.getClientname();
  }

  ngOnInit(): void {
    this.getReportList()
  }

  getReportList() {
    this.reportLoading = true
    let email = this.app.helperService.getActiveid()
    let type = 'null'
    let status = 'null';

    this.app.productService.getBasicReport(type, status)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.reportLoading = false
            this.totalList = res['reports'].filter((e: any) => e.reportPlatform != 'Looker' && e.dbtProcessedName != 'No DBT data' && e.templateUsed != 'N/A')
            this.listFilter = this.totalList
          }
          else {
            this.reportLoading = false
            this.totalList = []
            this.listFilter = []
          }
        },
        error: (err) => {
          this.reportLoading = false
          this.totalList = []
          this.listFilter = []
        }
      })
  }

  getSuggestion(item: any) {
    let message = item.name;
    let final = { id: 'question', reply: message };

    this.chatList.push(final);
    this.chatForm.reset();
  }

  selectReport(report: any) {
    this.form.get('reportname')?.setValue(report)
    this.setTitle()
    this.showChat = true
  }

  setTitle() {
    this.newTitle = this.form.get('reportname')?.value
    this.isNew = true
    this.sendNew()
  }

  setTitleNew() {
    this.newTitle = this.form.get('reportname')?.value
    if(!this.newTitle) return
    this.isNew = true
    this.pageloading = true
    let i = 0;
    this.loadingText = this.loadingTextArray[i]
    setInterval(() => {
      i++
      this.loadingText = this.loadingTextArray[i]
      if (i == 4) i = 0
    }, 5000);

    this.sendNew()
  }

  sendNew() {
    let message = "Can you tell me if I am connected to this report and tell me what it's about and what questions can I ask this report?";
    this.isdata = true

    let payload: gptChat = {
      // dataset_id: this.newTitle.reportdatasetid || '',
      dataset_id: this.getDatasetId(this.newTitle) || '',
      report_id: this.newTitle._id,
      // dataset_id: 'ga4_s1_convz_jamiu_122218_2025217_mag_s1_convz_jamiu_122326_2025217_reporting',
      // dataset_id: 'e5e1fc21-d776-4302-b2bb-94c24219aeca',
      // dataset_id: '70347198-61c2-49db-a0a8-54b840261e93',
      user_prompt: message,
      // workspace_id: this.newTitle.workspaceid,
      user: this.app.helperService.getActiveid(),
      gbq_project: this.app.helperService.getDestinationTitle()
      // workspace_id: '59a75e77-0641-4fba-a74a-60ca875d6b27'
    }

    if (this.isNew) {
      let title = { id: 'title', title: this.newTitle };
      this.chatList.push(title)
      this.isNew = false
    }

    this.chatForm.get('message')?.reset('');

    let final = { id: 'question', reply: message, timestamp: new Date() };
    let reply = { id: 'answer', reply: '', chart: '', loading: true, timestamp: new Date() };

    setTimeout(() => {
      reply.timestamp = new Date()
      this.chatList.push(reply)
      this.goToBottom()
    }, 300);

    this.canSend = false
    this.app.productService.dataeGPTChat(payload)
      .subscribe({
        next: res => {
          this.pageloading = false
          this.showChat = true

          if (res.status) {
            reply.loading = false
            let chart = JSON.parse(res.chart)
            let data = chart.data

            if (data.labels[0] == 'Not Relevant') {
              reply.chart = ''
            } else reply.chart = res.chart

            this.formatType(reply, res.response)
            this.goToBottom()
            this.trackevent('success')
          } else {
            setTimeout(() => {
              reply.loading = false
              this.trackevent('success')
              this.formatType(reply, res.response)
              this.goToBottom()
            }, 1000);
          }
        }, error: err => {
          this.canSend = true
          reply.loading = false
          this.trackevent('failure')
          this.formatType(reply, 'Sorry we are unable to process this at this time');
          this.replaceChat(reply)
        }
      })
  }

  public chart!: Partial<any>;
  displayChart: boolean = false;
  chartLoading: boolean = false;

  showChart(item: any) {
    if (this.chart) {
      this.chart['destroy']();
    }

    this.displayChart = true
    Chart.register(CategoryScale, LinearScale, BarController, BarElement)

    let chart = JSON.parse(item.chart)

    let type = chart.chart_type
    let data = chart.data
    let options = chart.options

    this.chartLoading = true

    setTimeout(() => {
      this.chartLoading = false
      this.chart = new Chart(`canvas`, {
        type: type,
        data: data,
        options: options
      })
    }, 500);
  }

  copy(copy: string, index: number) {
    this.clipboard.copy(copy)
    this.copied = index
    setTimeout(() => {
      this.copied = 0
    }, 2000);
  }

  resetKey(event: any) {
    if (event.shiftKey) {
      return
    }

    if (event.key.toUpperCase() == 'ENTER') {
      this.chatForm.get('message')?.setValue('')
    }
  }

  enter(event: any) {
    if (!this.canSend) {
      return
    }
    if (event.shiftKey) {
      return
    }

    let message = this.chatForm.value.message;
    if (event.key.toUpperCase() == 'ENTER' && message) {
      this.send()
    }
  }

  send() {
    let message = this.chatForm.value.message;
    this.isdata = true

    let payload: gptChat = {
      // dataset_id: this.newTitle.reportdatasetid || '',
      dataset_id: this.getDatasetId(this.newTitle) || '',
      report_id: this.newTitle._id,
      // dataset_id: 'ga4_s1_convz_jamiu_122218_2025217_mag_s1_convz_jamiu_122326_2025217_reporting',
      // dataset_id: 'e5e1fc21-d776-4302-b2bb-94c24219aeca',
      // dataset_id: '70347198-61c2-49db-a0a8-54b840261e93',
      user_prompt: message,
      // workspace_id: this.newTitle.workspaceid,
      user: this.app.helperService.getActiveid(),
      gbq_project: this.app.helperService.getDestinationTitle()
      // workspace_id: '59a75e77-0641-4fba-a74a-60ca875d6b27'
    }

    if (this.isNew) {
      let title = { id: 'title', title: this.newTitle };
      this.chatList.push(title)
      this.isNew = false
    }

    this.chatForm.get('message')?.reset('');

    let final = { id: 'question', reply: message, timestamp: new Date() };
    let reply = { id: 'answer', reply: '', chart: '', loading: true, timestamp: new Date() };
    this.chatList.push(final);

    setTimeout(() => {
      reply.timestamp = new Date()
      this.chatList.push(reply)
      this.goToBottom()
    }, 300);

    this.canSend = false
    this.app.productService.dataeGPTChat(payload)
      .subscribe({
        next: res => {
          if (res.status) {
            reply.loading = false
            let chart = JSON.parse(res.chart)
            let data = chart.data

            if (data.labels[0] == 'Not Relevant') {
              reply.chart = ''
            } else reply.chart = res.chart
            
            this.formatType(reply, res.response)
            this.goToBottom()
            this.trackevent('success')
          } else {
            setTimeout(() => {
              // reply.reply = res.message
              // reply.reply = res.response
              reply.loading = false
              // this.replaceChat(reply)
              this.trackevent('success')
              this.formatType(reply, res.response)
              this.goToBottom()
            }, 1000);
          }
        }, error: err => {
          this.canSend = true
          // reply.reply = 'Sorry we are unable to process this at this time';
          reply.loading = false
          this.trackevent('failure')
          this.formatType(reply, 'Sorry we are unable to process this at this time');
          this.replaceChat(reply)
        }
      })
  }

  trackevent(type: string) {
    if (type == 'success') {
      window.analytics.track('success_alert', {
        username: this.app.helperService.getClientname(),
        datae_user_id: this.app.helperService.getActiveid(),
        plan_type: this.app.helperService.getTrial(),
        user_role: this.app.helperService.getRole(),
        organisation_name: this.app.helperService.getOrg(),
      });
    } else {
      window.analytics.track('failure_alert', {
        username: this.app.helperService.getClientname(),
        datae_user_id: this.app.helperService.getActiveid(),
        plan_type: this.app.helperService.getTrial(),
        user_role: this.app.helperService.getRole(),
        organisation_name: this.app.helperService.getOrg(),
      });
    }
  }

  replaceChat(reply: any) {
    let k = this.chatList.find((cht: any) => {
      if (cht.timestamp == reply.timestamp) {
        cht = reply
      }
    })
    this.chatList.splice(this.chatList.indexOf(k), 1, reply)
  }

  goToBottom() {
    setTimeout(() => {
      let msgboard = document.getElementById("messageboard");
      if (msgboard!.scrollHeight)
        msgboard!.scrollTop = msgboard!.scrollHeight;
    }, 100);
  }

  reset() {
    this.onKey('');
  }

  getInitials(string: any) {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  editPrompt(item: any) {
    let temp = {
      message: item,
    };
    this.chatForm.patchValue(temp);
  }

  getBasicList() {
    this.loading = true
    let user = this.app.helperService.getActiveid()
    this.app.productService.getBasicConnector()
      .subscribe({
        next: (res) => {
          if (res['status']) {
            this.basicList = res['connectors'].filter((item: any) => item.status === 'connected');

            this.getCustomConnector()
          } else {
            this.loading = false
            this.errorList = true
            this.basicList = []
          }
        },
        error: (err) => {
          this.loading = false
          this.errorList = true
          this.basicList = []
        }
      })
  }

  getCustomConnector() {
    let user = this.app.helperService.getActiveid()
    let status = 'Connected'
    let service = null
    let date = null
    let schema = ''
    this.app.productService.getCustomConnector(user, service, status, date, schema)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loading = false
            this.customList = res['connectors']

            this.totalList = [...this.basicList, ...this.customList]

            this.listFilter = this.totalList
          }
          else {
            this.loading = false
            this.customList = []
            this.errorList = true
            this.app.snackBar.open(res['message'], 'Dismiss', {
              duration: MessageUtil.TIMEOUT_DURATION,
              panelClass: ['custom-snackbar']
            })
          }
        },
        error: (err) => {
          this.loading = false
          this.customList = []
          this.errorList = true
          this.app.snackBar.open('Error', 'Dismiss', {
            duration: MessageUtil.TIMEOUT_DURATION,
            panelClass: ['custom-snackbar']
          })
        }
      })
  }


  onKey(value: string) {
    this.totalList = this.search(value);
  }
  search(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.listFilter;
    }
    return this.listFilter.filter((option: any) => {
      if (option.reportname) {
        return option.reportname.toString().toLowerCase().includes(keyWord);
      }
    });
  }

  tryitout() {
    this.showChat = true;
  }

  // query() {
  //   this.store = this.form.value.connectorname
  //   if(this.store.serviceOfConnector == 'Google Analytics' || this.store.serviceOfConnector == 'Google Analytics 4' || this.store.serviceOfConnector == 'Magento'){
  //     this.dataSet = this.store.nameOfConnector
  //     this.showChat = true;
  //   }else{
  //     this.queryLoading = true
  //     let payload = new generateReport
  //     payload.connector = this.store.nameOfConnector
  //     payload.project = "datahub-convz"
  //     let temp = this.store.serviceOfConnector ? this.store.serviceOfConnector.toLowerCase()+"_api" : this.store.fivetranFilter[0].service.toLowerCase()
  //     payload.source = temp

  //     this.app.productService.generateReports(payload)
  //     .subscribe({
  //       next: (res) => {
  //         if(res){
  //           this.queryLoading = false

  //           this.dataSet = this.store.nameOfConnector + "_intermediate"
  //           this.showChat = true;
  //         }else{
  //           this.queryLoading = false
  //           this.queryError = true

  //           this.app.snackBar.open('Error.', 'Dismiss', {
  //             duration: MessageUtil.TIMEOUT_DURATION,
  //             panelClass: ['custom-snackbar']
  //           })
  //         }
  //       },
  //       error: (err) => {
  //         this.queryLoading = true
  //         this.queryError = false
  //         this.app.snackBar.open(err, 'Dismiss', {
  //           duration: MessageUtil.TIMEOUT_DURATION,
  //           panelClass: ['custom-snackbar']
  //         })
  //       }
  //     })
  //   }
  // }

  getDatasetId(report: any) {
    switch (report.templateUsed.toLowerCase()) {
      case 'asana':
        return report.dbtProcessedName + '_intermediate';
      case 'adjust':
        return report.dbtProcessedName + '_intermediate';
      case 'intraday':
        return report.dbtProcessedName + '_reporting';
      case 'ecommerce marketing':
        return report.dbtProcessedName + '_reporting';
      case 'ad source':
        return report.dbtProcessedName + '_ad_reporting';
      default:
        return report.dbtProcessedName + '_reporting';
    }
  }

  clear() {
    this.chatList = [];
    this.chatForm.reset();
  }
  back() {
    this.showChat = false;
  }

  joinWaitlist() {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.width = '30vw'
    this.dialog.open(WaitlistPopupComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        // if(res === 'Success'){
        //   this.getCustomConnector()
        //   this.dynamicIndex = 2
        // }
      })

  }

  currentIndex: number = 0;
  typingSpeed: number = 5;
  returnText: string = '';
  mainText: string = '';
  chat: any;

  formatType(chat: any, text: any) {
    this.returnText = ''
    this.currentIndex = 0

    this.chat = chat
    this.mainText = text
    this.type()
  }

  type() {
    if (this.currentIndex < this.mainText.length) {
      this.returnText += this.mainText.charAt(this.currentIndex);
      this.currentIndex++;
      setTimeout(() => this.type(), this.typingSpeed);
    } else {
      this.canSend = true
    }
    this.returnText = this.formatBoldText(this.returnText)
    this.chat.reply = this.returnText
    this.replaceChat(this.chat)
    this.goToBottom()
  }

  formatBoldText(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}
