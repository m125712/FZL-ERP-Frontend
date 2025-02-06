import { color } from 'motion/react';
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
		balance_quantity: null,
		count_length: null,
		batch_number: null,
		color: null,
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
		Pdf(update)?.print({}, window);
	};

	return (
		<AddModal
			id={modalId}
			title={`${`Cone Sticker (Total QTY: ${update?.balance_quantity})`}`}
			subTitle={`${`Suggest Cone Sticker QTY: ${Math.ceil(update?.balance_quantity / 3)} X 3`}`}
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
