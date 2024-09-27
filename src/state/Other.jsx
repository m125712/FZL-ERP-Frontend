import createGlobalState from '.';
import { otherQK } from './QueryKeys';

// GET OTHER HR USERS
export const useOtherHRUser = () =>
	createGlobalState({
		queryKey: otherQK.hrUser(),
		url: `/other/hr/user/value/label?designation=driver`,
	});

export const useOtherHRUserByDesignation = (designation) =>
	createGlobalState({
		queryKey: otherQK.hrUserByDesignation(designation),
		url: `/other/hr/user/value/label?designation=${designation}`,
		enabled: !!designation,
	});

// GET OTHER PARTY
export const useOtherParty = () =>
	createGlobalState({
		queryKey: otherQK.party(),
		url: '/other/party/value/label',
	});

// GET OTHER MARKETING USER
export const useOtherMarketingUser = () =>
	createGlobalState({
		queryKey: otherQK.marketingUser(),
		url: '/other/marketing-user/value/label',
	});

// GET OTHER BUYER
export const useOtherBuyer = () =>
	createGlobalState({
		queryKey: otherQK.buyer(),
		url: '/other/buyer/value/label',
	});

// GET OTHER MERCHANDISER BY PARTY UUID
export const useOtherMerchandiserByPartyUUID = (uuid) =>
	createGlobalState({
		queryKey: otherQK.merchandiserByPartyUUID(uuid),
		url: `/other/merchandiser/value/label/${uuid}`,
		enabled: !!uuid,
	});

// GET OTHER FACTORY BY PARTY UUID
export const useOtherFactoryByPartyUUID = (uuid) =>
	createGlobalState({
		queryKey: otherQK.factoryByPartyUUID(uuid),
		url: `/other/factory/value/label/${uuid}`,
		enabled: !!uuid,
	});

// GET OTHER MARKETING
export const useOtherMarketing = () =>
	createGlobalState({
		queryKey: otherQK.marketing(),
		url: '/other/marketing/value/label',
	});

// GET OTHER ORDER
export const useOtherOrder = () =>
	createGlobalState({
		queryKey: otherQK.order(),
		url: '/other/order/info/value/label',
	});

export const useOtherOrderDescription = () =>
	createGlobalState({
		queryKey: otherQK.orderDescription(),
		url: '/other/order/description/value/label',
	});

// GET OTHER ORDER PROPERTIES BY TYPE NAME
export const useOtherOrderPropertiesByTypeName = (name) =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByTypeName(name),
		url: `/other/order-properties/by/${name}`,
		enabled: !!name,
	});

// GET OTHER ORDER ENTRY
export const useOtherOrderEntry = () =>
	createGlobalState({
		queryKey: otherQK.orderEntry(),
		url: `/other/order/entry/value/label`,
	});

// GET OTHER VENDOR
export const useOtherVendor = () =>
	createGlobalState({
		queryKey: otherQK.vendor(),
		url: `/other/vendor/value/label`,
	});

// GET OTHER MATERIAL SECTION
export const useOtherMaterialSection = () =>
	createGlobalState({
		queryKey: otherQK.materialSection(),
		url: `/other/material-section/value/label`,
	});

// GET OTHER MATERIAL TYPE
export const useOtherMaterialType = () =>
	createGlobalState({
		queryKey: otherQK.materialType(),
		url: `/other/material-type/value/label`,
	});

// GET OTHER MATERIAL
export const useOtherMaterial = () =>
	createGlobalState({
		queryKey: otherQK.material(),
		url: `/other/material/value/label/unit/quantity`,
	});

// GET OTHER BANK
export const useOtherBank = () =>
	createGlobalState({
		queryKey: otherQK.bank(),
		url: `/other/bank/value/label`,
	});

// GET OTHER LC BY PARTY UUID
export const useOtherLcByPartyUUID = (uuid) =>
	createGlobalState({
		queryKey: otherQK.lcByPartyUUID(uuid),
		url: `/other/lc/value/label/${uuid}`,
		enabled: !!uuid,
	});

// GET OTHER PI
export const useOtherUpdatePI = () =>
	createGlobalState({
		queryKey: otherQK.pi(),
		url: `/other/pi/value/label?is_update=true`,
	});
export const useOtherPI = () =>
	createGlobalState({
		queryKey: otherQK.pi(),
		url: `/other/pi/value/label?is_update=false`,
	});

// GET OTHER ORDER DESCRIPTION BY ORDER NUMBER
export const useOtherOrderDescriptionByOrderNumber = (orderNumber) =>
	createGlobalState({
		queryKey: otherQK.orderDescriptionByOrderNumber(orderNumber),
		url: `/other/order/order_description_uuid/by/${orderNumber}`,
		enabled: !!orderNumber,
	});

// GET OTHER ORDER NUMBER FOR ZIPPER BY MARKETING AND PARTY UUID
export const useOtherOrderNumberForZipperByMarketingAndPartyUUID = (
	marketingUUID,
	partyUUID,
	params
) =>
	createGlobalState({
		queryKey: otherQK.orderNumberForZipperByMarketingAndPartyUUID(
			marketingUUID,
			partyUUID,
			params
		),

		url: `/other/order-number-for-pi-zipper/value/label/${marketingUUID}/${partyUUID}?${params}`,
		enabled: !!marketingUUID && !!partyUUID,
	});

// GET OTHER ORDER NUMBER FOR THREAD BY MARKETING AND PARTY UUID
export const useOtherOrderNumberForThreadByMarketingAndPartyUUID = (
	partyUUID,
	marketingUUID,
	params
) =>
	createGlobalState({
		queryKey: otherQK.orderNumberForThreadByMarketingAndPartyUUID(
			partyUUID,
			marketingUUID,
			params
		),

		url: `/other/order-number-for-pi-thread/value/label/${partyUUID}/${marketingUUID}?${params}`,
		enabled: !!marketingUUID && !!partyUUID,
	});

// GET OTHER DEPARTMENT
export const useOtherDepartment = () =>
	createGlobalState({
		queryKey: otherQK.department(),
		url: `/other/department/value/label`,
	});

// GET OTHER LAB DIP
export const useOtherLabDip = () =>
	createGlobalState({
		queryKey: otherQK.labDip(),
		url: `/other/lab-dip/recipe/value/label`,
	});

// GET OTHER SLIDER ITEM
export const useOtherSliderItem = () =>
	createGlobalState({
		queryKey: otherQK.sliderItem(),
		url: `/other/slider-item-name/value/label`,
	});

// GET OTHER Packing List
export const useOtherPackingListByOrderInfoUUID = (uuid) =>
	createGlobalState({
		queryKey: otherQK.deliveryPackingListByOrderInfoUUID(uuid),
		url: `/other/delivery/packing-list-by-order-info/value/label/${uuid}`,
		enabled: !!uuid,
	});

export const useOtherPackingListByOrderInfoUUIDAndChallanUUID = (
	uuid,
	challan_uuid
) =>
	createGlobalState({
		queryKey: otherQK.deliveryPackingListByOrderInfoUUIDAndChallanUUID(
			uuid,
			challan_uuid
		),
		url: `/other/delivery/packing-list-by-order-info/value/label/${uuid}?challan_uuid=${challan_uuid}`,
		enabled: !!uuid,
	});
