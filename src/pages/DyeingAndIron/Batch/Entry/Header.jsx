import { SectionEntryBody, Textarea } from '@/ui';

export default function Header({ register, errors }) {
	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Batch'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
