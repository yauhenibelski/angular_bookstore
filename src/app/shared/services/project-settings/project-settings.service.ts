import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectSettings } from 'src/app/shared/services/project-settings/project-settings.interface';

@Injectable({
    providedIn: 'root',
})
export class ProjectSettingsService {
    private readonly projectSettings$ = new BehaviorSubject<ProjectSettings | null>(null);

    get projectSettings(): Observable<ProjectSettings | null> {
        return this.projectSettings$.asObservable();
    }

    set projectSettings(settings: ProjectSettings | null) {
        this.projectSettings$.next(settings);
    }
}
