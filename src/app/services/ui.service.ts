import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface alertModal {
    type?: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO', //Type of Alert
    message?: string, //message header of alert
    details?: string, //details of the alert
    action?: string, //action key tied to that alert
    duration?: number, //duration of alert in ms
}

@Injectable({
    providedIn: 'root'
})
export class UiService {
    drawerStatus = new BehaviorSubject<boolean>(true);
    $drawerStatus = this.drawerStatus.asObservable();

    closeSide = new BehaviorSubject<boolean>(false);
    $closeSide = this.closeSide.asObservable()

    alertStatus = new BehaviorSubject<alertModal>({});
    $alertStatus = this.alertStatus.asObservable();

    alertButton = new BehaviorSubject<string>('');
    $alertButton = this.alertButton.asObservable();


    switchRoute = new BehaviorSubject<boolean>(false)
    $switchRoute = this.switchRoute.asObservable()

    setSwitch(val: boolean) {
        this.switchRoute.next(val)
    }

    setCloseSide(val: boolean) {
        this.closeSide.next(val)
    }

    setDrawerStatus(val: boolean) {
        this.drawerStatus.next(val)
    }

    clickAlertButton(val: string) {
        this.alertButton.next(val)
    }

    setAlertStatus(val: alertModal) {
        this.alertStatus.next(val)
    }

    setPrimaryColor(color: string) {
        const primaryColor = `--primary-color: ${color}`;
        document.documentElement.style.setProperty('--primary-color', color);
    }
}