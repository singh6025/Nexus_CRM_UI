import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

interface SettingsSection {
  title:       string;
  description: string;
  icon:        string;
  route:       string;
}

@Component({
  selector: 'settings-settings-overview-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './settings-overview-page.component.html',
  styleUrl: './settings-overview-page.component.scss',
})
export class SettingsOverviewPageComponent {
  protected readonly sections: SettingsSection[] = [
    {
      title:       'Tenant Configuration',
      description: 'Manage organisation name, timezone, and default settings.',
      icon:        'business',
      route:       '/settings/tenant',
    },
    {
      title:       'Users & Roles',
      description: 'Invite team members, assign roles, and manage access.',
      icon:        'group',
      route:       '/settings/users',
    },
    {
      title:       'Pipeline Stages',
      description: 'Customise opportunity pipeline stages and deal flow.',
      icon:        'account_tree',
      route:       '/settings/pipeline-stages',
    },
  ];
}
