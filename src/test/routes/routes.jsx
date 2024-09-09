import flattenRoutes from '@/util/flattenRoutes';
import privateRoutes from './private';

export const routes = [...privateRoutes];

export const flatRoutes = flattenRoutes(routes);
