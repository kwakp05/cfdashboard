import { Directive, ElementRef, Input } from '@angular/core';

declare var Plotly: any;

@Directive({
  selector: '[appGraph]'
})
export class GraphDirective {
  @Input("appGraph")
  get dataLayout(): any {
    return this._dataLayout;
  }
  set dataLayout(newDataLayout: any) {
    this._dataLayout = newDataLayout;

    if (this._dataLayout && this._dataLayout.data && this._dataLayout.layout)
      setTimeout(() => Plotly.newPlot(this.el.nativeElement, this._dataLayout.data, this._dataLayout.layout), 0);
    else
      setTimeout(() => Plotly.purge(this.el.nativeElement));
  }
  private _dataLayout: any;
  /**
   *  {
   *    data: ...,
   *    layout: ...
   *  }
   */

  constructor(
    private el: ElementRef
  ) { }

}
