import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'textChange'
})
export class TextChange implements PipeTransform {

    transform(text: string): string {
        if(text){
            return text.replace('_', ' ')
        } return ''
    }

}