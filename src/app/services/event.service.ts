// global-click-listener.service.ts

import { Injectable, HostListener } from '@angular/core';

declare global {
  interface Window {
    analytics: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent): void {
    // Get the target element that was clicked
    const target = event.target as HTMLElement;

    // Check if the clicked element is a button or has a specific class
    if (
      target.tagName === 'BUTTON' ||
      target.classList.contains('trackable-button')
    ) {
      
      this.handleButtonClick(target);
    }
  }

  private handleButtonClick(button: HTMLElement): void {
    const buttonName = button.innerText || 'Unknown Button';

    // Use the track method to send button click events

    if (window.location.hostname === 'localhost') {
      ""
    }else {
      window.analytics.track('create_connector_start', {
        connector_name: 'connector_name variable',
        connector_type: 'connector_type variable',
        user_id: 'user_id variable',
        device_id: 'device_id variable',
      });
    }
  }
}
