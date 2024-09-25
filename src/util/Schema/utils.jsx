import * as yup from 'yup';

export const handelNumberDefaultValue = (value) =>
	value === null ? undefined : value;

// * STRING
export const STRING = yup.string().trim();
export const STRING_REQUIRED = STRING.required('Required');

export const UUID = STRING.length(
	15,
	'Invalid Primary Key UUID Length'
).nullable();
export const UUID_REQUIRED = UUID.required('Required');
export const UUID_FK = UUID.nullable();
export const UUID_PK = UUID_REQUIRED;

export const URL = STRING.url('Invalid URL');
export const URL_REQUIRED = URL.required('Required');

export const NAME = STRING.matches(/^[a-zA-Z0-9 ._#-/"'()]*$/, 'Invalid Name');
export const NAME_REQUIRED = NAME.required('Required');

export const EMAIL = yup.string().email('Invalid Email');
export const EMAIL_REQUIRED = EMAIL.required('Required');

// * Json String
export const JSON_STRING = yup.mixed();
export const JSON_STRING_REQUIRED = JSON_STRING.required('Required');

// * boolean
export const BOOLEAN = yup.boolean();
export const BOOLEAN_DEFAULT_VALUE = (value = false) =>
	BOOLEAN.transform(handelNumberDefaultValue).default(value);
export const BOOLEAN_REQUIRED = BOOLEAN.required('Required');

// ? email pattern will be after @ is fortunezip.com
// export const FORTUNE_ZIP_EMAIL_PATTERN = EMAIL_REQUIRED.matches(
// 	/^[a-zA-Z0-9._%+-]+@fortunezip.com$/,
// 	"Email: XXXXX@fortunezip.com"
// );
export const FORTUNE_ZIP_EMAIL_PATTERN = EMAIL_REQUIRED;

// * NUMBER
export const NUMBER = yup.number().integer().typeError('Invalid Number');
export const NUMBER_REQUIRED = NUMBER.required('Required');

export const NUMBER_DOUBLE = yup.number().typeError('Invalid Number');
export const NUMBER_DOUBLE_REQUIRED = NUMBER_DOUBLE.required('Required');

export const PHONE_NUMBER = yup
	.string()
	.matches(
		/^$|^\+?\d{4,15}$/,
		'Must be a valid phone number with optional "+" sign and up to 4-15 digits'
	)
	.typeError('Invalid Number')
	.nullable() // Allows null values
	.default(''); // Sets default to empty string if no value is provided

export const PHONE_NUMBER_REQUIRED = PHONE_NUMBER.required('Required');

export const PASSWORD = STRING_REQUIRED.min(
	4,
	'Password length should be at least 4 characters'
).max(50, 'Password cannot exceed more than 50 characters');

// * ORDER NUMBER
export const ORDER_NUMBER_NOT_REQUIRED = STRING.matches(
	/^(?:[0-9]{4}-[2]{1}[3-9]{1}|[C]{1}[S]{1}[0-9]{4}-[2]{1}[3-9]{1}|[S]{1}[0-9]{4}-[2]{1}[3-9]{1})$/, // 09877-24
	'O/N format: XXXX-23, CSXXXX-23, SXXXX-23'
);
export const ORDER_NUMBER = STRING_REQUIRED.matches(
	// 2021-23 or CS2021-23 or S2021-23
	/^(?:[0-9]{4}-[2]{1}[3-9]{1}|[C]{1}[S]{1}[0-9]{4}-[2]{1}[3-9]{1}|[S]{1}[0-9]{4}-[2]{1}[3-9]{1})$/,
	'O/N format: XXXX-23, CSXXXX-23, SXXXX-23'
);
