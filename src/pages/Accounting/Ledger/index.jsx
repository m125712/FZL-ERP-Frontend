import { lazy, useEffect, useMemo, useState } from 'react';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { useAccLedger } from './config/query';
import { restrictionOptions } from './utils';

const AddOrUpdate = lazy(() => import('./AddOrUpdate'));
const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const { data, isLoading, deleteData } = useAccLedger();

	const info = new PageInfo(
		'Ledger',
		'/accounting/ledger',
		'accounting__ledger'
	);
	const haveAccess = useAccess('accounting__ledger');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden:
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes('delete')}
							showUpdate={haveAccess.includes('update')}
						/>
					);
				},
			},
			{
				accessorKey: 'is_active',
				header: 'Active',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.is_active}
					/>
				),
			},
			{
				accessorKey: 'id',
				header: 'ID',
				enableColumnFilter: false,
			},

			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => {
					const { name } = info.row.original;
					const uuid = info.row.original.uuid;
					const url = `/accounting/ledger/${uuid}/details/`;
					return (
						<div className='flex flex-col gap-1'>
							<CustomLink
								label={name}
								url={url}
								openInNewTab={true}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'group_name',
				header: 'Group',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'head_name',
				header: 'Accounting Head',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'total_amount',
				header: 'Amount',
				enableColumnFilter: false,
				cell: (info) =>
					info.row.original.total_amount >= 0
						? info.row.original.total_amount.toLocaleString()
						: `(${Math.abs(info.row.original.total_amount).toLocaleString()})`,
			},
			{
				accessorKey: 'is_bank_ledger',
				header: 'Bank Ledger',
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						size='btn-xs'
						value={info.row.original.is_bank_ledger}
					/>
				),
			},
			{
				accessorKey: 'account_no',
				header: 'Account No.',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'old_ledger_id',
				header: 'Old Ledger ID',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'index',
				header: 'Index',
				enableColumnFilter: false,
			},

			{
				accessorKey: 'table_name',
				header: 'Table',
				enableColumnFilter: false,
				cell: (info) => info.getValue()?.replace('.', ' '),
			},

			{
				accessorKey: 'identifier',
				header: 'Identifier',
				enableColumnFilter: false,
			},

			{
				accessorKey: 'type',
				header: 'Type',
				enableColumnFilter: false,
			},

			{
				accessorKey: 'restrictions',
				header: 'Restrictions',
				enableColumnFilter: false,
				cell: (info) => {
					const { restrictions } = info.row.original;
					return restrictionOptions.find(
						(option) => option.value === restrictions
					)?.label;
				},
			},

			{
				accessorKey: 'group_number',
				header: 'Group Number',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'initial_amount',
				header: 'Initial Amount',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'vat_deduction',
				header: 'VAT Deduction',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'tax_deduction',
				header: 'Tax Deduction',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
		],
		[data]
	);

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => {
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Update
	const [updateItem, setUpdateItem] = useState({
		uuid: null,
	});

	const handelUpdate = (idx) => {
		setUpdateItem((prev) => ({
			...prev,
			uuid: data[idx].uuid,
		}));
		window[info.getAddOrUpdateModalId()].showModal();
	};

	// Delete
	const [deleteItem, setDeleteItem] = useState({
		itemId: null,
		itemName: null,
	});

	const handelDelete = (idx) => {
		setDeleteItem((prev) => ({
			...prev,
			itemId: data[idx].uuid,
			itemName: data[idx].name,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>

			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateItem,
						setUpdateItem,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/acc/ledger',
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
