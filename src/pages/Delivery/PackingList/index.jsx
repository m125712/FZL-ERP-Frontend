import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import {
	useDeliveryChallan,
	useDeliveryPackingList,
	useDeliveryPackingListByUUID,
	useDeliveryPackingListDetailsByUUID,
} from '@/state/Delivery';
import { useOtherChallan, useOtherOrder, useThreadOrder } from '@/state/Other';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import Pdf2 from '@/components/Pdf/PackingListSticker';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

export default function Index() {
	const navigate = useNavigate();
	const { data, isLoading, url, deleteData, updateData } =
		useDeliveryPackingList();
	const info = new PageInfo('Packing List', url, 'delivery__packing_list');
	const haveAccess = useAccess('delivery__packing_list');
	const { invalidateQuery: invalidateDeliveryChallan } = useDeliveryChallan();
	const { invalidateQuery: invalidateOtherChallan } =
		useOtherChallan('gate_pass=false');
	const [pdfUuid, setPdfUuid] = useState(null);

	const { invalidateQuery: invalidateOtherOrder } =
		useOtherOrder('page=challan');
	const { invalidateQuery: invalidateThreadOrder } =
		useThreadOrder('page=challan');
	const { invalidateQuery: invalidateThreadOrderSample } = useThreadOrder(
		'page=challan&is_sample=true'
	);
	const { invalidateQuery: invalidateOtherOrderSample } = useOtherOrder(
		'page=challan&is_sample=true'
	);
	const { data: pdfData, isLoading: pdfLoading } =
		useDeliveryPackingListDetailsByUUID(pdfUuid, {
			params: 'is_update=false',
		});

	useEffect(() => {
		if (pdfData && !pdfLoading) {
			Pdf2(pdfData)?.print({}, window);
			setPdfUuid(null);
		}
	}, [pdfData, pdfLoading]);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'action',
				header: 'Sticker',
				enableColumnFilter: false,
				enableSorting: false,
				width: 'w-8',
				cell: (info) => {
					return (
						<button
							type='button'
							className='btn btn-accent btn-sm font-semibold text-white shadow-md'
							disabled={pdfLoading}
							onClick={() => handlePdf(info.row.index)}>
							Carton Sticker
						</button>
					);
				},
			},
			{
				accessorKey: 'packing_number',
				header: 'ID',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/delivery/packing-list'
						/>
					);
				},
			},
			{
				accessorKey: 'challan_number',
				header: 'C/N',
				cell: (info) => {
					const { challan_number, challan_uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={challan_number}
							id={challan_uuid}
							uri='/delivery/challan'
						/>
					);
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_info_uuid } = info.row.original;
					const { item_for } = info.row.original;
					return item_for === 'zipper' ? (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/order/details'
						/>
					) : (
						<LinkWithCopy
							title={info.getValue()}
							id={order_info_uuid}
							uri='/thread/order-info'
						/>
					);
				},
			},
			{
				accessorKey: 'is_warehouse_received',
				header: 'Received',
				enableColumnFilter: false,
				cell: (info) => {
					const access = haveAccess.includes('click_received');
					const overrideAccess = haveAccess.includes(
						'click_received_override'
					);
					// const {
					// 	invalidateQuery: invalidateDeliveryPackingListByUUID,
					// } = useDeliveryPackingListByUUID(info.row.original.uuid);
					return (
						<SwitchToggle
							disabled={
								!overrideAccess &&
								(!access || info.getValue() !== true)
							}
							onChange={() => {
								handelReceivedStatus(info.row.index);

								// invalidateDeliveryPackingListByUUID();
							}}
							checked={info.getValue() === true}
						/>
					);
				},
			},
			{
				accessorKey: 'gate_pass',
				header: 'Gate Pass',
				enableColumnFilter: false,
				cell: (info) => {
					const access = haveAccess.includes('click_gate_pass');
					const overrideAccess = haveAccess.includes(
						'click_gate_pass_override'
					);
					const { challan_uuid } = info.row.original;
					return (
						<SwitchToggle
							disabled={
								(!overrideAccess &&
									(!access || info.getValue() !== 1)) ||
								challan_uuid === null ||
								info.row.original.is_warehouse_received ===
									false
							}
							onChange={() => handelGatePass(info.row.index)}
							checked={info.getValue() === 1}
						/>
					);
				},
			},
			{
				accessorKey: 'total_poly_quantity',
				header: 'Poly',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'carton_size',
				header: 'Carton Size',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'carton_weight',
				header: 'Carton Weight',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'count',
				header: 'Count',
				enableColumnFilter: false,
				cell: (info) => {
					const { packing_list_wise_rank } = info.row.original;
					const { packing_list_wise_count } = info.row.original;

					return `${packing_list_wise_rank}/${packing_list_wise_count}`;
				},
			},

			{
				accessorKey: 'created_by_name',
				header: 'Created By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} />;
				},
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
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
					!haveAccess.includes('update') &&
					!haveAccess.includes('delete'),
				width: 'w-24',
				cell: (info) => (
					<EditDelete
						idx={info.row.index}
						handelUpdate={handelUpdate}
						handelDelete={handelDelete}
						showDelete={haveAccess.includes('delete')}
						showUpdate={haveAccess.includes('update')}
					/>
				),
			},
		],
		[data]
	);

	const handelAdd = () => navigate('/delivery/packing-list/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/delivery/packing-list/${uuid}/update`);
	};
	const handelReceivedStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${data[idx]?.uuid}`,
			updatedData: {
				is_warehouse_received:
					data[idx]?.is_warehouse_received === true ? false : true,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
		invalidateDeliveryChallan();
		invalidateOtherChallan();
		invalidateOtherOrder();
		invalidateOtherOrderSample();
		invalidateThreadOrderSample();
		invalidateThreadOrder();
	};
	const handelGatePass = async (idx) => {
		await updateData.mutateAsync({
			url: `${url}/${data[idx]?.uuid}`,
			updatedData: {
				gate_pass: data[idx]?.gate_pass === 1 ? 0 : 1,
				updated_at: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});

		invalidateDeliveryChallan();
		invalidateOtherChallan();
	};
	//handle PDf

	const handlePdf = async (idx) => {
		const uuid = data[idx]?.uuid;
		setPdfUuid(uuid);
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
				data={data}
				columns={columns}
				accessor={haveAccess.includes('create')}
				handelAdd={handelAdd}
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
