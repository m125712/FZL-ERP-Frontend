import { format } from 'date-fns';

import { SectionEntryBody, SimpleDatePicker } from '@/ui';

export default function Header({ dyeingDate = '', setDyeingDate = () => {} }) {
	return (
		<div>
			<SectionEntryBody title={'Dyeing Dashboard'}>
				<SimpleDatePicker
					selected={dyeingDate}
					onChange={(data) => {
						setDyeingDate(format(data, 'yyyy-MM-dd'));
						console.log(data);
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
