import flattenRoutes from '@/util/flattenRoutes';
import privateRoutes from './private';
import filterRoutes from '@/util/filterRoutes';
import filterSidebarRoutes from '@/util/filterSidebarRoutes';

// all routes including private
export const routes = [...privateRoutes];

// filtered routes which has read access
export const filteredRoutes = filterRoutes(routes);

// flatten routes which has read access
export const flatRoutes = flattenRoutes(filteredRoutes);

// sidebar routes which has view access only in sidebar
export const sidebarRoutes = filterSidebarRoutes(filteredRoutes);
