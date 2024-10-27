import { useEffect } from 'react';
import {
	useOtherOrder,
	useOtherOrderPropertiesByTypeName,
} from '@/state/Other';
import {
	useSliderDashboardInfo,
	useSliderDashboardInfoByUUID,
} from '@/state/Slider';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	SLIDER_DASHBOARD_INFO_NULL,
	SLIDER_DASHBOARD_INFO_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateInfo = {
		uuid: null,
	},
	setUpdateInfo,
}) {
	const { url, updateData, postData } = useSliderDashboardInfo();
	const { data } = useSliderDashboardInfoByUUID(updateInfo.uuid, {
		enabled: updateInfo?.uuid !== null,
	});

	const {
		register,
		handleSubmit,
		Controller,
		control,
		errors,
		getValues,
		reset,
		context,
	} = useRHF(SLIDER_DASHBOARD_INFO_SCHEMA, SLIDER_DASHBOARD_INFO_NULL);

	const { data: orders } = useOtherOrder();

	
	// Other Order Properties
	const { data: item } = useOtherOrderPropertiesByTypeName('item');
	const { data: zipper_number } =
		useOtherOrderPropertiesByTypeName('zipper_number');
	const { data: end_type } = useOtherOrderPropertiesByTypeName('end_type');
	const { data: puller_type } =
		useOtherOrderPropertiesByTypeName('puller_type');

	// Reset form data on update
	useEffect(() => {
		if (updateInfo?.uuid !== null && data) {
			reset(data);
		}
	}, [updateInfo, data, reset]);

	const onClose = () => {
		setUpdateInfo((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SLIDER_DASHBOARD_INFO_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateInfo?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateInfo?.uuid}`,
				uuid: updateInfo?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		// Add new item
		const newData = {
			...data,
			created_at: GetDateTime(),
			uuid: nanoid(),
		};

		delete newData['updated_at'];

		await postData.mutateAsync({
			url,
			newData,
			onClose,
		});
	};



	return (
		<AddModal
			id={modalId}
			title={updateInfo?.uuid !== null ? 'Update Info' : 'Create Info'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			formClassName={'mt-4'}>
			{/* ORDER NO */}
			{/* ITEM */}
			{/* ZIPPER NUMBER */}
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<FormField
					label='order_info_uuid'
					title='Order No'
					errors={errors}>
					<Controller
						name={'order_info_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Order'
									options={orders}
									value={orders?.find(
										(item) =>
											item.value ===
											getValues('order_info_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									isDisabled={updateInfo?.uuid !== null}
								/>
							);
						}}
					/>
				</FormField>

				<FormField label='item' title='Item' errors={errors}>
					<Controller
						name={'item'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Order'
									options={item}
									value={item?.find(
										(item) =>
											item.value === getValues('item')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='zipper_number'
					title='Zipper No'
					errors={errors}>
					<Controller
						name={'zipper_number'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Order'
									options={zipper_number}
									value={zipper_number?.find(
										(item) =>
											item.value ===
											getValues('zipper_number')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
			</div>

			{/* END TYPE */}
			{/* PULLER TYPE */}
			{/* COLOR */}

			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<FormField label='end_type' title='End Type' errors={errors}>
					<Controller
						name={'end_type'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Order'
									options={end_type}
									value={end_type?.find(
										(item) =>
											item.value === getValues('end_type')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>

				<FormField
					label='puller_type'
					title='Puller Type'
					errors={errors}>
					<Controller
						name={'puller_type'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Order'
									options={puller_type}
									value={puller_type?.find(
										(item) =>
											item.value ===
											getValues('puller_type')
									)}
									onChange={(e) => onChange(e.value)}
								/>
							);
						}}
					/>
				</FormField>
				<Input
					label='color'
					placeholder='Color'
					{...{ register, errors }}
				/>
			</div>

			{/* ORDER QUANTITY */}
			{/* BODY QUANTITY */}
			{/* CAP QUANTITY */}
			{/* PULLER QUANTITY */}
			<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				<Input
					label='order_quantity'
					placeholder='Order Quantity'
					{...{ register, errors }}
				/>
				<Input
					label='body_quantity'
					placeholder='Body Quantity'
					{...{ register, errors }}
				/>
				<Input
					label='cap_quantity'
					placeholder='Cap Quantity'
					{...{ register, errors }}
				/>

				<Input
					label='puller_quantity'
					placeholder='Puller Quantity'
					{...{ register, errors }}
				/>
			</div>

			{/* LINK QUANTITY */}
			{/* SA PROD */}
			{/* COLORING STOCK */}
			{/* COLORING PROD */}
			<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				<Input
					label='link_quantity'
					placeholder='Link Quantity'
					{...{ register, errors }}
				/>

				<Input
					label='sa_prod'
					placeholder='SA Prod'
					{...{ register, errors }}
				/>

				<Input
					label='coloring_stock'
					placeholder='Coloring Stock'
					{...{ register, errors }}
				/>

				<Input
					label='coloring_prod'
					placeholder='Coloring Prod'
					{...{ register, errors }}
				/>
			</div>

			{/* TRX TO FINISHING */}
			{/* U TOP QUANTITY */}
			{/* H BOTTOM QUANTITY */}
			{/* BOX PIN QUANTITY */}
			<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				<Input
					label='trx_to_finishing'
					placeholder='Trx To Finishing'
					{...{ register, errors }}
				/>
				<Input
					label='u_top_quantity'
					placeholder='U Top Quantity'
					{...{ register, errors }}
				/>

				<Input
					label='h_bottom_quantity'
					placeholder='H Bottom Quantity'
					{...{ register, errors }}
				/>

				<Input
					label='box_pin_quantity'
					placeholder='Box Pin Quantity'
					{...{ register, errors }}
				/>
			</div>

			{/* TWO WAY PIN QUANTITY */}
			<Input
				label='two_way_pin_quantity'
				placeholder='Two Way Pin Quantity'
				{...{ register, errors }}
			/>

			{/* REMARKS */}
			<Textarea
				label='remarks'
				placeholder='Enter remarks'
				rows={3}
				{...{ register, errors }}
			/>
		</AddModal>
	);
}

