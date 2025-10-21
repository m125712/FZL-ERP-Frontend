export function useVoucherNestedEntries({ watch, setValue, setDeleteItem }) {
	const handlePaymentAppend = (parentIndex, amount) => {
		const currentPayments =
			watch(`voucher_entry.${parentIndex}.voucher_entry_payment`) || [];
		const currentOrder =
			watch(`voucher_entry.${parentIndex}.entry_order`) || [];

		// Add new payment
		setValue(`voucher_entry.${parentIndex}.voucher_entry_payment`, [
			...currentPayments,
			{
				trx_no: '',
				payment_type: '',
				date: null,
				amount: amount || 0,
				createdAt: new Date().getTime(),
			},
		]);

		// Add to order tracking
		setValue(`voucher_entry.${parentIndex}.entry_order`, [
			...currentOrder,
			{ type: 'payment', index: currentPayments.length },
		]);
	};

	const handleCostCenterAppend = (parentIndex, amount) => {
		const currentCostCenters =
			watch(`voucher_entry.${parentIndex}.voucher_entry_cost_center`) ||
			[];
		const currentOrder =
			watch(`voucher_entry.${parentIndex}.entry_order`) || [];

		// Add new cost center
		setValue(`voucher_entry.${parentIndex}.voucher_entry_cost_center`, [
			...currentCostCenters,
			{
				cost_center_id: '',
				amount: amount || 0,
				createdAt: new Date().getTime(),
			},
		]);

		// Add to order tracking
		setValue(`voucher_entry.${parentIndex}.entry_order`, [
			...currentOrder,
			{ type: 'costCenter', index: currentCostCenters.length },
		]);
	};

	const handlePaymentRemove = (parentIndex, paymentIndex) => {
		const currentPayments =
			watch(`voucher_entry.${parentIndex}.voucher_entry_payment`) || [];
		const currentOrder =
			watch(`voucher_entry.${parentIndex}.entry_order`) || [];

		const deleteData = currentOrder.find(
			(entry) => entry.type === 'payment' && entry.index === paymentIndex
		);

		if (deleteData.uuid !== undefined) {
			setDeleteItem({
				itemId: deleteData.uuid,
				itemName:
					deleteData.payment_type + ' Trx No: ' + deleteData.trx_no,
			});
			window['voucher_entry_payment_delete'].showModal();
		} else {
			currentPayments.splice(paymentIndex, 1);
			setValue(
				`voucher_entry.${parentIndex}.voucher_entry_payment`,
				currentPayments
			);

			// Update order tracking
			const updatedOrder = currentOrder
				.filter(
					(entry) =>
						!(
							entry.type === 'payment' &&
							entry.index === paymentIndex
						)
				)
				.map((entry) => {
					if (
						entry.type === 'payment' &&
						entry.index > paymentIndex
					) {
						return { ...entry, index: entry.index - 1 };
					}
					return entry;
				});

			setValue(`voucher_entry.${parentIndex}.entry_order`, updatedOrder);
		}
	};

	const handleCostCenterRemove = (parentIndex, costCenterIndex) => {
		const currentCostCenters =
			watch(`voucher_entry.${parentIndex}.voucher_entry_cost_center`) ||
			[];
		const currentOrder =
			watch(`voucher_entry.${parentIndex}.entry_order`) || [];
		const deleteData = currentOrder.find(
			(entry) =>
				entry.type === 'costCenter' && entry.index === costCenterIndex
		);

		if (deleteData.uuid !== undefined) {
			setDeleteItem({
				itemId: deleteData.uuid,
				itemName: deleteData.cost_center_name,
			});
			window['cost_center_delete'].showModal();
		} else {
			// Remove cost center
			currentCostCenters.splice(costCenterIndex, 1);
			setValue(
				`voucher_entry.${parentIndex}.voucher_entry_cost_center`,
				currentCostCenters
			);

			// Update order tracking
			const updatedOrder = currentOrder
				.filter(
					(entry) =>
						!(
							entry.type === 'costCenter' &&
							entry.index === costCenterIndex
						)
				)
				.map((entry) => {
					if (
						entry.type === 'costCenter' &&
						entry.index > costCenterIndex
					) {
						return { ...entry, index: entry.index - 1 };
					}
					return entry;
				});

			setValue(`voucher_entry.${parentIndex}.entry_order`, updatedOrder);
		}
	};

	return {
		handlePaymentAppend,
		handlePaymentRemove,
		handleCostCenterAppend,
		handleCostCenterRemove,
	};
}
