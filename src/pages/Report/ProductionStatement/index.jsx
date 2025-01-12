import { useEffect, useMemo, useState } from 'react';
import { useProductionStatementReport } from '@/state/Report';
import { format } from 'date-fns';

import Pdf from '@/components/Pdf/ProductionStatement';

import PageInfo from '@/util/PageInfo';

import Excel from './Excel';
import Header from './Header';

export default function index() {
	const info = new PageInfo(
		'Daily Production',
		null,
		'report__daily_production'
	);

	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [marketing, setMarketing] = useState();
	const [type, setType] = useState();
	const [party, setParty] = useState();
	const { data, isLoading } = useProductionStatementReport(
		from,
		to,
		party,
		marketing,
		type
	);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_section_name',
				header: 'Section',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_name',
				header: 'Material',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'material_unit',
				header: 'Unit',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'opening_quantity',
				header: 'Opening',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'purchase_quantity',
				header: 'Purchase',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'consumption_quantity',
				header: 'Consumption',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'closing_quantity',
				header: 'Closing',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[data]
	);
	useEffect(() => {
		document.title = info.getTabName();
	}, []);
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<div className='flex flex-col gap-8'>
				<Header
					{...{
						from,
						setFrom,
						to,
						setTo,
						party,
						setParty,
						marketing,
						setMarketing,
						type,
						setType,
					}}
				/>
				<button
					type='button'
					onClick={() => {
						Pdf(data, from, to)?.print({}, window);
					}}
					className='btn btn-primary'>
					Generate PDF
				</button>
				<button
					type='button'
					onClick={() => {
						Excel(data, from, to);
					}}
					className='btn btn-primary'>
					Generate Excel
				</button>
			</div>
		</>
	);
}
