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
	DYEING_AGAINST_STOCK_NULL,
	DYEING_AGAINST_STOCK_SCHEMA,
	NUMBER_REQUIRED,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	updateCoilProd = {
		uuid: null,
		dyeing_stock: null,
		quantity: null,
	},
	setUpdateCoilProd,
}) {
	const { user } = useAuth();
	const { postData, invalidateQuery: invalidateCommonCoilSFG } =
		useCommonCoilSFG();
	const { invalidateQuery: invalidateCommonTapeToCoil } =
		useCommonTapeToCoil();
	const schema = {
		...DYEING_AGAINST_STOCK_SCHEMA,
		trx_quantity: NUMBER_REQUIRED.max(
			updateCoilProd?.quantity,
			'More Than Max'
		),
	};

	const { register, handleSubmit, errors, reset, context } = useRHF(
		schema,
		DYEING_AGAINST_STOCK_NULL
	);

	const onClose = () => {
		setUpdateCoilProd((prev) => ({
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
			tape_coil_uuid: updateCoilProd?.uuid,
			to_section: 'coil_dyeing',
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
			title={updateCoilProd?.uuid !== null && 'Dyeing Against Stock'}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				label='trx_quantity'
				title='Transfer Quantity'
				sub_label={`Max: ${updateCoilProd?.quantity}`}
				unit='KG'
				placeholder={`Max: ${updateCoilProd?.quantity}`}
				{...{ register, errors }}
			/>
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
