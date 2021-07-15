import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core'

import { JsPlumbToolkit } from '@jsplumbtoolkit/core'
import {jsPlumbService } from '@jsplumbtoolkit/browser-ui-angular'
import * as SyntaxHighlighter from '@jsplumb/json-syntax-highlighter'

@Component({
  selector: 'jsplumb-dataset',
  template: '<div class="jtk-demo-dataset"></div>'
})
export class DatasetComponent implements OnInit, AfterViewInit {

  toolkit: JsPlumbToolkit
  updateListener: Function

  @Input() toolkitId: string;

  constructor(private el: ElementRef, private $jsplumb: jsPlumbService) { }

  ngOnInit() {
    this.toolkit = this.$jsplumb.getToolkit('flowchart')
  }

  getNativeElement(component: any) {
    return (component.nativeElement || component._nativeElement || component.location.nativeElement).childNodes[0];
  }

  ngAfterViewInit() {
    SyntaxHighlighter.newInstance(this.toolkit, this.getNativeElement(this.el))
  }
}
