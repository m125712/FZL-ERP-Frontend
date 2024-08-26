import { useFetch } from '@/hooks';
import { CheckBox, FormField, ReactSelect, SectionEntryBody } from '@/ui';
import { DateInput, Textarea } from '@/ui/Core';
import { Input } from 'postcss';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useParams } from 'react-router-dom';

export default function Header({
	register,
	errors,
	getValues,
	Controller,
	control,
}) {
	const { order_info_uuid } = useParams();

	const [isSample, setIsSample] = useState(
		typeof getValues('is_sample') !== 'boolean' &&
			getValues('is_sample') === 1
			? true
			: false
	);
	const [isBill, setIsBill] = useState(
		typeof getValues('is_bill') !== 'boolean' && getValues('is_bill') === 1
			? true
			: false
	);

	const [partyId, setPartyId] = useState(getValues('party_uuid'));
	const { value: party } = useFetch('/other/party/value/label');
	const { value: merchandiser } = useFetch(
		`/other/merchandiser/value/label/${partyId}`,
		[partyId]
	);

	const { value: factory } = useFetch(
		`/other/factory/value/label/${partyId}`,
		[partyId]
	);

	const { value: buyer } = useFetch('/other/buyer/value/label');
	const { value: marketing } = useFetch('/other/marketing/value/label');
	console.log(partyId);

	useEffect(() => {
		setPartyId(getValues('party_uuid'));
	}, [getValues('party_uuid')]);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody
				title='Order'
				header={
					<div className='flex justify-end gap-2 p-2 text-sm'>
						<div className='rounded-md bg-primary px-1'>
							<CheckBox
								label='is_sample'
								title='Sample'
								text='text-primary-content'
								defaultChecked={isSample}
								{...{ register, errors }}
								onChange={(e) => setIsSample(e.target.checked)}
							/>
						</div>
						<div className='rounded-md bg-primary px-1'>
							<CheckBox
								title='Bill'
								label='is_bill'
								text='text-primary-content'
								defaultChecked={isBill}
								{...{ register, errors }}
								onChange={(e) => setIsBill(e.target.checked)}
							/>
						</div>
					</div>
				}>
				<div className='flex flex-col gap-1 md:flex-row'>
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
											order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
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
											order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
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
											order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<div className='flex flex-col gap-1 md:flex-row'>
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
											order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
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
											order_info_uuid !== undefined
										}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='delivery_date'
						title='Delivery Date'
						errors={errors}>
						<Controller
							name={'delivery_date'}
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<DatePicker
										className='h-12 w-full rounded-md border bg-primary/5 px-2 text-primary'
										placeholderText='Select Delivery Date'
										dateFormat='dd/MM/yyyy'
										selected={getValues('delivery_date')}
										onChange={(date) => onChange(date)}
									/>
								);
							}}
						/>
					</FormField>
				</div>
				<Textarea label='remarks' {...{ register, errors }} />
			</SectionEntryBody>
		</div>
	);
}
