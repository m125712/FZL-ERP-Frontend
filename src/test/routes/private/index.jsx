import { DashboardRoutes } from './Dashboard';
import { HrRoutes } from './Hr';
import { StoreRoutes } from './Store';

const privateRoutes = [...DashboardRoutes, ...StoreRoutes, ...HrRoutes];

export default privateRoutes;
