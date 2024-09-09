import { StoreRoutes } from './Store';
import { DashboardRoutes } from './Dashboard';

const privateRoutes = [...DashboardRoutes, ...StoreRoutes];

export default privateRoutes;
