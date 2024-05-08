import { ProjectSettings } from 'src/app/interfaces/project-settings';

export interface Environment {
    projectSettings: ProjectSettings;
    clientSecret: string;
    clientId: string;
    getAccessToken: () => string;
}
