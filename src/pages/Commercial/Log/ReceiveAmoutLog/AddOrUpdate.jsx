import { useEffect } from 'react';
import { useAuth } from '@/context/auth';
import {
	useCommercialPIByQuery,
	useCommercialPICash,
	useCommercialReceiveAmount,
	useCommercialReceiveAmountByUUID,
} from '@/state/Commercial';
import {
	useCommonCoilSFG,
	useCommonTapeProductionByUUID,
} from '@/state/Common';
import { useAccess, useRHF } from '@/hooks';

import { AddModal } from '@/components/Modal';
import { ShowLocalToast } from '@/components/Toast';
import { Input } from '@/ui';

import {
	NUMBER_DOUBLE_REQUIRED,
	PI_CASH_RECEIVE_NULL,
	PI_CASH_RECEIVE_SCHEMA,
} from '@util/Schema';
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
	updateReceiveAmountLog = {
		uuid: null,
		pi_cash_uuid: null,
		max_amount: 0,
		amount: null,
		pi_cash_id: null,
	},
	setUpdateReceiveAmountLog,
}) {
	const { data, url, updateData } = useCommercialReceiveAmountByUUID(
		updateReceiveAmountLog.uuid
	);
	const { user } = useAuth();
	const haveAccess = useAccess('commercial__pi-cash');
	const { invalidateQuery: invalidateCommercialPI } = useCommercialPIByQuery(
		getPath(haveAccess, user?.uuid),
		{
			enabled: !!user?.uuid,
		}
	);
	const MAX_AMOUNT = updateReceiveAmountLog?.max_amount;
	const schema = {
		...PI_CASH_RECEIVE_SCHEMA,
		amount: NUMBER_DOUBLE_REQUIRED.max(MAX_AMOUNT, 'Beyond Max Amount'),
	};
	const {
		register,
		handleSubmit,
		errors,
		reset,
		context,
		getValues,
		watch,
		setValue,
	} = useRHF(schema, PI_CASH_RECEIVE_NULL);

	useEffect(() => {
		if (data && updateReceiveAmountLog?.uuid) {
			reset(data);
		}
	}, [data]);

	const onClose = () => {
		setUpdateReceiveAmountLog((prev) => ({
			...prev,
			uuid: null,
			pi_cash_uuid: null,
			max_amount: 0,
			amount: null,
			pi_cash_id: null,
		}));
		reset(PI_CASH_RECEIVE_NULL);
		window[modalId].close();
	};

	const onSubmit = async (data) => {
		// Update item
		if (
			updateReceiveAmountLog?.uuid !== null &&
			updateReceiveAmountLog?.uuid !== undefined
		) {
			const updatedData = {
				...data,
				updated_at: GetDateTime(),
			};

			await updateData.mutateAsync({
				url,
				updatedData,
				onClose,
			});

			return;
		}
		invalidateCommercialPI();
	};

	return (
		<AddModal
			id={modalId}
			title={`Update Receive Log of ${updateReceiveAmountLog?.pi_cash_id}`}
			formContext={context}
			onSubmit={handleSubmit(onSubmit)}
			onClose={onClose}
			isSmall={true}>
			<Input
				title='Amount'
				label='amount'
				sub_label={`Max: ${MAX_AMOUNT}`}
				placeholder={`Max: ${MAX_AMOUNT}`}
				{...{ register, errors }}
			/>

			<Input label='remarks' {...{ register, errors }} />
		</AddModal>
	);
}
