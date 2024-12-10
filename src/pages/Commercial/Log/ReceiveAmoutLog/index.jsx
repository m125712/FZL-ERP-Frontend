import React, { useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useCommercialPIByQuery,
	useCommercialPICash,
	useCommercialReceiveAmount,
} from '@/state/Commercial';
import { useCommonCoilProduction, useCommonCoilSFG } from '@/state/Common';
import { useAccess } from '@/hooks';

import { Suspense } from '@/components/Feedback';
import { DeleteModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { DateTime, EditDelete } from '@/ui';

import PageInfo from '@/util/PageInfo';

import AddOrUpdate from './AddOrUpdate';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?is_cash=true`;
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?is_cash=true&own_uuid=${userUUID}`;
	}

	return `?is_cash=true`;
};
export default function ProductionLog() {
	const info = new PageInfo('Receive Amount Log', 'receive_amount_log');

	const { data, isLoading, url, deleteData } = useCommercialReceiveAmount();
	const { user } = useAuth();
	const haveAccess_2 = useAccess('commercial__pi-cash');
	const { invalidateQuery: invalidateCommercialPI } = useCommercialPIByQuery(
		getPath(haveAccess_2, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const haveAccess = useAccess('commercial__log');
	const columns = useMemo(
		() => [
			{
				accessorKey: 'pi_cash_id',
				header: 'Cash ID',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},
			{
				accessorKey: 'amount',
				header: 'Amount',
				enableColumnFilter: false,
				cell: (info) => (
					<span className='capitalize'>{info.getValue()}</span>
				),
			},

			{
				accessorKey: 'created_by_name',
				header: 'Created By',
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
				hidden:
					!haveAccess.includes('click_receive_amount_update') &&
					!haveAccess.includes('click_receive_amount_delete'),
				width: 'w-24',
				cell: (info) => {
					return (
						<EditDelete
							idx={info.row.index}
							handelUpdate={handelUpdate}
							handelDelete={handelDelete}
							showDelete={haveAccess.includes(
								'click_receive_amount_delete'
							)}
							showUpdate={haveAccess.includes(
								'click_receive_amount_update'
							)}
						/>
					);
				},
			},
		],
		[data]
	);

	// Update
	const [updateReceiveAmountLog, setUpdateReceiveAmountLog] = useState({
		uuid: null,
		pi_cash_uuid: null,
		max_amount: 0,

		pi_cash_id: null,
	});

	const handelUpdate = (idx) => {
		const selected = data[idx];

		setUpdateReceiveAmountLog((prev) => ({
			...prev,
			...selected,
			uuid: selected.uuid,
			max_amount:
				selected.total_amount +
				selected.amount -
				selected.receive_amount,
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
			itemName: data[idx].pi_cash_id,
		}));
		window[info.getDeleteModalId()].showModal();
	};
	// invalidateCommonCoilSFG();

	// if (error) return <h1>Error:{error}</h1>;

	// Fetching data from server

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable title={info.getTitle()} data={data} columns={columns} />
			<Suspense>
				<AddOrUpdate
					modalId={info.getAddOrUpdateModalId()}
					{...{
						updateReceiveAmountLog,
						setUpdateReceiveAmountLog,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					invalidateQuery={invalidateCommercialPI}
					{...{
						deleteItem,
						setDeleteItem,
						url: `/commercial/cash-receive`,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
