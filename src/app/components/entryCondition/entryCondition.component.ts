import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BaseNodeComponent } from "@jsplumbtoolkit/browser-ui-angular";

@Component({
    templateUrl: './entryCondition.component.html',
    styleUrls: ['./entryCondition.component.css'],
    selector: 'zap-entry-condition-node'
})
export class EntryConditionNodeComponent extends BaseNodeComponent implements OnInit {

    @Output() addNode = new EventEmitter();

    ngOnInit(): void {
        this.obj.conditions = this.obj.conditions || [];
        this.obj.isTailConnected = this.obj.isTailConnected || false;
    }

    dispatchAddNodeEvent() {
        document.dispatchEvent(new CustomEvent('addNode', { detail: { parentNode: this.getNode() } }));
    }
}