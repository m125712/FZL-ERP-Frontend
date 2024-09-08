import ReactTable from '@/components/Table';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { useFetchFunc } from '@/hooks';

import { DateTime } from '@/ui';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Index() {
	const { slider_slider_assembly_uuid } = useParams();
	const [slider, setSlider] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		document.title = 'Assembly Details';
	}, []);

	useEffect(() => {
		useFetchFunc(
			`/slider/slider-assembly/details/by/${slider_slider_assembly_uuid}`,
			setSlider,
			setLoading,
			setError
		);
	}, [slider]);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'Order Number',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_name',
				header: 'Item Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_quantity',
				header: 'Production QTY (PCS)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'production_weight',
				header: 'Production Weight (KG)',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'weight',
				header: 'Weight (PCS/KG)',
				enableColumnFilter: false,
				cell: (info) => {
					const { production_quantity, production_weight } =
						info.row.original;
					if (production_quantity && production_weight) {
						return (
							production_quantity / production_weight
						).toFixed(4);
					} else {
						return 0;
					}
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'issued_by_name',
				header: 'Issued By',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'created_at',
				header: 'Created At',
				enableColumnFilter: false,
				cell: (info) => <DateTime value={info.getValue()} />,
			},
			{
				accessorKey: 'updated_at',
				header: 'Updated At',
				enableColumnFilter: false,
				cell: (info) => <DateTime value={info.getValue()} />,
			},
		],
		[slider]
	);

	return (
		<ReactTableTitleOnly title='Details' data={slider} columns={columns} />
	);
}
