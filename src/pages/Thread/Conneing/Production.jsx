import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth';
import { useConningProdLog, useDyeingCone } from '@/state/Thread';
import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	NUMBER_DOUBLE,
	NUMBER_DOUBLE_REQUIRED,
	NUMBER_REQUIRED,
	STRING,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	coningProd = {
		uuid: null,
		batch_entry_uuid: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		wastage: null,
		remarks: null,
	},
	setConingProd,
}) {
	const { postData, invalidateQuery } = useDyeingCone();
	const { invalidateQuery: invalidateConningProdLog } = useConningProdLog();
	const { user } = useAuth();
	const [qty, setQty] = useState();

	const MAX_PROD = Number(coningProd.balance_quantity);
	const MAX_CARTON = Math.ceil(
		Number(qty) / Number(coningProd.cone_per_carton)
	);

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				production_quantity: NUMBER_REQUIRED.moreThan(
					0,
					'More than 0'
				).max(MAX_PROD, 'Beyond max value'),
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

	const onClose = () => {
		setConingProd((prev) => ({
			...prev,
			uuid: null,
			batch_entry_uuid: null,
			production_quantity: null,
			production_quantity_in_kg: null,
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
		const updatedData = {
			...data,
			uuid: nanoid(),
			batch_entry_uuid: coningProd?.batch_entry_uuid,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/thread/batch-entry-production',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		invalidateConningProdLog();
		return;
	};

	useEffect(() => {
		setQty(watch('production_quantity'));
	}, [watch('production_quantity')]);

	return (
		<AddModal
			id='ConingProdModal'
			title={'Coning Production'}
			subTitle='Coning -> Production'
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
				unit='PCS'
				sub_label={`MAX: ${MAX_CARTON} pcs`}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
