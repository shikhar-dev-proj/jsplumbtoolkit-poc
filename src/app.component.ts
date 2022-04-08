import { AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core'

import { FlowchartComponent } from './flowchart';

import { BrowserUIAngular, jsPlumbService } from '@jsplumbtoolkit/browser-ui-angular'
import { uuid } from '@jsplumbtoolkit/core'
import { FlowchartService } from './app/flowchart.service'
import { StartNodeComponent } from './components';
import { CustomStartNodeComponent } from './app/components/start/start.component';

@Component({
  selector: 'app-demo',
  template: `
          <app-flowchart></app-flowchart>
    `
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild(FlowchartComponent) flowchart: FlowchartComponent;

  toolkitId: string
  toolkit: BrowserUIAngular

  toolkitParams: any = {
    nodeFactory: (type: string, data: any, callback: Function, abort?: Function) => {
      this.flowchartService.showDialog({
        id: 'dlgText',
        title: 'Enter ' + type + ' name:',
        onOK: (d: any) => {
          data.text = d.text;
          // if the user entered a name...
          if (data.text) {
            // and it was at least 2 chars
            if (data.text.length >= 2) {
              // set an id and continue.
              data.id = uuid()
              callback(data);
            } else {
              // else advise the user.
              alert(type + ' names must be at least 2 characters!');
            }
          }
          // else...do not proceed.
        }
      });
    },
    beforeStartConnect: (node: any, edgeType: string) => {
      return { label: '...' };
    },
    edgeFactory: (type: string, data: any, continueCallback: Function, abortCallback: Function) => {
      this.flowchartService.showEdgeLabelDialog(data, continueCallback, abortCallback)
    }
  }

  constructor(
    private $jsplumb: jsPlumbService,
    private elementRef: ElementRef,
    private flowchartService: FlowchartService
    ) {
    this.toolkitId = this.elementRef.nativeElement.getAttribute('toolkitId');
  }

  ngOnInit() {
    this.toolkit = this.$jsplumb.getToolkit(
      this.toolkitId, {
        ...this.toolkitParams,
        autoSave: true,
        onAutoSaveSuccess: (response) => {
          console.log('Workflow .... : ', response);
        },
        onAfterAutoSave: (response) => {
          console.log('Workflow .... : ', response);
        }
      }
    );
  }

  ngAfterViewInit() {
    // this.toolkit.load({ url: 'assets/copyright.json' });
    const startNode = this.toolkit.addNode({
      type: 'customstart',

    });
    const entryConditionNode = this.toolkit.addNode({
      type: 'entrycondition'
    });
    this.toolkit.connect({
      source: startNode,
      target: entryConditionNode,
      directed: false,
      geometry: 'Vertical'
    });

    this.$jsplumb.getSurface('flowchartSurface', (surface) => surface.centerOnHorizontally(startNode));


    document.addEventListener('addNode', (event: CustomEvent) => {
      const parentNode = event.detail.parentNode;
      if (parentNode.type === 'entrycondition') {
        const delayNode = this.toolkit.addNode({type: 'delay'});
        this.toolkit.connect({
          source: parentNode,
          target: delayNode
        });
        this.toolkit.updateNode(parentNode.id, { ...parentNode.obj, isTailConnected: true });
        // this.relayout();
      } else if (parentNode.type === 'delay') {
        const multibranchSplitNode = this.toolkit.addNode({type: 'multibranchsplit'});
        this.toolkit.connect({
          source: parentNode,
          target: multibranchSplitNode
        });
        this.toolkit.updateNode(parentNode.id, { ...parentNode.obj, isTailConnected: true });
        const firstSplitNode = this.toolkit.addNode({type: 'condition', conditions: ['High Value']});
        const secondSplitNode = this.toolkit.addNode({type: 'condition', conditions: ['Medium Value']});
        const thirdSplitNode = this.toolkit.addNode({type: 'condition', conditions: ['Low Value']});

        this.toolkit.connect({
          source: multibranchSplitNode,
          target: firstSplitNode
        })

        this.toolkit.connect({
          source: multibranchSplitNode,
          target: secondSplitNode
        })

        this.toolkit.connect({
          source: multibranchSplitNode,
          target: thirdSplitNode
        })
      } else if (parentNode.type === 'condition') {
        const destinationNode = this.toolkit.addNode({ type: 'destination', destinations: ['Facebook']});
        this.toolkit.connect({
          source: parentNode,
          target: destinationNode
        });
        this.toolkit.updateNode(parentNode.id, { ...parentNode.obj, isTailConnected: true });
      }
    })
  }

  relayout() {
    this.$jsplumb.getSurface('flowchartSurface', (surface) => surface.relayout());
  }

}
