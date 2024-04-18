import { Component } from '@angular/core';
import { CodeModel } from '../interface/code-model';
import { CommonModule } from '@angular/common';

import { CodeEditorModule } from '@ngstack/code-editor';
@Component({
  selector: 'app-code-box',
  standalone: true,
  imports: [CommonModule, CodeEditorModule],
  templateUrl: './code-box.component.html',
  styleUrl: './code-box.component.css',
})
export class CodeBoxComponent {
  theme = 'vs-dark';

  codeModel: CodeModel = {
    language: 'javascript',
    uri: 'main.js',
    value: '',
    // dependencies: ['@types/node', '@ngstack/translate', '@ngstack/code-editor'],
  };

  options = {
    contextmenu: true,
    minimap: {
      enabled: true,
    },
  };

  onCodeChanged(value: string) {
    console.log('CODE', value);
  }
}
