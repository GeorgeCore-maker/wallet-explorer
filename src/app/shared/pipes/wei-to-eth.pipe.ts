import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weiToEth',
  standalone: true
})
export class WeiToEthPipe implements PipeTransform {
  transform(value: string | number, decimals: string | number = 18, decimalsToShow: number = 4): string {
    const d = Number(decimals) || 18;
    return (Number(value) / Math.pow(10, d)).toFixed(decimalsToShow);
  }
}
