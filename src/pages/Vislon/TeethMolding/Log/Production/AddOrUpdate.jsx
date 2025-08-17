import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useVislonTMP, useVislonTMPEntryByUUID } from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import {
	NUMBER_DOUBLE_REQUIRED,
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
	const { user } = useAuth();

	const MAX_DYED_TAPE_KG =
		Number(updateTeethMoldingLog.dyed_tape_used_in_kg) +
		Number(updateTeethMoldingLog.tape_stock);

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		{
			...SFG_PRODUCTION_SCHEMA_IN_KG,
			dyed_tape_used_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
				0,
				'More than 0'
			).max(MAX_DYED_TAPE_KG, 'Beyond Max Quantity'),
		},
		{ SFG_PRODUCTION_SCHEMA_IN_KG_NULL, dyed_tape_used_in_kg: null }
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
		reset({ SFG_PRODUCTION_SCHEMA_IN_KG_NULL, dyed_tape_used_in_kg: null });
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateTeethMoldingLog?.uuid !== null) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
				updated_by: user?.uuid,
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
			isSmall={true}
		>
			<JoinInput
				label='production_quantity_in_kg'
				unit='KG'
				{...{ register, errors }}
			/>
			<JoinInput
				label='dyed_tape_used_in_kg'
				unit='KG'
				sub_label={`Max: ${MAX_DYED_TAPE_KG}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
