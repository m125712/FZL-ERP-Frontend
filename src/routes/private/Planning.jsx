import { lazy } from 'react';

// * Finishing Batch
const FinishingBatch = lazy(() => import('@/pages/Planning/FinishingBatch'));
const FinishingBatchDetails = lazy(
	() => import('@/pages/Planning/FinishingBatch/Details')
);
const FinishingBatchEntry = lazy(
	() => import('@/pages/Planning/FinishingBatch/Entry')
);

// * Finishing Dashboard
const FinishingDashboard = lazy(
	() => import('@/pages/Planning/FinishingDashboard')
);
const DateWiseBatchReport = lazy(
	() => import('@/pages/Planning/DateWiseBatchReport')
);
const ProductionCapacity = lazy(
	() => import('@/pages/Planning/ProductionCapacity')
);
const PlanningOverview = lazy(() => import('@/pages/Planning/Overview'));

const ApprovalDate = lazy(() => import('@/pages/Planning/ApprovalDate'));

export const PlanningRoutes = [
	{
		name: 'Planning',
		children: [
			// * Finishing Dashboard
			{
				name: 'Dashboard',
				path: '/planning/finishing-dashboard',
				element: <FinishingDashboard />,
				page_name: 'planning__finishing_dashboard',
				actions: ['read', 'create', 'update', 'delete'],
			},
			// * Overview
			{
				name: 'Order Overview',
				path: '/planning/overview',
				element: <PlanningOverview />,
				page_name: 'planning__overview',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Batch Report DateWise',
				path: '/planning/finishing-dashboard/batch-report/:date',
				element: <DateWiseBatchReport />,
				hidden: true,
				page_name: 'planning__finishing_dashboard_batch_report',
				actions: ['read'],
			},

			// * Finishing Batch
			{
				name: 'Batch',
				path: '/planning/finishing-batch',
				element: <FinishingBatch />,
				page_name: 'planning__finishing_batch',
				actions: [
					'create',
					'read',
					'update',
					'delete',
					'click_status_complete',
					'show_developer',
				],
			},
			{
				name: 'Finishing Batch Entry',
				path: '/planning/finishing-batch/entry',
				element: <FinishingBatchEntry />,
				hidden: true,
				page_name: 'planning__finishing_batch_entry',
				actions: ['create', 'read'],
			},
			{
				name: 'Finishing Batch Details',
				path: '/planning/finishing-batch/:batch_uuid',
				element: <FinishingBatchDetails />,
				hidden: true,
				page_name: 'planning__finishing_batch_details',
				actions: ['read'],
			},
			{
				name: 'Finishing Batch Update',
				path: '/planning/finishing-batch/:batch_uuid/update',
				element: <FinishingBatchEntry />,
				hidden: true,
				page_name: 'planning__finishing_batch_entry_update',
				actions: ['create', 'read', 'update', 'delete'],
			},

			// * Production Capacity
			{
				name: 'Production Capacity',
				path: '/planning/production-capacity',
				element: <ProductionCapacity />,
				page_name: 'planning__production_capacity',
				actions: ['read', 'create', 'update', 'delete'],
			},
			//*Approval Date
			{
				name: 'Approval Date',
				path: '/planning/approval-date',
				element: <ApprovalDate />,
				page_name: 'planning__approval_date',
				actions: ['read', 'create', 'update', 'delete'],
			},
		],
	},
];
