import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useCommonMultiColorDashboard,
	useCommonMultiColorLogTapeReceivedByUUID,
} from '@/state/Common';
import { useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { JoinInput, Textarea } from '@/ui';

import nanoid from '@/lib/nanoid';
import { DevTool } from '@/lib/react-hook-devtool';
import {
	MULTI_COLOR_TAPE_RECEIVED_NULL,
	MULTI_COLOR_TAPE_RECEIVED_SCHEMA,
} from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

export default function Index({
	modalId = '',
	tapeReceived = {
		uuid: null,
	},
	setTapeReceived,
}) {
	const { data, updateData, url } = useCommonMultiColorLogTapeReceivedByUUID(
		tapeReceived?.uuid
	);
	const { invalidateQuery: indexPageInvalidate } =
		useCommonMultiColorDashboard();
	const { user } = useAuth();

	const { register, handleSubmit, errors, reset, control, context } = useRHF(
		MULTI_COLOR_TAPE_RECEIVED_SCHEMA,
		MULTI_COLOR_TAPE_RECEIVED_NULL
	);

	useEffect(() => {
		if (data) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setTapeReceived((prev) => ({
			...prev,
			uuid: null,
		}));

		reset(MULTI_COLOR_TAPE_RECEIVED_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		const Data = {
			...data,
			updated_at: GetDateTime(),
		};

		await updateData.mutateAsync({
			url,
			updatedData: Data,
			onClose,
		});

		indexPageInvalidate();
	};

	return (
		<AddModal
			id={modalId}
			title={'Tape Received'}
			subTitle={`
				${tapeReceived.order_number} -> 
				${tapeReceived.item_description} 
				`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<JoinInput
				title='Quantity'
				label='quantity'
				unit='KG'
				sub_label={`MAX: ${Number(tapeReceived?.expected_tape_quantity)} KG`}
				{...{ register, errors }}
			/>

			<Textarea label='remarks' {...{ register, errors }} />
			<DevTool control={control} placement='top-left' />
		</AddModal>
	);
}
