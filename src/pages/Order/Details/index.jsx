import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useOrderDetailsByQuery } from '@/state/Order';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { StatusSelect } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

import { DetailsColumns } from '../columns';
import { getPath, options } from './utils';

export default function Index() {
	const [status, setStatus] = useState('all');

	const haveAccess = useAccess('order__details');
	const { user } = useAuth();

	const { data, isLoading, url, updateData } = useOrderDetailsByQuery(
		getPath(haveAccess, user?.uuid) + `&type=${status}`,
		{ enabled: !!user?.uuid }
	);

	const info = new PageInfo('Order/Details', url, 'order__details');

	// Fetching data from server
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	// Add
	const handelAdd = () => window.open('/order/entry', '_blank');

	// Update
	const handelUpdate = (idx) => {
		const { order_description_uuid, order_number } = data[idx];

		window.open(
			`/order/${order_number}/${order_description_uuid}/update`,
			'_blank'
		);
	};

	const handelMarketingCheckedStatus = async (idx) => {
		await updateData.mutateAsync({
			url: `/zipper/order/description/update-is-marketing-checked/by/${data[idx]?.order_description_uuid}`,
			updatedData: {
				is_marketing_checked:
					data[idx]?.is_marketing_checked === true ? false : true,
				marketing_checked_at:
					data[idx]?.is_marketing_checked === true
						? null
						: GetDateTime(),
			},
			isOnCloseNeeded: false,
		});
	};

	const handleWhatsApp = (idx) => {
		const val = data[idx];
		const fullUrl = `${window.location.href}/${val.order_number}`;
		let message = `Hello, please check the order: ${fullUrl}`;

		const whatsappUrl = `https://web.whatsapp.com/send?phone=88${val.marketing_phone}&text=${encodeURIComponent(message)}&app_absent=0`;

		window.open(whatsappUrl, '_blank');
	};

	const columns = DetailsColumns({
		handelUpdate,
		haveAccess,
		data,
		handelMarketingCheckedStatus,
		handleWhatsApp,
	});

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<ReactTable
			title={info.getTitle()}
			info='Order details, including item descriptions and status, allowing for updates and marketing checks.'
			accessor={haveAccess.includes('create')}
			data={data}
			columns={columns}
			handelAdd={handelAdd}
			extraButton={
				<StatusSelect
					status={status}
					setStatus={setStatus}
					options={options}
				/>
			}
		/>
	);
}
