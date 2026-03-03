import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drop-down-search',
  templateUrl: './drop-down-search.component.html',
  styleUrls: ['./drop-down-search.component.scss']
})
export class DropDownSearchComponent implements OnInit {

  @Input() dropdowndata: any
  @Output() result = new EventEmitter<any>();

  loading: boolean = true;
  originalData: any;
  selectedList: any;
  setoption: any = [];
  setitem: any = [];
  selectedItem: any;

  constructor() { }

  ngOnInit(): void {
    
    this.check()
  }

  check() {
    if (this.dropdowndata) {
      this.getData()      
    }
  }

  setItem() {

    this.result.emit(this.selectedItem)
  }

  getData() {
    this.loading = false
    
    this.setitem = this.dropdowndata.params

    this.originalData = this.dropdowndata.list
    this.selectedList = this.dropdowndata.list

    let item = this.dropdowndata.value

    if (item) {
      this.selectedItem = this.originalData.find((el:any) => {
        return item == el[this.setitem[0]]
      })
    }
  }

  //To clear the search values
  resetSearch(){
    this.onKey('')
  }

  // Receive user input and send to search method 
  onKey(value: string) {     
    this.selectedList = this.search(value);
  }

  // Filter the states list and send back to populate the selectedStates**
  search(value:any) { 
    let keyWord = value.trim().toLowerCase();
    if(value == ''){
      return this.originalData
    }
    return this.originalData.filter((option:any) => {
      for (let i = 0; i < this.dropdowndata.params.length; i++) {
        if (option[this.dropdowndata.params[i]]) {
          let format = option[this.dropdowndata.params[i]].toLowerCase().includes(keyWord)
          if (format) {
            return format
          }
        }
      }
      

      // if (option.accountname && option.accountno) {
      //   return option.accountname.toLowerCase().includes(keyWord) || option.accountno.toString().toLowerCase().includes(keyWord)        
      // }
    });
  }
}
