// Dyeing And Iron
import DyeingRMStock from '@/pages/DyeingAndIron/RMStock';
import DyeingSFG from '@/pages/DyeingAndIron/SFG';
import DyeingLog from '@/pages/DyeingAndIron/Log';
import DyeingSwatch from '@/pages/DyeingAndIron/Swatch';
import DyeingPlanning from '@/pages/DyeingAndIron/Planning';

// * SNO
import DyeingPlanningSNO from '@/pages/DyeingAndIron/PlanningSNO';
import DyeingPlanningSNOEntry from '@/pages/DyeingAndIron/PlanningSNO/Entry';
import DyeingPlanningSNODetails from '@/pages/DyeingAndIron/PlanningSNO/Details';

// * Head office
import DyeingPlanningHeadOffice from '@/pages/DyeingAndIron/PlanningHeadOffice';
import DyeingPlanningHeadOfficeEntry from '@/pages/DyeingAndIron/PlanningHeadOffice/Entry';
import DyeingPlanningHeadOfficeDetails from '@/pages/DyeingAndIron/PlanningHeadOffice/Details';

// * Batch
import DyeingBatch from '@/pages/DyeingAndIron/Batch';
import DyeingBatchEntry from '@/pages/DyeingAndIron/Batch/Entry';
import DyeingBatchDetails from '@/pages/DyeingAndIron/Batch/Details';

// * Batch Production
import DyeingBatchProduction from '@/pages/DyeingAndIron/Batch/Production';

// * Batch Transfer
import DyeingTransfer from '@/pages/DyeingAndIron/Transfer';

// * Batch Transfer Entry
import DyeingTransferEntry from '@/pages/DyeingAndIron/Transfer/EntryUpdate';

// * Batch Thread
import DyeingThreadBatch from '@/pages/DyeingAndIron/ThreadBatch';

// * Batch Thread Entry
import DyeingThreadBatchEntry from '@/pages/DyeingAndIron/ThreadBatch/Entry';

// * Batch Thread Details
import DyeingThreadBatchDetails from '@/pages/DyeingAndIron/ThreadBatch/Details';

//* Batch Thread Conneing
import DyeingThreadBatchConneing from '@/pages/DyeingAndIron/ThreadBatch/Conneing/Entry';

