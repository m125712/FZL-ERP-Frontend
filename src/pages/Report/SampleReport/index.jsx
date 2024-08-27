import GeneratePdf from '@/components/Pdf';
import ReactTable from '@/components/Table';
import { useAuth } from '@/context/auth';
import { useFetchFunc } from '@/hooks';
import { DateTime } from '@/ui';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

const DateFormate = (date) => format(new Date(date), 'dd-MM-yy');
export default function Index() {
	const { user } = useAuth();
	const [sampleReport, setSampleReport] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const columns = useMemo(
		() => [
			{
				accessorKey: 'order_number',
				header: 'O/N',
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
				accessorKey: 'marketing_name',
				header: 'Marketing Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'buyer_name',
				header: 'Buyer Name',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
			{
				accessorKey: 'booking_date',
				header: 'Booking Date',
				enableColumnFilter: false,
				cell: (info) => <DateTime date={info.getValue()} />,
			},
			{
				accessorKey: 'completion_date',
				header: 'Completion Date',
				enableColumnFilter: false,
				cell: (info) => {
					const { total_production_quantity, quantity } =
						info.row.original;
					if (quantity === total_production_quantity) {
						return <DateTime date={info.getValue()} />;
					} else {
						return 'Running Order';
					}
				},
			},
			{
				accessorKey: 'remarks',
				header: 'Remarks',
				enableColumnFilter: false,
				cell: (info) => info.getValue(),
			},
		],
		[sampleReport]
	);

	// Fetching data from server
	useEffect(() => {
		useFetchFunc(`/report/sample`, setSampleReport, setLoading, setError);
	}, []);

	if (loading)
		return <span className='loading loading-dots loading-lg z-50' />;
	// if (error) return <h1>Error:{error}</h1>;

	const date = format(new Date(), 'dd-MM-yy');
	const title = `Sample Report: ` + date;

	// PDF info
	const PDFinfo = {
		headers: [
			'Order Number',
			'Item Description',
			'Marketing Name',
			'Buyer Name',
			'Booking Date',
			'Completion Date',
			'Remarks',
		],
		pdfData: sampleReport.map((elt) => [
			elt.order_number,
			elt.item_description,
			elt.marketing_name,
			elt.buyer_name,
			DateFormate(elt.booking_date),
			elt.quantity == elt.total_production_quantity
				? DateFormate(elt.completion_date)
				: 'Running',
			elt.remarks,
		]),
		reportName: 'Sample Report',
		extraInfo: date.toString(),
		printedBy: user.name,
		orientation: 'landscape',
	};

	return (
		<div className=''>
			<ReactTable
				title={title}
				data={sampleReport}
				columns={columns}
				extraClass='py-2'
				onClickPdfDownload={() => GeneratePdf(PDFinfo)}
			/>
		</div>
	);
}
