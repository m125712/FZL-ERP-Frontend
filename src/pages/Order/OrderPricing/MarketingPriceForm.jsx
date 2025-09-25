import { useAuth } from '@/context/auth';
import { Circle, Undo, Undo2Icon } from 'lucide-react';
import { useRHF } from '@/hooks';

import JoinMultiInputButton from '@/components/ui/join-multi-input-buton';

import GetDateTime from '@/util/GetDateTime';
import { MKT_PRICE_NULL, MKT_PRICE_SCHEMA } from '@/util/Schema';

export function MarketingPriceForm({ rowData, updateData, invalidQuery }) {
	const { user } = useAuth();

	const { register, getValues, watch, control, setValue } = useRHF(
		MKT_PRICE_SCHEMA,
		{
			mkt_party_price: rowData.mkt_party_price || 0,
		}
	);

	// Custom submit handler for the check button
	const handleSubmit = async (value) => {
		await updateData.mutateAsync({
			url: `/zipper/order/description/update-md-mkt-cmp-party-price-is-price-confirmed/by/${rowData?.order_description_uuid}`,
			updatedData: {
				mkt_party_price: Number(value),
				updated_at: GetDateTime(),
				updated_by: user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const currentValue =
		watch('mkt_party_price') > 0
			? watch('mkt_party_price')
			: rowData.mkt_party_price;
	const hasChanges = currentValue !== rowData.mkt_party_price;

	return (
		<div className='flex flex-col gap-1'>
			<JoinMultiInputButton
				names={['mkt_party_price']}
				register={register}
				getValues={getValues}
				control={control}
				type='number'
				numberOfInputFields={2}
				showSubmitButton={hasChanges}
				placeholder={`${rowData.mkt_party_price || 'Enter price'}`}
				onSubmit={handleSubmit}
			/>
			{hasChanges && (
				<span className='pl-2 text-xs font-semibold text-gray-700'>
					{/* Modified (not saved){' '} */}
					<span
						className='text-gray underline'
						onClick={() =>
							setValue('mkt_party_price', rowData.mkt_party_price)
						}
					>
						undo
					</span>
				</span>
			)}
		</div>
	);
}
