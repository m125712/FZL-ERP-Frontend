import { useAuth } from '@/context/auth';
import { useRHF } from '@/hooks';

import JoinMultiInputButton from '@/components/ui/join-multi-input-buton';

import GetDateTime from '@/util/GetDateTime';
import { MKT_PRICE_SCHEMA } from '@/util/Schema';

export function MarketingPriceForm({ rowData, updateData, disabled = false }) {
	const { user } = useAuth();

	const { register, getValues, watch, control, setValue } = useRHF(
		MKT_PRICE_SCHEMA,
		{
			mkt_party_price: rowData.mkt_party_price || 0,
			mkt_company_price: rowData.mkt_company_price || 0,
		}
	);

	// Custom submit handler for the check button
	const handleSubmit = async (value) => {
		await updateData.mutateAsync({
			url: `/zipper/order/description/update-md-mkt-cmp-party-price-is-price-confirmed/by/${rowData?.order_description_uuid}`,
			updatedData: {
				mkt_party_price: Number(value[1]),
				mkt_company_price: Number(value[0]),
				updated_at: GetDateTime(),
				updated_by: user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const currentPartyValue = watch('mkt_party_price');

	const currentCompanyValue = watch('mkt_company_price');

	const hasChanges =
		currentPartyValue !== rowData.mkt_party_price ||
		currentCompanyValue !== rowData.mkt_company_price;

	const handleUndoButton = () => {
		setValue('mkt_party_price', rowData.mkt_party_price);
		setValue('mkt_company_price', rowData.mkt_company_price);
	};

	return (
		<div className='flex flex-col gap-1'>
			<JoinMultiInputButton
				names={['mkt_company_price', 'mkt_party_price']}
				register={register}
				getValues={getValues}
				control={control}
				type='number'
				disabled={disabled}
				numberOfInputFields={2}
				showSubmitButton={hasChanges}
				placeholder={`${rowData.mkt_party_price || 'Enter price'}`}
				showUndoButton={hasChanges}
				handleUndoButton={handleUndoButton}
				onSubmit={handleSubmit}
			/>
			{hasChanges && (
				<span className='pl-2 text-xs font-semibold text-gray-700'>
					{/* Modified (not saved){' '} */}
					<span
						className='text-gray underline'
						onClick={() => {
							setValue(
								'mkt_party_price',
								rowData.mkt_party_price
							);
							setValue(
								'mkt_company_price',
								rowData.mkt_company_price
							);
						}}
					></span>
				</span>
			)}
		</div>
	);
}
