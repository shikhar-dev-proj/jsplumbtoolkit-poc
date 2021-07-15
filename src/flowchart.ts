import {Component, ViewChild} from '@angular/core'

import { jsPlumbSurfaceComponent, AngularViewOptions, BrowserUIAngular } from "@jsplumbtoolkit/browser-ui-angular"

import { ActionNodeComponent, QuestionNodeComponent, OutputNodeComponent, StartNodeComponent } from "./components"

import { Surface, EVENT_CANVAS_CLICK, EVENT_CLICK } from "@jsplumbtoolkit/browser-ui"

import {
  Connection,
  BlankEndpoint,
  DEFAULT,
  AnchorLocations,
  LabelOverlay,
  ArrowOverlay
} from "@jsplumb/core"

import {Edge, EVENT_EDGE_ADDED} from "@jsplumbtoolkit/core"

import {EdgePathEditor} from "@jsplumbtoolkit/connector-editors"

import {SpringLayout} from "@jsplumbtoolkit/layout-spring"
import {LassoPlugin} from "@jsplumbtoolkit/browser-ui-plugin-lasso"

import { OrthogonalConnector } from "@jsplumbtoolkit/connector-orthogonal"
import * as OrthogonalConnectorEditor  from "@jsplumbtoolkit/connector-editors-orthogonal"

import {FlowchartService} from "./app/flowchart.service"

OrthogonalConnectorEditor.initialize()

const TARGET = "target"
const SOURCE = "source"
const START = "start"
const SELECTABLE = "selectable"
const CONNECTION = "connection"
const OUTPUT = "output"
const QUESTION = "question"
const ACTION = "action"

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

  toolkit:BrowserUIAngular
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

  getToolkit():BrowserUIAngular {
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
      [START]:{
        component:StartNodeComponent
      },
      [SELECTABLE]: {
        events: {
          tap: (params:any) => {
            this.toggleSelection(params.node);
          }
        }
      },
      [QUESTION]:{
        parent:SELECTABLE,
        component:QuestionNodeComponent
      },
      [OUTPUT]:{
        parent:SELECTABLE,
        component:OutputNodeComponent
      },
      [ACTION]:{
        parent:SELECTABLE,
        component:ActionNodeComponent
      }
    },
    edges: {
      [DEFAULT]: {
        anchor:AnchorLocations.AutoDefault,
        endpoint:BlankEndpoint.type,
        connector: { type:OrthogonalConnector.type, options:{ cornerRadius: 5 } },
        paintStyle: { strokeWidth: 2, stroke: "rgb(132, 172, 179)", outlineWidth: 3, outlineStroke: "transparent" },	//	paint style for this edge type.
        hoverPaintStyle: { strokeWidth: 2, stroke: "rgb(67,67,67)" }, // hover paint style for this edge type.
        events: {
          [EVENT_CLICK]:(p) => {
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
          { type:ArrowOverlay.type, options:{ location: 1, width: 10, length: 10 }}
        ]
      },
      [CONNECTION]:{
        parent:DEFAULT,
        overlays:[
          {
            type: LabelOverlay.type,
            options: {
              label: "${label}",
              events: {
                [EVENT_CLICK]: (params: {edge:Edge}) => {
                  this.editLabel(params.edge);
                }
              }
            }
          }
        ]
      }
    },
    ports: {
      [START]: {
        endpoint: BlankEndpoint.type,
        anchor: AnchorLocations.Continuous,
        uniqueEndpoint: true,
        edgeType: DEFAULT
      },
      [SOURCE]: {
        endpoint: BlankEndpoint.type,
        paintStyle: {fill: "#84acb3"},
        anchor: AnchorLocations.AutoDefault,
        maxConnections: -1,
        edgeType: CONNECTION
      },
      [TARGET]: {
        maxConnections: -1,
        endpoint: BlankEndpoint.type,
        anchor: AnchorLocations.AutoDefault,
        paintStyle: {fill: "#84acb3"},
        isTarget: true
      }
    }
  };

  renderParams = {
    layout:{
      type:SpringLayout.type
    },
    events: {
      [EVENT_EDGE_ADDED]:(params:any) => {
        if (params.addedByMouse) {
          this.editLabel(params.edge)
        }
      },
      [EVENT_CANVAS_CLICK]:(params:any) => {
        this.pathEditor.stopEditing()
      }
    },
    consumeRightClick:false,
    dragOptions: {
      filter: ".jtk-draw-handle, .node-action, .node-action i"
    },
    zoomToFit:true,
    plugins:[
      LassoPlugin.type
    ]
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
