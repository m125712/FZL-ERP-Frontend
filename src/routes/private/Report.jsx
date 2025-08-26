import { lazy } from 'react';

const DailyChallan = lazy(() => import('@/pages/Report/DailyChallan'));
const DailyChallanDR = lazy(() => import('@/pages/Report/DailtChallanDR'));

const ProductionStatement = lazy(
	() => import('@/pages/Report/ProductionStatement')
);
const LCDue = lazy(() => import('@/pages/Report/LC'));
const PIRegister = lazy(() => import('@/pages/Report/PIRegister'));
const PIToBeSubmit = lazy(() => import('@/pages/Report/PIToBeSubmit'));

const OrderStatusZipper = lazy(
	() => import('@/pages/Report/OrderStatusZipper')
);
const OrderStatusThread = lazy(
	() => import('@/pages/Report/OrderStatusThread')
);
const ThreadProduction = lazy(
	() => import('@/pages/Report/ThreadProductionStatus')
);
const ThreadProductionOrderWise = lazy(
	() => import('@/pages/Report/ThreadProductionStatusOrderWise')
);
const ZipperProduction = lazy(
	() => import('@/pages/Report/ZipperProductionStatus')
);
const Store = lazy(() => import('@/pages/Report/Store'));
const DailyProduction = lazy(() => import('@/pages/Report/DailyProduction'));
const ApprovedOrders = lazy(() => import('@/pages/Report/ApprovedOrders'));
const Sample = lazy(() => import('@/pages/Report/Sample'));
const Bulk = lazy(() => import('@/pages/Report/Bulk'));
const Orders = lazy(() => import('@/pages/Report/Order'));
const ChallanStatus = lazy(() => import('@/pages/Report/ChallanStatus'));
const OrderTracking = lazy(() => import('@/pages/Report/OrderTracking'));
const OrderSummary = lazy(() => import('@/pages/Report/OrderSummary'));
const DeliveryReport = lazy(() => import('@/pages/Report/DeliveryReport'));
const ThreadDelivery = lazy(() => import('@/pages/Report/ThreadDelivery'));
const PackingList = lazy(() => import('@/pages/Report/PackingList'));
const ProductionSummary = lazy(
	() => import('@/pages/Report/ProductionSummary')
);
const Consumption = lazy(() => import('@/pages/Report/Consumption'));

const ThreadBatch = lazy(() => import('@/pages/Report/ThreadBatch'));
const ZipperBatch = lazy(() => import('@/pages/Report/ZipperBatch'));
const OrderSummaryPL = lazy(() => import('@/pages/Report/OrderSummaryPL'));
const OrderSheetSR = lazy(() => import('@/pages/Report/OrderSheetSR'));
const DailyOrderStatus = lazy(() => import('@/pages/Report/DailyOrderStatus'));
const IndividualMaterial = lazy(
	() => import('@/pages/Report/IndividualMaterial')
);

const OutForDelivery = lazy(() => import('@/pages/Report/OutForDelivery'));

//* Production section
const VislonFinishing = lazy(
	() => import('@/pages/Report/Production/VislonFinishing')
);
const VislonTeethMolding = lazy(
	() => import('@/pages/Report/Production/VislonTeenthMolding')
);
const NylonFinishingPlastic = lazy(
	() => import('@/pages/Report/Production/NylonFinishingPlastic')
);
const NylonFinishingMetallic = lazy(
	() => import('@/pages/Report/Production/NylonFinishingMetallic')
);
const MetalTeethMolding = lazy(
	() => import('@/pages/Report/Production/MetalTeethMolding')
);
const MetalTeethColoring = lazy(
	() => import('@/pages/Report/Production/MetalTeethColoring')
);
const MetalFinishing = lazy(
	() => import('@/pages/Report/Production/MetalFinishing')
);
const OrderWise = lazy(() => import('@/pages/Report/OrderTImeLength'));

