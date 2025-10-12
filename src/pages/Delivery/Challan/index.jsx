import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useDeliveryChallan } from '@/state/Delivery';
import { useNavigate } from 'react-router';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import SwitchToggle from '@/ui/Others/SwitchToggle';
import {
	CustomLink,
	DateTime,
	EditDelete,
	StatusButton,
	StatusSelect,
} from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

const DeleteModal = lazy(() => import('@/components/Modal/Delete'));

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return `all=true`;
};

const options = [
	{ value: 'all', label: 'All' },
	{ value: 'pending', label: 'Pending' },
	{ value: 'delivered', label: 'Delivered' },
	{ value: 'received', label: 'Received' },
	{ value: 'gate_pass', label: 'W/H Out' },
];

const orderTypeOptions = [
	{ value: 'all', label: 'All' },
	{ value: 'sample', label: 'Sample' },
	{ value: 'bulk', label: 'Bulk' },
];

const productTypeOptions = [
	{ value: 'all', label: 'All' },
	{ value: 'zipper', label: 'Zipper' },
	{ value: 'thread', label: 'Thread' },
];

export default function Index() {
	const [status, setStatus] = useState('received');
	const [orderType, setOrderType] = useState('bulk');
	const [productType, setProductType] = useState('all');
	const navigate = useNavigate();
	const haveAccess = useAccess('delivery__challan');
	const { user } = useAuth();

	const { data, isLoading, url, deleteData, updateData } = useDeliveryChallan(
		getPath(haveAccess, user?.uuid) +
			`&type=${status}&order_type=${orderType}&product_type=${productType}`,
		{ enabled: !!user?.uuid }
	);

	const info = new PageInfo('Challan', url, 'delivery__challan');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'is_hand_delivery',
				header: (
					<>
						Hand <br />
						Del.
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'gate_pass',
				header: (
					<>
						W/H <br />
						Out
					</>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton
						size='btn-sm'
						value={Number(info.getValue()) === 1}
					/>
				),
			},
			{
				accessorKey: 'is_out_for_delivery',
				header: (
					<>
						Out For <br />
						Del.
					</>
				),
				enableColumnFilter: false,
				cell: (info) => {
					const {
						is_out_for_delivery,
						gate_pass,
						is_out_for_delivery_by_name,
						is_out_for_delivery_date,
						is_delivered,
					} = info.row.original;

					const access = haveAccess.includes(
						'click_is_out_for_delivery'
					);
					const overrideAccess = haveAccess.includes(
						'click_is_out_for_delivery_override'
					);

					let permission = false;
					if (gate_pass === 1) {
						if (is_out_for_delivery === false && access)
							permission = true;
						if (overrideAccess) permission = true;
						if (is_delivered === 1) permission = false;
					}

					return (
						<div className='flex flex-col gap-1'>
							<SwitchToggle
								checked={info.getValue() === true}
								onChange={() =>
									handelIsOutForDelivery(info.row.index)
								}
								disabled={!permission}
							/>
							<DateTime date={is_out_for_delivery_date} />
							<span className=''>
								{is_out_for_delivery_by_name}
							</span>
						</div>
					);
				},
			},
			{
				accessorKey: 'is_delivered',
				header: 'Delivered',
				enableColumnFilter: false,
				cell: (info) => {
					const {
						is_delivered,
						is_out_for_delivery,
						is_delivered_by_name,
						is_delivered_date,
						receive_status,
					} = info.row.original;

					const access = haveAccess.includes('click_delivered');
					const overrideAccess = haveAccess.includes(
						'click_delivered_override'
					);
					let permission = false;
					if (is_out_for_delivery) {
						if (is_delivered === 0 && access) permission = true;
						if (overrideAccess) permission = true;
						if (receive_status === 1) permission = false;
					}

					return (
						<div className='flex flex-col gap-1'>
							<SwitchToggle
								checked={Number(info.getValue()) === 1}
								onChange={() =>
									handelDeliveryStatus(info.row.index)
								}
								disabled={!permission}
							/>
							<DateTime date={is_delivered_date} />
							<span className=''>{is_delivered_by_name}</span>
						</div>
					);
				},
			},
			// {
			// 	accessorFn: (row) => format(row.delivery_date, 'dd/MM/yy'),
			// 	id: 'delivery_date',
			// 	header: 'Challan Date',
			// 	enableColumnFilter: true,
			// 	width: 'w-32',
			// 	cell: (info) => {
			// 		const { delivery_date } = info.row.original;
			// 		const date = format(new Date(delivery_date), 'yyyy-MM-dd');
			// 		return (
			// 			<CustomLink
			// 				label={
			// 					<DateTime date={delivery_date} isTime={false} />
			// 				}
			// 				url={`/delivery/challan-by-date/${date}`}
			// 				openInNewTab
			// 			/>
			// 		);
			// 	},
			// },
			{
				accessorKey: 'receive_status',
				header: 'Received',
				enableColumnFilter: false,
				cell: (info) => {
					const {
						is_delivered,
						receive_status,
						receive_status_by_name,
						receive_status_date,
					} = info.row.original;

					const access = haveAccess.includes('click_receive_status');
					const overrideAccess = haveAccess.includes(
						'click_receive_status_override'
					);
					let permission = false;
					if (is_delivered === 1) {
						if (receive_status === 0 && access) permission = true;
						if (overrideAccess) permission = true;
					}

					return (
						<div className='flex flex-col'>
							<SwitchToggle
								checked={Number(info.getValue()) === 1}
								onChange={() =>
									handelReceiveStatus(info.row.index)
								}
								disabled={!permission}
							/>
							<DateTime date={receive_status_date} />
							<span className=''>{receive_status_by_name}</span>
						</div>
					);
				},
			},

			{
				accessorKey: 'challan_number',
				header: 'Challan ID',
				width: 'w-40',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<CustomLink
							label={info.getValue()}
							url={`/delivery/challan/${uuid}`}
							openInNewTab
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
					const url =
						item_for === 'thread' || item_for === 'sample_thread'
							? `/thread/order-info/${order_info_uuid}`
							: `/order/details/${info.getValue()}`;

					return (
						<CustomLink
							label={info.getValue()}
							url={url}
							openInNewTab
						/>
					);
				},
			},
			{
				//* joining packing list numbers
				accessorFn: (row) =>
					row.packing_list_numbers
						?.map((item) => item.packing_number)
						?.join(', '),
				id: 'packing_list_numbers',
				header: 'Packing List',
				width: 'w-36',
				enableColumnFilter: false,
				cell: (info) => {
					const { packing_list_numbers } = info.row.original;

					return packing_list_numbers?.map((packingList) => {
						if (packingList === 'PL-') return '-';
						return (
							<CustomLink
								key={packingList.packing_number}
								label={packingList.packing_number}
								url={`/delivery/packing-list/${packingList.packing_list_uuid}`}
								openInNewTab
							/>
						);
					});
				},
			},

			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-24',
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer',
				enableColumnFilter: false,
				width: 'w-24',
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
				accessorKey: 'total_carton_quantity',
				header: 'Carton QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_poly_quantity',
				header: 'Poly QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total QTY',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'vehicle_name',
				header: 'Assign To',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'name',
				header: 'Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'delivery_cost',
				header: 'Cost',
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
							haveAccess.includes('delete') &&
							info.row.original?.packing_numbers?.length < 2 &&
							info.row.original?.gate_pass == 0
						}
						showUpdate={haveAccess.includes('update')}
					/>
				),
			},
		],
		[data]
	);

	// Receive Status
	const handelReceiveStatus = async (idx) => {
		const challan = data[idx];
		const status = challan?.receive_status == 1 ? 0 : 1;

		await updateData.mutateAsync({
			url: `/delivery/challan/update-receive-status/${challan?.uuid}`,
			uuid: challan?.uuid,
			updatedData: {
				receive_status: status,
				receive_status_by: status ? user?.uuid : null,
				receive_status_date: status ? GetDateTime() : null,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
	};
	const handelDeliveryStatus = async (idx) => {
		const challan = data[idx];
		const status = challan?.is_delivered == 1 ? 0 : 1;

		await updateData.mutateAsync({
			url: `/delivery/challan/update-delivered/${challan?.uuid}`,
			uuid: challan?.uuid,
			updatedData: {
				is_delivered: status,
				is_delivered_by: status ? user?.uuid : null,
				is_delivered_date: status ? GetDateTime() : null,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const handelIsOutForDelivery = async (idx) => {
		const challan = data[idx];
		const status = challan?.is_out_for_delivery == true ? false : true;

		await updateData.mutateAsync({
			url: `/delivery/challan/is-out-for-delivery/${challan?.uuid}`,
			uuid: challan?.uuid,
			updatedData: {
				is_out_for_delivery: status,
				is_out_for_delivery_by: user?.uuid,
				is_out_for_delivery_date: status ? GetDateTime() : null,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const handelAdd = () => navigate('/delivery/challan/entry');

	const handelUpdate = (idx) => {
		const uuid = data[idx]?.uuid;
		navigate(`/delivery/challan/${uuid}/update`);
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
			itemName: data[idx].challan_number,
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
					<>
						<StatusSelect
							status={status}
							setStatus={setStatus}
							options={options}
						/>
						<StatusSelect
							status={orderType}
							setStatus={setOrderType}
							options={orderTypeOptions}
						/>
						<StatusSelect
							status={productType}
							setStatus={setProductType}
							options={productTypeOptions}
						/>
					</>
				}
			/>

			<Suspense>
				<DeleteModal
					modalId={info.getDeleteModalId()}
					title={info.getTitle()}
					url={`/delivery/challan/delete-challan-packing-list-ref/${deleteItem.itemName}`}
					{...{
						deleteItem,
						setDeleteItem,
						deleteData,
					}}
				/>
			</Suspense>
		</div>
	);
}
