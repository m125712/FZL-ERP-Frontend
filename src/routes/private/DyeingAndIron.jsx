// Dyeing And Iron
//* Dyes Category
import DyesCategory from '@/pages/DyeingAndIron/DyesCategory';
// * Finishing Batch
import FinishingBatch from '@/pages/DyeingAndIron/FinishingBatch';
import FinishingBatchEntry from '@/pages/DyeingAndIron/FinishingBatch/Entry';
import FinishingBatchDetails from '@/pages/DyeingAndIron/FinishingBatch/Details';
//* Log
import DyeingLog from '@/pages/DyeingAndIron/Log';
//* Machine
import Machine from '@/pages/DyeingAndIron/Machine';
import DyeingPlanning from '@/pages/DyeingAndIron/Planning';
// * Head office
import DyeingPlanningHeadOffice from '@/pages/DyeingAndIron/PlanningHeadOffice';
import DyeingPlanningHeadOfficeDetails from '@/pages/DyeingAndIron/PlanningHeadOffice/Details';
import DyeingPlanningHeadOfficeEntry from '@/pages/DyeingAndIron/PlanningHeadOffice/Entry';
// * SNO
import DyeingPlanningSNO from '@/pages/DyeingAndIron/PlanningSNO';
import DyeingPlanningSNODetails from '@/pages/DyeingAndIron/PlanningSNO/Details';
import DyeingPlanningSNOEntry from '@/pages/DyeingAndIron/PlanningSNO/Entry';
//*Programs
import Programs from '@/pages/DyeingAndIron/Programs';
//
//*RM
import DyeingRMStock from '@/pages/DyeingAndIron/RMStock';
// * Batch Thread
import DyeingThreadBatch from '@/pages/DyeingAndIron/ThreadBatch';
import DyeingThreadBatchConneing from '@/pages/DyeingAndIron/ThreadBatch/Conneing/Entry';
import DyeingThreadBatchDetails from '@/pages/DyeingAndIron/ThreadBatch/Details';
import DyeingThreadBatchEntry from '@/pages/DyeingAndIron/ThreadBatch/Entry';
// * Batch Zipper
import DyeingZipperBatch from '@/pages/DyeingAndIron/ZipperBatch';
import DyeingZipperBatchDetails from '@/pages/DyeingAndIron/ZipperBatch/Details';
import DyeingZipperBatchEntry from '@/pages/DyeingAndIron/ZipperBatch/Entry';
import DyeingZipperBatchProduction from '@/pages/DyeingAndIron/ZipperBatch/Production';

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
				name: 'Zipper Batch',
				path: '/dyeing-and-iron/zipper-batch',
				element: <DyeingZipperBatch />,
				page_name: 'dyeing__zipper_batch',
				actions: [
					'create',
					'read',
					'update',
					'click_receive_status',
					'click_receive_status_override',
				],
			},
			{
				name: 'Zipper Batch Entry',
				path: '/dyeing-and-iron/zipper-batch/entry',
				element: <DyeingZipperBatchEntry />,
				hidden: true,
				page_name: 'dyeing__zipper_batch_entry',
				actions: ['create', 'read', 'update'],
			},
			{
				name: 'Zipper Batch Update',
				path: '/dyeing-and-iron/zipper-batch/:batch_uuid/update',
				element: <DyeingZipperBatchEntry />,
				hidden: true,
				page_name: 'dyeing__zipper_batch_entry_update',
				actions: ['create', 'read', 'update','delete'],
			},
			{
				name: ' Zipper Batch Details',
				path: '/dyeing-and-iron/zipper-batch/:batch_uuid',
				element: <DyeingZipperBatchDetails />,
				hidden: true,
				page_name: 'dyeing__zipper_batch_details',
				actions: ['read'],
			},

			// * Batch Production
			{
				name: 'Batch Production',
				path: '/dyeing-and-iron/zipper-batch/batch-production/:batch_prod_uuid',
				element: <DyeingZipperBatchProduction />,
				page_name: 'dyeing__zipper_batch_production',
				hidden: true,
				actions: ['create', 'read', 'update'],
			},

			// * Batch Thread
			{
				name: 'Thread Batch',
				path: '/dyeing-and-iron/thread-batch',
				element: <DyeingThreadBatch />,
				page_name: 'dyeing__thread_batch',
				actions: [
					'create',
					'read',
					'update',
					'click_drying_status',
					'click_drying_status_override',
				],
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
			// *Dyeing ThreadBatch Conening
			{
				name: 'Batch Conneing',
				path: '/dyeing-and-iron/thread-batch/conneing/:batch_con_uuid',
				element: <DyeingThreadBatchConneing />,
				page_name: 'dyeing__thread_batch_conneing',
				hidden: true,
				actions: ['create', 'read', 'update'],
			},

			// * Machine
			{
				name: 'Machine',
				path: '/dyeing-and-iron/machine',
				element: <Machine />,
				page_name: 'dyeing__machine',
				actions: ['create', 'read', 'update', 'delete'],
			},
			// * Programs
			{
				name: 'Programs',
				path: '/dyeing-and-iron/programs',
				element: <Programs />,
				page_name: 'dyeing__programs',
				actions: ['create', 'read', 'update', 'delete'],
			},
			// * Dyes Category
			{
				name: 'Dyes Category',
				path: '/dyeing-and-iron/dyes-category',
				element: <DyesCategory />,
				page_name: 'dyeing__dyes_category',
				actions: ['create', 'read', 'update', 'delete'],
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

			// * Finishing Batch
			{
				name: 'Finishing Batch',
				path: '/dyeing-and-iron/finishing-batch',
				element: <FinishingBatch />,
				page_name: 'dyeing__finishing_batch',
				actions: ['create', 'read', 'update', 'delete'],
			},
			{
				name: 'Finishing Batch Entry',
				path: '/dyeing-and-iron/finishing-batch/entry',
				element: <FinishingBatchEntry />,
				hidden: true,
				page_name: 'dyeing__finishing_batch_entry',
				actions: ['create', 'read'],
			},
			{
				name: 'Finishing Batch Details',
				path: '/dyeing-and-iron/finishing-batch/:batch_uuid',
				element: <FinishingBatchDetails />,
				hidden: true,
				page_name: 'dyeing__finishing_batch_details',
				actions: ['read'],
			},
			{
				name: 'Finishing Batch Update',
				path: '/dyeing-and-iron/finishing-batch/:batch_uuid/update',
				element: <FinishingBatchEntry />,
				hidden: true,
				page_name: 'dyeing__finishing_batch_entry_update',
				actions: ['create', 'read', 'update', 'delete'],
			},
		],
	},
];
