import { useMediaQuery } from '@uidotdev/usehooks';
import { format } from 'date-fns';

import MultiCalendar from '@/ui/Others/DatePicker/MultiCalendar';
import { SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({ dyeingDate = '', setDyeingDate = () => {} }) {
	const isSmallDevice = useMediaQuery('only screen and (max-width : 768px)');
	return (
		<div>
			<SectionEntryBody title={'Dyeing Dashboard'}>
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
