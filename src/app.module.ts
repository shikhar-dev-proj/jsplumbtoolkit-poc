import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AppComponent } from './app.component'
import { jsPlumbToolkitModule } from '@jsplumbtoolkit/browser-ui-angular'
import { jsPlumbToolkitDragDropModule } from '@jsplumbtoolkit/browser-ui-angular-drop'
import { ControlsComponent } from './controls'

import { FlowchartComponent } from './flowchart'
import { ActionNodeComponent, QuestionNodeComponent, OutputNodeComponent, StartNodeComponent } from './components'
import { CustomStartNodeComponent } from './app/components/start/start.component'
import { EntryConditionNodeComponent } from './app/components/entryCondition/entryCondition.component'
import { DelayNodeComponent } from './app/components/delay/delay.component'
import { MultiBranchSplitNodeComponent } from './app/components/multibranchsplit/multibranchsplit.component'
import { ConditionNodeComponent } from './app/components/condition/condition.component'
import { DestinationNodeComponent } from './app/components/destination/destination.component'

@NgModule({
    imports: [ BrowserModule, jsPlumbToolkitModule, jsPlumbToolkitDragDropModule],
    declarations: [ 
        AppComponent,
        QuestionNodeComponent,
        ActionNodeComponent,
        StartNodeComponent,
        OutputNodeComponent,
        FlowchartComponent,
        ControlsComponent,
        CustomStartNodeComponent,
        EntryConditionNodeComponent,
        DelayNodeComponent,
        MultiBranchSplitNodeComponent,
        ConditionNodeComponent,
        DestinationNodeComponent
    ],
    bootstrap: [ AppComponent ],
    entryComponents: [
        QuestionNodeComponent,
        ActionNodeComponent,
        StartNodeComponent,
        OutputNodeComponent,
        CustomStartNodeComponent,
        EntryConditionNodeComponent,
        DelayNodeComponent,
        MultiBranchSplitNodeComponent,
        ConditionNodeComponent,
        DestinationNodeComponent
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }

