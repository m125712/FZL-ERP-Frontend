import { useAuth } from '@/context/auth';
import { Circle, Undo, Undo2Icon } from 'lucide-react';
import { useRHF } from '@/hooks';

import JoinMultiInputButton from '@/components/ui/join-multi-input-buton';

import GetDateTime from '@/util/GetDateTime';
import { MD_PRICE_NULL, MD_PRICE_SCHEMA } from '@/util/Schema';

export function MDPriceForm({ rowData, updateData, invalidQuery }) {
	const { user } = useAuth();

	const { register, getValues, watch, control, setValue } = useRHF(
		MD_PRICE_SCHEMA,
		{
			md_price: rowData.md_price || 0,
		}
	);

	// Custom submit handler for the check button
	const handleSubmit = async (value) => {
		await updateData.mutateAsync({
			url: `/zipper/order/description/update-md-mkt-cmp-party-price-is-price-confirmed/by/${rowData?.order_description_uuid}`,
			updatedData: {
				md_price: Number(value),
				updated_at: GetDateTime(),
				updated_by: user.uuid,
			},
			isOnCloseNeeded: false,
		});
	};

	const currentValue =
		watch('md_price') > 0 ? watch('md_price') : rowData.md_price;
	const hasChanges = currentValue !== rowData.md_price;

	return (
		<div className='flex flex-col gap-1'>
			<JoinMultiInputButton
				names={['md_price']}
				register={register}
				getValues={getValues}
				control={control}
				type='number'
				numberOfInputFields={1}
				showSubmitButton={hasChanges}
				placeholder={`${rowData.md_price || 'Enter price'}`}
				onSubmit={handleSubmit}
			/>
			{hasChanges && (
				<span className='pl-2 text-xs font-semibold text-gray-700'>
					{/* Modified (not saved){' '} */}
					<span
						className='text-gray underline'
						onClick={() => setValue('md_price', rowData.md_price)}
					>
						undo
					</span>
				</span>
			)}
		</div>
	);
}
