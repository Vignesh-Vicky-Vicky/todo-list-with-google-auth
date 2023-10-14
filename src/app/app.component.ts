import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  enableLoader: boolean = false;

  constructor(private loader: LoaderService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loader.loaderState.subscribe((res: boolean) => {
      this.enableLoader = res;
      this.cdr.detectChanges();
    })
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
