import { useEffect, useState } from 'react';
import {
	useOtherBank,
	useOtherFactoryByPartyUUID,
	useOtherLcByPartyUUID,
	useOtherMarketing,
	useOtherMerchandiserByPartyUUID,
	useOtherOrderNumberByMarketingAndPartyUUID,
	useOtherParty,
} from '@/state/Other';
import { useParams } from 'react-router-dom';

import {
	FormField,
	Input,
	JoinInput,
	ReactSelect,
	SectionEntryBody,
	Textarea,
} from '@/ui';

import isJSON from '@/util/isJson';

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

	const { data: marketing } = useOtherMarketing();
	const { data: party } = useOtherParty();
	const { data: order_number } = useOtherOrderNumberByMarketingAndPartyUUID(
		marketingId,
		partyId,
		true
	);
	const { data: merchandiser } = useOtherMerchandiserByPartyUUID(partyId);
	const { data: factory } = useOtherFactoryByPartyUUID(partyId);
	const { data: bank } = useOtherBank();
	const { data: lc } = useOtherLcByPartyUUID(partyId);

	useEffect(() => {
		if (isUpdate) {
			setMarketingId(getValues('marketing_uuid'));
			setPartyId(getValues('party_uuid'));
		}
	}, [isUpdate, getValues('marketing_uuid'), getValues('party_uuid')]);

	return (
		<SectionEntryBody title='PI Information'>
			<div className='grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5'>
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
									isDisabled={isUpdate}
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
												console.log('--json--');
												return JSON.parse(
													order_info_uuids
												)
													.split(',')
													.includes(item.value);
											} else {
												if (
													!Array.isArray(
														order_info_uuids
													)
												) {
													return order_info_uuids.includes(
														item.value
													);
												}

												return order_info_uuids.includes(
													item.value
												);
											}
										}
									})}
									onChange={(e) => {
										onChange(e.map(({ value }) => value));
									}}
								/>
							);
						}}
					/>
				</FormField>

				<Input
					label='conversion_rate'
					type='number'
					{...{ register, errors }}
				/>
				<Input
					label='receive_amount'
					type='number'
					{...{ register, errors }}
				/>
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

				<Textarea label='remarks' {...{ register, errors }} />
			</div>
		</SectionEntryBody>
	);
}
