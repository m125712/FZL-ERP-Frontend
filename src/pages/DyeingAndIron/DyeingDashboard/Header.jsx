import { useOtherMachines } from '@/state/Other';
import { format } from 'date-fns';

import { ReactSelect, SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({
	dyeingDate = '',
	setDyeingDate = () => {},
	machines,
	setMachines,
	orderType,
	setOrderType,
}) {
	const { data: machineOptions } = useOtherMachines();

	const orderTypes = [
		{ label: 'Bulk', value: 'bulk' },
		{ label: 'Sample', value: 'sample' },
		{ label: 'All', value: 'all' },
	];
	return (
		<div>
			<SectionEntryBody title={'Dyeing Dashboard'}>
				<div className='flex flex-col gap-4 md:flex-row'>
					<SimpleDatePicker
						inline
						value={dyeingDate}
						onChange={(data) => {
							setDyeingDate(format(data, 'yyyy-MM-dd'));
						}}
						selected={dyeingDate}
					/>
					<ReactSelect
						className='md:min-w-96'
						placeholder='Select Machines'
						options={machineOptions}
						value={machines}
						onChange={(e) => {
							setMachines(e);
						}}
						isMulti={true}
						menuPortalTarget={document.body}
					/>
					<ReactSelect
						className='md:min-w-96'
						placeholder='Select Order Type'
						options={orderTypes}
						value={orderTypes?.find(
							(item) => item.value == orderType
						)}
						onChange={(e) => {
							setOrderType(e.value);
						}}
						menuPortalTarget={document.body}
					/>
				</div>
			</SectionEntryBody>
		</div>
	);
}
