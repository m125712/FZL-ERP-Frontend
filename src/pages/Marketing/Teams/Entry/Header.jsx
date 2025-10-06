import { Input, SectionEntryBody, Textarea } from '@/ui';

export default function Header({ register, errors }) {
	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Team Info'>
				<Input label='name' {...{ register, errors }} />
				<Textarea label='remarks' {...{ register, errors }} />
			</SectionEntryBody>
		</div>
	);
}
