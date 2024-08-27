import ReactTable from '@/components/Table';
import { useAuth } from '@/context/auth';
import { useFetchFuncForReport } from '@/hooks';
import { useEffect, useMemo, useState } from 'react';

const dateConversion = (date) =>
	new Date(date).toLocaleString('en-GB', {
		day: 'numeric',
		month: 'numeric',
		year: '2-digit',
	});

export default function Index() {
	const { user } = useAuth();
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
	const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
	const [stockPerDay, setStockPerDay] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const finalValue = useMemo(() => {
		return stockPerDay.map((row) => {
			return {
				...row,
			};
		});
	}, [stockPerDay]);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'material_name',
				header: 'Name',
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
				accessorKey: 'purchased_quantity',
				header: 'Purchased',
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
		[finalValue]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFuncForReport(
			`/report/stock-range/of/${date}/${toDate}/new`,
			setStockPerDay,
			setLoading,
			setError
		);
	}, [date, toDate]);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	const fromToDate = `${dateConversion(date)} to ${dateConversion(toDate)}`;
	const title = `Ledger: ${fromToDate}`;

	return (
		<div className=''>
			<ReactTable
				title={title}
				data={finalValue}
				columns={columns}
				extraClass={'py-3'}
				fromDate={date}
				toDate={toDate}
				setFromDate={setDate}
				setToDate={setToDate}
				multiDateRange={true}
				error={error}
			/>
		</div>
	);
}
