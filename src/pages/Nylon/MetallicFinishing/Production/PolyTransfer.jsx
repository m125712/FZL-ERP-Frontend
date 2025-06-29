import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import Pdf2 from '@/components/Pdf/PolySticker';
import { Input } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
import { POLY_NULL, POLY_SCHEMA } from '@util/Schema';

const DEFAULT_UPDATE = {
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
	item_for: null,
	order_quantity: 0,
	is_inch: 0,
	party_name: null,
	recipe_name: null,
	batch_quantity: null,
};

export default function Index({
	modalId = '',
	update = DEFAULT_UPDATE,
	setUpdate,
}) {
	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		POLY_SCHEMA,
		POLY_NULL
	);

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

		Pdf2(update)?.print({});
	};

	return (
		<AddModal
			id={modalId}
			title={`Poly Sticker (Total QTY: ${update?.batch_quantity})`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input label='quantity' {...{ register, errors }} />
			<Input label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
