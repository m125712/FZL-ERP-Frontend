import { useEffect, useState } from 'react';
import { useDyeingTransfer } from '@/state/Dyeing';
import { useOrderBuyer } from '@/state/Order';
import { DevTool } from '@hookform/devtools';
import { Watch } from 'lucide-react';
import { Controller, useWatch } from 'react-hook-form';
import { useFetch, useFetchForRhfReset, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	UPDATE_DYEING_TRANSFER_NULL,
	UPDATE_DYEING_TRANSFER_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTransfer = {
		uuid: null,
	},
	setUpdateTransfer,
}) {
	const { url, updateData } = useDyeingTransfer();
	const { register, handleSubmit, errors, reset, control, getValues, watch } =
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
	const [colors, setColors] = useState([]);
	const [colorsSelect, setColorsSelect] = useState([]);
	const { value: order_id } = useFetch(
		`/other/order/description/value/label`
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

	const getColors = (uuid) => {
		// * get colors and set them as value & lables for select options
		setColors([]);

		const item = order_id?.find((entry) => entry.value === uuid);

		if (item) {
			item.colors.map((color) =>
				setColors((prev) => [...prev, { label: color, value: color }])
			);
		}
	};

	// TODO: Fix this
	useEffect(() => {
		if (watch('order_description_uuid')) {
			// getColors(getValues('order_description_uuid'));
		}
	}, [watch('order_description_uuid')]);

	return (
		<AddModal
			id={modalId}
			title={
				updateTransfer?.uuid !== null ? 'Update Transfer' : 'Transfer'
			}
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
			<FormField label='colors' title='Colors' errors={errors}>
				<Controller
					name='colors'
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Colors'
								options={colors}
								value={colors?.find((item) =>
									colorsSelect?.includes(item.value)
								)}
								onChange={(selectedOptions) => {
									const newSelections = selectedOptions
										? selectedOptions.map(
												(item) => item.value
											)
										: [];
									setColorsSelect(newSelections); // Update the selected colors
									onChange(newSelections); // Update the form value
								}}
								menuPortalTarget={document.body}
							/>
						);
					}}
				/>
			</FormField>
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
