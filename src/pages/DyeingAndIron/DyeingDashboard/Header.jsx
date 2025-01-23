import { useOtherMachines } from '@/state/Other';
import { format } from 'date-fns';

import { ReactSelect, SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({
	dyeingDate = '',
	setDyeingDate = () => {},
	machines,
	setMachines,
}) {
	const { data: machineOptions } = useOtherMachines();
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
				</div>
			</SectionEntryBody>
		</div>
	);
}
