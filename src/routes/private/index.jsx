import { AccountingRoutes } from './Acounting';
import { CommercialRoutes } from './Commercial';
import { CommonRoutes } from './Common';
import { DashboardRoutes } from './Dashboard';
import { DeliveryRoutes } from './Delivery';
import { DyeingAndIronRoutes } from './DyeingAndIron';
import { HrRoutes } from './Hr';
import { LabDipRoutes } from './LabDip';
import { LibraryRoutes } from './Library';
import { MaintenanceRoutes } from './Maintenance';
import { MarketingRoutes } from './Marketing';
import { MetalRoutes } from './Metal';
import { NylonRoutes } from './Nylon';
import { OrderRoutes } from './Order';
import { PlanningRoutes } from './Planning';
import { ProfileRoutes } from './Profile';
import { ReportRoutes } from './Report';
import { SliderRoutes } from './Slider';
import { StoreAccessoriesRoutes } from './StoreAccessories';
import { StoreMaintenanceRoutes } from './StoreMaintenance';
import { StoreRmRoutes } from './StoreRm';
import { ThreadRoutes } from './Thread';
import { VislonRoutes } from './Vislon';

const privateRoutes = [
	...DashboardRoutes,
	...ReportRoutes,
	...OrderRoutes,
	...ThreadRoutes,
	...CommercialRoutes,
	...StoreMaintenanceRoutes,
	...StoreRmRoutes,
	...StoreAccessoriesRoutes,
	...MaintenanceRoutes,
	...CommonRoutes,
	...LabDipRoutes,
	...PlanningRoutes,
	...DyeingAndIronRoutes,
	...SliderRoutes,
	...NylonRoutes,
	...VislonRoutes,
	...MetalRoutes,
	...DeliveryRoutes,
	...HrRoutes,
	...LibraryRoutes,
	...MarketingRoutes,
	...ProfileRoutes,
	...AccountingRoutes,
];

export default privateRoutes;
