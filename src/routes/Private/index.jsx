import { CommercialRoutes } from './Commercial';
import { CommonRoutes } from './Common';
import { DashboardRoutes } from './Dashboard';
import { DeliveryRoutes } from './Delivery';
import { DyeingAndIronRoutes } from './DyeingAndIron';
import { HrRoutes } from './Hr';
import { IssueRoutes } from './Issue';
import { LabDipRoutes } from './LabDip';
import { LibraryRoutes } from './Library';
import { MetalRoutes } from './Metal';
import { NylonRoutes } from './Nylon';
import { OrderRoutes } from './Order';
import { SliderRoutes } from './Slider';
import { StoreRoutes } from './Store';
import { ThreadRoutes } from './Thread';
import { VislonRoutes } from './Vislon';

const privateRoutes = [
	...DashboardRoutes,
	...OrderRoutes,
	...LabDipRoutes,
	...ThreadRoutes,
	...CommercialRoutes,
	...DeliveryRoutes,
	...StoreRoutes,
	...CommonRoutes,
	...IssueRoutes,
	...DyeingAndIronRoutes,
	...NylonRoutes,
	...VislonRoutes,
	...MetalRoutes,
	...SliderRoutes,
	...HrRoutes,
	...LibraryRoutes,
];

export default privateRoutes;
