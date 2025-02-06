import { useAuth } from '@/context/auth';
import {
	useCommonCoilSFG,
	useCommonTapeSFG,
	useCommonTapeToCoil,
} from '@/state/Common';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	COIL_STOCK_NULL,
	NUMBER_REQUIRED,
	TAPE_TO_COIL_TRX_NULL,
	TAPE_TO_COIL_TRX_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

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
	const { invalidateQuery: invalidateCommonTapeToCoil } =
		useCommonTapeToCoil();
	const { invalidateQuery: invalidateCommonCoilSFG } = useCommonCoilSFG();
	const schema = {
		...TAPE_TO_COIL_TRX_SCHEMA,

		trx_quantity: NUMBER_REQUIRED.max(
			updateTapeProd?.quantity,
			'More Than Max'
		),
	};

	const { register, handleSubmit, errors, reset, context } = useRHF(
		schema,
		TAPE_TO_COIL_TRX_NULL
	);

	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			uuid: null,
			trx_quantity: null,
			quantity: null,
		}));
		reset(COIL_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			tape_coil_uuid: updateTapeProd?.uuid,
			to_section: 'coil',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: `/zipper/tape-trx`,
			newData: updatedData,
			onClose,
		});
		invalidateCommonTapeToCoil();
		invalidateCommonCoilSFG();
	};

	return (
		<AddModal
			id={modalId}
			title={updateTapeProd?.uuid !== null && 'Tape -> Coil'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label='trx_quantity'
				sub_label={`Max: ${updateTapeProd?.quantity}`}
				unit='KG'
				placeholder={`Max: ${updateTapeProd?.quantity}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
