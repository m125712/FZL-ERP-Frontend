import { lazy, Suspense, useMemo, useState } from 'react';
import { useProcurementByIssueUUID } from '@/state/Maintenance';
import { useOtherMaterial } from '@/state/Other';

import { DeleteModal, HistoryModal } from '@/components/Modal';
import ReactTable from '@/components/Table';
import { EditDelete } from '@/ui';

const Procurement = lazy(() => import('./Procurement'));

export default function Index({ modalId = '', history = {}, setHistory }) {
	const onClose = () => {
		// document.getElementById(modalId).close();
		window[modalId].close();
	};

	const { data, deleteData } = useProcurementByIssueUUID(history?.uuid);
	const { invalidateQuery } = useOtherMaterial('maintenance');

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'quantity',
				header: 'Quantity',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'description',
				header: 'Description',
				enableColumnFilter: false,
			},
			{
				accessorKey: 'actions',
				header: 'Actions',
				enableColumnFilter: false,
				enableSorting: false,

				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelProcurement}
						handelDelete={handelDelete}
					/>
				),
			},
		],
		[data]
	);

	// update
	const [procurement, setProcurement] = useState({
		uuid: null,
	});

	const handelProcurement = (idx) => {
		setProcurement((prev) => ({
			uuid: history?.uuid,
			procurement_uuid: data[idx].uuid,
		}));

		window['ProcureModalEdit'].showModal();
	};

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

		window['ProcurementDelete'].showModal();
	};

	return (
		<HistoryModal
			id={modalId}
			title={modalId + ': History'}
			onClose={onClose}
		>
			<ReactTable
				showTitleOnly={true}
				data={data ?? []}
				columns={columns}
			/>
			<Suspense>
				<Procurement
					modalId='ProcureModalEdit'
					{...{
						procurement,
						setProcurement,
					}}
				/>
			</Suspense>
			<Suspense>
				<DeleteModal
					modalId={'ProcurementDelete'}
					title={'Delete Procurement'}
					{...{
						deleteItem,
						setDeleteItem,
						url: '/maintain/issue-procurement',
						deleteData,
						invalidateQuery,
					}}
				/>
			</Suspense>
		</HistoryModal>
	);
}
