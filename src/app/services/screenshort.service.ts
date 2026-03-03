import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class ScreenshortService {

  captureReport(element: HTMLElement): Promise<string> {
    return html2canvas(element, { useCORS: true }).then(canvas => {
      return canvas.toDataURL('image/png');
    });
  }
}
