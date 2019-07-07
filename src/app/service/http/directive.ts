import { Directive, ElementRef, ContentChild, Output, EventEmitter, Input, Host, HostListener } from "@angular/core";
import { ButtonTriggerDirective } from "./directive2";

@Directive({
  selector: '[btntoggle]',
  exportAs: 'btntoggle'
})

export class btntoggleDirective {


  
  @Output()
  public btnTypeChange = new EventEmitter<string>();

  constructor(@Host() public btntoggle: ButtonTriggerDirective,private elementRef: ElementRef) { }

@HostListener("click")
  change() {
    const element: HTMLElement = this.elementRef.nativeElement;
    this.btntoggle.toggle();
    console.log(this.btntoggle.changeType,'this.btntoggle.changeType');
    if(this.btntoggle.changeType!='selfactive'){
      element.classList.add('ant-btn');
      element.classList.add(`ant-btn-${this.btntoggle.changeType}`);
    }
    else{
      element.classList.add(`${this.btntoggle.changeType}`);
    }
    
 

    this.btnTypeChange.emit("change");
   
   }





}