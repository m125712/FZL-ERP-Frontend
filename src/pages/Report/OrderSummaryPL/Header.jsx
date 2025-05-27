import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAllZipperThreadOrderList } from '@/state/Other';
import { useAccess } from '@/hooks';

import { FormField, ReactSelect, SectionEntryBody } from '@/ui';

import PageInfo from '@/util/PageInfo';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Header({ order = '', setOrder = () => {} }) {
	const haveAccess = useAccess('report__order_summary');
	const info = new PageInfo('Order Summary', null, 'report__order_summary');
	useEffect(() => {
		document.title = info.getTabName();
	}, []);

	const { user } = useAuth();
	const { data: orders } = useAllZipperThreadOrderList(
		`page=production_statement${getPath(haveAccess, user?.uuid)}`
	);

	return (
		<div>
			<SectionEntryBody title={'Order Summary Report (Packing list) '}>
				<FormField label='' title='Order'>
					<ReactSelect
						placeholder='Select Order'
						options={orders}
						value={orders?.find((item) => item.value == order)}
						onChange={(e) => {
							setOrder(e.value);
						}}
					/>
				</FormField>
			</SectionEntryBody>
		</div>
	);
}
