import { AddModal } from '@/components/Modal';
import { useRHF } from '@/hooks';
import nanoid from '@/lib/nanoid';
import { useCommonTapeSFG } from '@/state/Common';
import { Input } from '@/ui';
import GetDateTime from '@/util/GetDateTime';
import { TAPE_STOCK_ADD_NULL, TAPE_STOCK_ADD_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	updateTapeProd = {
		uuid: null,
		type: '',
		zipper_number: null,
		quantity: null,
		trx_quantity_in_coil: null,
		quantity_in_coil: null,
		remarks: '',
	},
	setUpdateTapeProd,
}) {
	const { url, updateData, postData } = useCommonTapeSFG();
	const { register, handleSubmit, errors, reset, control } = useRHF(
		TAPE_STOCK_ADD_SCHEMA,
		TAPE_STOCK_ADD_NULL
	);

	const onClose = () => {
		setUpdateTapeProd((prev) => ({
			...prev,
			uuid: null,
			type: '',
			zipper_number: null,
			quantity: null,
			trx_quantity_in_coil: null,
			quantity_in_coil: null,
			remarks: '',
		}));
		reset(TAPE_STOCK_ADD_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		//console.log(data);
		if (
			updateTapeProd?.uuid !== null &&
			updateTapeProd?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				quantity: 0,
				trx_quantity_in_coil: 0,
				quantity_in_coil: 0,
				updated_at: GetDateTime(),
			};
			await updateData.mutateAsync({
				url: `${url}/${updateTapeProd?.uuid}/${data?.type}`,
				uuid: updateTapeProd?.uuid,
				updatedData,
				onClose,
			});

			return;
		}
		const updatedData = {
			...data,
			uuid: nanoid(),
			quantity: 0,
			trx_quantity_in_coil: 0,
			quantity_in_coil: 0,
			created_at: GetDateTime(),
		};

		await postData.mutateAsync({
			url,
			newData: updatedData,
			onClose,
		});
	};

	return (
		<AddModal
			id={modalId}
			title={
				updateTapeProd?.id !== undefined ? 'Tape Add' : 'Tape Update'
			}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='type' {...{ register, errors }} />
			<Input label='zipper_number' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
