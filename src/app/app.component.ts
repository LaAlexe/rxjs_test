import { Component, OnInit } from '@angular/core';
import { of, from, fromEvent, timer, combineLatest } from 'rxjs';
import { map, mergeMap, tap, pluck, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  firstNameObs$ = of('User1');
  lastNameObs$ = of('User2');
  obs$ = of(1, 2, 3, 4, 5);
  data = [{id:1, value:'one'}, {id:2, value:'two'}, {id:3, value:'three'}];

  ngOnInit() {
    this.tapOperator();
    this.mergemapOperator();
  }

  private tapOperator() {
    this.obs$.pipe(
      tap(val => console.log(`BEFORE MAP: ${val}`)),
      map(val => val + 10),
      tap(val => console.log(`AFTER MAP: ${val}`))
    ).subscribe({
    next: (val) => console.log(val),
    });
  }

  private mergemapOperator() {
    this.firstNameObs$.pipe(
      mergeMap((event1: string) => this.lastNameObs$.pipe(map(event2 => event1+' '+event2)))
    ).subscribe((value) => console.log(value));
  }

  private mapAndPluckOperators() {
    const obsPluck$ = from(this.data).pipe(
      pluck('value')
    ).subscribe(x => console.log(x));
    
    const obsMap$ = from(this.data).pipe(
      map(data => data.value)
    ).subscribe(x => console.log(x));
  }

  private debounceTimeOperator() {
    const input = document.querySelector('input') as HTMLInputElement;
    const obs$ = fromEvent(input, 'input');

    obs$.pipe(
      //@ts-ignore
    map((event: Event) => event.target.value),
    debounceTime(1000),
    distinctUntilChanged())
    .subscribe({
      next: (value) => console.log(value),
    });
  }


  private catchErrorOperator() {
    const defaultRejectedPromise = () => new Promise((resolve, reject) => reject('defaultRejectedPromise!'));

    const sourceObs$ = from(defaultRejectedPromise());
    sourceObs$.pipe(catchError(error => of(`Bad Promise: ${error}`)))
    .subscribe({
      next: (value) => console.log(value),
    })}


    private combineLatestOperator() {
      //timerOne emits first value at 1s, then once every 4s
      const timerOne$ = timer(1000, 4000);
      //timerTwo emits first value at 2s, then once every 4s
      const timerTwo$ = timer(2000, 4000);
      //timerThree emits first value at 3s, then once every 4s
      const timerThree$ = timer(3000, 4000);
      //when one timer emits, emit the latest values from each timer as an array
      combineLatest([timerOne$, timerTwo$, timerThree$]).subscribe({
        next: (items) => {
          console.log(
          `Timer One Latest: ${items[0]},
          Timer Two Latest: ${items[1]},
          Timer Three Latest: ${items[2]}`
          );
        },
      });
    }

}
