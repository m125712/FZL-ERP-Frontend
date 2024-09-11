import flattenRoutes from '@/util/flattenRoutes';
import privateRoutes from './private';
import filterRoutes from '@/util/filterRoutes';
import filterSidebarRoutes from '@/util/filterSidebarRoutes';

// all private routes
export const allPrivateRoutes = [...privateRoutes];

// filtered routes which has read access
export const filteredRoutes = filterRoutes(privateRoutes);

// flatten routes which has read access
export const flatRoutes = flattenRoutes(filteredRoutes);

// sidebar routes which has view access only in sidebar
export const sidebarRoutes = filterSidebarRoutes(filteredRoutes);
