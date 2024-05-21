import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

    readonly isLoading$ = this.isLoadingSubject.asObservable();

    private urlCount = 0;

    showLoader(): void {
        this.urlCount++;

        if (!this.isLoadingSubject.value) {
            this.isLoadingSubject.next(true);
        }
    }

    hideLoader(): void {
        this.urlCount--;

        if (this.urlCount <= 0) {
            this.urlCount = 0;
            setTimeout(() => this.isLoadingSubject.next(false), 500);
        }
    }
}
