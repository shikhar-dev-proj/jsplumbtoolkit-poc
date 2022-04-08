import {AfterViewInit, Component, ViewChild} from '@angular/core'

import { jsPlumbSurfaceComponent, AngularViewOptions, BrowserUIAngular } from '@jsplumbtoolkit/browser-ui-angular'

import { ActionNodeComponent, QuestionNodeComponent, OutputNodeComponent, StartNodeComponent } from './components'

import {
  Surface,
  EVENT_CANVAS_CLICK,
  EVENT_CLICK,
  Connection,
  BlankEndpoint,
  LabelOverlay,
  ArrowOverlay,
  DEFAULT,
  AnchorLocations
} from '@jsplumbtoolkit/browser-ui'


import {Edge, Vertex} from '@jsplumbtoolkit/core'

import {EdgePathEditor} from '@jsplumbtoolkit/connector-editors'

import {SpringLayout} from '@jsplumbtoolkit/layout-spring'
import {LassoPlugin} from '@jsplumbtoolkit/browser-ui-plugin-lasso'
import {DrawingToolsPlugin} from '@jsplumbtoolkit/browser-ui-plugin-drawing-tools'

import { OrthogonalConnector } from '@jsplumbtoolkit/connector-orthogonal'
import * as OrthogonalConnectorEditor from '@jsplumbtoolkit/connector-editors-orthogonal'

import {FlowchartService} from './app/flowchart.service'
import { CustomStartNodeComponent } from './app/components/start/start.component'
import { EntryConditionNodeComponent } from './app/components/entryCondition/entryCondition.component'
import { HierarchyLayout } from '@jsplumbtoolkit/layout-hierarchy'
import { DelayNodeComponent } from './app/components/delay/delay.component'
import { HierarchicalLayout } from '@jsplumbtoolkit/layout-hierarchical'
import { MultiBranchSplitNodeComponent } from './app/components/multibranchsplit/multibranchsplit.component'
import { ConditionNodeComponent } from './app/components/condition/condition.component'
import { DestinationNodeComponent } from './app/components/destination/destination.component'

// // initialize the orthogonal connector editor. This registers it on the Surface.
OrthogonalConnectorEditor.initialize()

const TARGET = 'target'
const SOURCE = 'source'
const START = 'start'
const SELECTABLE = 'selectable'
const RESPONSE = 'response'
const OUTPUT = 'output'
const QUESTION = 'question'
const ACTION = 'action'


@Component({
  selector: 'app-flowchart',
  template: `

    <div class="jtk-demo-canvas">
      <jsplumb-surface [surfaceId]="surfaceId" [toolkitId]="toolkitId" [view]="view" [renderParams]="renderParams"></jsplumb-surface>
      <jsplumb-controls [surfaceId]="surfaceId"></jsplumb-controls>
    </div>

      <div class="jtk-demo-rhs">
        <div class="sidebar node-palette">
          <button class="btn" (click)="saveWorkflow()">SAVE</button>
        </div>
      </div>
  `
})
export class FlowchartComponent implements AfterViewInit {

  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;

  toolkit: BrowserUIAngular
  surface: Surface
  pathEditor: EdgePathEditor

  toolkitId: string;
  surfaceId: string;

  nodeTypes = [
    { label: 'Question', type: 'question', w: 240, h: 220 },
    { label: 'Action', type: 'action', w: 240, h: 160 },
    { label: 'Output', type: 'output', w: 240, h: 160 }
  ]

