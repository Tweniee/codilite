import { ChangeDetectorRef, Component } from '@angular/core';
import { CodeModel } from '../interface/code-model';
import { CommonModule } from '@angular/common';

import { CodeEditorModule } from '@ngstack/code-editor';
import { SocketService } from '../services/socket.service';
import { Observable, Subscription } from 'rxjs';
import { SessionCodeService } from '../services/session-code.service';

@Component({
  selector: 'app-code-box',
  standalone: true,
  imports: [CommonModule, CodeEditorModule],
  templateUrl: './code-box.component.html',
  styleUrl: './code-box.component.css',
})
export class CodeBoxComponent {
  isEdit: boolean = false;
  theme = 'vs-dark';
  finalCompiledOutput = 'Run the code!!';
  mainWrittenCode: string = 'console.log("Abhishek")\n//Welcome';
  roomId: string;
  sockets: Observable<string[]>;
  private _socketSub: Subscription;
  subscription!: Subscription;

  codeModel: CodeModel = {
    language: 'javascript',
    uri: 'main.js',
    value: 'console.log("Abhishek")\n//Welcome',
    // dependencies: ['@types/node', '@ngstack/translate', '@ngstack/code-editor'],
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };
  constructor(
    private socketService: SocketService,
    private service: SessionCodeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('sessionCode') != null) {
      const userSessionCode = sessionStorage.getItem('sessionCode');
      this.getInitialSession(userSessionCode);
    }
    this.connectToSocket();
  }
  connectToSocket() {
    this._socketSub = this.socketService.defaultSockets.subscribe((socket) => {
      if (sessionStorage.getItem('sessionCode') == null) {
        const { userSessionCode } = socket;
        sessionStorage.setItem('sessionCode', userSessionCode);
        this.roomId = userSessionCode;
        this.getInitialSession(userSessionCode);
        this.socketService.connectToSocketRoom(
          this.codeModel.value,
          userSessionCode
        );
      } else {
        const userSessionCode = sessionStorage.getItem('sessionCode');
        this.roomId = userSessionCode;
        this.socketService.connectToSocketRoom(
          this.codeModel.value,
          userSessionCode
        );
      }

      this.getCompiledCodeBySocket();
      this.syncCodeToOtherUsers();
    });
  }
  ngOnDestroy() {
    this._socketSub.unsubscribe();
  }

  onCodeChanged(value: string) {
    this.isEdit = true;
    setTimeout(() => {
      if (this.mainWrittenCode == value) {
        this.isEdit = false;
      }
    }, 2000);
    this.mainWrittenCode = value;
  }
  onCodeFocus(){
    console.log(">>")
  }

  sendCodeToSocketToCompile() {
    this.socketService.emitCodeForCompilation({
      baseCode: this.mainWrittenCode,
      roomId: this.roomId,
    });
  }
  getCompiledCodeBySocket() {
    this.socketService.compiledCodeSocket.subscribe((body) => {
      const { code, output } = body;
      var newCodeModel = {
        language: 'javascript',
        uri: 'main.js',
        value: code,
        // dependencies: ['@types/node', '@ngstack/translate', '@ngstack/code-editor'],
      };
      this.finalCompiledOutput = output;
      this.codeModel = JSON.parse(JSON.stringify(newCodeModel));
    });
  }

  getInitialSession(roomId: string) {
    this.service.getSessionDataService(roomId).subscribe((item: any) => {
      if (typeof item != 'string') {
        const { code, output } = item.body;
        var newCodeModel = {
          language: 'javascript',
          uri: 'main.js',
          value: code,
          // dependencies: ['@types/node', '@ngstack/translate', '@ngstack/code-editor'],
        };
        this.finalCompiledOutput = output;
        this.codeModel = JSON.parse(JSON.stringify(newCodeModel));
        this.cdr.detectChanges();
      }
    });
  }

  syncCodeToOtherUsers() {
    setInterval(() => {
      console.log('>');
      this.sendCodeToSocketToCompile();
    }, 3000);
  }
}
