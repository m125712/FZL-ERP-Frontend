import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF, useUpdateFunc } from '@/hooks';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
	SFG_PRODUCTION_SCHEMA_IN_KG,
} from '@util/Schema';
import { useVislonTMPEntryByUUID } from '@/state/Vislon';
import { useEffect } from 'react';
import { number } from 'yup';

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

	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		watch,
	} = useRHF(SFG_PRODUCTION_SCHEMA_IN_KG, SFG_PRODUCTION_SCHEMA_IN_KG_NULL);

	const MAX_PROD_KG =  // Todo: Fix this
		Number(updateTeethMoldingLog.production_quantity_in_kg).toFixed(3) +
		Number(updateTeethMoldingLog.teeth_coloring_stock);

	const MAX_WASTAGE_KG = Number(  // Todo: Fix this
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
	).toFixed(3);

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
				unit='PCS'
				sub_label={`Max: ${MAX_PROD_KG}`}
				{...{ register, errors }}
			/>
			<JoinInput
				label='wastage'
				unit='PCS'
				sub_label={`Max: ${MAX_WASTAGE_KG}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
