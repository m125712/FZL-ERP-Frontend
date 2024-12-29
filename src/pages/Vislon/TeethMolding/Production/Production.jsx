import { useAuth } from '@/context/auth';
import { useVislonTMP, useVislonTMPLog } from '@/state/Vislon';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	NUMBER_DOUBLE_REQUIRED,
	SFG_PRODUCTION_SCHEMA_IN_KG,
	SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTeethMoldingProd = {
		uuid: null,
		sfg_uuid: null,
		section: null,
		production_quantity_in_kg: null,
		production_quantity: null,
		vislon_teeth_molding: null,
		wastage: null,
		remarks: null,
	},
	setUpdateTeethMoldingProd,
}) {
	const { postData } = useVislonTMP();
	const { invalidateQuery } = useVislonTMPLog();
	const { user } = useAuth();

	const MAX_DYED_TAPE_KG = Number(updateTeethMoldingProd.tape_stock);

	const { register, handleSubmit, errors, reset, watch, control, context } =
		useRHF(
			{
				...SFG_PRODUCTION_SCHEMA_IN_KG,
				dyed_tape_used_in_kg: NUMBER_DOUBLE_REQUIRED.moreThan(
					0,
					'More than 0'
				).max(MAX_DYED_TAPE_KG, 'Beyond Max Quantity'),
			},
			{ ...SFG_PRODUCTION_SCHEMA_IN_KG_NULL, dyed_tape_used_in_kg: null }
		);

	const onClose = () => {
		setUpdateTeethMoldingProd((prev) => ({
			...prev,
			uuid: null,
			sfg_uuid: null,
			section: null,
			production_quantity_in_kg: null,
			production_quantity: null,
			vislon_teeth_molding: null,
			wastage: null,
			remarks: null,
		}));

		reset({
			...SFG_PRODUCTION_SCHEMA_IN_KG_NULL,
			dyed_tape_used_in_kg: null,
		});
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			finishing_batch_entry_uuid:
				updateTeethMoldingProd?.finishing_batch_entry_uuid,
			section: 'teeth_molding',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: '/zipper/finishing-batch-production',
			newData: updatedData,
			onClose,
		});

		invalidateQuery();
		return;
	};

	return (
		<AddModal
			id='TeethMoldingProdModal'
			title={'Teeth Molding Production'}
			subTitle={`
				${updateTeethMoldingProd.order_number} -> 
				${updateTeethMoldingProd.item_description} -> 
				${updateTeethMoldingProd.style_color_size} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				title='Production Quantity'
				label='production_quantity_in_kg'
				unit='KG'
				{...{ register, errors }}
			/>
			<JoinInput
				title='Dyed Tape Used'
				label='dyed_tape_used_in_kg'
				unit='KG'
				sub_label={`MAX: ${MAX_DYED_TAPE_KG} kg`}
				{...{ register, errors }}
			/>
			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
