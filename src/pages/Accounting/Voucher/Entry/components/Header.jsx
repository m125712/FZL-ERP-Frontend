import { From } from '@/assets/icons';
import { useOtherVendor } from '@/state/Other';
import { useParams } from 'react-router';

import { DateInput, Radio } from '@/ui/Core';
import {
	File,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

import { categoryOptions } from '../utils';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	watch,
	isUpdate,
	type,
}) {
	const { uuid } = useParams();

	return (
		<SectionEntryBody
			title='Information'
			className='grid grid-cols-4 gap-4'
		>
			<DateInput
				label={`date`}
				Controller={Controller}
				control={control}
				selected={watch(`date`)}
				{...{ register, errors }}
			/>
			<Input label='vat_deduction' {...{ register, errors }} />
			<Input label='tax_deduction' {...{ register, errors }} />
			<Textarea label='remarks' {...{ register, errors }} />
			<Radio
				name='category'
				title='Category'
				options={categoryOptions}
				control={control}
				defaultValue=''
				Controller={Controller}
				register={register}
				errors={errors}
			/>
		</SectionEntryBody>
	);
}
