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
export const useOtherParty = (params) =>
	createGlobalState({
		queryKey: otherQK.party(params),
		url: params
			? `/other/party/value/label?marketing=${params}`
			: '/other/party/value/label',
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
export const useOtherOrder = (query) =>
	createGlobalState({
		queryKey: otherQK.order(query),
		url: query
			? `/other/order/info/value/label?${query}`
			: '/other/order/info/value/label',
	});

// GET OTHER ORDER FOR PACKING LIST
export const useOtherOrderPackingList = (param) =>
	createGlobalState({
		queryKey: otherQK.orderPackingList(),
		url: `/other/order/info/value/label?page=challan${param}`,
	});

// GET THREAD ORDER
export const useThreadOrder = (query) => 
createGlobalState({
	queryKey: otherQK.threadOrders(query),
	url: query
		? `/other/thread/value/label?${query}`
		: '/other/thread/value/label',
});
export const useOtherThreadOrderPackingList = (param) =>
	createGlobalState({
		queryKey: otherQK.threadOrderPackingList(),
		url: `/other/thread/value/label?page=challan${param}`,
	});
// GET THREAD ORDER For Challan
export const useThreadOrderForChallan = () =>
	createGlobalState({
		queryKey: otherQK.threadOrdersForChallan(),
		url: '/other/thread/value/label?page=challan',
	});

export const useOtherOrderDescription = (params) =>
	createGlobalState({
		queryKey: otherQK.orderDescription(params),
		url: params
			? `/other/order/description/value/label?${params}`
			: '/other/order/description/value/label',
	});

export const useOtherOrderBatchDescription = (params) =>
	createGlobalState({
		queryKey: otherQK.orderBatchDescription(),
		url: params
			? `/other/zipper/finishing-batch/value/label?${params}`
			: '/other/zipper/finishing-batch/value/label',
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
// GET OTHER MATERIAL
export const useOtherMaterialByParams = (params) =>
	createGlobalState({
		queryKey: otherQK.materialByParams(params),
		url: `/other/material/value/label/unit/quantity?${params}`,
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
export const useOtherPiValues = (query) =>
	createGlobalState({
		queryKey: otherQK.pi(query),
		url: query ? `/other/pi/value/label?${query}` : `/other/pi/value/label`,
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
		url: `/other/delivery/packing-list-by-order-info/value/label/${uuid}?received=true`,
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

//* GET ORDER INFO VALUE LABEL
export const useOtherOrderInfoValueLabel = () =>
	createGlobalState({
		queryKey: otherQK.orderInfoValueLabel(),
		url: '/other/order/info/value/label',
	});

//* GET ORDER PROPERTIES BY ITEM
export const useOtherOrderPropertiesByItem = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByItem(),
		url: '/other/order-properties/by/item',
	});

//* GET ORDER PROPERTIES BY ZIPPER NUMBER
export const useOtherOrderPropertiesByZipperNumber = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByZipperNumber(),
		url: '/other/order-properties/by/zipper_number',
	});

//* GET ORDER PROPERTIES BY END TYPE
export const useOtherOrderPropertiesByEndType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByEndType(),
		url: '/other/order-properties/by/end_type',
	});

//* GET ORDER PROPERTIES BY GARMENTS WASH
export const useOtherOrderPropertiesByGarmentsWash = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByGarmentsWash(),
		url: '/other/order-properties/by/garments_wash',
	});

//* GET ORDER PROPERTIES BY LIGHT PREFERENCE
export const useOtherOrderPropertiesByLightPreference = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByLightPreference(),
		url: '/other/order-properties/by/light_preference',
	});

//* GET ORDER PROPERTIES BY END USER
export const useOtherOrderPropertiesByEndUser = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByEndUser(),
		url: '/other/order-properties/by/end_user',
	});

//* GET ORDER PROPERTIES BY SLIDER BODY SHAPE
export const useOtherOrderPropertiesBySliderBodyShape = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesBySliderBodyShape(),
		url: '/other/order-properties/by/slider_body_shape',
	});

//* GET ORDER PROPERTIES BY SLIDER LINK
export const useOtherOrderPropertiesBySliderLink = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesBySliderLink(),
		url: '/other/order-properties/by/slider_link',
	});

