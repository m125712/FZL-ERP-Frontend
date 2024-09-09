import { elements } from 'chart.js';
import { lazy } from 'react';

// Dyeing And Iron
const DyeingRMStock = lazy(() => import('@/pages/DyeingAndIron/RMStock'));
const DyeingSFG = lazy(() => import('@/pages/DyeingAndIron/SFG'));
const DyeingLog = lazy(() => import('@/pages/DyeingAndIron/Log'));
const DyeingSwatch = lazy(() => import('@/pages/DyeingAndIron/Swatch'));
const DyeingPlanning = lazy(() => import('@/pages/DyeingAndIron/Planning'));

// * SNO
const DyeingPlanningSNO = lazy(
	() => import('@/pages/DyeingAndIron/PlanningSNO')
);
const DyeingPlanningSNOEntry = lazy(
	() => import('@/pages/DyeingAndIron/PlanningSNO/Entry')
);
const DyeingPlanningSNODetails = lazy(
	() => import('@/pages/DyeingAndIron/PlanningSNO/Details')
);

// * Head office
const DyeingPlanningHeadOffice = lazy(
	() => import('@/pages/DyeingAndIron/PlanningHeadOffice')
);
const DyeingPlanningHeadOfficeEntry = lazy(
	() => import('@/pages/DyeingAndIron/PlanningHeadOffice/Entry')
);
const DyeingPlanningHeadOfficeDetails = lazy(
	() => import('@/pages/DyeingAndIron/PlanningHeadOffice/Details')
);

// * Batch
const DyeingBatch = lazy(() => import('@/pages/DyeingAndIron/Batch'));
const DyeingBatchEntry = lazy(
	() => import('@/pages/DyeingAndIron/Batch/Entry')
);
const DyeingBatchDetails = lazy(
	() => import('@/pages/DyeingAndIron/Batch/Details')
);

// * Batch Production
const DyeingBatchProduction = lazy(
	() => import('@/pages/DyeingAndIron/Batch/Production')
);

// * Batch Transfer
const DyeingTransfer = lazy(() => import('@/pages/DyeingAndIron/Transfer'));

// * Batch Transfer Entry
const DyeingTransferEntry = lazy(
	() => import('@/pages/DyeingAndIron/Transfer/EntryUpdate')
);

// * Batch Thread
const DyeingThreadBatch = lazy(
	() => import('@/pages/DyeingAndIron/ThreadBatch')
);

// * Batch Thread Entry
const DyeingThreadBatchEntry = lazy(
	() => import('@/pages/DyeingAndIron/ThreadBatch/Entry')
);

// * Batch Thread Details
const DyeingThreadBatchDetails = lazy(
	() => import('@/pages/DyeingAndIron/ThreadBatch/Details')
);

