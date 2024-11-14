import { Input, SectionEntryBody, Textarea } from '@/ui';

export default function Header({ register, errors }) {
	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Manual PI Info'>
				<Input label='name' {...{ register, errors }} />
				<Textarea label='remarks' {...{ register, errors }} />
			</SectionEntryBody>
		</div>
	);
}
