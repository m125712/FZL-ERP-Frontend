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

	const MAX_PROD_KG = Number(coningProd.balance_quantity);

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				production_quantity: NUMBER_REQUIRED.moreThan(0, 'More than 0'),
				production_quantity_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
					0,
					'More than 0'
				),
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

	const MAX_WASTAGE_KG = Number(
		MAX_PROD_KG - (watch('production_quantity_in_kg') || 0)
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
				sub_label={`MAX: ${MAX_PROD_KG} pcs`}
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
				sub_label={`MAX: ${MAX_WASTAGE_KG} kg`}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
