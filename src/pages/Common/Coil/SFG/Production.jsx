import { AddModal } from '@/components/Modal';
import { useAuth } from '@/context/auth';
import { useRHF, useUpdateFunc } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonCoilSFG } from '@/state/Common';
import { Input, JoinInput } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import {
	COIL_PROD_NULL,
	COIL_PROD_SCHEMA,
	NUMBER_REQUIRED,
} from '@util/Schema';

export default function Index({
	modalId = '',
	updateCoilProd = {
		uuid: null,
		type: null,
		production_quantity: null,
		zipper_number: null,
		type_of_zipper: null,
		tape_or_coil_stock_id: null,
	},
	setUpdateCoilProd,
}) {
	const { user } = useAuth();
	const { postData } = useCommonCoilSFG();

	const MAX_PRODUCTION_QTY = updateCoilProd?.trx_quantity_in_coil;
	const schema = {
		...COIL_PROD_SCHEMA,
		production_quantity: NUMBER_REQUIRED.max(MAX_PRODUCTION_QTY),
		wastage: NUMBER_REQUIRED.max(MAX_PRODUCTION_QTY),
	};

	const { register, handleSubmit, errors, reset } = useRHF(
		schema,
		COIL_PROD_NULL
	);

	const onClose = () => {
		setUpdateCoilProd((prev) => ({
			...prev,
			uuid: null,
			type: null,
			production_quantity: null,
			zipper_number: null,
			type_of_zipper: null,
			tape_or_coil_stock_id: null,
		}));
		reset(COIL_PROD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const section = 'coil';
		console.log(data);
		// Update item
		const updatedData = {
			...data,
			section,
			uuid: nanoid(),
			tape_coil_uuid: updateCoilProd?.uuid,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};
		await postData.mutateAsync({
			url: `/zipper/tape-coil-production`,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={'CoilProdModal'}
			title={`Coil Production: ${
				updateCoilProd?.type_of_zipper
					? updateCoilProd?.type_of_zipper.toUpperCase()
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
