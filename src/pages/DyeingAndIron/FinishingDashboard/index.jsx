import { useEffect, useMemo, useState } from 'react';
import { useDyeingFinishingDashboard } from '@/state/Dyeing';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

import Content from './Content/Content';
import Header from './Header';

export default function index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('dyeing__finishing_dashboard');

	const info = new PageInfo(
		'Finishing Dashboard',
		'/dyeing-and-iron/finishing-dashboard',
		'dyeing__finishing_dashboard'
	);

	const [from, setFrom] = useState('');
	const [to, setFTo] = useState('');
	const { data } = useDyeingFinishingDashboard(from, to, {
		enabled: !!(from && to),
	});

	console.log(data);
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<Header {...{ from, setFrom, to, setFTo }} />
			<Content data={data} />
		</div>
	);
}
