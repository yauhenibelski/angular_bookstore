import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { HostApiService } from '../services/host-api/host-api.service';

@Injectable()
export class CheckUniqueEmail implements AsyncValidator {
    private readonly hostService = inject(HostApiService);

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.hostService.checkUserByEmail(control.value).pipe(
            switchMap(() => of({ validate: 'user with such email already exists' })),
            catchError(() => of(null)),
        );
    }
}
