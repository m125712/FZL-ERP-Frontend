import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import Pdf from '@/components/Pdf/ConeSticker';
import Pdf2 from '@/components/Pdf/PolySticker';
import { Input } from '@/ui';

import { DevTool } from '@/lib/react-hook-devtool';
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
		item_for: null,
		order_quantity: 0,
		is_inch: 0,
		party_name: null,
		recipe_name: null,
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
		if (
			update?.item_for === 'thread' ||
			update?.item_for === 'sample_thread'
		) {
			Pdf(update)?.print({}, window);
		} else {
			Pdf2(update)?.print({}, window);
		}
	};

	return (
		<AddModal
			id={modalId}
			title={`${update?.item_for === 'thread' || update?.item_for === 'sample_thread' ? `Cone Sticker (Total QTY: ${update?.quantity})` : `Poly Sticker (Total QTY: ${update?.quantity})`}`}
			subTitle={`${update?.item_for === 'thread' || update?.item_for === 'sample_thread' ? `Suggest Cone Sticker QTY: ${Math.ceil(update?.quantity / 3)} X 3` : ''}`}
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
