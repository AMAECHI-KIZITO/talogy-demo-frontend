import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { updateDestPayload } from 'src/app/model/productModel';
import { alertModal } from 'src/app/services/ui.service';

@Component({
  selector: 'app-destination-setup',
  templateUrl: './destination-setup.component.html',
  styleUrls: ['./destination-setup.component.scss']
})
export class DestinationSetupComponent implements OnInit {

  form: FormGroup
  loading: boolean = false
  error: boolean = false

  showSuccess: boolean = false;

  successmsg: any;

  destinationLoading: boolean = false
  destinationError: boolean = false
  destListFilter : any = []

  destList : any = []
  
  destListSet : any = []

  customList: any = []
  customListFilter : any = []

  regionList: any = []
  regionListFilter : any = []

  constructor(private fb: FormBuilder, private dialog: MatDialogRef<DestinationSetupComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedRow : any,
    private app: AppService, private dialog1: MatDialog) {

    this.form = this.fb.group({
      'dest': [this.selectedRow.destinationChoices.destination._id, Validators.required],
      'region': [this.selectedRow.destinationChoices.region._id, Validators.required],
    })
   }

  ngOnInit(): void {

    this.getAllDest()

  }

  submit(){
    this.loading = true
    let payload = new updateDestPayload

    payload.destinationRegion = this.form.value.region
    payload.mappedDestination = this.form.value.dest
    payload.organizationId = this.selectedRow.organizationId

  

    this.app.productService.updateOrgDestination(payload)
    .subscribe({
      next: (res) => {
        if(res['status'] == true){
          this.loading = false
          // this.showSuccess = true
          this.successmsg = res['message']
          this.successDialog(this.successmsg)
          this.closeSuccess()
        }
        else {
          this.loading = false
          this.error = true
          this.errorDialog(res['message'])
        }
      },
      error: (err) => {
        this.loading = false
        this.error = true
        this.errorDialog(err)
      }
    })
  }


  getAllDest(){
    this.destinationLoading = true
    this.app.productService.getAllDestination()
    .subscribe({
      next: (res) => {
        if(res['status'] === true){
          this.destinationLoading = false
          this.destinationError = false
          this.destListSet = res['data']

          this.destList = this.destListSet.destinations
          this.destListFilter = this.destList

          this.regionList = this.destListSet.custConnectorRegions
          this.regionListFilter = this.regionList


        }else{
          this.destinationLoading = false
          this.destinationError = true
          this.destList = []
          this.regionList = []
        }
      },
      error: (err) => {
        this.destinationLoading = false
        this.destinationError = true 
        this.destList = []
        this.regionList = []
      }
    })
    

   
  }

  reset() {
    this.onKeyDest('')
    this.onKeyRegion('')
  }

  onKeyDest(value: string) {
    this.destList = this.searchDest(value);

  }

  searchDest(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.destListFilter
    }
    return this.destListFilter.filter((option: any) => {
      if (option.title) {
        return option.title.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }


  onKeyRegion(value: string) {
    this.regionList = this.searchRegion(value);

  }

  searchRegion(value: any) {
    let keyWord = value.trim().toLowerCase();
    if (value == '') {
      return this.regionListFilter
    }
    return this.regionListFilter.filter((option: any) => {
      if (option.regionDescription) {
        return option.regionDescription.toString().toLowerCase().startsWith(keyWord)
      }
    });
  }


  close(){
    this.dialog.close()
  }

  closeSuccess(){
    this.dialog.close('success')
  }

  successDialog(item: any){
    let alert: alertModal = {
      details: item,
      message: 'Process Completed',
      type: 'SUCCESS',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }

  errorDialog(item:any){
    let alert: alertModal = {
      details: item,
      message: 'Process Failed',
      type: 'ERROR',
      duration: 10000
    }
    this.app.ui.setAlertStatus(alert)
  }

}
