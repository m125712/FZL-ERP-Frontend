import { useOtherMaterial } from '@/state/Other';

import { ReactSelect, SectionEntryBody } from '@/ui';

export default function Header({ material, setMaterial }) {
	const { data: materials } = useOtherMaterial();

	return (
		<div className='mb-5 flex flex-col gap-4'>
			<SectionEntryBody title={'Select Material'}>
				<ReactSelect
					placeholder='Select Material'
					options={materials}
					value={materials?.find((item) => item.value == material)}
					onChange={(e) => {
						setMaterial(e.value);
					}}
				/>
			</SectionEntryBody>
		</div>
	);
}
