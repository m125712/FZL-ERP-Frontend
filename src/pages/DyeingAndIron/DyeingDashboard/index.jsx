import { useEffect, useMemo, useState } from 'react';
import { useDyeingDashboard } from '@/state/Dyeing';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/DyeingDashboard';
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

	const [data2, setData] = useState('');

	useEffect(() => {
		if (data) {
			Pdf(data)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [data]);
	// ! FOR TESTING

	return (
		<div className='flex flex-col gap-8'>
			<iframe
				src={data2}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<Header {...{ dyeingDate, setDyeingDate }} />
			<Content data={data} dyeingDate={dyeingDate} />
		</div>
	);
}
