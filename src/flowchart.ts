import {Component, ViewChild} from '@angular/core';

import { jsPlumbSurfaceComponent, AngularViewOptions } from "@jsplumbtoolkit/angular";

import { ActionNodeComponent, QuestionNodeComponent, OutputNodeComponent, StartNodeComponent } from "./components";

import {BrowserUI, Surface} from "@jsplumbtoolkit/browser-ui"
import {Edge, Connection} from "@jsplumbtoolkit/core"
import {EdgePathEditor} from "@jsplumbtoolkit/connector-editors"
import {FlowchartService} from "./app/flowchart.service"

@Component({
  selector: 'jsplumb-flowchart',
  template: `

    <div class="jtk-demo-canvas">
      <jsplumb-surface [surfaceId]="surfaceId" [toolkitId]="toolkitId" [view]="view" [renderParams]="renderParams"></jsplumb-surface>
      <jsplumb-miniview [surfaceId]="surfaceId"></jsplumb-miniview>
      <jsplumb-controls [surfaceId]="surfaceId"></jsplumb-controls>
    </div>

      <div class="jtk-demo-rhs">
        <div class="sidebar node-palette"
             jsplumb-surface-drop
             selector="div"
             surfaceId="flowchartSurface"
             [dataGenerator]="dataGenerator">
          <div *ngFor="let nodeType of nodeTypes" class="sidebar-item" [attr.data-node-type]="nodeType.type" title="Drag to add new" [attr.jtk-width]="nodeType.w" [attr.jtk-height]="nodeType.h">{{nodeType.label}}</div>
        </div>
        <div class="description">
          <p>
            This sample application is a copy of the Flowchart Builder application, using the Toolkit's
            Angular integration components and Angular CLI.
          </p>
          <ul>
            <li>Drag new nodes from the palette on the left onto whitespace to add new disconnected nodes</li>
            <li>Drag new nodes from the palette on the left onto on edge to drop a node between two existing nodes</li>
            <li>Drag from the grey border of any node to any other node to establish a link, then provide a description for the link's label</li>
            <li>Click a link to edit its label.</li>
            <li>Click the 'Pencil' icon to enter 'select' mode, then select several nodes. Click the canvas to exit.</li>
            <li>Click the 'Home' icon to zoom out and see all the nodes.</li>
          </ul>
        </div>
      </div>
    
    
    
    
`
})
export class FlowchartComponent {

  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent:jsPlumbSurfaceComponent;

  toolkit:BrowserUI
  surface:Surface
  pathEditor:EdgePathEditor

  toolkitId:string;
  surfaceId:string;

  nodeTypes = [
    { label: "Question", type: "question", w:120, h:120 },
    { label: "Action", type: "action", w:120, h:120 },
    { label: "Output", type: "output", w:120, h:90 }
  ];

  constructor(private flowchartService:FlowchartService) {
    this.toolkitId = "flowchart";
    this.surfaceId = "flowchartSurface";
  }

  getToolkit():BrowserUI {
    return this.toolkit;
  }

  toggleSelection(node:any) {
    this.toolkit.toggleSelection(node);
  }

  removeEdge(edge:any) {
    this.toolkit.removeEdge(edge);
  }

  editLabel(edge:any) {
    this.flowchartService.showDialog({
      id: "dlgText",
      data: {
        text: edge.data.label || ""
      },
      onOK: (data:any) => {
        this.toolkit.updateEdge(edge, { label:data.text });
      }
    });
  }

  view:AngularViewOptions = {
    nodes:{
      "start":{
        component:StartNodeComponent
      },
      "selectable": {
        events: {
          tap: (params:any) => {
            this.toggleSelection(params.node);
          }
        }
      },
      "question":{
        parent:"selectable",
        component:QuestionNodeComponent
      },
      "output":{
        parent:"selectable",
        component:OutputNodeComponent
      },
      "action":{
        parent:"selectable",
        component:ActionNodeComponent
      }
    },
    edges: {
      "default": {
        anchor:"AutoDefault",
        endpoint:"Blank",
        connector: { type:"Orthogonal", options:{ cornerRadius: 5 } },
        paintStyle: { strokeWidth: 2, stroke: "rgb(132, 172, 179)", outlineWidth: 3, outlineStroke: "transparent" },	//	paint style for this edge type.
        hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
        events: {
          click:(p) => {
            this.pathEditor.startEditing(p.edge, {
              deleteButton:true,
              onMaybeDelete:(edge:Edge, conn:Connection, doDelete:Function) => {
                this.flowchartService.showDialog({
                  id: "dlgConfirm",
                  data: {
                    msg: "Delete Edge"
                  },
                  onOK: doDelete
                });
              }
            });
          }
        },
        overlays: [
          { type:"Arrow", options:{ location: 1, width: 10, length: 10 }}
        ]
      },
      "connection":{
        parent:"default",
        overlays:[
          {
            type: "Label",
            options: {
              label: "${label}",
              events: {
                click: (params: any) => {
                  this.editLabel(params.edge);
                }
              }
            }
          }
        ]
      }
    },
    ports: {
      "start": {
        endpoint: "Blank",
        anchor: "Continuous",
        uniqueEndpoint: true,
        edgeType: "default"
      },
      "source": {
        endpoint: "Blank",
        paintStyle: {fill: "#84acb3"},
        anchor: "AutoDefault",
        maxConnections: -1,
        edgeType: "connection"
      },
      "target": {
        maxConnections: -1,
        endpoint: "Blank",
        anchor: "AutoDefault",
        paintStyle: {fill: "#84acb3"},
        isTarget: true
      }
    }
  };

  renderParams = {
    layout:{
      type:"Spring"
    },
    events: {
      "edge:add":(params:any) => {
        if (params.addedByMouse) {
          this.editLabel(params.edge);
        }
      },
      canvasClick:(params:any) => {
        this.pathEditor.stopEditing()
      }
    },
    consumeRightClick:false,
    dragOptions: {
      filter: ".jtk-draw-handle, .node-action, .node-action i"
    },
    zoomToFit:true
  }

  dataGenerator(el:Element) {
    return {
      type:el.getAttribute("data-node-type"),
      w:parseInt(el.getAttribute("jtk-width"), 10),
      h:parseInt(el.getAttribute("jtk-height"), 10)
    }
  }

  ngAfterViewInit() {
    this.surface = this.surfaceComponent.surface;
    this.toolkit = this.surface.toolkitInstance
    this.pathEditor = new EdgePathEditor(this.surface)

    // new DrawingTools({
    //   renderer: this.surface
    // });
  }

  ngOnDestroy() {
    console.log("flowchart being destroyed");
  }

}
