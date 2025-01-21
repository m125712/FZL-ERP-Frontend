import { useEffect, useState } from 'react';
import { useDyeingDashboard } from '@/state/Dyeing';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/DyeingDashboard';

import PageInfo from '@/util/PageInfo';

import Content from './Content/Content';
import Header from './Header';

export default function index() {
	const [machines, setMachines] = useState([]);

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
			let filters =
				machines.length > 0
					? data?.filter((item) =>
							machines
								.map((machine) => machine.value)
								?.includes(item.machine_uuid)
						)
					: data;

			Pdf(filters, dyeingDate)?.getDataUrl((dataUrl) => {
				setData(dataUrl);
			});
		}
	}, [data, machines]);
	// ! FOR TESTING

	return (
		<div className='flex flex-col gap-8'>
			<iframe
				src={data2}
				className='h-[40rem] w-full rounded-md border-none'
			/>
			<Header {...{ dyeingDate, setDyeingDate, machines, setMachines }} />
			<Content data={data} dyeingDate={dyeingDate} />
		</div>
	);
}
