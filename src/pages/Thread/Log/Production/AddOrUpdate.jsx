import { useEffect } from 'react';
import { useConeProdByUUID, useDyeingCone} from '@/state/Thread';

import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import {
	NUMBER_DOUBLE,
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	STRING,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateConingProd = {
		uuid: null,
		batch_entry_uuid: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		wastage: null,
		remarks: null,
	},
	setUpdateConingProd,
}) {
	const { data, updateData, url } = useConeProdByUUID(updateConingProd?.uuid);
	const { invalidateQuery } = useDyeingCone();

	const MAX_PROD =
		Number(updateConingProd?.balance_quantity) +
		Number(data?.production_quantity);
	const MAX_PROD_KG = MAX_PROD;

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		{
			production_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0').max(
				MAX_PROD,
				'Beyond max value'
			),
			production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
				0,
				'More than 0'
			).max(MAX_PROD, 'Beyond max value'),
			wastage: NUMBER_DOUBLE.min(0, 'Minimum of 0')
				.nullable()
				.transform((value, originalValue) =>
					String(originalValue).trim() === '' ? 0 : value
				),
			remarks: STRING.nullable(),
		},
		{
			production_quantity: '',
			production_quantity_in_kg: '',
			wastage: '',
			remarks: '',
		}
	);

	// * To reset the form with the fetched data
	useEffect(() => {
		if (data) {
			reset(data); // Reset the form with the fetched data
		}
	}, [data, reset]);

	const onClose = () => {
		setUpdateConingProd((prev) => ({
			...prev,
			uuid: null,
			batch_entry_uuid: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			wastage: null,
			remarks: null,
		}));
		reset({
			production_quantity: '',
			production_quantity_in_kg: '',
			wastage: '',
			remarks: '',
		});
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (updateConingProd?.uuid !== null) {
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

	return (
		<AddModal
			id={modalId}
			title={`Production Log`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity'
				unit='PCS'
				sub_label={`MAX: ${MAX_PROD} pcs`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='Production Quantity In KG'
				label='production_quantity_in_kg'
				unit='KG'
				sub_label={`MAX: ${MAX_PROD_KG} kg`}
				{...{ register, errors }}
			/>
			<JoinInput
				title='wastage'
				label='wastage'
				unit='KG'
				sub_label={`MAX: ${MAX_PROD_KG} kg`}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
