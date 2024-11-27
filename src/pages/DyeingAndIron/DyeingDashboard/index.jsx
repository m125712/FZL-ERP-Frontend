import { useEffect, useMemo, useState } from 'react';
import { useDyeingDashboard } from '@/state/Dyeing';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { DateTime, EditDelete, LinkWithCopy } from '@/ui';

import PageInfo from '@/util/PageInfo';

import Content from './Content/Content';
import Header from './Header';

export default function index() {
	const navigate = useNavigate();
	const haveAccess = useAccess('dyeing__dyeing_dashboard');

	const info = new PageInfo(
		'Dyeing Dashboard',
		'/dyeing-and-iron/dyeing-dashboard',
		'dyeing__dyeing_dashboard'
	);
	const [dyeingDate, setDyeingDate] = useState('');
	const { data } = useDyeingDashboard(dyeingDate);

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	return (
		<div className='flex flex-col gap-8'>
			<Header {...{ dyeingDate, setDyeingDate }} />
			<Content data={data} dyeingDate={dyeingDate} />
		</div>
	);
}
