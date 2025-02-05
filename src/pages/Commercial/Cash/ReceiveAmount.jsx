import { useAuth } from '@/context/auth';
import {
	useCommercialPIByQuery,
	useCommercialReceiveAmount,
} from '@/state/Commercial';
import {
	useCommonCoilProduction,
	useCommonCoilSFG,
	useCommonTapeAssign,
} from '@/state/Common';
import { useOtherTapeCoil } from '@/state/Other';
import { useAccess, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { Input, JoinInput } from '@/ui';

import nanoid from '@/lib/nanoid';
import { PI_CASH_RECEIVE_NULL, PI_CASH_RECEIVE_SCHEMA } from '@util/Schema';
import GetDateTime from '@/util/GetDateTime';

const getPath = (haveAccess, userUUID) => {
	if (haveAccess.includes('show_all_orders')) {
		return `?is_cash=true`;
	}

	if (haveAccess.includes('show_own_orders') && userUUID) {
		return `?is_cash=true&own_uuid=${userUUID}`;
	}

	return `?is_cash=true`;
};
export default function Index({
	modalId = '',
	updateReceiveAmount = {
		max_amount: 0,
		pi_uuid: '',
		PI_ID: '',
	},

	setUpdateReceiveAmount,
}) {
	const { user } = useAuth();
	const haveAccess = useAccess('commercial__pi-cash');
	const { url, postData } = useCommercialReceiveAmount();
	const { invalidateQuery: invalidateCommercialPI } = useCommercialPIByQuery(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const MAX_AMOUNT = updateReceiveAmount?.max_amount;

	const { register, handleSubmit, errors, reset, watch, context } = useRHF(
		PI_CASH_RECEIVE_SCHEMA,
		PI_CASH_RECEIVE_NULL
	);

	const onClose = () => {
		setUpdateReceiveAmount((prev) => ({
			...prev,
			max_amount: 0,
			pi_uuid: '',
			PI_ID: '',
		}));
		reset(PI_CASH_RECEIVE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		const updatedData = {
			...data,
			uuid: nanoid(),
			pi_cash_uuid: updateReceiveAmount?.pi_uuid,
			created_by: user?.uuid,
			created_at: GetDateTime(),
		};
		await postData.mutateAsync({
			url: url,
			newData: updatedData,
			onClose,
		});
		invalidateCommercialPI();
	};

	return (
		<AddModal
			id={'add_receive_amount_modal'}
			title={`Receive Amount - ${updateReceiveAmount?.PI_ID}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}
		>
			<Input
				label='amount'
				sub_label={`Max: ${Number(MAX_AMOUNT)}`}
				placeholder={`Max: ${Number(MAX_AMOUNT)}`}
				{...{ register, errors }}
			/>

			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
