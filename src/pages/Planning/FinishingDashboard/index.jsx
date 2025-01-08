import { useEffect, useState } from 'react';
import { useDyeingFinishingDashboard } from '@/state/Dyeing';
import { format } from 'date-fns';

import PageInfo from '@/util/PageInfo';

import Content from './Content/Content';
import Header from './Header';

export default function index() {
	const info = new PageInfo(
		'Finishing Dashboard',
		'/planning/finishing-dashboard',
		'planning__finishing_dashboard'
	);

	const [from, setFrom] = useState(format(new Date(), 'yyyy-MM-dd'));
	const [to, setTo] = useState(format(new Date(), 'yyyy-MM-dd'));
	const { data } = useDyeingFinishingDashboard(from, to, {
		enabled: !!(from && to),
	});

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col'>
			<Header {...{ from, setFrom, to, setTo }} />
			<Content data={data} />
		</div>
	);
}
