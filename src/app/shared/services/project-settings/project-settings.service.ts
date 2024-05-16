import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectSettings } from 'src/app/shared/services/project-settings/project-settings.interface';

@Injectable({
    providedIn: 'root',
})
export class ProjectSettingsService {
    private readonly projectSettingsSubject = new BehaviorSubject<ProjectSettings | null>(null);

    get projectSettings$() {
        return this.projectSettingsSubject.asObservable();
    }

    get projectSettings() {
        return this.projectSettingsSubject.value;
    }

    setProjectSettings(settings: ProjectSettings | null) {
        this.projectSettingsSubject.next(settings);
    }
}
