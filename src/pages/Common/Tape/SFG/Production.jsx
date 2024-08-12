import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonTapeSFG } from '@/state/Common';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { TAPE_PROD_NULL, TAPE_PROD_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateTapeProd = {
		uuid: null,
		type: null,
		quantity: null,
		zipper_number: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
	},
	setUpdateTapeProd,
}) {
	const { user } = useAuth();
	const { updateData } = useCommonTapeSFG();

	const { register, handleSubmit, errors, reset } = useRHF(
		TAPE_PROD_SCHEMA,
		TAPE_PROD_NULL
	);

	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			uuid: null,
			type: null,
			quantity: null,
			zipper_number: null,
			type_of_zipper: null,
			tape_or_coil_stock_id: null,
		}));
		reset(TAPE_PROD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const section = 'tape';

		// Update item
		const updatedData = {
			...data,
			section,
			uuid: nanoid(),
			tape_coil_uuid: updateTapeProd?.uuid,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};
		await updateData.mutateAsync({
			url: `/zipper/tape-coil-production`,
			uuid: updateTapeProd?.uuid,
			updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={'TapeProdModal'}
			title={`Tape Production: ${
				updateTapeProd?.type_of_zipper
					? updateTapeProd?.type_of_zipper.toUpperCase()
					: ''
			} `}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='production_quantity'
				unit='KG'
				{...{ register, errors }}
			/>
			<JoinInput label='wastage' unit='KG' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
