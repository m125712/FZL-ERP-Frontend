import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import {
	useDeliveryChallan,
	useDeliveryPackingList,
	useDeliveryPackingListDetailsByUUID,
} from '@/state/Delivery';
import { useOtherChallan, useOtherOrder, useThreadOrder } from '@/state/Other';
import { getDate, isSameMonth } from 'date-fns';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import Pdf2 from '@/components/Pdf/PackingListSticker';
import Pdf from '@/components/Pdf/ThreadPackeListStickerV2';
import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import { DateTime, EditDelete, LinkWithCopy, StatusSelect } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

const options = [
	{ value: 'all', label: 'All' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'challan', label: 'Challan' },
	{ value: 'gate_pass', label: 'W/H Out' },
	{ value: 'deleted', label: 'Deleted' },
];

const accessDays = (date) => {
	const today = new Date();
	const giveDayNo = getDate(date);
	const todayDayNo = getDate(today);
	const sameMonth = isSameMonth(date, new Date());

	if (sameMonth) {
		if (
			todayDayNo >= 1 &&
			todayDayNo <= 15 &&
			giveDayNo >= 1 &&
			giveDayNo <= 15
		) {
			return true;
		}

		if (
			todayDayNo > 15 &&
			todayDayNo <= 31 &&
			giveDayNo > 15 &&
			giveDayNo <= 31
		) {
			return true;
		}

		return false;
	} else {
		return false;
	}
};

