import { createHttpClient } from "~/infrastructure/http/clients";

export class BaseService {
    protected static get api() {
        return createHttpClient();
    }
}