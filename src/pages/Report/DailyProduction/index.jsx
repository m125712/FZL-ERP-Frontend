import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useProductionReportDateWise, useReportStock } from '@/state/Report';
import { formToJSON } from 'axios';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/DailyProduction';
import ReactTable from '@/components/Table';

import PageInfo from '@/util/PageInfo';

import Excel from './Excel';
import Header from './Header';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function index() {
	const haveAccess = useAccess('report__daily_production');
	const { user } = useAuth();

	const info = new PageInfo(
		'Daily Production',
		null,
		'report__daily_production'
	);

	const [from, setFrom] = useState(new Date());
	const [to, setTo] = useState(new Date());
	const [type, setType] = useState('all');
	const { data, isLoading } = useProductionReportDateWise(
		format(from, 'yyyy-MM-dd'),
		format(to, 'yyyy-MM-dd'),
		type,
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<>
			<div className='flex flex-col gap-8'>
				<Header {...{ from, setFrom, to, setTo, type, setType }} />
				<div className='flex gap-2'>
					<button
						type='button'
						onClick={() => {
							Pdf(data, from)?.print(
								{},
								window.open('', '_blank')
							);
						}}
						className='btn btn-primary flex-1'
					>
						PDF
					</button>
					<button
						type='button'
						onClick={() => {
							Excel(data, from, to);
						}}
						className='btn btn-secondary flex-1'
					>
						Excel
					</button>
				</div>
			</div>
		</>
	);
}
