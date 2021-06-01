import {Component, ElementRef, ViewChild} from '@angular/core';

import {FlowchartComponent } from "./flowchart";
import {DatasetComponent } from "./dataset";

import { jsPlumbService } from "@jsplumbtoolkit/angular"
import {BrowserUI} from "@jsplumbtoolkit/browser-ui"
import { uuid } from "@jsplumb/util"
import {FlowchartService} from "./app/flowchart.service"

@Component({
    selector: 'jsplumb-demo',
    template:`       
          <nav>
              <a routerLink="/home" style="cursor:pointer;" routerLinkActive="active">Flowchart</a>
              <a routerLink="/data" style="cursor:pointer;" routerLinkActive="active">Dataset</a>
          </nav>
          <router-outlet></router-outlet>      
    `
})
export class AppComponent {

  @ViewChild(FlowchartComponent) flowchart:FlowchartComponent;
  @ViewChild(DatasetComponent) dataset:DatasetComponent;

  toolkitId:string
  toolkit:BrowserUI

  constructor(private $jsplumb:jsPlumbService, private elementRef:ElementRef, private flowchartService:FlowchartService) {
    this.toolkitId = this.elementRef.nativeElement.getAttribute("toolkitId");
  }

  ngOnInit() {
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams)
  }

  ngAfterViewInit() {
    this.toolkit.load({ url:"data/copyright.json" });
  }

  toolkitParams:any = {
    nodeFactory:(type:string, data:any, callback:Function) => {
      this.flowchartService.showDialog({
        id: "dlgText",
        title: "Enter " + type + " name:",
        onOK: (d:any) => {
          data.text = d.text;
          // if the user entered a name...
          if (data.text) {
            // and it was at least 2 chars
            if (data.text.length >= 2) {
              // set an id and continue.
              data.id = uuid()
              callback(data);
            }
            else
            // else advise the user.
              alert(type + " names must be at least 2 characters!");
          }
          // else...do not proceed.
        }
      });
    },
    beforeStartConnect:(node:any, edgeType:string) => {
      return { label:"..." };
    }
  }

}
