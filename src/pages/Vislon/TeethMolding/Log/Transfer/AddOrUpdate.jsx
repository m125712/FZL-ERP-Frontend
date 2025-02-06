import { useEffect } from 'react';
import { useVislonTMP, useVislonTMTEntryByUUID } from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import {
	NUMBER_DOUBLE_REQUIRED,
	VISLON_TRANSACTION_SCHEMA,
	VISLON_TRANSACTION_SCHEMA_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTeethMoldingLog = {
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_from: null,
		trx_to: null,
		remarks: null,
	},
	setUpdateTeethMoldingLog,
}) {
	const MAX_QUANTITY =
		Number(updateTeethMoldingLog?.teeth_molding_prod) +
		Number(updateTeethMoldingLog?.trx_quantity_in_kg);

	const { data, updateData, url } = useVislonTMTEntryByUUID(
		updateTeethMoldingLog?.uuid
	);
	const { invalidateQuery } = useVislonTMP();

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
	} = useRHF(
		{
			...VISLON_TRANSACTION_SCHEMA,
			trx_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
				0,
				'More than 0'
			).max(
				Number(updateTeethMoldingLog?.teeth_molding_prod) +
					Number(updateTeethMoldingLog?.trx_quantity_in_kg),
				'Beyond Max Quantity'
			),
		},
		VISLON_TRANSACTION_SCHEMA_NULL
	);

	// * To reset the form with the fetched data
	useEffect(() => {
		if (data) {
			reset(data); // Reset the form with the fetched data
		}
	}, [data, reset]);

	const onClose = () => {
		setUpdateTeethMoldingLog((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			trx_quantity_in_kg: null,
			trx_from: null,
			trx_to: null,
			remarks: null,
		}));
		reset(VISLON_TRANSACTION_SCHEMA_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTeethMoldingLog?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData: updatedData,
				onClose,
			});
			invalidateQuery();
			return;
		}
	};

	const transactionArea = [
		{ label: 'Dying and Iron', value: 'dying_and_iron_stock' },
		{ label: 'Teeth Molding', value: 'teeth_molding_stock' },
		{ label: 'Teeth Coloring', value: 'teeth_coloring_stock' },
		{ label: 'Finishing', value: 'finishing_stock' },
		{ label: 'Slider Assembly', value: 'slider_assembly_stock' },
		{ label: 'Coloring', value: 'coloring_stock' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Transfer Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<FormField label='trx_to' title='Trx to' errors={errors}>
				<Controller
					name={'trx_to'}
					control={control}
					render={({ field: { onChange } }) => {
						return (
							<ReactSelect
								placeholder='Select Transaction Area'
								options={transactionArea}
								value={transactionArea?.find(
									(item) => item.value == getValues('trx_to')
								)}
								onChange={(e) => onChange(e.value)}
								isDisabled={
									updateTeethMoldingLog?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				label='trx_quantity_in_kg'
				unit='KG'
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
