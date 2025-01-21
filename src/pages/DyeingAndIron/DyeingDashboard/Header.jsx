import { useOtherMachines } from '@/state/Other';
import { useMediaQuery } from '@uidotdev/usehooks';
import { format } from 'date-fns';

import MultiCalendar from '@/ui/Others/DatePicker/MultiCalendar';
import { ReactSelect, SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({
	dyeingDate = '',
	setDyeingDate = () => {},
	machines,
	setMachines,
}) {
	const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');

	const { data: machineOptions } = useOtherMachines();
	return (
		<div>
			<SectionEntryBody
				title={'Dyeing Dashboard'}
				header={
					<div className='min-w-60'>
						<ReactSelect
							placeholder='Select Machines'
							options={machineOptions}
							value={machines}
							onChange={(e) => {
								setMachines(e);
							}}
							isMulti={true}
						/>
					</div>
				}>
				{isSmallDevice ? (
					<SimpleDatePicker
						inline
						value={dyeingDate}
						onChange={(data) => {
							setDyeingDate(format(data, 'yyyy-MM-dd'));
						}}
					/>
				) : (
					<MultiCalendar
						selected={dyeingDate}
						onChange={(data) => {
							setDyeingDate(format(data, 'yyyy-MM-dd'));
						}}
						monthsShown={4}
					/>
				)}
			</SectionEntryBody>
		</div>
	);
}
