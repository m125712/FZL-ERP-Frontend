import { lazy } from 'react';

// PI
const PI = lazy(() => import('@pages/Commercial/PI'));
const PiDetails = lazy(() => import('@pages/Commercial/PI/Details'));
const PiEntry = lazy(() => import('@pages/Commercial/PI/Entry'));

// Bank
const Bank = lazy(() => import('@pages/Commercial/Bank'));

// LC
const LC = lazy(() => import('@pages/Commercial/LC'));
const LCDetails = lazy(() => import('@pages/Commercial/LC/Details'));
const LCEntry = lazy(() => import('@pages/Commercial/LC/Entry'));

export const CommercialRoutes = [
	{
		id: 5,
		name: 'LC',
		path: '/commercial/lc',
		element: LC,
		type: 'commercial',
		page_name: 'commercial__lc',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 7,
		name: 'LC Details',
		path: '/commercial/lc/details/:lc_uuid',
		element: LCDetails,
		type: 'commercial',
		page_name: 'commercial__lc_details',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},

	{
		id: 2,
		name: 'LC Entry',
		path: '/commercial/lc/entry',
		element: LCEntry,
		type: 'commercial',
		page_name: 'commercial__lc_entry',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},
	{
		id: 3,
		name: 'PI Update',
		path: '/commercial/lc/update/:lc_uuid',
		element: LCEntry,
		type: 'commercial',
		page_name: 'commercial__lc_update',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},

	{
		id: 1,
		name: 'PI',
		path: '/commercial/pi',
		element: PI,
		type: 'commercial',
		page_name: 'commercial__pi',
		actions: ['create', 'read', 'update', 'delete', 'click_receive_status'],
	},
	{
		id: 11,
		name: 'PI',
		path: '/commercial/pi/details/:pi_uuid',
		element: PiDetails,
		type: 'commercial',
		page_name: 'commercial__pi_details',
		actions: ['create', 'read', 'update', 'delete', 'click_receive_status'],
		hidden: true,
	},
	{
		id: 2,
		name: 'PI Entry',
		path: '/commercial/pi/entry',
		element: PiEntry,
		type: 'commercial',
		page_name: 'commercial__pi_entry',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},
	{
		id: 3,
		name: 'PI Update',
		path: '/commercial/pi/update/:pi_uuid',
		element: PiEntry,
		type: 'commercial',
		page_name: 'commercial__pi_update',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},
	{
		id: 4,
		name: 'Bank',
		path: '/commercial/bank',
		element: Bank,
		type: 'commercial',
		page_name: 'commercial__bank',
		actions: ['create', 'read', 'update', 'delete'],
	},
];
