import { useCallback, useEffect, useState } from 'react';

function useStorage(key, defaultValue, storageObject) {
	const [value, setValue] = useState(() => {
		const jsonValue = storageObject.getItem(key);
		if (jsonValue != null) return JSON.parse(jsonValue);

		if (typeof defaultValue === 'function') return defaultValue();
		else return defaultValue;
	});

	useEffect(() => {
		if (value === '') {
			return storageObject.setItem(key, JSON.stringify(''));
		}
		storageObject.setItem(key, JSON.stringify(value));
	}, [key, value, storageObject]);

	const remove = useCallback(() => setValue(''), []);

	return [value, setValue, remove];
}

function useLocalStorage(key, defaultValue) {
	return useStorage(key, defaultValue, window.localStorage);
}

function useSessionStorage(key, defaultValue) {
	return useStorage(key, defaultValue, window.sessionStorage);
}

export { useLocalStorage, useSessionStorage };
