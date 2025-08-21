import { lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import ReactTable from '@/components/Table';
import { CustomLink, DateTime, EditDelete, LinkOnly } from '@/ui';

import PageInfo from '@/util/PageInfo';

import { useVoucher } from './config/query';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('accounting__voucher');
	const { data, isLoading, deleteData } = useVoucher();

	const info = new PageInfo(
		`Voucher`,
		`/accounts/voucher`,
		'accounting__voucher'
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'voucher_id',
				header: 'LC',
				enableColumnFilter: true,
				cell: (info) => {
					const { uuid, lc_date } = info.row.original;
					const url = `/accounting/voucher/${uuid}/details/`;
					return (
						<div className='flex flex-col gap-1'>
							<CustomLink
								label={info.getValue()}
								url={url}
								openInNewTab={true}
							/>
						</div>
					);
				},
			},
			{
				accessorKey: 'date',
				header: 'Date',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'category',
				header: 'Category',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'vat_deduction',
				header: 'VAT Deduction',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'tax_deduction',
				header: 'TAX Deduction',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,
				hidden: !haveAccess.includes('update'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							// showDelete={false}
						/>
					);
				},
			},
		],
		[data]
	);

	// Add
	const handelAdd = () => navigate(`/accounting/voucher/entry`);

	const handelUpdate = (idx) => {
		navigate(`/accounting/voucher/${data[idx].uuid}/update`);
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
			itemName: data[idx].uuid,
		}));

		window[info.getDeleteModalId()].showModal();
	};

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				handelAdd={handelAdd}
				accessor={haveAccess.includes('create')}
				data={data}
				columns={columns}
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/accounts/voucher',
						deleteData,
					}}
				/>
			</Suspense>
		</>
	);
}
