import { useFetch } from '@/hooks';
import {
	FormField,
	JoinInput,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';
import isJSON from '@/util/isJson';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Header({
	register,
	errors,
	control,
	getValues,
	Controller,
	isUpdate,
}) {
	const { pi_uuid } = useParams();
	const [marketingId, setMarketingId] = useState(
		pi_uuid != undefined ? getValues('marketing_uuid') : null
	); // 2 is the default value
	const [partyId, setPartyId] = useState(
		pi_uuid != undefined ? getValues('party_uuid') : null
	); // 47 is the default value

	const { value: marketing } = useFetch('/other/marketing/value/label');
	const { value: party } = useFetch('/other/party/value/label');
	const { value: order_number } = useFetch(
		`/other/order-number-for-pi/value/label/${marketingId}/${partyId}`,
		[marketingId, partyId]
	);

	const { value: merchandiser } = useFetch(
		`/other/merchandiser/value/label/${partyId}`,
		[partyId]
	);
	const { value: factory } = useFetch(
		`/other/factory/value/label/${partyId}`,
		[partyId]
	);
	const { value: bank } = useFetch('/other/bank/value/label');

	const { value: lc } = useFetch(`/other/lc/value/label/${partyId}`, [
		partyId,
	]);

	useEffect(() => {
		if (isUpdate) {
			setMarketingId(getValues('marketing_uuid'));
			setPartyId(getValues('party_uuid'));
		}
	}, [isUpdate, getValues('marketing_uuid'), getValues('party_uuid')]);

	return (
		<div className='flex flex-col gap-4'>
			<SectionEntryBody title='PI Information'>
				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
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
												item.value ==
												getValues('lc_uuid')
										)}
										onChange={(e) => {
											onChange(e.value);
										}}
										// isDisabled={pi_uuid != undefined}
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
											const value = e.value;
											onChange(value);
											setMarketingId(value);
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
											const value = e.value;
											onChange(value);
											setPartyId(value);
										}}
										isDisabled={pi_uuid != undefined}
									/>
								);
							}}
						/>
					</FormField>
					<FormField
						label='order_info_uuids'
						title='Order Numbers'
						errors={errors}>
						<Controller
							name='order_info_uuids'
							control={control}
							render={({ field: { onChange } }) => {
								return (
									<ReactSelect
										isMulti
										placeholder='Select Order Numbers'
										options={order_number}
										value={order_number?.filter((item) => {
											const order_info_uuids =
												getValues('order_info_uuids');

											if (order_info_uuids === null) {
												return false;
											} else {
												if (isJSON(order_info_uuids)) {
													return JSON.parse(
														order_info_uuids
													)
														.split(',')
														.includes(item.value);
												} else {
													return order_info_uuids
														.flat()
														.includes(item.value);
												}
											}
										})}
										onChange={(e) => {
											onChange(
												e.map(({ value }) => value)
											);
										}}
									/>
								);
							}}
						/>
					</FormField>
				</div>

				<div className='flex flex-col gap-1 px-2 text-secondary-content md:flex-row'>
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
					<FormField
						label='factory_uuid'
						title='Factory'
						errors={errors}>
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
												item.value ==
												getValues('bank_uuid')
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
					<Textarea label='remarks' {...{ register, errors }} />
				</div>
			</SectionEntryBody>
		</div>
	);
}
