import createGlobalState from '.';
import { deliveryQk } from './QueryKeys';

// * RM
export const useDeliveryRM = () =>
    createGlobalState({
        queryKey: deliveryQk.all(),
        url: '',
    });

export const useDeliveryRMByUUID = (uuid) =>
    createGlobalState({
        queryKey: deliveryQk.deliveryRMByUUID(uuid),
        url: '',
    });
// * RM Log
export const useDeliveryRMLog = () =>
    createGlobalState({
        queryKey: deliveryQk.all(),
        url: '',
    });
export const useDeliveryRMLogByUUID = (uuid) =>
    createGlobalState({
        queryKey: deliveryQk.deliveryRMLogByUUID(uuid),
        url: '',
    });