export const DyeingAndIronRoutes = [
	{
		name: 'Dyeing And Iron',
		children: [
			{
				name: 'RM',
				path: '/dyeing-and-iron/rm',
				element: <DyeingRMStock />,
				page_name: 'dyeing__dyeing_and_iron_rm',
				actions: ['read', 'click_name', 'click_used'],
			},
			{
				name: 'SFG',
				path: '/dyeing-and-iron/sfg',
				element: <DyeingSFG />,
				page_name: 'dyeing__dyeing_and_iron_sfg',
				actions: ['read', 'click_production', 'click_transaction'],
			},
			{
				name: 'Log',
				path: '/dyeing-and-iron/log',
				element: <DyeingLog />,
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
				name: 'Swatch',
				path: '/dyeing-and-iron/swatch',
				element: <DyeingSwatch />,
				page_name: 'dyeing__dyeing_and_iron_swatch',
				actions: ['read', 'update'],
			},
			{
				name: 'Planning',
				path: '/dyeing-and-iron/planning',
				element: <DyeingPlanning />,
				page_name: 'dyeing__planning',
				actions: ['read'],
			},
			{
				name: 'Planning SNO',
				path: '/dyeing-and-iron/planning-sno',
				element: <DyeingPlanningSNO />,
				page_name: 'dyeing__planning_sno',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning SNO Entry',
				path: '/dyeing-and-iron/planning-sno/entry/:weeks',
				element: <DyeingPlanningSNOEntry />,
				hidden: true,
				page_name: 'dyeing__planning_sno_entry',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning SNO Update',
				path: '/dyeing-and-iron/planning-sno/:week_id/update',
				element: <DyeingPlanningSNOEntry />,
				hidden: true,
				page_name: 'dyeing__planning_sno_entry_update',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning SNO Details',
				path: '/dyeing-and-iron/planning-sno/:week_id',
				element: <DyeingPlanningSNODetails />,
				hidden: true,
				page_name: 'dyeing__planning_sno_entry_details',
				actions: ['read'],
			},

			// * Planning Head Office
			{
				name: 'Planning Head Office',
				path: '/dyeing-and-iron/planning-head-office',
				element: <DyeingPlanningHeadOffice />,
				page_name: 'dyeing__planning_head_office',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning Head Office',
				path: '/dyeing-and-iron/planning-head-office/entry/:weeks',
				element: <DyeingPlanningHeadOfficeEntry />,
				hidden: true,
				page_name: 'dyeing__planning_head_office_entry',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning Head Office Update',
				path: '/dyeing-and-iron/planning-head-office/:week_id/update',
				element: <DyeingPlanningHeadOfficeEntry />,
				hidden: true,
				page_name: 'dyeing__planning_head_office_entry_update',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Planning Head Office Details',
				path: '/dyeing-and-iron/planning-head-office/:week_id',
				element: <DyeingPlanningHeadOfficeDetails />,
				hidden: true,
				page_name: 'dyeing__planning_head_office_details',
				actions: ['read'],
			},

			// * Batch
			{
				name: 'Batch',
				path: '/dyeing-and-iron/batch',
				element: <DyeingBatch />,
				page_name: 'dyeing__batch',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Batch Entry',
				path: '/dyeing-and-iron/batch/entry',
				element: <DyeingBatchEntry />,
				hidden: true,
				page_name: 'dyeing__batch_entry',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Batch Update',
				path: '/dyeing-and-iron/batch/:batch_uuid/update',
				element: <DyeingBatchEntry />,
				hidden: true,
				page_name: 'dyeing__batch_entry_update',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Batch Details',
				path: '/dyeing-and-iron/batch/:batch_uuid',
				element: <DyeingBatchDetails />,
				hidden: true,
				page_name: 'dyeing__batch_details',
				actions: ['read'],
			},

			// * Batch Production
			{
				name: 'Batch Production',
				path: '/dyeing-and-iron/batch/batch-production/:batch_prod_uuid',
				element: <DyeingBatchProduction />,
				page_name: 'dyeing__batch_production',
				hidden: true,
				actions: ['create', 'read', 'update'],
			},

			// * Batch Transfer
			{
				name: 'Dyeing Transfer',
				path: '/dyeing-and-iron/transfer',
				element: <DyeingTransfer />,
				page_name: 'dyeing__transfer',
				actions: ['create', 'read', 'update'],
			},

			// * Batch Transfer Entry
			{
				name: 'Dyeing Transfer Entry',
				path: '/dyeing-and-iron/transfer/entry',
				element: <DyeingTransferEntry />,
				hidden: true,
				page_name: 'dyeing__transfer_entry',
				actions: ['create', 'read', 'update'],
			},

			// * Batch Thread
			{
				name: 'Thread Batch',
				path: '/dyeing-and-iron/thread-batch',
				element: <DyeingThreadBatch />,
				page_name: 'dyeing__thread_batch',
				actions: ['create', 'read', 'update'],
			},

			// * Batch Thread Entry
			{
				name: 'Thread Batch Entry',
				path: '/dyeing-and-iron/thread-batch/entry',
				element: <DyeingThreadBatchEntry />,
				hidden: true,
				page_name: 'dyeing__thread_batch_entry',
				actions: ['create', 'read', 'update'],
			},

			// * Batch Thread Details
			{
				name: 'Thread Batch Details',
				path: '/dyeing-and-iron/thread-batch/:batch_uuid',
				element: <DyeingThreadBatchDetails />,
				hidden: true,
				page_name: 'dyeing__thread_batch_details',
				actions: ['read'],
			},

			// * Batch Thread Update
			{
				name: 'Thread Batch Update',
				path: '/dyeing-and-iron/thread-batch/:batch_uuid/update',
				element: <DyeingThreadBatchEntry />,
				hidden: true,
				page_name: 'dyeing__thread_batch_entry_update',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Dyeing Transfer Update',
				path: '/dyeing-and-iron/transfer/:transfer_uui/update',
				element: <DyeingTransferEntry />,
				hidden: true,
				page_name: 'dyeing__transfer_update',
				actions: ['create', 'read', 'update'],
			},
			// *Dyeing ThreadBatch Conening
			{
				name: 'Batch Conneing',
				path: '/dyeing-and-iron/thread-batch/conneing/:batch_con_uuid',
				element: <DyeingThreadBatchConneing />,
				page_name: 'dyeing__batch_conneing',
				hidden: true,
				actions: ['create', 'read', 'update'],
			},
		],
	},
];
