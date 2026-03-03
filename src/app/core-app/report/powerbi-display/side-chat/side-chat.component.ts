import { Clipboard } from '@angular/cdk/clipboard';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { gptChat } from 'src/app/model/productModel';

@Component({
  selector: 'app-side-chat',
  templateUrl: './side-chat.component.html',
  styleUrls: ['./side-chat.component.scss']
})
export class SideChatComponent implements OnInit {
  @Input() reportData: any;
  @Input() open: string = '';
  @Input() chatLists: any = [];
  @Output() saveList = new EventEmitter<any>();

  message = new FormControl('', Validators.required)
  canSend: boolean = true;
  show: boolean = false;
  name: any;

  chatList: any = [];
  list: any = [];
  copied!: number;
  firstReply: any;

  constructor(private app: AppService, private clipboard: Clipboard) {
    this.name = this.app.helperService.getClientname();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.show = true
      this.firstReply = { id: 'answer', reply: '', loading: true, timestamp: new Date() };
      this.chatList.push(this.firstReply)
    }, 500);

    if (this.chatLists.length) {
      this.chatList = this.chatLists
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (simpleChanges['open']?.currentValue) {
      if (this.firstReply) {
        this.firstReply.loading = false
        this.formatType(this.firstReply, simpleChanges['open']?.currentValue)
      }
    }
  }

  enter(event: any) {
    if (!this.canSend) {
      return
    }
    if (event.shiftKey) {
      return
    }

    let message = this.message.value;
    if (event.key.toUpperCase() == 'ENTER' && message) {
      this.send()
    }
  }

  send() {
    let message = this.message.value;

    let payload: gptChat = {
      dataset_id: this.getDatasetId(this.reportData) || '',
      report_id: this.reportData._id,
      user_prompt: message || '',
      user: this.app.helperService.getActiveid(),
      gbq_project: this.app.helperService.getDestinationTitle()
    }

    this.message.reset('');

    let final = { id: 'question', reply: message, timestamp: new Date() };
    let reply = { id: 'answer', reply: '', loading: true, timestamp: new Date() };
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
          this.canSend = true
          if (res.status) {
            // reply.reply = res.message
            // reply.reply = res.response
            reply.loading = false
            // this.replaceChat(reply)
            this.formatType(reply, res.response)
            this.goToBottom()
            this.trackevent('success')
          } else {
            setTimeout(() => {
              // reply.reply = res.message
              // reply.reply = res.response
              reply.loading = false
              // this.replaceChat(reply)
              this.formatType(reply, res.response)
              this.goToBottom()
              this.trackevent('success')
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
    this.saveList.emit(this.chatList)
  }

  goToBottom() {
    setTimeout(() => {
      let msgboard = document.getElementById("messageboard");
      msgboard!.scrollTop = msgboard!.scrollHeight;
    }, 100);
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
      this.message.setValue('')
    }
  }

  getInitials(string: any) {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  currentIndex: number = 0;
  typingSpeed: number = 10;
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
    this.chat.reply = this.returnText
    this.replaceChat(this.chat)
    this.goToBottom()
  }

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
}
