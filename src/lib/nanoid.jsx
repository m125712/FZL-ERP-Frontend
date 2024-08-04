import { customAlphabet } from "nanoid";
import { NANOID_CHARSET, NANOID_SIZE } from "./secret";

const nanoid = customAlphabet(NANOID_CHARSET, NANOID_SIZE);

export { nanoid };
