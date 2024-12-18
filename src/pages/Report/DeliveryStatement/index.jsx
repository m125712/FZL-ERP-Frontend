import { useEffect, useMemo } from 'react';
import { useDeliveryStatement } from '@/state/Report';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { data, isLoading, url } = useDeliveryStatement();
	const info = new PageInfo(
		'Delivery Statement',
		url,
		'report__delivery_statement'
	);

	const haveAccess = useAccess('report__delivery_statement');

	const val = [
		{
			order_info_uuid: 'p5YsBahYMDxNNel',
			order_number: 'Z24-0053',
			party_uuid: 'dDyPAEculX3tDrY',
			party_name: 'Designer Fashion Ltd.',
			order_description_uuid: 'HQvuUeOglM193XD',
			item_description: 'M-4.5-CE-YG-WL',
			end_type: 'eE9nM0TDosBNqoT',
			end_type_name: 'Close End',
			size: '10 - 9.5',
			opening_total_close_end_quantity: 2606,
			opening_total_open_end_quantity: 0,
			opening_total_quantity: 2606,
			opening_total_quantity_dzn: 217.16666666666666,
			opening_unit_price_dzn: 1.05,
			opening_unit_price_pcs: 0.0875,
			opening_total_close_end_value: 228.02499999999998,
			opening_total_open_end_value: 0,
			opening_total_value: 228.02499999999998,
			challan_numbers: 'ZC24-0007',
			challan_date: '2024-12-17 14:42:22',
			running_total_close_end_quantity: 2606,
			running_total_open_end_quantity: 0,
			running_total_quantity: 2606,
			running_total_quantity_dzn: 217.16666666666666,
			running_unit_price_dzn: 1.05,
			running_unit_price_pcs: 0.0875,
			running_total_close_end_value: 228.02499999999998,
			running_total_open_end_value: 0,
			running_total_value: 228.02499999999998,
		},
		{
			order_info_uuid: 'p5YsBahYMDxNNel',
			order_number: 'Z24-0053',
			party_uuid: 'dDyPAEculX3tDrY',
			party_name: 'Designer Fashion Ltd.',
			order_description_uuid: 'HQvuUeOglM193XD',
			item_description: 'M-4.5-CE-YG-WL',
			end_type: 'eE9nM0TDosBNqoT',
			end_type_name: 'Close End',
			size: '10 - 9.5',
			opening_total_close_end_quantity: 2606,
			opening_total_open_end_quantity: 0,
			opening_total_quantity: 2606,
			opening_total_quantity_dzn: 217.16666666666666,
			opening_unit_price_dzn: 1.05,
			opening_unit_price_pcs: 0.0875,
			opening_total_close_end_value: 228.02499999999998,
			opening_total_open_end_value: 0,
			opening_total_value: 228.02499999999998,
			challan_numbers: 'ZC24-0007',
			challan_date: '2024-12-17 14:42:22',
			running_total_close_end_quantity: 13866,
			running_total_open_end_quantity: 0,
			running_total_quantity: 13866,
			running_total_quantity_dzn: 1155.5,
			running_unit_price_dzn: 1.15,
			running_unit_price_pcs: 0.09583333333333334,
			running_total_close_end_value: 1328.825,
			running_total_open_end_value: 0,
			running_total_value: 1328.825,
		},
		{
			order_info_uuid: 'p5YsBahYMDxNNel',
			order_number: 'Z24-0053',
			party_uuid: 'dDyPAEculX3tDrY',
			party_name: 'Designer Fashion Ltd.',
			order_description_uuid: 'HQvuUeOglM193XD',
			item_description: 'M-4.5-CE-YG-WL',
			end_type: 'eE9nM0TDosBNqoT',
			end_type_name: 'Close End',
			size: '10 - 9.5',
			opening_total_close_end_quantity: 13866,
			opening_total_open_end_quantity: 0,
			opening_total_quantity: 13866,
			opening_total_quantity_dzn: 1155.5,
			opening_unit_price_dzn: 1.15,
			opening_unit_price_pcs: 0.09583333333333334,
			opening_total_close_end_value: 1328.825,
			opening_total_open_end_value: 0,
			opening_total_value: 1328.825,
			challan_numbers: 'ZC24-0007',
			challan_date: '2024-12-17 14:42:22',
			running_total_close_end_quantity: 2606,
			running_total_open_end_quantity: 0,
			running_total_quantity: 2606,
			running_total_quantity_dzn: 217.16666666666666,
			running_unit_price_dzn: 1.05,
			running_unit_price_pcs: 0.0875,
			running_total_close_end_value: 228.02499999999998,
			running_total_open_end_value: 0,
			running_total_value: 228.02499999999998,
		},
		{
			order_info_uuid: 'p5YsBahYMDxNNel',
			order_number: 'Z24-0053',
			party_uuid: 'dDyPAEculX3tDrY',
			party_name: 'Designer Fashion Ltd.',
			order_description_uuid: 'HQvuUeOglM193XD',
			item_description: 'M-4.5-CE-YG-WL',
			end_type: 'eE9nM0TDosBNqoT',
			end_type_name: 'Close End',
			size: '10 - 9.5',
			opening_total_close_end_quantity: 13866,
			opening_total_open_end_quantity: 0,
			opening_total_quantity: 13866,
			opening_total_quantity_dzn: 1155.5,
			opening_unit_price_dzn: 1.15,
			opening_unit_price_pcs: 0.09583333333333334,
			opening_total_close_end_value: 1328.825,
			opening_total_open_end_value: 0,
			opening_total_value: 1328.825,
			challan_numbers: 'ZC24-0007',
			challan_date: '2024-12-17 14:42:22',
			running_total_close_end_quantity: 13866,
			running_total_open_end_quantity: 0,
			running_total_quantity: 13866,
			running_total_quantity_dzn: 1155.5,
			running_unit_price_dzn: 1.15,
			running_unit_price_pcs: 0.09583333333333334,
			running_total_close_end_value: 1328.825,
			running_total_open_end_value: 0,
			running_total_value: 1328.825,
		},
	];

	const columns = useMemo(
		() => [
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'order_number',
				header: 'O/N',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_description',
				header: 'item',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size (cm)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_close_end_quantity',
				header: 'C/E',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_open_end_quantity',
				header: 'O/E',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity',
				header: 'Total',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_quantity_dzn',
				header: 'Total (Dzn)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit_price_dzn',
				header: 'Unit Price Dzn',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'unit_price_pcs',
				header: 'Unit Price Pcs',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'total_value',
				header: 'Total Value',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<ReactTable
				title={info.getTitle()}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
			/>
		</>
	);
}
