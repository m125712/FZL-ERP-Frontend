import { useFetch } from '@/hooks';
import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
}) {
	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Planning'>
				<div className='text-secondary-content flex flex-col gap-1 px-2 md:flex-row'>
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
