import { Injectable } from '@angular/core';
import {newInstance as newDialogInstance, Dialogs} from '@jsplumbtoolkit/dialogs'
import {jsPlumbService, BrowserUIAngular} from '@jsplumbtoolkit/browser-ui-angular'

@Injectable({
  providedIn: 'root'
})
export class FlowchartService {

  private TOOLKIT_ID = 'flowchart'
  private dialogs: Dialogs
  private _toolkit: BrowserUIAngular

  constructor(private $jsplumb: jsPlumbService) {
    this.dialogs = newDialogInstance({
      dialogs: {
        dlgText: [
          '<input type="text" size="50" jtk-focus jtk-att="text" value="${text}" jtk-commit="true"/>',
          'Enter Text',
          true

        ],
        dlgConfirm: [
          '${msg}',
          'Please Confirm',
          true
        ],
        dlgMessage: [
          '${msg}',
          'Message',
          false
        ]
      }
    })
  }

  showDialog(options: any) {
    this.dialogs.show(options)
  }

  showEdgeLabelDialog(data: any, callback: Function, abort: Function) {
    this.showDialog({
      id: 'dlgText',
      data: {
        text: data.label || ''
      },
      onOK: (d: any) => {
        callback({label: d.text || ''})
      },
      onCancel: abort
    })
  }

  get toolkit(): BrowserUIAngular {
    if (this._toolkit == null) {
      this._toolkit = this.$jsplumb.getToolkit(this.TOOLKIT_ID);
    }
    return this._toolkit
  }
}
