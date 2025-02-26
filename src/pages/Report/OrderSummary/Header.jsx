import { useAuth } from '@/context/auth';
import { useAllZipperThreadOrderList } from '@/state/Other';
import { useAccess } from '@/hooks';

import { FormField, ReactSelect, SectionEntryBody } from '@/ui';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `&own_uuid=${userUUID}`;
	}

	return ``;
};

export default function Header({ order = '', setOrder = () => {} }) {
	const haveAccess = useAccess('report__order_summary');
	const { user } = useAuth();
	const { data: orders } = useAllZipperThreadOrderList(
		`page=challan_pdf${getPath(haveAccess, user?.uuid)}`
	);

	return (
		<div>
			<SectionEntryBody title={'Challan Status Report'}>
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
