import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { FormField, Input, ReactSelect } from '@/ui';

import { SFG_TRANSFER_LOG_NULL, SFG_TRANSFER_LOG_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	setFinishingLog,
	updateFinishingLog = {
		id: null,
		trx_from: null,
		trx_to: null,
		trx_quantity: null,
		order_description: null,
		order_quantity: null,
		finishing_prod: null,
		order_entry_id: null,
	},
	setUpdateFinishingLog,
}) {
	const MAX_QUANTITY = updateFinishingLog?.finishing_prod;
	const schema = {
		...SFG_TRANSFER_LOG_SCHEMA,
		trx_quantity: SFG_TRANSFER_LOG_SCHEMA.trx_quantity.max(MAX_QUANTITY),
	};
	const { user } = useAuth();
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

	useFetchForRhfReset(
		`/sfg/trx/by/id/${updateFinishingLog?.id}`,
		updateFinishingLog?.id,
		reset
	);

	const onClose = () => {
		setUpdateFinishingLog((prev) => ({
			...prev,
			id: null,
			trx_from: null,
			trx_to: null,
			trx_quantity: null,
			order_description: null,
			order_quantity: null,
			finishing_prod: null,
			order_entry_id: null,
		}));
		reset(SFG_TRANSFER_LOG_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateFinishingLog?.id !== null) {
			const updatedData = {
				...data,
				order_entry_id: updateFinishingLog?.order_entry_id,
				updated_at: GetDateTime(),
			};

			await useUpdateFunc({
				uri: `/sfg/trx/${updateFinishingLog?.id}/${updateFinishingLog?.order_description}`,
				itemId: updateFinishingLog?.id,
				data: data,
				updatedData: updatedData,
				setItems: setFinishingLog,
				onClose: onClose,
			});

			return;
		}
	};

	const transactionArea = [
		{ label: 'Dying and Iron', value: 'dying_and_iron_stock' },
		{ label: 'Teeth Molding', value: 'teeth_molding_stock' },
		{ label: 'Teeth Cleaning', value: 'teeth_coloring_stock' },
		{ label: 'Finishing', value: 'finishing_prod' },
		{ label: 'Slider Assembly', value: 'slider_assembly_stock' },
		{ label: 'Coloring', value: 'coloring_stock' },
	];

	return (
		<AddModal
			id={modalId}
			title={`Teeth Molding SFG Transfer Log`}
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
								isDisabled={updateFinishingLog?.id !== null}
							/>
						);
					}}
				/>
			</FormField>
			<Input
				label='trx_quantity'
				sub_label={`Max: ${MAX_QUANTITY}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
