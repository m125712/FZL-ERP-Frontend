import {
	useOtherFactoryByPartyUUID,
	useOtherMarketing,
	useOtherMerchandiserByPartyUUID,
	useOtherParty,
} from '@/state/Other';
import { useParams } from 'react-router-dom';

import {
	FormField,
	JoinInput,
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
	isUpdate,
	watch,
	reset,
}) {
	const { pi_uuid } = useParams();
	const { data: marketing } = useOtherMarketing();
	const { data: party } = useOtherParty(
		watch('marketing_uuid') + '&is_cash=true'
	);

	const { data: merchandiser } = useOtherMerchandiserByPartyUUID(
		watch('party_uuid')
	);
	const { data: factory } = useOtherFactoryByPartyUUID(watch('party_uuid'));

	return (
		<SectionEntryBody title='PI Information'>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4'>
				<FormField
					label='marketing_uuid'
					title='Marketing'
					errors={errors}
				>
					<Controller
						name='marketing_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Marketing'
									options={marketing}
									value={marketing?.find(
										(item) =>
											item.value ==
											getValues('marketing_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
										reset({
											marketing_uuid: e.value,
											party_uuid: '',
											merchandiser_uuid: '',
											factory_uuid: '',
										});
									}}
									isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='party_uuid' title='Party' errors={errors}>
					<Controller
						name='party_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Party'
									options={party}
									value={
										party?.find(
											(item) =>
												item.value ==
												getValues('party_uuid')
										) || null
									}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>

				<FormField
					label='merchandiser_uuid'
					title='Merchandiser'
					errors={errors}
				>
					<Controller
						name='merchandiser_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Merchandiser'
									options={merchandiser}
									value={
										merchandiser?.find(
											(item) =>
												item.value ==
												getValues('merchandiser_uuid')
										) || null
									}
									onChange={(e) => onChange(e.value)}
									// isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='factory_uuid' title='Factory' errors={errors}>
					<Controller
						name='factory_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Factory'
									options={factory}
									value={
										factory?.find(
											(item) =>
												item.value ==
												getValues('factory_uuid')
										) || null
									}
									onChange={(e) => onChange(e.value)}
									// isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>

				<JoinInput
					label='conversion_rate'
					unit='BDT'
					{...{ register, errors }}
				/>

				<JoinInput
					label='receive_amount'
					disabled={true}
					unit='BDT'
					{...{ register, errors }}
				/>

				<Textarea label='remarks' {...{ register, errors }} />
			</div>
		</SectionEntryBody>
	);
}
