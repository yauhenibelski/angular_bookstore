import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoaderService {
    private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);

    isLoading$ = this.isLoadingSubject.asObservable();

    showLoader(): void {
        if (!this.isLoadingSubject.value) {
            this.isLoadingSubject.next(true);
        }
    }

    hideLoader(): void {
        if (this.isLoadingSubject.value) {
            setTimeout(() => this.isLoadingSubject.next(false), 500);
        }
    }
}
