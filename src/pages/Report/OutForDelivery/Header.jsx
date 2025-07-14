import {
	FormField,
	ReactSelect,
	SectionEntryBody,
	SimpleDatePicker,
} from '@/ui';

export default function Header({
	date = '',
	setDate = () => {},
	vehicle = '',
	setVehicle = () => {},
	modifiedVehicles = [],
}) {
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
				</div>
			</SectionEntryBody>
		</div>
	);
}
