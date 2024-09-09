import { AddModal } from '@/components/Modal';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useDyeingTransfer } from '@/state/Dyeing';
import { useOrderBuyer } from '@/state/Order';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import GetDateTime from '@/util/GetDateTime';
import { DevTool } from '@hookform/devtools';
import {
	UPDATE_DYEING_TRANSFER_NULL,
	UPDATE_DYEING_TRANSFER_SCHEMA,
} from '@util/Schema';
import { useState } from 'react';
import { Controller, useWatch } from 'react-hook-form';

export default function Index({
	modalId = '',
	updateTransfer = {
		uuid: null,
	},
	setUpdateTransfer,
}) {
	const { url, updateData } = useDyeingTransfer();
	const { register, handleSubmit, errors, reset, control, getValues, context } =
		useRHF(UPDATE_DYEING_TRANSFER_SCHEMA, UPDATE_DYEING_TRANSFER_NULL);

	useFetchForRhfReset(
		`${url}/${updateTransfer?.uuid}`,
		updateTransfer?.uuid,
		reset
	);

	const onClose = () => {
		setUpdateTransfer((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(UPDATE_DYEING_TRANSFER_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateTransfer?.uuid !== null &&
			updateTransfer?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `${url}/${updateTransfer?.uuid}`,
				uuid: updateTransfer?.uuid,
				updatedData,
				onClose,
			});

			return;
		}

		// Add new item
		const updatedData = {
			...data,
			uuid: nanoid(),
			created_at: GetDateTime(),
		};
	};
	// const [colors, setColors] = useState([]);
	// const [colorsSelect, setColorsSelect] = useState([]);
	const { value: order_id } = useFetch(
		`/other/order/description/value/label?tape_received=true`
	); // * get order id and set them as value & lables for select options

	const getTransferArea = [
		// * get transfer area and set them as value & lables for transfer select options
		{ label: 'Nylon Plastic Finishing', value: 'nylon_plastic_finishing' },
		{
			label: 'Nylon Metallic Finishing',
			value: 'nylon_metallic_finishing',
		},
		{ label: 'Vislon Teeth Molding', value: 'vislon_teeth_molding' },
		{ label: 'Metal Teeth Molding', value: 'metal_teeth_molding' },
	];

	// const getColors = (colors) => {
	// 	// * get colors and set them as value & lables for select options
	// 	setColors([]);
	// 	colors.map((item) => {
	// 		setColors((prev) => [...prev, { label: item, value: item }]);
	// 	});
	// };

	return (
		<AddModal
			id={modalId}
			title={
				updateTransfer?.uuid !== null ? 'Update Transfer' : 'Transfer'
			}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<FormField
				label='order_description_uuid'
				title='Order Entry ID'
				errors={errors}>
				<Controller
					name='order_description_uuid'
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select User'
								options={order_id}
								value={order_id?.filter(
									(item) =>
										item.value ==
										getValues('order_description_uuid')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			{/* <FormField label='colors' title='Colors' errors={errors}>
				<Controller
					name='colors'
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Colors'
								options={colors}
								value={colors?.filter((item) =>
									colorsSelect?.includes(item.value)
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField> */}
			<FormField label='section"' title='Section' errors={errors}>
				<Controller
					name='section'
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select User'
								options={getTransferArea}
								value={getTransferArea.filter(
									(item) => item.value == getValues('section')
								)}
								onChange={(e) => {
									onChange(e.value);
								}}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label='trx_quantity'
				title='Transfer Quantity'
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
