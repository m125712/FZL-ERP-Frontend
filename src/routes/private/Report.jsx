import DailyChallan from '@/pages/Report/DailyChallan';
import DeliveryStatement from '@/pages/Report/DeliveryStatement';
import LCDue from '@/pages/Report/LC';
import PIRegister from '@/pages/Report/PIRegister';
import PIToBeSubmit from '@/pages/Report/PIToBeSubmit';
import ProductionReportDirector from '@/pages/Report/ProductionReportDirector';
import ProductionReportSM from '@/pages/Report/ProductionReportS&M';
import ThreadProduction from '@/pages/Report/ThreadProductionStatus';
import ZipperProduction from '@/pages/Report/ZipperProductionStatus';

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
				name: 'Production Report (Director)',
				path: '/report/production-report/director',
				element: <ProductionReportDirector />,
				page_name: 'report__production_report_director',
				actions: ['read'],
			},
			{
				name: 'Production Report (S&M)',
				path: '/report/production-report/sm',
				element: <ProductionReportSM />,
				page_name: 'report__production_report_sm',
				actions: ['read'],
			},
			{
				name: 'Delivery Statement',
				path: '/report/delivery-statement',
				element: <DeliveryStatement />,
				page_name: 'report__delivery_statement',
				actions: ['read'],
			},
		],
	},
];
