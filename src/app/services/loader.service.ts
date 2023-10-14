import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  loaderState = new Subject<boolean>()
  constructor() { }

  open() {
    this.loaderState.next(true);
  }

  close() {
    this.loaderState.next(false);
  }
}
