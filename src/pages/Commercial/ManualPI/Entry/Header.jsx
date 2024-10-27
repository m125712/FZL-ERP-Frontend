import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useParams } from 'react-router-dom';
import { useFetch } from '@/hooks';

import { DateInput, Textarea } from '@/ui/Core';
import {
	CheckBox,
	FormField,
	Input,
	ReactSelect,
	SectionEntryBody,
} from '@/ui';

export default function Header({
	register,
	errors,
	getValues,
	Controller,
	control,
	watch,
}) {
	const { manual_pi_uuid } = useParams();
	const [partyId, setPartyId] = useState(getValues('party_uuid'));
	const { value: party } = useFetch('/other/party/value/label');
	const { value: factory } = useFetch(
		`/other/factory/value/label/${partyId}`,
		[partyId]
	);
	const { value: merchandiser } = useFetch(
		`/other/merchandiser/value/label/${partyId}`,
		[partyId]
	);
	const { value: buyer } = useFetch('/other/buyer/value/label');
	const { value: marketing } = useFetch('/other/marketing/value/label');
	const { value: bank } = useFetch('/other/bank/value/label');
	const { value: pi } = useFetch('/other/pi/value/label');

	useEffect(() => {
		setPartyId(getValues('party_uuid'));
	}, [getValues('party_uuid')]);

	const [pis, setPis] = useState([]);

	useEffect(() => {
		if (manual_pi_uuid !== undefined) {
			setPis([
				...(getValues('pi_uuids')
					? getValues('pi_uuids').map((item) => item)
					: ''),
			]);
		}
	}, [getValues('pi_uuids')]);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='Manual PI Info'>
				{/* PI UUIDs  MULTI SELECT */}
				<FormField label='pi_uuids' title='PIs' errors={errors}>
					<Controller
						name={'pi_uuids'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select PIs'
									options={pi}
									value={pi?.filter((item) =>
										pis?.includes(item.value)
									)}
									onChange={(e) => {
										setPis((prev) => [
											...prev,
											e.map((item) => item.value),
										]);
										onChange(e.map((item) => item.value));
									}}
									isMulti={true}
								/>
							);
						}}
					/>
				</FormField>
				<div className='flex flex-col gap-1 md:flex-row'>
					{/* MARKETING */}
					<FormField
						label='marketing_uuid'
						title='Marketing'
						errors={errors}>
						<Controller
							name={'marketing_uuid'}
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
										onChange={(e) => onChange(e.value)}
										isDisabled={
											manual_pi_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
					{/* PARTY */}
					<FormField label='party_uuid' title='Party' errors={errors}>
						<Controller
							name={'party_uuid'}
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
											setPartyId(e.value);
										}}
										isDisabled={
											manual_pi_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
					{/* BUYER */}
					<FormField label='buyer_uuid' title='Buyer' errors={errors}>
						<Controller
							name={'buyer_uuid'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Buyer'
										options={buyer}
										value={buyer?.find(
											(item) =>
												item.value ==
												getValues('buyer_uuid')
										)}
										onChange={(e) => onChange(e.value)}
										isDisabled={
											manual_pi_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<div className='flex flex-col gap-1 md:flex-row'>
					{/* MERCHANDISER */}
					<FormField
						label='merchandiser_uuid'
						title='Merchandiser'
						errors={errors}>
						<Controller
							name={'merchandiser_uuid'}
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
										onChange={(e) => {
											onChange(e.value);
										}}
										isDisabled={
											manual_pi_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
					{/* FACTORY */}
					<FormField
						label='factory_uuid'
						title='Factory'
						errors={errors}>
						<Controller
							name={'factory_uuid'}
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
										onChange={(e) => {
											onChange(e.value);
										}}
										isDisabled={
											manual_pi_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
					{/* BANK */}
					<FormField label='bank_uuid' title='Bank' errors={errors}>
						<Controller
							name={'bank_uuid'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										placeholder='Select Bank'
										options={bank}
										value={bank?.find(
											(item) =>
												item.value ==
												getValues('bank_uuid')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
										isDisabled={
											manual_pi_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<div className='flex flex-col gap-1 md:flex-row'>
					<DateInput
						label='date'
						Controller={Controller}
						control={control}
						selected={watch('date')}
						{...{ register, errors }}
						// disabled={watch('document_receive_date') ? false : true}
					/>
					<Input label='validity' {...{ register, errors }} />
					<Input label='payment' {...{ register, errors }} />
				</div>
				<div className='flex flex-col gap-1 md:flex-row'>
					<Input label='receive_amount' {...{ register, errors }} />
					<Input label='weight' {...{ register, errors }} />
					<Textarea label='pi_number' {...{ register, errors }} />
				</div>
				<Textarea label='remarks' {...{ register, errors }} />
			</SectionEntryBody>
		</div>
	);
}
