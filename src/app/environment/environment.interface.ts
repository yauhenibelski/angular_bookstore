import { ProjectSettings } from 'src/app/interfaces/project-settings';

export interface Environment {
    projectSettings: ProjectSettings | null;
    clientSecret: string;
    clientId: string;
}
