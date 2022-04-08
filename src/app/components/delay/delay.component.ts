import { Component, OnInit } from "@angular/core";
import { BaseNodeComponent } from "@jsplumbtoolkit/browser-ui-angular";

@Component({
    templateUrl: './delay.component.html',
    styleUrls: ['./delay.component.css'],
    selector: 'zap-delay-node'
})
export class DelayNodeComponent extends BaseNodeComponent implements OnInit {


    ngOnInit(): void {
        this.obj.isTailConnected = this.obj.isTailConnected || false;
    }

    dispatchAddNodeEvent() {
        document.dispatchEvent(new CustomEvent('addNode', { detail: { parentNode: this.getNode() } }));
    }
}