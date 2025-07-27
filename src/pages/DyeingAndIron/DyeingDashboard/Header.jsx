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
	isSample,
	setIsSample,
}) {
	const { data: machineOptions } = useOtherMachines();

	const orderTypes = [
		{ label: 'Zipper', value: 'zipper' },
		{ label: 'Thread', value: 'thread' },
		{ label: 'All', value: 'all' },
	];
	const sampleTypes = [
		{ label: 'Bulk', value: 0 },
		{ label: 'Sample', value: 1 },
		{ label: 'All', value: 2 },
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
					<ReactSelect
						className='md:min-w-96'
						placeholder='Select Sample Type'
						options={sampleTypes}
						value={sampleTypes?.find(
							(item) => item.value == isSample
						)}
						onChange={(e) => {
							setIsSample(e.value);
						}}
						menuPortalTarget={document.body}
					/>
				</div>
			</SectionEntryBody>
		</div>
	);
}
