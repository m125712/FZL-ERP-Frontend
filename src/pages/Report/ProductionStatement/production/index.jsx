import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionStatementReport } from '@/state/Report';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/ProductionStatement';

import Excel from './Excel';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__production_statement');
	const { user } = useAuth();

	const [get, setGet] = useState(false);
	const [exportType, setExportType] = useState(null); // 'pdf' or 'excel'

	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [marketing, setMarketing] = useState();
	const [type, setType] = useState();
	const [priceFor, setPriceFor] = useState('company');
	const [party, setParty] = useState();
	const [order, setOrder] = useState('');
	const [reportFor, setReportFor] = useState('');
	const { data, isLoading } = useProductionStatementReport(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		party,
		marketing,
		type,
		order,
		reportFor,
		priceFor,
		getPath(haveAccess, user?.uuid),
		{
			isEnabled: !!user?.uuid && get,
		}
	);

	useEffect(() => {
		if (get && data && !isLoading) {
			if (exportType === 'pdf') {
				Pdf(data, from, to)?.open();
			} else if (exportType === 'excel') {
				Excel(data, from, to);
			}
			setGet(false);
			setExportType(null);
		}
	}, [get, data, isLoading, exportType, from, to]);

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
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
					order,
					setOrder,
					reportFor,
					setReportFor,
					priceFor,
					setPriceFor,
				}}
			/>
			<div className='flex gap-2'>
				<button
					type='button'
					onClick={() => {
						setExportType('pdf');
						setGet(true);
					}}
					className='btn btn-primary flex-1'
				>
					PDF
				</button>
				<button
					type='button'
					onClick={() => {
						setExportType('excel');
						setGet(true);
					}}
					className='btn btn-secondary flex-1'
				>
					Excel
				</button>
			</div>
		</div>
	);
}
