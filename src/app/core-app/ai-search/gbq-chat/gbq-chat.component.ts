import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GbqPopComponent } from '../gbq-pop/gbq-pop.component';
import { gbqChat } from 'src/app/model/productModel';

@Component({
  selector: 'app-gbq-chat',
  templateUrl: './gbq-chat.component.html',
  styleUrls: ['./gbq-chat.component.scss']
})
export class GbqChatComponent implements OnInit {

  pageloading: boolean = false;
  loadingTextArray = ['Firing up Natural Language Model...', 'Connecting to Database...', 'Understanding Report Context...', 'Configuring Query/Reponse Semantics...'];
  loadingText: string = '';
  showChat: boolean = false;
  form: FormGroup;
  chatForm: FormGroup;
  totalList: any[] = []
  listFilter: any[] = []
  isdata: boolean = true;
  canSend: boolean = true;
  chatList: any[] = [];
  name: any;
  copied!: number;
  datasetID: string = '';
  serviceToken: string = '';

  constructor(
    private fb: FormBuilder,
    private app: AppService,
    private clipboard: Clipboard,
    private dialog: MatDialog,
  ) {
    this.form = this.fb.group({
      reportname: ['', Validators.required],
    });
    this.chatForm = this.fb.group({
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.name = this.app.helperService.getClientname();
    this.callGBQ()
  }

  callGBQ() {
    let dialogConfig = new MatDialogConfig()
    dialogConfig.disableClose = true
    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.width = '30vw'
    this.dialog.open(GbqPopComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res) {
          this.totalList = res.datasets
          this.listFilter = res.datasets
          this.serviceToken = res.token
        }
      })
  }

  setTitleNew() {
    this.showChat = true
    this.datasetID = this.form.value.reportname
    let title = { id: 'title', title: this.datasetID };
  }

  setTitle() {
    this.datasetID = this.form.get('reportname')?.value
  }

  clear() {
    this.chatList = [];
    this.chatForm.reset();
  }

  back() {
    this.showChat = false;
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

    let payload: gbqChat = {
      dataset_id: this.datasetID,
      user: this.app.helperService.getActiveid(),
      user_prompt: message,
      key: JSON.parse(this.serviceToken)
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
    let token = JSON.stringify(this.serviceToken.replace(/\s+/g, ''))
    this.app.productService.dataeGBQChat(payload).subscribe({
      next: res => {
        reply.loading = false
        this.formatType(reply, res.response)
        this.goToBottom()
      }, error: err => {
        this.canSend = true
        // reply.reply = 'Sorry we are unable to process this at this time';
        reply.loading = false
        this.formatType(reply, 'Sorry we are unable to process this at this time');
        this.replaceChat(reply)
      }
    })
  }

  copy(copy: string, index: number) {
    this.clipboard.copy(copy)
    this.copied = index
    setTimeout(() => {
      this.copied = 0
    }, 2000);
  }

  getInitials(string: any) {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  reset() {
    this.onKey('');
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
      if (option) {
        return option.toString().toLowerCase().includes(keyWord);
      }
    });
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
}