export default function Index() {
	const { user } = useAuth();
	const [status, setStatus] = useState('pending');

	const navigate = useNavigate();
	const haveAccess = useAccess('delivery__packing_list_sample');
	const access = haveAccess?.filter(
		(item) =>
			item == 'thread' ||
			item == 'sample_zipper' ||
			item == 'zipper' ||
			item == 'all'
	);
	const { data, isLoading, url, deleteData, updateData } =
		useDeliveryPackingList(
			`?can_show=${access.join(',')}&type=${status}&order_type=sample`
		);
	const info = new PageInfo(
		'Packing List Sample',
		url,
		'delivery__packing_list_sample'
	);

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
		if (
			pdfData &&
			!pdfLoading &&
			pdfData?.item_for !== 'thread' &&
			pdfData?.item_for !== 'sample_thread'
		) {
			Pdf2(pdfData)?.print({}, window);
			setPdfUuid(null);
		} else if (
			pdfData &&
			!pdfLoading &&
			(pdfData?.item_for === 'thread' ||
				pdfData?.item_for === 'sample_thread')
		) {
			Pdf(pdfData)?.print({}, window);
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
				cell: (info) => (
					<button
						type='button'
						className='btn btn-accent btn-sm font-semibold text-white shadow-md'
						disabled={pdfLoading}
						onClick={() => handlePdf(info.row.index)}
					>
						<BookOpen />
					</button>
				),
			},
			{
				accessorKey: 'packing_number',
				header: 'Packing List',
				width: 'w-36',
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
				accessorKey: 'order_number',
				header: 'O/N',
				width: 'w-40',
				cell: (info) => {
					const { order_info_uuid, item_for } = info.row.original;

					if (item_for === 'thread' || item_for === 'sample_thread') {
						return (
							<LinkWithCopy
								title={info.getValue()}
								id={order_info_uuid}
								uri='/thread/order-info'
							/>
						);
					}
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={info.getValue()}
							uri='/order/details'
						/>
					);
				},
			},
			{
				accessorKey: 'item_name',
				header: 'Item',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
					const {
						challan_uuid,
						is_warehouse_received,
						gate_pass,
						warehouse_received_date,
						warehouse_received_by_name,
					} = info.row.original;

					let permission = false;
					if (challan_uuid === null && !gate_pass) {
						if (!is_warehouse_received && access) permission = true;
						if (overrideAccess) permission = true;
					}
					return (
						<div className='flex flex-col'>
							<SwitchToggle
								disabled={!permission}
								onChange={() => {
									handelReceivedStatus(info.row.index);
								}}
								checked={info.getValue() === true}
							/>
							<DateTime date={warehouse_received_date} />
							<span className=''>
								{warehouse_received_by_name}
							</span>
						</div>
					);
				},
			},
			// {
			// 	accessorKey: 'warehouse_received_date',
			// 	header: 'Received Date',
			// 	enableColumnFilter: false,
			// 	filterFn: 'isWithinRange',
			// 	cell: (info) => {
			// 		return <DateTime date={info.getValue()} />;
			// 	},
			// },
			// {
			// 	accessorKey: 'warehouse_received_by_name',
			// 	header: 'Received By',
			// 	enableColumnFilter: false,
			// 	filterFn: 'isWithinRange',
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'challan_number',
				header: 'Challan',
				enableColumnFilter: true,
				width: 'w-36',
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
				accessorKey: 'gate_pass',
				header: (
					<span>
						Warehouse <br />
						Out
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const access = haveAccess.includes('click_gate_pass');
					const overrideAccess = haveAccess.includes(
						'click_gate_pass_override'
					);
					const {
						challan_uuid,
						is_warehouse_received,
						gate_pass,
						gate_pass_date,
						gate_pass_by_name,
					} = info.row.original;

					let permission = false;
					if (is_warehouse_received && challan_uuid !== null) {
						if (!gate_pass && access) permission = true;
						if (overrideAccess) permission = true;
					}

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								checked={info.getValue() === 1}
								onChange={() => handelGatePass(info.row.index)}
								disabled={!permission}
							/>
							<DateTime date={gate_pass_date} />
							<span>{gate_pass_by_name}</span>
						</div>
					);
				},
			},
			// {
			// 	accessorKey: 'gate_pass_date',
			// 	header: (
			// 		<span>
			// 			Warehouse <br />
			// 			Out Date
			// 		</span>
			// 	),
			// 	enableColumnFilter: false,
			// 	filterFn: 'isWithinRange',
			// 	cell: (info) => {
			// 		return <DateTime date={info.getValue()} />;
			// 	},
			// },
			// {
			// 	accessorKey: 'gate_pass_by_name',
			// 	header: (
			// 		<span>
			// 			Warehouse <br />
			// 			Out By
			// 		</span>
			// 	),
			// 	enableColumnFilter: false,
			// 	filterFn: 'isWithinRange',
			// 	cell: (info) => info.getValue(),
			// },
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorFn(row) {
					const { color } = row;
					return color?.join(', ') || '--';
				},
				id: 'color',
				header: 'Colors',
				enableColumnFilter: false,
				width: 'w-32',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'count',
				header: 'Count',
				enableColumnFilter: false,
				cell: (info) => {
					const { packing_list_wise_rank, packing_list_wise_count } =
						info.row.original;

					return `${packing_list_wise_rank}/${packing_list_wise_count}`;
				},
			},
			{
				accessorKey: 'total_quantity',
				header: 'QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_poly_quantity',
				header: 'Poly',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorFn(row) {
					if (row.item_for === 'thread') {
						return Math.ceil(
							row.total_quantity / row.cone_per_carton || 1
						);
					} else {
						return 1;
					}
				},
				id: 'carton_quantity',
				header: 'Carton Qty',
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
				header: 'Weight',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
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
			// {
			// 	accessorKey: 'date_count',
			// 	header: 'Days',
			// 	enableColumnFilter: false,
			// 	cell: (info) => {
			// 		const { created_at } = info.row.original;
			// 		const days = accessDays(created_at);
			// 		return (
			// 			<span className='badge badge-secondary badge-sm'>
			// 				{days ? 'Access' : 'No Access'}
			// 			</span>
			// 		);
			// 	},
			// },
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
						showDelete={
							(accessDays(info.row.original.created_at) &&
								haveAccess.includes('delete') &&
								!info.row.original.is_warehouse_received) ||
							haveAccess.includes('override_access')
						}
						showUpdate={
							(accessDays(info.row.original.created_at) &&
								haveAccess.includes('update') &&
								!info.row.original.is_warehouse_received) ||
							haveAccess.includes('override_access')
						}
					/>
				),
			},
		],
		[data]
	);

	const handelAdd = () => navigate('/delivery/packing-list-sample/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/delivery/packing-list-sample/${uuid}/update`);
	};
	const handelReceivedStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `/delivery/packing-list/${data[idx]?.uuid}`,
			updatedData: {
				is_warehouse_received:
					data[idx]?.is_warehouse_received === true ? false : true,
				warehouse_received_date:
					data[idx]?.is_warehouse_received === true
						? null
						: GetDateTime(),
				warehouse_received_by: user.uuid,
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
			url: `/delivery/packing-list/${data[idx]?.uuid}`,
			updatedData: {
				gate_pass: data[idx]?.gate_pass === 1 ? 0 : 1,
				gate_pass_date:
					data[idx]?.gate_pass === 1 ? null : GetDateTime(),
				gate_pass_by: user.uuid,
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
				extraButton={
					<StatusSelect
						options={options}
						status={status}
						setStatus={setStatus}
					/>
				}
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					{...{
						deleteItem,
						setDeleteItem,
						url: `/delivery/packing-list`,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
