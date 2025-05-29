import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export interface ResponseError {
  statusCode: number;
  message: string;
  messageDetail: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  constructor() {}

  private itineraryIdSubject = new BehaviorSubject<string | null>(null);

  setItineraryId(id: string) {
    this.itineraryIdSubject.next(id);
  }

  getItineraryId(): Observable<string | null> {
    return this.itineraryIdSubject.asObservable();
  }

  getItineraryIdValue(): string | null {
    return this.itineraryIdSubject.getValue();
  }

  private redirectMsgKey = 'redirectLoginMsg';

  setLoginRedirectMessage(msg: string) {
    localStorage.setItem(this.redirectMsgKey, msg);
  }

  getLoginRedirectMessage(): string | null {
    return localStorage.getItem(this.redirectMsgKey);
  }

  clearLoginRedirectMessage() {
    localStorage.removeItem(this.redirectMsgKey);
  }

  async managementToast(
    element: string,
    validRequest: boolean,
    error?: ResponseError,
    customMessage?: string
  ): Promise<void> {
    const toastMsg = document.getElementById(element);
    if (toastMsg) {
      if (validRequest) {
        toastMsg.className = 'show requestOk';
        toastMsg.textContent = customMessage ?? 'El proceso se ha compleatdo con éxito';
        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      } else {
        toastMsg.className = 'show requestKo';
        if (error?.messageDetail) {
          toastMsg.textContent =
            'Se ha producido un error, show logs. Message: ' +
            error?.message +
            '. Message detail: ' +
            error?.messageDetail +
            '. Status code: ' +
            error?.statusCode;
        } else {
          toastMsg.textContent =
            'Se ha producido un error, show logs. Message: ' +
            error?.message +
            '. Status code: ' +
            error?.statusCode;
        }

        await this.wait(2500);
        toastMsg.className = toastMsg.className.replace('show', '');
      }
    }
  }

  errorLog(error: ResponseError): void {
    console.error('path:', error.path);
    console.error('timestamp:', error.timestamp);
    console.error('message:', error.message);
    console.error('messageDetail:', error.messageDetail);
    console.error('statusCode:', error.statusCode);
  }

  async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}