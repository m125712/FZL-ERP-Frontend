import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useFetchForRhfReset, useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonTapeSFG } from '@/state/Common';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	COIL_STOCK_NULL,
	NUMBER_REQUIRED,
	TAPE_TO_COIL_TRX_NULL,
	TAPE_TO_COIL_TRX_SCHEMA,
} from '@util/Schema';

export default function Index({
	modalId = '',
	updateTapeProd = {
		uuid: null,
		trx_quantity: null,
		quantity: null,
	},
	setUpdateTapeProd,
}) {
	const { user } = useAuth();
	const { postData } = useCommonTapeSFG();
	const schema = {
		...TAPE_TO_COIL_TRX_SCHEMA,

		trx_quantity: NUMBER_REQUIRED.max(
			updateTapeProd?.quantity,
			'More Than Max'
		),
	};

	const { register, handleSubmit, errors, reset } = useRHF(
		schema,
		TAPE_TO_COIL_TRX_NULL
	);

	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			uuid: null,
			trx_quantity: null,
		}));
		reset(COIL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			tape_coil_uuid: updateTapeProd?.uuid,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: `/zipper/tape-to-coil`,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={updateTapeProd?.uuid !== null && 'Tape to Coil'}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='trx_quantity'
				unit='KG'
				placeholder={`Max: ${updateTapeProd?.quantity}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}