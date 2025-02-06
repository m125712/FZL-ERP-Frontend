import { useEffect, useMemo, useState } from 'react';
import { useReportStock } from '@/state/Report';
import { format, startOfMonth, subMonths } from 'date-fns';

import ReactTable from '@/components/Table';
import { SimpleDatePicker } from '@/ui';

import PageInfo from '@/util/PageInfo';

import Approved from './Approved';
import Store from './Store';

export default function index() {
	const info = new PageInfo('Store', null, 'report__store');

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<Store />
			<Approved />
		</div>
	);
}
