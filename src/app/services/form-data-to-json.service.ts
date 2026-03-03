import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataToJsonService {

  formDataToJson(formData: FormData): string {
    const jsonPayload: any = {};

    formData.forEach((value, key) => {
      // Check if the key already exists in the jsonPayload
      if (jsonPayload[key]) {
        // If it exists, convert the value to an array
        if (!Array.isArray(jsonPayload[key])) {
          jsonPayload[key] = [jsonPayload[key]];
        }
        // Add the new value to the array
        jsonPayload[key].push(value);
      } else {
        // If the key doesn't exist, simply set the value
        jsonPayload[key] = value;
      }
    });

    return jsonPayload;
  }
}
