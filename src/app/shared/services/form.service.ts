import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor() { }

  chartForm() {
    return new FormGroup({
      title: new FormControl<string>("", {
        validators: Validators.required
      }),
      description: new FormControl<string>("", {
        validators: Validators.required
      }),
      
    });
  }
}
