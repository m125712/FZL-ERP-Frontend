import { useEffect, useMemo, useState } from 'react';
import { useOtherOrderPropertiesByItem } from '@/state/Other';
import { usePlanningDateWiseBatchReport } from '@/state/Planning';
import { usePIToBeSubmitted } from '@/state/Report';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/BatchReportDateWise';
import ReactTable from '@/components/Table';
import ReactTableTitleOnly from '@/components/Table/ReactTableTitleOnly';
import { DateTime, ReactSelect, StatusButton } from '@/ui';

import PageInfo from '@/util/PageInfo';

export default function Index() {
	const { date } = useParams();
	const [selectItem, setSelectItem] = useState('all');
	const { data, isLoading, url } = usePlanningDateWiseBatchReport(
		date,
		selectItem
	);
	const items = [
		{ value: 'all', label: 'All' },
		{ value: 'nylon_plastic', label: 'Nylon Plastic' },
		{ value: 'nylon', label: 'Nylon' },
		{ value: 'metal', label: 'Metal' },
		{ value: 'vislon ', label: 'Vislon' },
	];

	console.log(items);
	const info = new PageInfo(
		`Daily Production Plan (${format(new Date(date), 'dd/MM/yyyy')})`,
		url,
		'planning__finishing_dashboard_batch_report'
	);

	const haveAccess = useAccess('planning__finishing_dashboard_batch_report');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'batch_number',
				header: 'B/N',
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
				accessorKey: 'party_name',
				header: 'Party',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'item_description',
				header: 'Item Description',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'style',
				header: 'Style',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'color',
				header: 'Color',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'size',
				header: 'Size',
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
				accessorKey: 'quantity',
				header: 'Batch Qty',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);
	const [data2, setData] = useState('');
	const item = items?.find((item) => item.value === selectItem)?.label;

	useEffect(() => {
		if (data) {
			Pdf(data, date, item)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [data, selectItem]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<iframe
				src={data2}
				className='h-[40rem] w-full rounded-md border-none'
			/>

			<ReactTableTitleOnly
				title={
					<div className='my-2 flex items-center gap-4'>
						{`Daily Production Plan (${format(new Date(date), 'dd/MM/yyyy')})`}
						<div className='w-40'>
							<ReactSelect
								placeholder='Select Item'
								options={items}
								value={items?.find(
									(item) => item.value === selectItem
								)}
								onChange={(e) => setSelectItem(e.value)}
							/>
						</div>
					</div>
				}
				accessor={false}
				data={data}
				columns={columns}
				extraClass={'py-0.5'}
			/>
		</>
	);
}
