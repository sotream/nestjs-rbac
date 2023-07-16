import { SetMetadata } from '@nestjs/common';

import { KIND } from '../constants';

export type PermissionType = { [key in KIND]: string[] };

export const RBACPermissions = (data: PermissionType) => {
  return SetMetadata('RBACPermissions', data);
};
