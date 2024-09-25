import { useEffect } from 'react';
import { useVislonTMP, useVislonTMPEntryByUUID } from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import {
	SFG_PRODUCTION_SCHEMA_IN_KG,
	SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTeethMoldingLog = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		wastage: null,
		remarks: '',
	},
	setUpdateTeethMoldingLog,
}) {
	const { data, updateData, url } = useVislonTMPEntryByUUID(
		updateTeethMoldingLog?.uuid
	);

	const { invalidateQuery } = useVislonTMP();
	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		SFG_PRODUCTION_SCHEMA_IN_KG,
		SFG_PRODUCTION_SCHEMA_IN_KG_NULL
	);

	const MAX_PROD_KG =
		Number(updateTeethMoldingLog.production_quantity_in_kg) +
		Number(updateTeethMoldingLog.tape_transferred);

	const MAX_WASTAGE_KG = Number(
		// Todo: Fix this
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
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
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			wastage: null,
			remarks: '',
		}));
		reset(SFG_PRODUCTION_SCHEMA_IN_KG_NULL);
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
			title={`Production Log`}
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
									updateTeethMoldingLog?.uuid !== null
								}
							/>
						);
					}}
				/>
			</FormField> */}

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
