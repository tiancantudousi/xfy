import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';''
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  ws: WebSocket;
  constructor() {};
  // 返回一个可观测的流，包括服务器返回的消息
  createObservableSocket(url: string): Observable<any> {
    this.ws = new WebSocket(url);
    return new Observable(
      observer => {
        this.ws.onmessage = (event) => observer.next(event.data);
        this.ws.onerror = (event) => observer.error(event);
        this.ws.onclose = (event) => observer.complete();}
      )
  }
  // 向服务器端发送消息
  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }
}