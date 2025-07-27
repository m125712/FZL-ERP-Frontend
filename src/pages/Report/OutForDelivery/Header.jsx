import { useOtherVehicle } from '@/state/Other';

import {
	FormField,
	ReactSelect,
	SectionEntryBody,
	SimpleDatePicker,
} from '@/ui';

const ORDER_TYPE = [
	{ label: 'All', value: 'all' },
	{ label: 'Bulk', value: 'bulk' },
	{ label: 'Sample', value: 'sample' },
];

export default function Header({
	date = '',
	setDate = () => {},
	vehicle = '',
	setVehicle = () => {},
	orderType = '',
	setOrderType = () => {},
}) {
	const { data: vehicles } = useOtherVehicle();
	const modifiedVehicles = vehicles
		? [...vehicles, { label: 'All', value: 'all' }]
		: [];

	return (
		<div>
			<SectionEntryBody title={'Out for Delivery'}>
				<div className='flex gap-2'>
					<FormField label='' title='Date'>
						<SimpleDatePicker
							key={'date'}
							value={date}
							placeholder='Date'
							onChange={(e) => {
								setDate(e);
							}}
							selected={date}
						/>
					</FormField>
					<FormField label='' title='Vehicle'>
						<ReactSelect
							placeholder='Select vehicle'
							options={modifiedVehicles}
							value={modifiedVehicles?.find(
								(item) => item.value == vehicle
							)}
							onChange={(e) => {
								setVehicle(e.value);
							}}
						/>
					</FormField>
					<FormField label='' title='Order Type'>
						<ReactSelect
							placeholder='Select order Type'
							options={ORDER_TYPE}
							value={ORDER_TYPE?.find(
								(item) => item.value == orderType
							)}
							onChange={(e) => {
								setOrderType(e.value);
							}}
						/>
					</FormField>
				</div>
			</SectionEntryBody>
		</div>
	);
}