//* Batch Thread Conneing
const DyeingThreadBatchConneing = lazy(
	() => import('@/pages/DyeingAndIron/ThreadBatch/Conneing/Entry')
);
export const DyeingAndIronRoutes = [
	{
		id: 28,
		name: 'RM',
		path: '/dyeing-and-iron/rm',
		element: DyeingRMStock,
		type: 'dyeing',
		page_name: 'dyeing__dyeing_and_iron_rm',
		actions: ['read', 'click_name', 'click_used'],
	},
	{
		id: 281,
		name: 'SFG',
		path: '/dyeing-and-iron/sfg',
		element: DyeingSFG,
		type: 'dyeing',
		page_name: 'dyeing__dyeing_and_iron_sfg',
		actions: ['read', 'click_production', 'click_transaction'],
	},
	{
		id: 282,
		name: 'Log',
		path: '/dyeing-and-iron/log',
		element: DyeingLog,
		type: 'dyeing',
		page_name: 'dyeing__dyeing_and_iron_log',
		actions: [
			'read',
			'click_update_sfg',
			'click_delete_sfg',
			'click_update_rm',
			'click_delete_rm',
			'click_update_production',
			'click_delete_production',
			'click_update_rm_order',
			'click_delete_rm_order',
		],
	},
	{
		id: 283,
		name: 'Swatch',
		path: '/dyeing-and-iron/swatch',
		element: DyeingSwatch,
		type: 'dyeing',
		page_name: 'dyeing__dyeing_and_iron_swatch',
		actions: ['read', 'update'],
	},
	{
		id: 284,
		name: 'Planning',
		path: '/dyeing-and-iron/planning',
		element: DyeingPlanning,
		type: 'dyeing',
		page_name: 'dyeing__planning',
		actions: ['read'],
	},
	{
		id: 285,
		name: 'Planning SNO',
		path: '/dyeing-and-iron/planning-sno',
		element: DyeingPlanningSNO,
		type: 'dyeing',
		page_name: 'dyeing__planning_sno',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 286,
		name: 'Planning SNO Entry',
		path: '/dyeing-and-iron/planning-sno/entry/:weeks',
		element: DyeingPlanningSNOEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__planning_sno_entry',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 287,
		name: 'Planning SNO Update',
		path: '/dyeing-and-iron/planning-sno/update/:week_id',
		element: DyeingPlanningSNOEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__planning_sno_entry_update',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 287,
		name: 'Planning SNO Details',
		path: '/dyeing-and-iron/planning-sno/details/:week_id',
		element: DyeingPlanningSNODetails,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__planning_sno_entry_details',
		actions: ['read'],
	},

	// * Planning Head Office
	{
		id: 285,
		name: 'Planning Head Office',
		path: '/dyeing-and-iron/planning-head-office',
		element: DyeingPlanningHeadOffice,
		type: 'dyeing',
		page_name: 'dyeing__planning_head_office',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 286,
		name: 'Planning Head Office',
		path: '/dyeing-and-iron/planning-head-office/entry/:weeks',
		element: DyeingPlanningHeadOfficeEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__planning_head_office_entry',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 287,
		name: 'Planning Head Office Update',
		path: '/dyeing-and-iron/planning-head-office/update/:week_id',
		element: DyeingPlanningHeadOfficeEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__planning_head_office_entry_update',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 287,
		name: 'Planning Head Office Details',
		path: '/dyeing-and-iron/planning-head-office/details/:week_id',
		element: DyeingPlanningHeadOfficeDetails,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__planning_head_office_details',
		actions: ['read'],
	},

	// * Batch
	{
		id: 288,
		name: 'Batch',
		path: '/dyeing-and-iron/batch',
		element: DyeingBatch,
		type: 'dyeing',
		page_name: 'dyeing__batch',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 289,
		name: 'Batch Entry',
		path: '/dyeing-and-iron/batch/entry',
		element: DyeingBatchEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__batch_entry',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 290,
		name: 'Batch Update',
		path: '/dyeing-and-iron/batch/update/:batch_uuid',
		element: DyeingBatchEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__batch_entry_update',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 291,
		name: 'Batch Details',
		path: '/dyeing-and-iron/batch/details/:batch_uuid',
		element: DyeingBatchDetails,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__batch_details',
		actions: ['read'],
	},

	// * Batch Production
	{
		id: 292,
		name: 'Batch Production',
		path: '/dyeing-and-iron/batch/batch-production/:batch_prod_uuid',
		element: DyeingBatchProduction,
		type: 'dyeing',
		page_name: 'dyeing__batch_production',
		hidden: true,
		actions: ['create', 'read', 'update'],
	},

	// * Batch Transfer
	{
		id: 293,
		name: 'Dyeing Transfer',
		path: '/dyeing-and-iron/transfer',
		element: DyeingTransfer,
		type: 'dyeing',
		page_name: 'dyeing__transfer',
		actions: ['create', 'read', 'update'],
	},

	// * Batch Transfer Entry
	{
		id: 294,
		name: 'Dyeing Transfer Entry',
		path: '/dyeing-and-iron/transfer/entry',
		element: DyeingTransferEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__transfer_entry',
		actions: ['create', 'read', 'update'],
	},

	// * Batch Thread
	{
		id: 295,
		name: 'Thread Batch',
		path: '/dyeing-and-iron/thread-batch',
		element: DyeingThreadBatch,
		type: 'dyeing',
		page_name: 'dyeing__thread_batch',
		actions: ['create', 'read', 'update'],
	},

	// * Batch Thread Entry
	{
		id: 296,
		name: 'Thread Batch Entry',
		path: '/dyeing-and-iron/thread-batch/entry',
		element: DyeingThreadBatchEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__thread_batch_entry',
		actions: ['create', 'read', 'update'],
	},

	// * Batch Thread Details
	{
		id: 297,
		name: 'Thread Batch Details',
		path: '/dyeing-and-iron/thread-batch/details/:batch_uuid',
		element: DyeingThreadBatchDetails,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__thread_batch_details',
		actions: ['read'],
	},

	// * Batch Thread Update
	{
		id: 298,
		name: 'Thread Batch Update',
		path: '/dyeing-and-iron/thread-batch/update/:batch_uuid',
		element: DyeingThreadBatchEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__thread_batch_entry_update',
		actions: ['create', 'read', 'update'],
	},
	{
		id: 294,
		name: 'Dyeing Transfer Update',
		path: '/dyeing-and-iron/transfer/update/:transfer_uuid',
		element: DyeingTransferEntry,
		type: 'dyeing',
		hidden: true,
		page_name: 'dyeing__transfer_update',
		actions: ['create', 'read', 'update'],
	},
	// *Dyeing ThreadBatch Conening
	{
		id: 292,
		name: 'Batch Conneing',
		path: '/dyeing-and-iron/thread-batch/conneing/:batch_con_uuid',
		element: DyeingThreadBatchConneing,
		type: 'dyeing',
		page_name: 'dyeing__batch_conneing',
		hidden: true,
		actions: ['create', 'read', 'update'],
	},
];
