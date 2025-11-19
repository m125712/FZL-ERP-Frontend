import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useOrderComplain } from '@/state/Order';
import { useNavigate } from 'react-router-dom';
import { useAccess } from '@/hooks';

import ReactTable from '@/components/Table';
import { StatusSelect } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import PageInfo from '@/util/PageInfo';

import { OrderComplainColumns } from '../columns';
import { options } from './utils';

export default function Index() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [status, setStatus] = useState(false);

	const { data, isLoading, url, updateData } = useOrderComplain(
		status !== 'all' && `is_resolved=${status}`
	);
	const info = new PageInfo('Order/Complain', url, 'order__complain');
	const haveAccess = useAccess(info.getTab());

	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const handelUpdate = (idx) => {
		const { order_number, order_description_uuid, uuid } = data[idx];
		navigate(
			`/order/complain/${order_number}/${order_description_uuid}/${uuid}/update`
		);
	};

	const handelResolved = async (idx) => {
		await updateData.mutateAsync({
			url: `/public/complaint/${data[idx]?.uuid}`,
			updatedData: {
				is_resolved: data[idx]?.is_resolved === true ? false : true,
				is_resolved_date:
					data[idx]?.is_resolved === true ? null : GetDateTime(),
				updated_at: GetDateTime(),
				updated_by: user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const columns = OrderComplainColumns({
		handelUpdate,
		haveAccess,
		handelResolved,
		data,
	});

	if (isLoading)
		return <span className='loading loading-dots loading-lg z-50' />;

	return (
		<div>
			<ReactTable
				title={info.getTitle()}
				data={data}
				columns={columns}
				extraButton={
					<StatusSelect
						status={status}
						setStatus={setStatus}
						options={options}
					/>
				}
			/>
		</div>
	);
}
