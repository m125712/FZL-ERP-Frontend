export const accQK = {
	all: () => ['accQK'],
	//Count-length
	voucher: () => [...accQK.all(), 'voucher'],
	voucherByUUID: (uuid) => [...accQK.voucher(), uuid],
	otherCostCenter: () => [...accQK.all(), 'otherCostCenter'],
};
