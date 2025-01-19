import { lazy } from 'react';

const DailyChallan = lazy(() => import('@/pages/Report/DailyChallan'));
const DeliveryStatement = lazy(
	() => import('@/pages/Report/DeliveryStatement')
);
const ProductionStatement = lazy(
	() => import('@/pages/Report/ProductionStatement')
);
const LCDue = lazy(() => import('@/pages/Report/LC'));
const PIRegister = lazy(() => import('@/pages/Report/PIRegister'));
const PIToBeSubmit = lazy(() => import('@/pages/Report/PIToBeSubmit'));
const ProductionReportDirector = lazy(
	() => import('@/pages/Report/ProductionReportDirector')
);
const ProductionReportSM = lazy(
	() => import('@/pages/Report/ProductionReportS&M')
);

const ThreadProduction = lazy(
	() => import('@/pages/Report/ThreadProductionStatus')
);
const ThreadProductionOrderWise = lazy(
	() => import('@/pages/Report/ThreadProductionStatusOrderWise')
)
const ZipperProduction = lazy(
	() => import('@/pages/Report/ZipperProductionStatus')
);
const Store = lazy(() => import('@/pages/Report/Store'));
const DailyProduction = lazy(() => import('@/pages/Report/DailyProduction'));

const Sample = lazy(() => import('@/pages/Report/Sample'));
const Bulk = lazy(() => import('@/pages/Report/Bulk'));
const Orders = lazy(() => import('@/pages/Report/Order'));

export const ReportRoutes = [
	{
		name: 'Report',
		children: [
			{
				name: 'Zipper Production',
				path: '/report/zipper-production',
				element: <ZipperProduction />,
				page_name: 'report__zipper_production',
				actions: [
					'read',
					'show_own_orders',
				],
			},
			{
				name: 'Thread Production (BW)',
				path: '/report/thread-production',
				element: <ThreadProduction />,
				page_name: 'report__thread_production',
				actions: [
					'read',
					'show_own_orders',
				],
			},
			{
				name: 'Thread Production (OW)',
				path: '/report/thread-production_order_wise',
				element: <ThreadProductionOrderWise />,
				page_name: 'report__thread_production_order_wise',
				actions: [
					'read',
					'show_own_orders',
				],
			},
			{
				name: 'Daily Challan',
				path: '/report/daily-challan',
				element: <DailyChallan />,
				page_name: 'report__daily_challan',
				actions: [
					'read',
					'show_own_orders',
				],
			},
			{
				name: 'PI Register',
				path: '/report/pi-register',
				element: <PIRegister />,
				page_name: 'report__pi_register',
				actions: [
					'read',
					'show_own_orders',
				],
			},
			{
				name: 'PI To Be Submitted',
				path: '/report/pi-to-be-submitted',
				element: <PIToBeSubmit />,
				page_name: 'report__pi_to_be_submitted',
				actions: [
					'read',
					'show_own_orders',
				],
			},
			{
				name: 'LC Due',
				path: '/report/lc-due',
				element: <LCDue />,
				page_name: 'report__lc_due',
				actions: [
					'read',
					'show_own_orders',
				],
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
				actions: [
					'read',
					'show_own_orders',
				],
			},
			{
				name: 'Delivery Statement',
				path: '/report/delivery-statement',
				element: <DeliveryStatement />,
				page_name: 'report__delivery_statement',
				actions: [
					'read',
					'show_own_orders',
				],
			},
			{
				name: 'Store',
				path: '/report/store',
				element: <Store />,
				page_name: 'report__store',
				actions: ['read'],
			},
			{
				name: 'Daily Production',
				path: '/report/daily-production',
				element: <DailyProduction />,
				page_name: 'report__daily_production',
				actions: [
					'read',
					'show_own_orders',

				],
			},
			{
				name: 'Production Statement',
				path: '/report/production-statement',
				element: <ProductionStatement />,
				page_name: 'report__production_statement',
				actions: ['read'],
			},
			{
				name: 'Sample',
				path: '/report/sample',
				element: <Sample />,
				page_name: 'report__sample',
				actions: ['read'],
			},
			{
				name: 'Bulk',
				path: '/report/bulk',
				element: <Bulk />,
				page_name: 'report__bulk',
				actions: ['read'],
			},
			{
				name: 'Orders',
				path: '/report/orders',
				element: <Orders />,
				page_name: 'report__orders',
				actions: ['read'],
			},
			// {
			// 	name: 'Production Report (Thread)',
			// 	path: '/report/production-report-thread-party-wise',
			// 	element: <ProductionReportThreadPartyWise />,
			// 	page_name: 'report__production_report_thread_party_wise',
			// 	actions: ['read'],
			// },
		],
	},
];
