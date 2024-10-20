import DailyChallan from '@/pages/Report/DailyChallan';
import LCDue from '@/pages/Report/LC';
import PIRegister from '@/pages/Report/PIRegister';
import PIToBeSubmit from '@/pages/Report/PIToBeSubmit';
import ZipperProduction from '@/pages/Report/ZipperProductionStatus';
import ThreadProduction from '@/pages/Report/ThreadProductionStatus';
import ProductionReport from '@/pages/Report/ProductionReport';
export const ReportRoutes = [
	{
		name: 'Report',
		children: [
			{
				name: 'Zipper Production',
				path: '/report/zipper-production',
				element: <ZipperProduction />,
				page_name: 'report__zipper_production',
				actions: ['read'],
			},
			{
				name: 'Thread Production',
				path: '/report/thread-production',
				element: <ThreadProduction />,
				page_name: 'report__thread_production',
				actions: ['read'],
			},
			{
				name: 'Daily Challan',
				path: '/report/daily-challan',
				element: <DailyChallan />,
				page_name: 'report__daily_challan',
				actions: ['read'],
			},
			{
				name: 'PI Register',
				path: '/report/pi-register',
				element: <PIRegister />,
				page_name: 'report__pi_register',
				actions: ['read'],
			},
			{
				name: 'PI To Be Submitted',
				path: '/report/pi-to-be-submitted',
				element: <PIToBeSubmit />,
				page_name: 'report__pi_to_be_submitted',
				actions: ['read'],
			},
			{
				name: 'LC Due',
				path: '/report/lc-due',
				element: <LCDue />,
				page_name: 'report__lc_due',
				actions: ['read'],
			},
			{
				name: 'Production Report',
				path: '/report/production-report',
				element: <ProductionReport />,
				page_name: 'report__production_report',
				actions: ['read'],
			}
		],
	},
];
