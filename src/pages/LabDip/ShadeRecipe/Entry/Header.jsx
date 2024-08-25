import { useFetch } from '@/hooks';
import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Select,
	Textarea,
} from '@/ui';
import { useState } from 'react';
import { useParams } from 'react-router-dom';


export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	is_Status,
}) {
	const { shade_recipe_description_uuid } = useParams();

	const [isStatus, setIsStatus] = useState(
		typeof is_Status !== 'boolean' && is_Status === 1 ? true : false
	);

	return (
		<SectionEntryBody title='Information'>
			<div className='flex flex-col gap-6 px-2 text-secondary-content md:flex-row'>
				<Input label='name' {...{ register, errors }} />
				<Input label='sub_streat' {...{ register, errors }} />
				<Textarea label='remarks' {...{ register, errors }} />
				<div className='my-4 rounded-md border border-primary px-2 py-1'>
					<CheckBox
						label='lab_status'
						title='Lab Status'
						height='h-[2.9rem]'
						defaultChecked={isStatus}
						{...{ register, errors }}
						onChange={(e) => setIsStatus(e.target.checked)}
					/>
				</div>
			</div>
		</SectionEntryBody>
	);
}
