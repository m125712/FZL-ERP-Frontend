import filterRoutes from '@/util/filterRoutes';
import filterSidebarRoutes from '@/util/filterSidebarRoutes';
import flattenRoutes from '@/util/flattenRoutes';

import privateRoutes from './private';

//* all private routes
export const allPrivateRoutes = privateRoutes;
export const allFlatRoutes = flattenRoutes(allPrivateRoutes);

//* filtered routes which has read access
export const filteredRoutes = filterRoutes(allPrivateRoutes);

//* sidebar routes which has view access only in sidebar
export const sidebarRoutes = filterSidebarRoutes(filteredRoutes);
