import { Directive, ElementRef, OnDestroy, Host, HostListener,Input } from "@angular/core";

@Directive({
    selector: '[button-trigger]',
    exportAs: "button-trigger"
})

export class ButtonTriggerDirective {

    @Input()
    public changeType="selfactive";//固定激活class为selfactive

    constructor(
        private elementRef: ElementRef) {

    }
    toggle(){
       const element: HTMLElement = this.elementRef.nativeElement;
       let buttons=this.changeType!="selfactive"?element.getElementsByClassName('ant-btn-primary'):element.getElementsByClassName(this.changeType);
       if(buttons[0]){
        this.changeType!="selfactive"?buttons[0].classList.remove(`ant-btn-${this.changeType}`):buttons[0].classList.remove(this.changeType);
        console.log(buttons[0],'buttons');
       }
      
        
    }
}