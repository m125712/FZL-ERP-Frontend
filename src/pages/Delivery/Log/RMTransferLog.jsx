import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { useAccess } from '@/hooks';

import { useDeliveryRM, useDeliveryRMLog } from '@/state/Delivery';
import { DateTime, EditDelete } from '@/ui';
import PageInfo from '@/util/PageInfo';
import { useEffect, useMemo, useState } from 'react';
import RMAddOrUpdate from './RMAddOrUpdate';

export default function Index() {
	const { data, isLoading, url, deleteData } = useDeliveryRMLog();
	const info = new PageInfo(' RM Used Log', url, 'delivery__log');
	const haveAccess = useAccess(info.getTab());
	const { invalidateQuery: invalidateRM } = useDeliveryRM();

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material Name',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'section',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<span>
							{info.getValue() === 'm_qc_and_packing'
								? 'Metal'
								: info.getValue() === 'n_qc_and_packing'
									? 'Nylon'
									: info.getValue() === 'v_qc_and_packing'
										? 'Vislon'
										: info.getValue() === 's_qc_and_packing'
											? 'Slider'
											: 'Other'}
						</span>
					);
				},
			},
			{
				accessorKey: 'used_quantity',
				header: 'Used QTY',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'wastage',
				header: 'Wastage',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_by_name',
				header: 'Issued By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created',
				filterFn: 'isWithinRange',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
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
							showDelete={haveAccess.includes('delete')}
						/>
					);
				},
			},
		],
		[data]
	);
	// { label: 'Delivery QC and Packing', value: 'm_qc_and_packing' },
	// 		{ label: 'Nylon QC and Packing', value: 'n_qc_and_packing' },
	// 		{ label: 'Vislon QC and Packing', value: 'v_qc_and_packing' },
	// 		{ label: 'Slider QC and Packing', value: 's_qc_and_packing' },
	// Update
	const [updateRMLog, setUpdateRMLog] = useState({
		uuid: null,
		section: null,
		material_name: null,
		m_qc_and_packing: null,
		n_qc_and_packing: null,
		v_qc_and_packing: null,
		s_qc_and_packing: null,
		used_quantity: null,
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];
		setUpdateRMLog((prev) => ({
			...prev,
			...selected,
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
			itemName: data[idx].material_name
				.replace(/#/g, '')
				.replace(/\//g, '-'),
		}));

		window[info.getDeleteModalId()].showModal();
	};
	invalidateRM();

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<RMAddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateRMLog,
						setUpdateRMLog,
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
						url: `/material/used`,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
