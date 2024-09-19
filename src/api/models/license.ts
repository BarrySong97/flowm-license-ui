export interface License {
  id: string;
  key: string;
  email: string;
  status: string;
  maxDevices: number;
  activatedDevices: number;
  expiresAt: Date | null;
  createdAt: Date;
  macIds: string[];
  updatedAt: Date;
  lastActiveAt: Date | null;
  nowActiveDevices: number;
}
export interface LicenseCreate {
  email: string;
  maxDevices: number;
  expiresAt: number | null;
}
export interface LicenseUpdate {
  maxDevices?: number;
  expiresAt?: number;
  status?: string;
}
export interface LicenseQuery {
  page?: number;
  pageSize?: number;
  status?: string;
  email?: string;
  key?: string;
  expiresAt?: number;
}
