import { Component, OnInit } from "@angular/core";
import { BaseNodeComponent } from "@jsplumbtoolkit/browser-ui-angular";

@Component({
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  selector: 'zap-start-node'
})
export class CustomStartNodeComponent extends BaseNodeComponent implements OnInit {

  ngOnInit(): void {
    // this.modelObject['left'] = '200px';
    // this.modelObject['top'] = '200px';
  }
}