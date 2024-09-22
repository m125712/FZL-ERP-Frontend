import { useAuth } from '@/context/auth';
import { useCommonTapeSFG, useCommonTapeToCoil } from '@/state/Common';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import {
	DYEING_AGAINST_STOCK_NULL,
	DYEING_AGAINST_STOCK_SCHEMA,
	NUMBER_REQUIRED,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateTapeProd = {
		uuid: null,
		dyeing_stock: null,
		quantity: null,
	},
	setUpdateTapeProd,
}) {
	const { user } = useAuth();
	const { postData, invalidateQuery: invalidateCommonTapeSFG } = useCommonTapeSFG();
	const { invalidateQuery: invalidateCommonTapeToCoil } =
		useCommonTapeToCoil();
	const schema = {
		...DYEING_AGAINST_STOCK_SCHEMA,
		trx_quantity: NUMBER_REQUIRED.max(
			updateTapeProd?.quantity,
			'More Than Max'
		),
	};

	const { register, handleSubmit, errors, reset, context } = useRHF(
		schema,
		DYEING_AGAINST_STOCK_NULL
	);

	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			uuid: null,
			dyeing_stock: null,
			quantity: null,
		}));
		reset(DYEING_AGAINST_STOCK_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const updatedData = {
			...data,
			uuid: nanoid(),
			tape_coil_uuid: updateTapeProd?.uuid,
			to_section: 'dyeing',
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url: `/zipper/tape-trx`,
			newData: updatedData,
			onClose,
		});
		 invalidateCommonTapeToCoil();
		invalidateCommonTapeSFG();
	};

	return (
		<AddModal
			id={modalId}
			title={updateTapeProd?.uuid !== null && 'Dyeing Against Stock'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<JoinInput
				label='trx_quantity'
				title='Transfer Quantity'
				sub_label={`Max: ${updateTapeProd?.quantity}`}
				unit='KG'
				placeholder={`Max: ${updateTapeProd?.quantity}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
