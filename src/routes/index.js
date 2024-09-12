import filterRoutes from '@/util/filterRoutes';
import filterSidebarRoutes from '@/util/filterSidebarRoutes';
import flattenRoutes from '@/util/flattenRoutes';

import privateRoutes from './private';

//* all private routes
export const allPrivateRoutes = privateRoutes;

//* all private routes flatten
export const allFlatRoutes = flattenRoutes(allPrivateRoutes);

//* filtered routes which has read access
export const filteredRoutes = filterRoutes(privateRoutes);

//* flatten routes which has read access
export const flatRoutes = flattenRoutes(filteredRoutes);

//* sidebar routes which has view access only in sidebar
export const sidebarRoutes = filterSidebarRoutes(filteredRoutes);

// first route
export const firstRoute = flatRoutes[0]?.children
	? flatRoutes[0].children[0]
	: flatRoutes[0];
