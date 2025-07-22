import { useEffect, useState } from 'react';
import { useDyeingDashboard } from '@/state/Dyeing';
import { format } from 'date-fns';
import { useAccess } from '@/hooks';

import Pdf from '@/components/Pdf/DyeingDashboard';
import { Collapse } from '@/ui';

import PageInfo from '@/util/PageInfo';

import Content from './Content/Content';
import Header from './Header';

export default function index() {
	const [machines, setMachines] = useState([]);
	const [orderType, setOrderType] = useState('all');

	const haveAccess = useAccess('dyeing__dyeing_dashboard');

	const info = new PageInfo(
		'Dyeing Dashboard',
		'/dyeing-and-iron/dyeing-dashboard',
		'dyeing__dyeing_dashboard'
	);

	const [dyeingDate, setDyeingDate] = useState(
		format(new Date(), 'yyyy-MM-dd')
	);
	const { data } = useDyeingDashboard(dyeingDate, orderType);

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
			<Collapse title='See PDF'>
				<iframe
					src={data2}
					className='h-[40rem] w-full rounded-md border-none'
				/>
			</Collapse>

			<Header
				{...{
					dyeingDate,
					setDyeingDate,
					machines,
					setMachines,
					orderType,
					setOrderType,
				}}
			/>
			<Content data={data} dyeingDate={dyeingDate} />
		</div>
	);
}
