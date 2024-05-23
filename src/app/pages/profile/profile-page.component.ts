import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { CustomerService } from 'src/app/shared/services/customer/customer.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideNativeDateAdapter } from '@angular/material/core';
import { getCountryByCode } from '../registration/utils/get-country-by-code';
import { AddressFilterPipe } from './pipe/address-filter/address-filter.pipe';

@UntilDestroy()
@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        AsyncPipe,
        MatExpansionModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        AddressFilterPipe,
    ],
    providers: [provideNativeDateAdapter()],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
    private readonly formBuilder = inject(FormBuilder);
    private readonly customerService = inject(CustomerService);

    readonly customer$ = this.customerService.customer$;

    getCountryByCode = getCountryByCode; // todo: replace to pipe

    form = this.formBuilder.nonNullable.group({
        address: this.formBuilder.array([]),
    });

    ngOnInit(): void {
        this.updateAddress();
    }

    updateAddress(): void {
        // this.address$.pipe(untilDestroyed(this)).subscribe(addresses => {
        //     const mapAddresses = [...addresses].map(
        //         ({ city, country, postalCode, streetName }) => ({
        //             country: getCountryByCode(country),
        //             city,
        //             postalCode,
        //             streetName,
        //         }),
        //     );
        // const addressesForm = this.formBuilder.array(mapAddresses);
        // this.form.setControl('address', addressesForm);
        // });
    }
}
