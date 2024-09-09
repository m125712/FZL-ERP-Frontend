import { AddModal } from '@/components/Modal';
import { useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useOtherOrderPropertiesByTypeName } from '@/state/Other';
import { useSliderDieCastingStock } from '@/state/Slider';
import { CheckBox, FormField, Input, Radio, ReactSelect, Textarea } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	SLIDER_DIE_CASTING_STOCK_NULL,
	SLIDER_DIE_CASTING_STOCK_SCHEMA,
} from '@util/Schema';

export default function Index({
	modalId = '',
	updateStock = {
		uuid: null,
	},
	setUpdateStock,
}) {
	const { url, updateData, postData } = useSliderDieCastingStock();
	const {
		register,
		handleSubmit,
		Controller,
		control,
		errors,
		getValues,
		reset,
		context,
	} = useRHF(SLIDER_DIE_CASTING_STOCK_SCHEMA, SLIDER_DIE_CASTING_STOCK_NULL);

	// Other Order Properties
	const { data: item } = useOtherOrderPropertiesByTypeName('item');
	const { data: zipper_number } =
		useOtherOrderPropertiesByTypeName('zipper_number');
	const { data: end_type } = useOtherOrderPropertiesByTypeName('end_type');
	const { data: puller_type } =
		useOtherOrderPropertiesByTypeName('puller_type');
	const { data: logo_type } = useOtherOrderPropertiesByTypeName('logo_type');
	const { data: slider_body_shape } =
		useOtherOrderPropertiesByTypeName('slider_body_shape');
	const { data: puller_link } =
		useOtherOrderPropertiesByTypeName('puller_link');
	const { data: stopper_type } =
		useOtherOrderPropertiesByTypeName('stopper_type');

	useFetchForRhfReset(
		`/slider/die-casting/${updateStock?.uuid}`,
		updateStock?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateStock((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SLIDER_DIE_CASTING_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateStock?.uuid !== null) {
			const updatedData = {
				...data,
				is_body: data.is_body === true ? 1 : 0,
				is_puller: data.is_puller === true ? 1 : 0,
				is_cap: data.is_cap === true ? 1 : 0,
				is_link: data.is_link === true ? 1 : 0,
				is_h_bottom: data.is_h_bottom === true ? 1 : 0,
				is_u_top: data.is_u_top === true ? 1 : 0,
				is_box_pin: data.is_box_pin === true ? 1 : 0,
				is_two_way_pin: data.is_two_way_pin === true ? 1 : 0,
				is_logo_body: data.is_logo_body === true ? 1 : 0,
				is_logo_puller: data.is_logo_puller === true ? 1 : 0,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateStock?.uuid}`,
				uuid: updateStock?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		// Add new item
		const newData = {
			...data,
			is_body: data.is_body === true ? 1 : 0,
			is_puller: data.is_puller === true ? 1 : 0,
			is_cap: data.is_cap === true ? 1 : 0,
			is_link: data.is_link === true ? 1 : 0,
			is_h_bottom: data.is_h_bottom === true ? 1 : 0,
			is_u_top: data.is_u_top === true ? 1 : 0,
			is_box_pin: data.is_box_pin === true ? 1 : 0,
			is_two_way_pin: data.is_two_way_pin === true ? 1 : 0,
			is_logo_body: data.is_logo_body === true ? 1 : 0,
			is_logo_puller: data.is_logo_puller === true ? 1 : 0,
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

	console.log(getValues());

	return (
		<AddModal
			id={modalId}
			title={updateStock?.uuid !== null ? 'Update Stock' : 'Create Stock'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}>
			{/* NAME , ITEM , ZIPPER NUMBER */}
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<Input
					label='name'
					placeholder='Enter Name'
					{...{ register, errors }}
				/>
				<FormField label='item' title='Item' errors={errors}>
					<Controller
						name={'item'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Item'
									options={item}
									value={item?.filter(
										(item) =>
											item.value == getValues('item')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>

				<FormField
					label='zipper_number'
					title='Zipper Number'
					errors={errors}>
					<Controller
						name={'zipper_number'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Zipper Number'
									options={zipper_number}
									value={zipper_number?.filter(
										(item) =>
											item.value ==
											getValues('zipper_number')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
			</div>

			{/* END TYPE , PULLER TYPE , LOGO TYPE  */}
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<FormField label='end_type' title='End' errors={errors}>
					<Controller
						name={'end_type'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select End Type'
									options={end_type}
									value={end_type?.filter(
										(end_type) =>
											end_type.value ==
											getValues('end_type')
									)}
									onChange={(e) => {
										onChange(e.value);
									}}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>

				<FormField label='puller_type' title='Puller' errors={errors}>
					<Controller
						name={'puller_type'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Puller Type'
									options={puller_type}
									value={puller_type?.filter(
										(puller_type) =>
											puller_type.value ==
											getValues('puller_type')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
				<FormField
					label='puller_link'
					title='Puller Link'
					errors={errors}>
					<Controller
						name={'puller_link'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Puller Link'
									options={puller_link}
									value={puller_link?.filter(
										(item) =>
											item.value ==
											getValues('puller_link')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
			</div>
			{/* SLIDER BODY SHAPE, PULLER LINK, STOPPER TYPE */}
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<FormField
					label='slider_body_shape'
					title='Body Shape'
					errors={errors}>
					<Controller
						name={'slider_body_shape'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select body shape'
									options={slider_body_shape}
									value={slider_body_shape?.filter(
										(item) =>
											item.value ==
											getValues('slider_body_shape')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>

				{/* //* TODO: if logo_type selected, then at least one of the input should be selected */}
				<FormField label='logo_type' title='Logo' errors={errors}>
					<Controller
						name={'logo_type'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select Logo Type'
									options={logo_type}
									value={logo_type?.filter(
										(logo_type) =>
											logo_type.value ==
											getValues('logo_type')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
				<div className='mt-6 flex items-center gap-1 text-sm'>
					<CheckBox
						label='is_logo_body'
						title='Logo in Body'
						height='h-[2.9rem]'
						defaultChecked={getValues('is_logo_body')}
						className='w-full rounded border border-primary/30 bg-primary/5 px-2'
						{...{ register, errors }}
					/>

					<CheckBox
						label='is_logo_puller'
						title='Logo in Puller'
						height='h-[2.9rem]'
						defaultChecked={getValues('is_logo_puller')}
						className='w-full rounded border border-primary/30 bg-primary/5 px-2'
						{...{ register, errors }}
					/>
				</div>
			</div>

			<div className='mt-4 text-lg font-bold text-primary'>
				Which Item?
			</div>
			{/* IS BODY, IS PULLER, IS CAP, IS LINK */}
			<div className='mt-2 grid grid-cols-2 gap-4 md:grid-cols-4'>
				<CheckBox
					label='is_body'
					title='Body'
					height='h-[2.9rem]'
					className='rounded border border-primary/30 bg-primary/5 px-2'
					{...{ register, errors }}
				/>
				<CheckBox
					label='is_puller'
					title='Puller'
					height='h-[2.9rem]'
					className='rounded border border-primary/30 bg-primary/5 px-2'
					{...{ register, errors }}
				/>
				<CheckBox
					label='is_cap'
					title='Cap'
					height='h-[2.9rem]'
					className='rounded border border-primary/30 bg-primary/5 px-2'
					{...{ register, errors }}
				/>
				<CheckBox
					label='is_link'
					title='Link'
					height='h-[2.9rem]'
					className='rounded border border-primary/30 bg-primary/5 px-2'
					{...{ register, errors }}
				/>
			</div>

			{/* IS H BOTTOM, IS U TOP, IS BOX PIN, IS TWO WAY PIN */}
			<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
				<CheckBox
					label='is_h_bottom'
					title='H Bottom'
					height='h-[2.9rem]'
					className='rounded border border-primary/30 bg-primary/5 px-2'
					{...{ register, errors }}
				/>
				<CheckBox
					label='is_u_top'
					title='U Top'
					height='h-[2.9rem]'
					className='rounded border border-primary/30 bg-primary/5 px-2'
					{...{ register, errors }}
				/>
				<CheckBox
					label='is_box_pin'
					title='Box Pin'
					height='h-[2.9rem]'
					className='rounded border border-primary/30 bg-primary/5 px-2'
					{...{ register, errors }}
				/>
				<CheckBox
					label='is_two_way_pin'
					title='Two Way Pin'
					height='h-[2.9rem]'
					className='rounded border border-primary/30 bg-primary/5 px-2'
					{...{ register, errors }}
				/>
			</div>
			{/* REMARKS */}
			<Textarea
				label='remarks'
				placeholder='Enter remarks'
				rows={3}
				{...{ register, errors }}
			/>
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