export const ReportRoutes = [
	{
		name: 'Report',
		children: [
			{
				name: 'Zipper Production',
				path: '/report/zipper-production',
				element: <ZipperProduction />,
				page_name: 'report__zipper_production',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Thread Production (BW)',
				path: '/report/thread-production-batch-wise',
				element: <ThreadProduction />,
				page_name: 'report__thread_production_batch_wise',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Thread Production (OW)',
				path: '/report/thread-production-order-wise',
				element: <ThreadProductionOrderWise />,
				page_name: 'report__thread_production_order_wise',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Daily Challan',
				path: '/report/daily-challan',
				element: <DailyChallan />,
				page_name: 'report__daily_challan',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Daily Challan (DR)',
				path: '/report/daily-challan-dr',
				element: <DailyChallanDR />,
				page_name: 'report__daily_challan_dr',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'PI Register',
				path: '/report/pi-register',
				element: <PIRegister />,
				page_name: 'report__pi_register',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'PI To Be Submitted',
				path: '/report/pi-to-be-submitted',
				element: <PIToBeSubmit />,
				page_name: 'report__pi_to_be_submitted',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'LC Due',
				path: '/report/lc-due',
				element: <LCDue />,
				page_name: 'report__lc_due',
				actions: ['read', 'show_own_orders'],
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
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Production Statement',
				path: '/report/production-statement',
				element: <ProductionStatement />,
				page_name: 'report__production_statement',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Sample',
				path: '/report/sample',
				element: <Sample />,
				page_name: 'report__sample',
				actions: ['read', 'show_zero_balance'],
			},
			{
				name: 'Bulk',
				path: '/report/bulk',
				element: <Bulk />,
				page_name: 'report__bulk',
				actions: [
					'read',
					'show_price_pi',
					'show_own_orders',
					'show_zero_balance',
					'show_date_range',
				],
			},
			{
				name: 'Orders',
				path: '/report/orders',
				element: <Orders />,
				page_name: 'report__orders',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Order Status (Zipper)',
				path: '/report/order-status-zipper',
				element: <OrderStatusZipper />,
				page_name: 'report__order_status_zipper',
				actions: ['read', 'show_own_orders', 'show_price'],
			},
			{
				name: 'Order Status (Thread)',
				path: '/report/order-status-thread',
				element: <OrderStatusThread />,
				page_name: 'report__order_status_thread',
				actions: ['read', 'show_own_orders', 'show_price'],
			},
			{
				name: 'Approved Orders',
				path: '/report/approved-orders',
				element: <ApprovedOrders />,
				page_name: 'report__approved_orders',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Challan Status',
				path: '/report/challan-status',
				element: <ChallanStatus />,
				page_name: 'report__challan_status',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Order Tracking',
				path: '/report/order-tracking',
				element: <OrderTracking />,
				page_name: 'report__order_tracking',
				actions: ['read'],
			},
			{
				name: 'Order Summary (Challan)',
				path: '/report/order-summary',
				element: <OrderSummary />,
				page_name: 'report__order_summary',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Order Summary (PL)',
				path: '/report/order-summary-pl',
				element: <OrderSummaryPL />,
				page_name: 'report__order_summary_pl',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Delivery Report',
				path: '/report/delivery-report',
				element: <DeliveryReport />,
				page_name: 'report__delivery_report',
				actions: ['read', 'show_price', 'show_own_orders'],
			},
			{
				name: 'Thread Delivery',
				path: '/report/thread-delivery',
				element: <ThreadDelivery />,
				page_name: 'report__thread_delivery',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Packing List',
				path: '/report/packing-list',
				element: <PackingList />,
				page_name: 'report__packing_list',
				actions: ['read', 'show_own_orders', 'show_price'],
			},
			{
				name: 'Production Summary',
				path: '/report/production-summary',
				element: <ProductionSummary />,
				page_name: 'report__production_summary',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Consumption',
				path: '/report/consumption',
				element: <Consumption />,
				page_name: 'report__consumption',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Order-Sheet Send & Receive',
				path: '/report/order-sheet-sr',
				element: <OrderSheetSR />,
				page_name: 'report__order_sheet_sr',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Individual Material',
				path: '/report/individual-material',
				element: <IndividualMaterial />,
				page_name: 'report__individual_material',
				actions: ['read', 'show_own_orders'],
			},
			{
				name: 'Out For Delivery',
				path: '/report/out-for-delivery',
				element: <OutForDelivery />,
				page_name: 'report__out_for_delivery',
				actions: ['read'],
			},
			{
				name: 'Daily Order Status',
				path: '/report/daily-order-status',
				element: <DailyOrderStatus />,
				page_name: 'report__daily_order_status',
				actions: ['read'],
			},
			{
				name: 'Order Time Length',
				path: '/report/order-time-length',
				element: <OrderWise />,
				page_name: 'report__time_length',
				actions: ['read'],
			},
			{
				name: 'Production',
				children: [
					{
						name: 'Thread Batch',
						path: '/report/thread-batch',
						element: <ThreadBatch />,
						page_name: 'report__thread_batch',
						actions: ['read', 'show_own_orders'],
					},
					{
						name: 'Zipper Dyeing Batch',
						path: '/report/zipper-dyeing-batch',
						element: <ZipperBatch />,
						page_name: 'report__zipper_dyeing_batch',
						actions: ['read', 'show_own_orders'],
					},
					{
						name: 'Nylon Finishing (plastic)',
						path: '/report/production/nylon-finishing-plastic',
						element: <NylonFinishingPlastic />,
						page_name: 'report__production_nylon_finishing_plastic',
						actions: ['read'],
					},
					{
						name: 'Nylon Finishing (Metallic)',
						path: '/report/production/nylon-finishing-metallic',
						element: <NylonFinishingMetallic />,
						page_name:
							'report__production_nylon_finishing_metallic',
						actions: ['read'],
					},
					{
						name: 'Vislon Teeth Molding',
						path: '/report/production/vislon-teeth-molding',
						element: <VislonTeethMolding />,
						page_name: 'report__production_vislon_teeth_molding',
						actions: ['read'],
					},
					{
						name: 'Vislon Finishing',
						path: '/report/production/vislon-finishing',
						element: <VislonFinishing />,
						page_name: 'report__production_vislon_finishing',
						actions: ['read'],
					},
					{
						name: 'Metal Teeth Molding',
						path: '/report/production/metal-teeth-molding',
						element: <MetalTeethMolding />,
						page_name: 'report__production_metal_teeth_molding',
						actions: ['read'],
					},
					{
						name: 'Metal Teeth Coloring',
						path: '/report/production/metal-teeth-coloring',
						element: <MetalTeethColoring />,
						page_name: 'report__production_metal_teeth_coloring',
						actions: ['read'],
					},
					{
						name: 'Metal Finishing',
						path: '/report/production/metal-finishing',
						element: <MetalFinishing />,
						page_name: 'report__production_metal_finishing',
						actions: ['read'],
					},
				],
			},
		],
	},
];
