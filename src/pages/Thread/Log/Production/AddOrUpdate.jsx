import { useEffect, useState } from 'react';
import { useConeProdByUUID, useDyeingCone } from '@/state/Thread';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import { NUMBER_REQUIRED, STRING } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateConingProd = {
		uuid: null,
		batch_entry_uuid: null,
		coning_carton_quantity: null,
		production_quantity: null,
		wastage: null,
		remarks: null,
	},
	setUpdateConingProd,
}) {
	const { data, updateData, url } = useConeProdByUUID(updateConingProd?.uuid);
	const { invalidateQuery } = useDyeingCone();
	const [qty, setQty] = useState();

	const MAX_PROD =
		Number(updateConingProd?.balance_quantity) +
		Number(data?.production_quantity);
	const MAX_CARTON = Math.ceil(
		Number(qty) / Number(updateConingProd.cone_per_carton)
	);

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		{
			production_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0').max(
				MAX_PROD,
				'Beyond max value'
			),
			coning_carton_quantity: NUMBER_REQUIRED.moreThan(
				0,
				'More than 0'
			).max(MAX_CARTON, 'Beyond max value'),
			remarks: STRING.nullable(),
		},
		{
			production_quantity: '',
			coning_carton_quantity: '',
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
			coning_carton_quantity: null,
			production_quantity: null,
			wastage: null,
			remarks: null,
		}));
		reset({
			production_quantity: '',
			coning_carton_quantity: '',
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

	useEffect(() => {
		setQty(watch('production_quantity'));
	}, [watch('production_quantity')]);

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
				title='Carton Quantity'
				label='coning_carton_quantity'
				unit='KG'
				sub_label={`Suggested: ${MAX_CARTON} kg`}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
