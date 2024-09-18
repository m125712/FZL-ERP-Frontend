import { useAuth } from '@/context/auth';
import { useSliderAssemblyStock } from '@/state/Slider';
import { DevTool } from '@hookform/devtools';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	SLIDER_ASSEMBLY_STOCK_NULL,
	SLIDER_ASSEMBLY_STOCK_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateStock = {
		uuid: null,
	},
	setUpdateStock,
}) {
	const { url, updateData, postData } = useSliderAssemblyStock();
	const {
		register,
		handleSubmit,
		Controller,
		control,
		errors,
		getValues,
		reset,
		context,
	} = useRHF(SLIDER_ASSEMBLY_STOCK_SCHEMA, SLIDER_ASSEMBLY_STOCK_NULL);

	const { value: body } = useFetch('/other/slider/die-casting/by-type/body');
	const { value: puller } = useFetch(
		'/other/slider/die-casting/by-type/puller'
	);
	const { value: cap } = useFetch('/other/slider/die-casting/by-type/cap');
	const { value: link } = useFetch('/other/slider/die-casting/by-type/link');

	const { user } = useAuth();

	useFetchForRhfReset(
		`/slider/assembly-stock/${updateStock?.uuid}`,
		updateStock?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateStock((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(SLIDER_ASSEMBLY_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateStock?.uuid !== null) {
			const updatedData = {
				...data,
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
			quantity: 0,
			created_by: user?.uuid,
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
			title={updateStock?.uuid !== null ? 'Update Stock' : 'Create Stock'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}>
			{/* NAME , ITEM , ZIPPER NUMBER */}
			<Input
				label='name'
				placeholder='Enter Name'
				{...{ register, errors }}
			/>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
				{/* Body */}
				<FormField
					label='die_casting_body_uuid'
					title='Body'
					errors={errors}>
					<Controller
						name={'die_casting_body_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select body'
									options={body}
									value={body?.filter(
										(item) =>
											item.value ==
											getValues('die_casting_body_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>

				{/* Puller */}
				<FormField
					label='die_casting_puller_uuid'
					title='Puller'
					errors={errors}>
					<Controller
						name={'die_casting_puller_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select puller'
									options={puller}
									value={puller?.filter(
										(item) =>
											item.value ==
											getValues('die_casting_puller_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>

				{/* Cap */}

				<FormField
					label='die_casting_cap_uuid'
					title='Cap'
					errors={errors}>
					<Controller
						name={'die_casting_cap_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select cap'
									options={cap}
									value={cap?.filter(
										(end_type) =>
											end_type.value ==
											getValues('die_casting_cap_uuid')
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

				{/* Link */}
				<FormField
					label='die_casting_link_uuid'
					title='Link'
					errors={errors}>
					<Controller
						name={'die_casting_link_uuid'}
						control={control}
						render={({ field: { onChange } }) => {
							return (
								<ReactSelect
									placeholder='Select link'
									options={link}
									value={link?.filter(
										(puller_type) =>
											puller_type.value ==
											getValues('die_casting_link_uuid')
									)}
									onChange={(e) => onChange(e.value)}
									// isDisabled={order_info_id !== undefined}
								/>
							);
						}}
					/>
				</FormField>
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
