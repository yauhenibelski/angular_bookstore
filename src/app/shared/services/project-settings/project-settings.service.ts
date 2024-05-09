import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProjectSettings } from 'src/app/interfaces/project-settings';

@Injectable({
    providedIn: 'root',
})
export class ProjectSettingsService {
    readonly envProjectSettings$ = new BehaviorSubject<ProjectSettings | null>(null);

    get projectSettings$(): Observable<ProjectSettings | null> {
        return this.envProjectSettings$.asObservable();
    }
}
