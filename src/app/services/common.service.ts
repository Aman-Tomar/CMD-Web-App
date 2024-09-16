import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // This makes the service available application-wide
})
export class CommonService {
  constructor() { }

  detectMimeTypeAndPrepend(base64: string): string {
    let mimeType = '';

    // Check the first characters of the base64 string to determine the image type
    if (base64.startsWith('/9j/')) {
      mimeType = 'image/jpeg';
    } else if (base64.startsWith('iVBORw')) {
      mimeType = 'image/png';
    } else if (base64.startsWith('R0lGOD')) {
      mimeType = 'image/gif';
    } else {
      mimeType = 'image/*'; // Use a generic type if unknown
    }

    // Return the complete base64 string with the correct MIME type
    return `data:${mimeType};base64,${base64}`;
  }
}
