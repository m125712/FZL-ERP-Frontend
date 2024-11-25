import { useEffect } from 'react';
import { UseLabDipInfoByDetails } from '@/state/LabDip';
import { useParams } from 'react-router-dom';
import { useAccess } from '@/hooks';

import Information from './Information';
import Table from './Table';

export default function Index() {
	const { info_uuid } = useParams();
	const haveAccess = useAccess('store__receive_by_uuid');

	// const {
	// 	value: info,
	// 	loading,
	// } = useFetch(`/lab-dip/info/details/${info_uuid}`, [info_uuid]);
	const { data, isLoading } = UseLabDipInfoByDetails(info_uuid);

	useEffect(() => {
		document.title = 'Info Details';
	}, []);

	// if (!info) return <Navigate to='/not-found' />;
	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div className='space-y-2'>
			<Information info={data} />
			<Table {...data} />
		</div>
	);
}
