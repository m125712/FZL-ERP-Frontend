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
const ProductionCapacity = lazy(
	() => import('@/pages/Planning/ProductionCapacity')
);
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

			// * Finishing Batch
			{
				name: 'Batch',
				path: '/planning/finishing-batch',
				element: <FinishingBatch />,
				page_name: 'planning__finishing_batch',
				actions: ['create', 'read', 'update', 'delete'],
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
		],
	},
];
