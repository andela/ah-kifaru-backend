import express from 'express';
import {
  adminCheck,
  superAdminCheck
} from '../middleware/permission.middleware';

import authMiddleware from '../middleware/auth.middleware';

import {
  AdminAccessController,
  SuperAdminAccessController
} from '../controllers/permission.controller';

const permissionRoute = express.Router();

permissionRoute.get(
  '/users',
  authMiddleware,
  adminCheck,
  AdminAccessController
);

permissionRoute.delete(
  '/users/:id',
  authMiddleware,
  superAdminCheck,
  SuperAdminAccessController
);

export default permissionRoute;
