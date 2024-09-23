import { useEffect } from 'react';
import {
	useNylonMFProduction,
	useNylonMFTrxLog,
	useNylonMFTrxLogByUUID,
} from '@/state/Nylon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, JoinInput, ReactSelect } from '@/ui';

import { SFG_TRANSFER_LOG_NULL, SFG_TRANSFER_LOG_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateLog = {
		uuid: null,
		trx_from: null,
		trx_to: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		teeth_coloring_prod: null,
		finishing_stock: null,
		order_entry_uuid: null,
	},
	setUpdateLog,
}) {
	const { invalidateQuery } = useNylonMFProduction(updateLog.uuid !== null);
	const { updateData } = useNylonMFTrxLog();
	const { data: dataByUUID } = useNylonMFTrxLogByUUID(updateLog.uuid, {
		enabled: updateLog.uuid !== null,
	});
	const MAX_QUANTITY =
		Number(updateLog?.teeth_coloring_prod) +
		Number(updateLog?.trx_quantity);
	const schema = {
		...SFG_TRANSFER_LOG_SCHEMA,
		trx_quantity: SFG_TRANSFER_LOG_SCHEMA.trx_quantity
			.moreThan(0, 'More than 0')
			.max(MAX_QUANTITY),
	};
	const {
		register,
		handleSubmit,
		errors,
		control,
		Controller,
		reset,
		getValues,
		context,
	} = useRHF(schema, SFG_TRANSFER_LOG_NULL);

	useEffect(() => {
		if (dataByUUID) {
			reset(dataByUUID);
		}
	}, [dataByUUID]);

	const onClose = () => {
		setUpdateLog((prev) => ({
			...prev,
			uuid: null,
			trx_from: null,
			trx_to: null,
			trx_quantity: null,
			order_description: null,
			order_quantity: null,
			teeth_coloring_prod: null,
			finishing_stock: null,
			order_entry_uuid: null,
		}));
		reset(SFG_TRANSFER_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateLog?.uuid !== null) {
			const updatedData = {
				...data,
				order_entry_uuid: updateLog?.order_entry_uuid,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url: `/zipper/sfg-transaction/${updateLog?.uuid}`,
				updatedData,
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
		{ label: 'Warehouse', value: 'warehouse' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Teeth Molding SFG Transfer Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
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
								isDisabled={updateLog?.uuid !== null}
							/>
						);
					}}
				/>
			</FormField>
			<JoinInput
				title='Trx Quantity (KG)'
				label='trx_quantity'
				sub_label={`Max: ${MAX_QUANTITY}`}
				unit='KG'
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
