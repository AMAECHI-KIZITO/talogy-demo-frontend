import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { DeleteConnectorComponent } from '../delete-connector/delete-connector.component';

@Component({
  selector: 'app-custom-connector',
  templateUrl: './custom-connector.component.html',
  styleUrls: ['./custom-connector.component.scss']
})
export class CustomConnectorComponent implements OnInit {
  connectorListCustom: any;
  coonectorErrorCustom: boolean = false
  loadingCustom: boolean = false

  filter: FormGroup

  reportCustomCount = 1
  searchKeyCustom: string = '';

  customError: boolean = false;

  myInnerHeight = window.innerHeight - 301;

  displayedColumnsCustom: string[] = ['select','name','org','service','identifier','status','createdby','createdat', 'action'];
  listDataCustom: MatTableDataSource<any> | any;

  selectionCustom = new SelectionModel<Element>(true, []);

  reportCountCustom = 1
  isNextCustom : any;
  orgList: any = []
  orgListFilter: any = []
  orgError: boolean = false
  orgloading: boolean = false
  @ViewChild(MatPaginator) paginator : any;
  

  constructor(private app: AppService, private fb: FormBuilder, private dialog: MatDialog) {
    this.filter = this.fb.group({
      org: [""]
    });
   }

  ngOnInit(): void {
    this.getCustomConnector()
    this.getOrg()
  }

  getCustomConnector(){

    this.loadingCustom = true
    this.app.productService.getConnectors("custom", this.reportCountCustom)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.loadingCustom = false
          this.customError = false
          this.connectorListCustom = res['data'].connectors
          this.isNextCustom = res['data'].isLastPage

          this.listDataCustom = new MatTableDataSource(this.connectorListCustom)
          this.listDataCustom.paginator = this.paginator
        }else{
          this.loadingCustom = false
          this.customError = true
          this.connectorListCustom = []
        }
      },
      error: (err) => {
        this.loadingCustom = false
        this.customError = true 
        this.connectorListCustom = []
      }
    })
  }

  filterConector(){
    this.loadingCustom = true
    let type = "custom"
    let client = this.filter.value.org

    this.app.productService.filterConnectorList(type, this.reportCountCustom,client)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.loadingCustom = false
          this.customError = false
          this.connectorListCustom = res['connectors'] ? res['connectors'] : res['data'].connectors
          this.isNextCustom = res['connectors'] ? "" : res['data'].isLastPage

          this.filter.reset()

          this.listDataCustom = new MatTableDataSource(this.connectorListCustom)
          this.listDataCustom.paginator = this.paginator
        }else {
          this.loadingCustom = false
          this.customError = true
          this.connectorListCustom = []
        }
      },
      error: (err) => {
        this.loadingCustom = true
        this.customError = true 
        this.connectorListCustom = []
      }
    })
  }

  getOrg(){
    this.orgloading = true
    this.app.productService.getOrganisation()
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.orgloading = false
          this.orgError = false
          this.orgList = res['organizations']
          this.orgListFilter = this.orgList
        }else{
          this.orgloading = false
          this.orgError = true
          this.orgList = []
        }
      },
      error: (err) => {
        this.orgloading = false
        this.orgError = true 
        this.orgList = []
      }
    })
    

   
  }
  reset() {
    this.onKeyOrg('')
  }

  onKeyOrg(value: string) {
    this.orgList = this.searchOrg(value);

  }

  searchOrg(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.orgListFilter
    }
    return this.orgListFilter.filter((option: any) => {
      if (option.organizationName) {
        return option.organizationName.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }


  truncateSentence(sentence: string, length: number): string {
    if (sentence.length <= length) {
      return sentence;
    } else {
      return sentence.substring(0, length) + '...';
    }
  }


  applyFiltersCustom(){
    this.listDataCustom.filter = this.searchKeyCustom.trim().toLowerCase()
  }

  masterToggleCustom() {
    this.isAllSelectedCustom() ?
      this.selectionCustom.clear() :
      this.listDataCustom.data.forEach((element:any) => this.selectionCustom.select(element));
  }

  isAllSelectedCustom() {
    const numSelected = this.selectionCustom.selected.length;
    const numRows = this.listDataCustom.data.length;
    return numSelected === numRows;

  }
  checkSelectedCustom(row:any) {
    return this.selectionCustom.isSelected(row)
  }
  toggleRowCustom(row:any) {
    this.selectionCustom.isSelected(row) ? this.selectionCustom.deselect(row) : this.selectionCustom.select(row)
  }

  nextReportCustom(){
    this.reportCountCustom = this.reportCountCustom + 1
    this.getCustomConnector()
  }
  previousReportCustom(){
    this.reportCountCustom = this.reportCountCustom - 1
    this.getCustomConnector()
  }

  getInitials(string:any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  }

  delete(row: any) {
    let dialogConfig = new MatDialogConfig()

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.data = row

    this.dialog.open(DeleteConnectorComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res === 'deleted') {
          this.getCustomConnector()
        }
      })
  }

}
