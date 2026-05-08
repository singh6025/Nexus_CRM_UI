export type UserRole   = 'admin' | 'manager' | 'agent' | 'viewer';
export type UserStatus = 'active' | 'invited' | 'disabled';

export interface AppUser {
  id:        string;
  name:      string;
  email:     string;
  role:      UserRole;
  status:    UserStatus;
  createdAt: string;
}

export interface InviteUserRequest {
  name:  string;
  email: string;
  role:  UserRole;
}

export interface PipelineStage {
  id:    string;
  name:  string;
  order: number;
  color: string;
  isWon:  boolean;
  isLost: boolean;
}

export interface CreateStageRequest {
  name:   string;
  color:  string;
  isWon:  boolean;
  isLost: boolean;
}

export interface TenantConfig {
  tenantId:              string;
  name:                  string;
  domain:                string;
  timezone:              string;
  currency:              string;
  defaultLeadAssigneeId: string;
}

export const ROLE_CONFIG: Record<UserRole, { label: string; variant: string }> = {
  admin:   { label: 'Admin',   variant: 'danger'  },
  manager: { label: 'Manager', variant: 'warning' },
  agent:   { label: 'Agent',   variant: 'info'    },
  viewer:  { label: 'Viewer',  variant: 'neutral' },
};

export const STATUS_CONFIG: Record<UserStatus, { label: string; variant: string }> = {
  active:   { label: 'Active',   variant: 'success' },
  invited:  { label: 'Invited',  variant: 'info'    },
  disabled: { label: 'Disabled', variant: 'neutral' },
};
