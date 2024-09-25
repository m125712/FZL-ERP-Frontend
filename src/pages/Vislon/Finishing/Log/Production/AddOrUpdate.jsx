import { useEffect } from 'react';
import {
	useVislonFinishingProd,
	useVislonTMPEntryByUUID,
} from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import {
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	SFG_PRODUCTION_SCHEMA_IN_KG,
	SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateFinishingLog = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		coloring_prod: null,
		wastage: null,
		remarks: '',
	},
	setUpdateFinishingLog,
}) {
	const { data, updateData, url } = useVislonTMPEntryByUUID(
		updateFinishingLog?.uuid
	);
	const { invalidateQuery } = useVislonFinishingProd();
	const MAX_PROD =
		Number(updateFinishingLog.balance_quantity) +
		Number(data?.production_quantity);
	
	const MAX_PROD_KG = Number(updateFinishingLog.finishing_stock) +
	Number(data?.production_quantity_in_kg);

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		{
			...SFG_PRODUCTION_SCHEMA_IN_KG,
			production_quantity: NUMBER_REQUIRED.moreThan(0, 'More Than 0').max(
				MAX_PROD,
				'Beyond Max Quantity'
			),
			production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
				0,
				'More Than 0'
			).max(MAX_PROD_KG, 'Beyond Max Quantity'),
		},
		SFG_PRODUCTION_SCHEMA_IN_KG_NULL
	);

	const MAX_WASTAGE_KG = Number(
		// Todo: Fix this
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

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
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			coloring_prod: null,
			wastage: null,
			remarks: '',
		}));
		reset(SFG_PRODUCTION_SCHEMA_IN_KG_NULL);
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
			title={`Teeth Molding SFG Production Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
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
				title='Production Quantity'
				label='production_quantity'
				unit='PCS'
				sub_label={`MAX: ${MAX_PROD} PCS`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='production_quantity_in_kg'
				unit='KG'
				sub_label={`Max: ${MAX_PROD_KG}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit='KG'
				sub_label={`Max: ${MAX_WASTAGE_KG}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
