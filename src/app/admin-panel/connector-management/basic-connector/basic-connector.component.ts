import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from 'src/app/app.service';
import { DeleteConnectorComponent } from '../delete-connector/delete-connector.component';

@Component({
  selector: 'app-basic-connector',
  templateUrl: './basic-connector.component.html',
  styleUrls: ['./basic-connector.component.scss']
})
export class BasicConnectorComponent implements OnInit {
  filter: FormGroup

  connectorListBasic: any;
  coonectorErrorBasic: boolean = false;
  loadingBasic: boolean = false;

  reportBasicCount = 1;

  orgList: any = []
  orgListFilter: any = []
  orgError: boolean = false
  orgloading: boolean = false

  searchKeyBasic: string = '';

  displayedColumnsBasic: string[] = [
    'select',
    'name',
    'org',
    'service',
    'identifier',
    'status',
    'createdby',
    'createdat',
    'action'
  ];
  listDataBasic: MatTableDataSource<any> | any;

  @ViewChild(MatPaginator) paginator: any;

  basicError: boolean = false;

  selectionBasic = new SelectionModel<Element>(true, []);

  reportCountBasic = 1;
  isNextBasic: any;

  constructor(private app: AppService, private fb: FormBuilder, private dialog: MatDialog) {
    this.filter = this.fb.group({
      org: [""]
    });
  }

  ngOnInit(): void {
    this.getBasicConnector();
    this.getOrg()
  }

  getBasicConnector() {
    this.loadingBasic = true;
    this.app.productService
      .getConnectors('basic', this.reportCountBasic)
      .subscribe({
        next: (res) => {
          if (res['status'] === true) {
            this.loadingBasic = false;
            this.basicError = false;
            this.connectorListBasic = res['data'].connectors;
            this.isNextBasic = res['data'].isLastPage;

            this.listDataBasic = new MatTableDataSource(
              this.connectorListBasic
            );
            this.listDataBasic.paginator = this.paginator;
          } else {
            this.loadingBasic = false;
            this.basicError = true;
            this.connectorListBasic = [];
          }
        },
        error: (err) => {
          this.loadingBasic = false;
          this.basicError = true;
          this.connectorListBasic = [];
        },
      });
  }

  filterConector(){
    this.loadingBasic = true
    let type = "basic"
    let client = this.filter.value.org

    this.app.productService.filterConnectorList(type, this.reportCountBasic,client)
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.loadingBasic = false
          this.basicError = false
          this.connectorListBasic = res['connectors'] ? res['connectors'] : res['data'].connectors
          this.isNextBasic = res['connectors'] ? "" : res['data'].isLastPage

          this.filter.reset()

          this.listDataBasic = new MatTableDataSource(this.connectorListBasic)
          this.listDataBasic.paginator = this.paginator
        }else {
          this.loadingBasic = false
          this.basicError = true
          this.connectorListBasic = []
        }
      },
      error: (err) => {
        this.loadingBasic = true
        this.basicError = true 
        this.connectorListBasic = []
      }
    })
  }

  getInitials(string:any) {
    var names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
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


  applyFiltersBasic() {
    this.listDataBasic.filter = this.searchKeyBasic.trim().toLowerCase();
  }

  masterToggleBasic() {
    this.isAllSelectedBasic()
      ? this.selectionBasic.clear()
      : this.listDataBasic.data.forEach((element: any) =>
          this.selectionBasic.select(element)
        );
  }

  truncateSentence(sentence: string, length: number): string {
    if (sentence.length <= length) {
      return sentence;
    } else {
      return sentence.substring(0, length) + '...';
    }
  }

  isAllSelectedBasic() {
    const numSelected = this.selectionBasic.selected.length;
    const numRows = this.listDataBasic.data.length;
    return numSelected === numRows;
  }
  checkSelectedBasic(row: any) {
    return this.selectionBasic.isSelected(row);
  }
  toggleRowBasic(row: any) {
    this.selectionBasic.isSelected(row)
      ? this.selectionBasic.deselect(row)
      : this.selectionBasic.select(row);
  }


  nextReportBasic() {
    this.reportCountBasic = this.reportCountBasic + 1;
    this.getBasicConnector();
  }
  previousReportBasic() {
    this.reportCountBasic = this.reportCountBasic - 1;
    this.getBasicConnector();
  }

  delete(row: any) {
    let dialogConfig = new MatDialogConfig()

    dialogConfig.panelClass = 'dialog-container'
    dialogConfig.height = 'auto'
    dialogConfig.data = row

    this.dialog.open(DeleteConnectorComponent, dialogConfig)
      .afterClosed().subscribe(res => {
        if (res === 'deleted') {
          this.getBasicConnector()
        }
      })
  }

}
