import { useEffect } from 'react';
import {
	useVislonFinishingProd,
	useVislonTMTEntryByUUID,
} from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import {
	NUMBER,
	NUMBER_REQUIRED,
	VISLON_TRANSACTION_SCHEMA,
	VISLON_TRANSACTION_SCHEMA_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateFinishingLog = {
		uuid: null,
		sfg_uuid: null,
		trx_quantity_in_kg: null,
		trx_quantity: null,
		trx_from: null,
		trx_to: null,
		remarks: null,
	},
	setUpdateFinishingLog,
}) {
	const MAX_QUANTITY =
		Number(updateFinishingLog?.finishing_prod) +
		Number(updateFinishingLog?.trx_quantity);

	const { data, updateData, url } = useVislonTMTEntryByUUID(
		updateFinishingLog?.uuid
	);
	const { invalidateQuery } = useVislonFinishingProd();
	const { register, handleSubmit, errors, reset, context } = useRHF(
		{
			...VISLON_TRANSACTION_SCHEMA,
			trx_quantity_in_kg: NUMBER,
			trx_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0').max(
				MAX_QUANTITY,
				'Beyond Max Quantity'
			),
		},
		{
			...VISLON_TRANSACTION_SCHEMA_NULL,
			trx_quantity_in_kg: 0,
			trx_quantity: 0,
		}
	);

	// * To reset the form with the fetched data
	useEffect(() => {
		if (data) {
			reset(data); // Reset the form with the fetched data
		}
	}, [data, reset]);

	const onClose = () => {
		setUpdateFinishingLog((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			trx_quantity_in_kg: null,
			trx_quantity: null,
			trx_from: null,
			trx_to: null,
			remarks: null,
		}));
		reset(VISLON_TRANSACTION_SCHEMA_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateFinishingLog?.uuid !== null) {
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
			title={`Transaction Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			subTitle='Finishing -> Warehouse'
			isSmall={true}
		>
			{/* <FormField label='trx_to' title='Trx to' errors={errors}>
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
									updateFinishingLog?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField> */}
			<JoinInput
				label='trx_quantity'
				unit='PCS'
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
