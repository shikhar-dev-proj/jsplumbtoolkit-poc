import { Component, OnInit } from "@angular/core";
import { BaseNodeComponent } from "@jsplumbtoolkit/browser-ui-angular";

@Component({
    templateUrl: './destination.component.html',
    styleUrls: ['./destination.component.css'],
    selector: 'zap-destination-node'
})
export class DestinationNodeComponent extends BaseNodeComponent implements OnInit {


    ngOnInit(): void {
    }

}