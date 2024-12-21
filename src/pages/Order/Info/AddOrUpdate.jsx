import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useOrderInfo, useOrderInfoByUUID } from '@/state/Order';
import {
	useAllZipperThreadOrderList,
	useOtherBuyer,
	useOtherFactoryByPartyUUID,
	useOtherMarketing,
	useOtherMerchandiserByPartyUUID,
	useOtherOrderInfoValueLabel,
	useOtherParty,
} from '@/state/Other';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { CheckBox, FormField, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { ORDER_INFO_NULL, ORDER_INFO_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',

	updateOrderInfo = {
		uuid: null,
		order_number: null,
	},
	setUpdateOrderInfo,
}) {
	const { url, updateData, postData } = useOrderInfo();
	const { data } = useOrderInfoByUUID(updateOrderInfo?.uuid);

	const { user } = useAuth();
	const {
		register,
		handleSubmit,
		errors,
		reset,
		Controller,
		control,
		getValues,
		context,
		watch,
		setValue,
	} = useRHF(ORDER_INFO_SCHEMA, ORDER_INFO_NULL);

	const [partyId, setPartyId] = useState(getValues('party_uuid'));
	const { data: ref_order } = useOtherOrderInfoValueLabel();
	const { data: party } = useOtherParty();
	const { data: buyer } = useOtherBuyer();
	const { data: marketing } = useOtherMarketing();
	const { data: merchandiser } = useOtherMerchandiserByPartyUUID(partyId);
	const { data: factory } = useOtherFactoryByPartyUUID(partyId);
	const { invalidateQuery: invalidateOrderInfoValueLabel } =
		useOtherOrderInfoValueLabel();
	const { invalidateQuery: invalidateOtherZipperThreadOrderList } =
		useAllZipperThreadOrderList();

	const PriorityOptions = [
		{ value: 'FIFO', label: 'FIFO' },
		{ value: 'URGENT', label: 'URGENT' },
		{ value: '---', label: '---' },
	];

	useEffect(() => {
		if (data && updateOrderInfo?.uuid) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateOrderInfo((prev) => ({
			uuid: null,
			order_number: null,
		}));

		reset(ORDER_INFO_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateOrderInfo?.uuid !== null &&
			updateOrderInfo?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				is_sample: data?.is_sample ? 1 : 0,
				is_bill: data?.is_bill ? 1 : 0,
				is_cash: data?.is_cash ? 1 : 0,
				status: data.status ? 1 : 0,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateOrderInfo?.uuid}`,
				uuid: updateOrderInfo?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		const updatedData = {
			...data,
			uuid: nanoid(),
			is_sample: data?.is_sample ? 1 : 0,
			is_bill: data?.is_bill ? 1 : 0,
			is_cash: data?.is_cash ? 1 : 0,
			status: 0,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
		invalidateOrderInfoValueLabel();
		invalidateOtherZipperThreadOrderList();
	};

	useEffect(() => {
		setPartyId(getValues('party_uuid'));
	}, [getValues('party_uuid')]);

	return (
		<AddModal
			id={modalId}
			title={
				updateOrderInfo?.uuid !== null
					? 'Party Description: ' + updateOrderInfo?.order_number
					: 'Party Description'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}>
			<div className='flex justify-end gap-2 text-sm'>
				<div className='rounded-md bg-primary px-1'>
					<CheckBox
						label='is_sample'
						title='Sample'
						text='text-primary-content'
						defaultChecked={
							getValues('is_sample') === 1 ||
							getValues('is_sample') === true
								? setValue('is_sample', true)
								: setValue('is_sample', false)
						}
						onChange={(e) =>
							setValue('is_sample', e.target.checked)
						}
						{...{ register, errors }}
					/>
				</div>
				<div className='rounded-md bg-primary px-1'>
					<CheckBox
						title='Bill'
						label='is_bill'
						text='text-primary-content'
						defaultChecked={
							getValues('is_bill') === 1 ||
							getValues('is_bill') === true
								? setValue('is_bill', true)
								: setValue('is_bill', false)
						}
						onChange={(e) => setValue('is_bill', e.target.checked)}
						{...{ register, errors }}
					/>
				</div>
				<div className='rounded-md bg-primary px-1'>
					<CheckBox
						title='Cash'
						label='is_cash'
						text='text-primary-content'
						defaultChecked={
							getValues('is_cash') === 1 ||
							getValues('is_cash') === true
								? setValue('is_cash', true)
								: setValue('is_cash', false)
						}
						onChange={(e) => setValue('is_cash', e.target.checked)}
						{...{ register, errors }}
					/>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-4 text-sm lg:grid-cols-3'>
				<FormField
					label='reference_order_info_uuid'
					title='Ref. Order'
					errors={errors}>
					<Controller
						name={'reference_order_info_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Order'
									options={ref_order}
									value={ref_order?.filter(
										(item) =>
											item.value ==
											getValues(
												'reference_order_info_uuid'
											)
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={updateOrderInfo?.uuid !== null}
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
						name={'marketing_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Marketing'
									options={marketing}
									value={marketing?.filter(
										(item) =>
											item.value ==
											getValues('marketing_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={updateOrderInfo?.uuid !== null}
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
									value={buyer?.filter(
										(item) =>
											item.value ==
											getValues('buyer_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className='grid grid-cols-1 gap-4 text-sm lg:grid-cols-3'>
				<FormField label='party_uuid' title='Party' errors={errors}>
					<Controller
						name={'party_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Party'
									options={party}
									value={party?.filter(
										(item) =>
											item.value ==
											getValues('party_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
										setPartyId(e.value);
									}}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
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
									value={merchandiser?.filter(
										(item) =>
											item.value ==
											getValues('merchandiser_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
				<FormField label='factory_uuid' title='Factory' errors={errors}>
					<Controller
						name={'factory_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Factory'
									options={factory}
									value={factory?.filter(
										(item) =>
											item.value ==
											getValues('factory_uuid')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									isDisabled={updateOrderInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<div className='grid grid-cols-1 gap-4 text-sm sm:grid-cols-2'>
				{/* <FormField label='is_cash' title='Cash / LC' errors={errors}>
					<Controller
						name={'is_cash'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Cash Or LC'
									options={CashOptions}
									value={CashOptions?.filter(
										(CashOptions) =>
											CashOptions.value ==
											getValues('is_cash')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField> */}
				<FormField
					label='marketing_priority'
					title='S&M Priority'
					errors={errors}>
					<Controller
						name={'marketing_priority'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Priority'
									options={PriorityOptions}
									value={PriorityOptions?.filter(
										(item) =>
											item.value ==
											getValues('marketing_priority')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>

				<FormField
					label='factory_priority'
					title='Factory Priority'
					errors={errors}>
					<Controller
						name={'factory_priority'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Priority'
									options={PriorityOptions}
									value={PriorityOptions?.filter(
										(item) =>
											item.value ==
											getValues('factory_priority')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			<Textarea rows={3} label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
