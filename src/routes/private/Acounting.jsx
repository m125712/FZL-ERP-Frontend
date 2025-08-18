import { lazy } from 'react';
import { anabil_routes } from '@/pages/Accounting/anabil_routes';

const CostCenter = lazy(() => import('@/pages/Accounting/CostCenter'));
const Currency = lazy(() => import('@/pages/Accounting/Currency'));
const FiscalYear = lazy(() => import('@/pages/Accounting/FiscalYear'));
const Group = lazy(() => import('@/pages/Accounting/Group'));
const Head = lazy(() => import('@/pages/Accounting/Head'));
const Ledger = lazy(() => import('@/pages/Accounting/Ledger'));
export const AccountingRoutes = [
	{
		name: 'Accounting',
		children: [
			{
				name: 'Cost Center',
				path: '/accounting/cost-center',
				element: <CostCenter />,
				page_name: 'accounting__cost_center',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Currency',
				path: '/accounting/currency',
				element: <Currency />,
				page_name: 'accounting__currency',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Fiscal Year',
				path: '/accounting/fiscal-year',
				element: <FiscalYear />,
				page_name: 'accounting__fiscal_year',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Group',
				path: '/accounting/group',
				element: <Group />,
				page_name: 'accounting__group',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Head',
				path: '/accounting/head',
				element: <Head />,
				page_name: 'accounting__head',
				actions: ['read', 'create', 'update', 'delete'],
			},
			{
				name: 'Ledger',
				path: '/accounting/ledger',
				element: <Ledger />,
				page_name: 'accounting__ledger',
				actions: ['read', 'create', 'update', 'delete'],
			},
			//! This NEED Replace with the new routes
			...anabil_routes,
		],
	},
];
