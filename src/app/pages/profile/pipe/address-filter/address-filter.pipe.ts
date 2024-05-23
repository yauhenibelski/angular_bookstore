import { Pipe, PipeTransform } from '@angular/core';
import { Addresses } from 'src/app/interfaces/customer-response-dto';

@Pipe({
    name: 'addressFilter',
    standalone: true,
})
export class AddressFilterPipe implements PipeTransform {
    transform(
        address: Addresses[],
        shippingAddressIds: string[],
        addressType: 'shipping' | 'billing',
    ): Addresses[] | null {
        const filterAddress = address.filter(({ id }) => {
            if (addressType === 'shipping' && shippingAddressIds.includes(id)) {
                return true;
            }

            if (addressType === 'billing' && !shippingAddressIds.includes(id)) {
                return true;
            }

            return false;
        });

        return filterAddress.length ? filterAddress : null;
    }
}
