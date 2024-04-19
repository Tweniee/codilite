import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  defaultSockets = this.socket.fromEvent<{ userSessionCode: string }>('demo');
  compiledCodeSocket: Observable<{ code: string; output: string }> =
    this.socket.fromEvent<{ code: string; output: string }>('output');
  initialSessionDetails: Observable<
    | {
        initialCode: string;
        initialCodeOutput: string;
      }
    | string
  > = this.socket.fromEvent<
    | {
        initialCode: string;
        initialCodeOutput: string;
      }
    | string
  >('initialSessionDetails');
  constructor(private socket: Socket) {}

  connectToSocketRoom(defaultCode: string, id: string) {
    this.socket.emit('joinRoom', { roomId: id, defaultCode });
  }

  emitCodeForCompilation({
    baseCode,
    roomId,
  }: {
    baseCode: string;
    roomId: string;
  }) {
    this.socket.emit('baseCode', { baseCode, roomId });
  }

  private docId() {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
