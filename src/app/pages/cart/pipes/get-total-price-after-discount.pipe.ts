import { Pipe, PipeTransform } from '@angular/core';
import { Cart } from 'src/app/shared/services/cart/cart.interface';

@Pipe({
    name: 'getTotalPriceAfterDiscount',
    standalone: true,
})
export class GetTotalPriceAfterDiscountPipe implements PipeTransform {
    transform(cart: Cart | null): number {
        if (!cart) {
            return 0;
        }

        const discountOnTotalPrice = Number(cart.discountOnTotalPrice?.discountedAmount.centAmount);
        const discountedAmount = Number(cart.totalPrice.centAmount);

        return discountOnTotalPrice + discountedAmount;
    }
}
