import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { jsPlumbToolkitModule } from '@jsplumbtoolkit/browser-ui-angular'
import { jsPlumbToolkitDragDropModule } from '@jsplumbtoolkit/browser-ui-angular-drop'
import { ROUTING } from './app.routing'
import { DatasetComponent } from './dataset'
import { ControlsComponent } from './controls'

import { FlowchartComponent } from './flowchart'
import { ActionNodeComponent, QuestionNodeComponent, OutputNodeComponent, StartNodeComponent } from './components'

@NgModule({
    imports: [ BrowserModule, jsPlumbToolkitModule, jsPlumbToolkitDragDropModule, ROUTING],
    declarations: [ AppComponent, QuestionNodeComponent, ActionNodeComponent, StartNodeComponent, OutputNodeComponent, DatasetComponent, FlowchartComponent, ControlsComponent ],
    bootstrap: [ AppComponent ],
    entryComponents: [ QuestionNodeComponent, ActionNodeComponent, StartNodeComponent, OutputNodeComponent ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