//* GET ORDER PROPERTIES BY LOCK TYPE
export const useOtherOrderPropertiesByLockType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByLockType(),
		url: '/other/order-properties/by/lock_type',
	});

//* GET ORDER PROPERTIES BY PULLER TYPE
export const useOtherOrderPropertiesByPullerType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByPullerType(),
		url: '/other/order-properties/by/puller_type',
	});

//* GET ORDER PROPERTIES BY PULLER LINK
export const useOtherOrderPropertiesByPullerLink = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByPullerLink(),
		url: '/other/order-properties/by/puller_link',
	});

//* GET ORDER PROPERTIES BY COLOR
export const useOtherOrderPropertiesByColor = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByColor(),
		url: '/other/order-properties/by/color',
	});

//* GET ORDER PROPERTIES BY HAND
export const useOtherOrderPropertiesByHand = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByHand(),
		url: '/other/order-properties/by/hand',
	});

//* GET ORDER PROPERTIES BY NYLON STOPPER
export const useOtherOrderPropertiesByNylonStopper = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByNylonStopper(),
		url: '/other/order-properties/by/nylon_stopper',
	});

//* GET ORDER PROPERTIES BY SPECIAL REQUIREMENT
export const useOtherOrderPropertiesBySpecialRequirement = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesBySpecialRequirement(),
		url: '/other/order-properties/by/special_requirement',
	});

//* GET ORDER PROPERTIES BY COLORING TYPE
export const useOtherOrderPropertiesByColoringType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByColoringType(),
		url: '/other/order-properties/by/coloring_type',
	});

//* GET ORDER PROPERTIES BY SLIDER
export const useOtherOrderPropertiesBySlider = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesBySlider(),
		url: '/other/order-properties/by/slider',
	});

//* GET ORDER PROPERTIES BY TOP STOPPER
export const useOtherOrderPropertiesByTopStopper = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByTopStopper(),
		url: '/other/order-properties/by/top_stopper',
	});

//* GET ORDER PROPERTIES BY BOTTOM STOPPER
export const useOtherOrderPropertiesByBottomStopper = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByBottomStopper(),
		url: '/other/order-properties/by/bottom_stopper',
	});

//* GET ORDER PROPERTIES BY LOGO TYPE
export const useOtherOrderPropertiesByLogoType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByLogoType(),
		url: '/other/order-properties/by/logo_type',
	});

//* GET ORDER PROPERTIES BY TEETH TYPE
export const useOtherOrderPropertiesByTeethType = () =>
	createGlobalState({
		queryKey: otherQK.orderPropertiesByTeethType(),
		url: '/other/order-properties/by/teeth_type',
	});

//*GET Vehicle Values
export const useOtherVehicle = () =>
	createGlobalState({
		queryKey: otherQK.vehicle(),
		url: '/other/delivery/vehicle/value/label',
	});

//*GET Carton Values
export const useOtherCarton = () =>
	createGlobalState({
		queryKey: otherQK.carton(),
		url: '/other/delivery/carton/value/label',
	});

export const useOtherCountLength = () =>
	createGlobalState({
		queryKey: otherQK.countLength(),
		url: `/other/thread/count-length/value/label`,
	});

//*GET ALl Zipper-Thread Order List
export const useAllZipperThreadOrderList = () =>
	createGlobalState({
		queryKey: otherQK.allZipperThreadOrderList(),
		url: `/other/order/zipper-thread/value/label`,
	});
//* GET SHADE RECIPE
export const useOtherShadeRecipe = () =>
	createGlobalState({
		queryKey: otherQK.shadeRecipe(),
		url: `/other/lab-dip/shade-recipe/value/label`,
	});

//* GET RECIPE
export const useOtherRecipe = () =>
	createGlobalState({
		queryKey: otherQK.recipe(),
		url: `/other/lab-dip/recipe/value/label`,
	});
//* GET CHALLAN
export const useOtherChallan = (query) =>
	createGlobalState({
		queryKey: otherQK.challan(),
		url: `/other/delivery/challan/value/label?${query}`,
	});

// TAPE-COIL
export const useOtherTapeCoil = () =>
	createGlobalState({
		queryKey: otherQK.tapeCoil(),
		url: `/other/tape-coil/value/label`,
	});

// * GET GIVEN URL DATA
export const useGetURLData = (url) =>
	createGlobalState({ queryKey: otherQK.getURLData(url), url: url });
