import flattenRoutes from '@/util/flattenRoutes';
import privateRoutes from './private';
import publicRoutes from './public';

export const routes = [...publicRoutes, ...privateRoutes];

export const flatRoutes = flattenRoutes(routes);
