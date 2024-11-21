import { DevTool } from '@hookform/devtools';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import Pdf2 from '@/components/Pdf/PolySticker';
import { Input } from '@/ui';

import { POLY_NULL, POLY_SCHEMA } from '@util/Schema';

export default function Index({
	modalId = '',
	update = {
		uuid: null,
		packing_number: null,
		packing_list_uuid: null,
		sfg_uuid: null,
		quantity: 0,
		order_number: null,
		item_description: null,
		style: null,
		color: null,
		size: null,
		is_inch: 0,
		order_quantity: 0,
	},
	setUpdate,
}) {
	const {
		register,
		handleSubmit,
		errors,
		reset,
		control,
		context,
		getValues,
	} = useRHF(POLY_SCHEMA, POLY_NULL);

	const onClose = () => {
		setUpdate((prev) => ({
			...prev,
			uuid: null,
		}));
		reset(POLY_NULL);
		window[modalId].close();
	};
	const onSubmit = async (data) => {
		update.quantity = data.quantity;

		Pdf2(update)?.print({}, window);
	};

	return (
		<AddModal
			id={modalId}
			title={`Poly Sticker(Total QTY:${update?.quantity})`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input label='quantity' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
