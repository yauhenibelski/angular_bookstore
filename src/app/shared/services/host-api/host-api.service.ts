import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProjectSettings } from 'src/app/interfaces/project-settings';
import { HOST_URL } from '../../url-tokens';
import { ProjectSettingsService } from '../project-settings/project-settings.service';

@Injectable({
    providedIn: 'root',
})
export class HostApiService {
    private accessToken: string | null = null;
    private readonly httpClient = inject(HttpClient);
    private readonly hostUrl = inject(HOST_URL);
    private readonly projectSettingsService = inject(ProjectSettingsService);

    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    setProjectSettings(): void {
        this.httpClient
            .get<ProjectSettings>(this.hostUrl.url, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
            })
            .subscribe(settings => {
                const { envProjectSettings$ } = this.projectSettingsService;

                envProjectSettings$.next(settings);
            });
    }
}
