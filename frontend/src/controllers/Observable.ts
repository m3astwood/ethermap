import type { ReactiveController, ReactiveControllerHost } from 'lit';
import type { Observable, Subscription } from 'rxjs';

export default class ObserveCtrl<T> implements ReactiveController {
  sub: Subscription | null = null;

  constructor(private host: ReactiveControllerHost,
              private source: Observable<T>,
              public value?: T) {
    this.host.addController(this);
  }

  hostConnected() {
    this.sub = this.source.subscribe(value => {
      this.value = value;
      this.host.requestUpdate()
    })
  }

  hostDisconnected() {
    this.sub?.unsubscribe();
  }
}

