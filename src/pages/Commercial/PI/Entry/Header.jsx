import {
	useOtherBank,
	useOtherFactoryByPartyUUID,
	useOtherLcByPartyUUID,
	useOtherMarketing,
	useOtherMerchandiserByPartyUUID,
	useOtherParty,
} from '@/state/Other';
import { useParams } from 'react-router-dom';

import {
	CheckBox,
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
}) {
	const { pi_uuid } = useParams();

	const { data: bank } = useOtherBank();
	const { data: party } = useOtherParty(
		watch('marketing_uuid') + '&is_cash=false'
	);
	const { data: marketing } = useOtherMarketing();

	const { data: merchandiser } = useOtherMerchandiserByPartyUUID(
		watch('party_uuid')
	);
	const { data: factory } = useOtherFactoryByPartyUUID(watch('party_uuid'));
	const { data: lc } = useOtherLcByPartyUUID(watch('party_uuid'));

	return (
		<SectionEntryBody
			title='PI Information'
			header={
				<div className='rounded-md bg-primary px-1'>
					<CheckBox
						title='RTGS'
						label='is_rtgs'
						text='text-primary-content'
						{...{ register, errors }}
					/>
				</div>
			}>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4'>
				<FormField label='lc_id' title='LC' errors={errors}>
					<Controller
						name='lc_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select LC'
									options={lc}
									value={lc?.find(
										(item) =>
											item.value == getValues('lc_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={true}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='marketing_uuid'
					title='Marketing'
					errors={errors}>
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
									value={party?.find(
										(item) =>
											item.value ==
											getValues('party_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>
			</div>

			<div className='grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6'>
				<FormField
					label='merchandiser_uuid'
					title='Merchandiser'
					errors={errors}>
					<Controller
						name='merchandiser_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Merchandiser'
									options={merchandiser}
									value={merchandiser?.find(
										(item) =>
											item.value ==
											getValues('merchandiser_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={pi_uuid != undefined}
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
									value={factory?.find(
										(item) =>
											item.value ==
											getValues('factory_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={pi_uuid != undefined}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='bank_uuid' title='Bank' errors={errors}>
					<Controller
						name='bank_uuid'
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Bank'
									options={bank}
									value={bank?.find(
										(item) =>
											item.value == getValues('bank_uuid')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<JoinInput
					label='validity'
					unit='DAYS'
					{...{ register, errors }}
				/>
				<JoinInput
					label='payment'
					unit='DAYS'
					{...{ register, errors }}
				/>
				<JoinInput label='weight' unit='KG' {...{ register, errors }} />
			</div>

			<Textarea label='remarks' {...{ register, errors }} />
		</SectionEntryBody>
	);
}
