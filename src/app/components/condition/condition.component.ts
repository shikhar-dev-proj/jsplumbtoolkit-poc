import { Component, OnInit } from "@angular/core";
import { BaseNodeComponent } from "@jsplumbtoolkit/browser-ui-angular";

@Component({
    templateUrl: './condition.component.html',
    styleUrls: ['./condition.component.css'],
    selector: 'zap-condition-node'
})
export class ConditionNodeComponent extends BaseNodeComponent implements OnInit {


    ngOnInit(): void {
        this.obj.isTailConnected = this.obj.isTailConnected || false;
    }

    dispatchAddNodeEvent() {
        document.dispatchEvent(new CustomEvent('addNode', { detail: { parentNode: this.getNode() } }));
    }
}