  view: AngularViewOptions = {
    nodes: {
      [START]: {
        component: StartNodeComponent,
      },
      'customstart': {
        component: CustomStartNodeComponent,
      },
      'entrycondition': {
        component: EntryConditionNodeComponent,
        // parent: SELECTABLE,
        events: {
          click: (params: {obj: Vertex}) => {
            console.log('entry condition node clicked ... : ', params);
            this.fillEntryConditions(params);
          }
        }
      },
      'delay': {
        component: DelayNodeComponent
      },
      'multibranchsplit': {
        component: MultiBranchSplitNodeComponent
      },
      'condition': {
        component: ConditionNodeComponent
      },
      'destination': {
        component: DestinationNodeComponent
      },
      [SELECTABLE]: {
        events: {
          tap: (params: {obj: Vertex}) => {
            this.toggleSelection(params.obj)
          }
        }
      },
      [QUESTION]: {
        parent: SELECTABLE,
        component: QuestionNodeComponent
      },
      [OUTPUT]: {
        parent: SELECTABLE,
        component: OutputNodeComponent
      },
      [ACTION]: {
        parent: SELECTABLE,
        component: ActionNodeComponent
      }
    },
    edges: {
      [DEFAULT]: {
        anchor: ['Top', 'Bottom'],
        endpoint: BlankEndpoint.type,
        connector: { type: OrthogonalConnector.type, options: { cornerRadius: 5, stub: 25 } },
        paintStyle: { strokeWidth: 2, stroke: 'rgb(132, 172, 179)', outlineWidth: 3, outlineStroke: 'transparent' },
        hoverPaintStyle: { strokeWidth: 2, stroke: 'rgb(67,67,67)' }, // hover paint style for this edge type.
        events: {
          [EVENT_CLICK]: (p: {edge: Edge}) => {
            this.pathEditor.startEditing(p.edge, {
              deleteButton: true,
              onMaybeDelete: (edge: Edge, conn: Connection, doDelete: Function) => {
                this.flowchartService.showDialog({
                  id: 'dlgConfirm',
                  data: {
                    msg: 'Delete Edge'
                  },
                  onOK: doDelete
                });
              }
            });
          }
        },
      },
      [RESPONSE]: {
        parent: DEFAULT,
        overlays: [
          {
            type: LabelOverlay.type,
            options: {
              label: '${label}',
              events: {
                [EVENT_CLICK]: (params: {edge: Edge}) => {
                  this.editLabel(params.edge)
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
        paintStyle: {fill: '#84acb3'},
        anchor: AnchorLocations.AutoDefault,
        maxConnections: -1,
        edgeType: RESPONSE
      },
      [TARGET]: {
        maxConnections: -1,
        endpoint: BlankEndpoint.type,
        anchor: AnchorLocations.AutoDefault,
        paintStyle: {fill: '#84acb3'},
        isTarget: true
      }
    }
  }

  renderParams = {
    elementsDraggable: false,
    layout: {
      type: HierarchicalLayout.type,
      options: {
        // axis: 'vertical',
        // placementStrategy: 'center',
        align: 'center',
        orientation: 'horizontal',
        // spacing: 'auto',
        // magnetize: true
      }
    },
    refreshLayoutOnEdgeConnect:true,
    events: {
      [EVENT_CANVAS_CLICK]: (params: any) => {
        this.pathEditor.stopEditing()
      }
    },
    consumeRightClick: false,
    dragOptions: {
      filter: '.jtk-draw-handle, .node-action, .node-action i'
    },
    zoomToFit: true,
    plugins: [
      LassoPlugin.type,
      DrawingToolsPlugin.type
    ],
    grid: {
      size: {
        w: 20,
        h: 20
      }
    },
    magnetize: {
      afterDrag: true
    }
  }

  constructor(private flowchartService: FlowchartService) {
    this.toolkitId = 'flowchart';
    this.surfaceId = 'flowchartSurface';
  }

  fillEntryConditions(params) {
    // params = { ...params, obj: { ...params.obj, conditions: ['Performed an Event', 'User attribute'] } }
    this.toolkit.updateNode(params.obj.id, { ...params.obj.data, conditions: ['Performed an Event', 'User attribute']})
  }

  getToolkit(): BrowserUIAngular {
    return this.toolkit;
  }

  toggleSelection(obj: Vertex) {
    this.toolkit.toggleSelection(obj)
  }

  removeEdge(edge: any) {
    this.toolkit.removeEdge(edge);
  }

  editLabel(edge: Edge) {
    this.flowchartService.showEdgeLabelDialog(edge.data, (data: any) => {
      this.toolkit.updateEdge(edge, { label: data.label });
    }, () => null)
  }

  dataGenerator(el: Element) {
    return {
      type: el.getAttribute('data-node-type'),
      w: parseInt(el.getAttribute('data-width'), 10),
      h: parseInt(el.getAttribute('data-height'), 10)
    }
  }

  ngAfterViewInit() {
    this.surface = this.surfaceComponent.surface;
    this.toolkit = this.surface.toolkitInstance
    this.pathEditor = new EdgePathEditor(this.surface)
  }

  saveWorkflow() {
    debugger
    console.log('JSON Data for the workflow .... : ', this.toolkit.exportData());
  }

}
