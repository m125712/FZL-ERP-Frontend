import { hi } from 'date-fns/locale';
import { lazy } from 'react';

// CountLength
const CountLength = lazy(() => import('@pages/Thread/CountLength'));

//Order
const OrderInfo = lazy(() => import('@pages/Thread/Order'));
const IndOrderInfo = lazy(() => import('@pages/Thread/Order/Details'));
const OrderInfoEntry = lazy(() => import('@pages/Thread/Order/Entry'));
const Machine = lazy(() => import('@pages/Thread/Machine'));
const Swatch = lazy(() => import('@pages/Thread/Swatch'));
const DyesCategory = lazy(() => import('@pages/Thread/DyesCategory'));
const Programs = lazy(() => import('@pages/Thread/Programs'));

export const ThreadRoutes = [
	{
		id: 1,
		name: 'Count Length',
		path: '/thread/count-length',
		element: CountLength,
		type: 'thread',
		page_name: 'thread__count_length',
		actions: ['create', 'read', 'update', 'delete'],
	},

	{
		id: 3,
		name: 'Order Info',
		path: '/thread/order-info/details',
		element: OrderInfo,
		type: 'thread',
		page_name: 'thread__order_info_details',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 31,
		name: 'Entry',
		path: '/thread/order-info/entry',
		element: OrderInfoEntry,
		type: 'thread',
		page_name: 'thread__order_info_entry',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},
	{
		id: 32,
		name: 'Update',
		path: '/thread/order-info/update/:order_info_uuid',
		element: OrderInfoEntry,
		type: 'thread',
		page_name: 'thread__order_info_update',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},
	{
		id: 33,
		name: 'Details of Order Info',
		path: '/thread/order-info/details/:order_info_uuid',
		element: IndOrderInfo,
		type: 'thread',
		page_name: 'thread__order_info_in_details',
		actions: ['create', 'read', 'update', 'delete'],
		hidden: true,
	},
	{
		id: 4,
		name: 'Machine',
		path: '/thread/machine',
		element: Machine,
		type: 'thread',
		page_name: 'thread__machine',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 283,
		name: 'Swatch',
		path: '/thread/swatch',
		element: Swatch,
		type: 'thread',
		page_name: 'thread__swatch',
		actions: ['read', 'update'],
	},
	{
		id: 7,
		name: 'DyesCategory',
		path: '/thread/dyes-category',
		element: DyesCategory,
		type: 'thread',
		page_name: 'thread__dyes_category',
		actions: ['create', 'read', 'update', 'delete'],
	},
	{
		id: 8,
		name: 'Programs',
		path: '/thread/programs',
		element: Programs,
		type: 'thread',
		page_name: 'thread__programs',
		actions: ['create', 'read', 'update', 'delete'],
	},
];
