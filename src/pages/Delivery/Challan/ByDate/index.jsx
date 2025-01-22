import { useEffect, useMemo, useState } from 'react';
import { useDeliveryChallan } from '@/state/Delivery';
import { useOtherVehicle } from '@/state/Other';
import { useParams } from 'react-router-dom';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/ChallanByDate';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, LinkWithCopy, ReactSelect, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const [vehicle, setVehicle] = useState('all');
	const { date } = useParams();

	const { data: vehicles } = useOtherVehicle();
	const modifiedVehicles = vehicles
		? [...vehicles, { label: 'All', value: 'all' }]
		: [];

	const { data, isLoading, url, updateData } = useDeliveryChallan(
		`?delivery_date=${date}&vehicle=${vehicle}`
	);

	const info = new PageInfo(`Challan `, url, 'delivery__challan_by_date');
	const haveAccess = useAccess('delivery__challan_by_date');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'is_hand_delivery',
				header: (
					<span>
						Hand
						<br />
						Delivery
					</span>
				),
				enableColumnFilter: false,
				cell: (info) => (
					<StatusButton size='btn-sm' value={info.getValue()} />
				),
			},
			{
				accessorKey: 'challan_number',
				header: 'ID',
				cell: (info) => {
					const { uuid } = info.row.original;
					return (
						<LinkWithCopy
							title={info.getValue()}
							id={uuid}
							uri='/delivery/challan'
						/>
					);
				},
			},
			{
				accessorKey: 'packing_list_numbers',
				id: 'packing_list',
				header: 'Packing List',
				width: 'w-28',
				enableColumnFilter: false,
				cell: (info) => {
					return info?.getValue()?.map((packingList, index) => {
						if (packingList === 'PL-') return '-';
						return (
							<LinkWithCopy
								key={packingList.packing_number}
								title={packingList.packing_number}
								id={packingList.packing_list_uuid}
								uri='/delivery/packing-list'
							/>
						);
					});
				},
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				cell: (info) => {
					const { order_number } = info.row.original;
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
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				width: 'w-24',
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
				header: 'Delivery Cost',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'gate_pass',
				header: 'Gate Pass',
				enableColumnFilter: false,
				cell: (info) => {
					return (
						<StatusButton
							size='btn-sm'
							value={Number(info.getValue()) === 1}
						/>
					);
				},
			},
			{
				accessorKey: 'delivery_date',
				header: 'Delivery Date',
				enableColumnFilter: false,
				filterFn: 'isWithinRange',
				cell: (info) => {
					return <DateTime date={info.getValue()} isTime={false} />;
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
		],
		[data]
	);

	const [data2, setData] = useState('');

	useEffect(() => {
		if (data) {
			Pdf(data)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [data]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='flex flex-col gap-6'>
			<iframe
				src={data2}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<ReactTableTitleOnly
				title={
					<div className='my-2'>
						{`Delivery Date: ${date}`}
						<ReactSelect
							placeholder='Select Vehicle'
							options={modifiedVehicles}
							value={modifiedVehicles?.find(
								(item) => item.value === vehicle
							)}
							onChange={(e) => setVehicle(e.value)}
						/>
					</div>
				}
				data={data}
				columns={columns}
			/>
		</div>
	);
}
