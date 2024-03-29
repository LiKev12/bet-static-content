import { PATH_BASE } from 'src/javascripts/clients/ResourceClientConfig';
import axios from 'axios';

class ResourceClient {
    extraVar: string = 'filler'; // to combat eslint "Unexpected class with only static properties"

    static _getRecordFromQueryParamsObject(queryParamsObject: any): Record<string, string> {
        Object.keys(queryParamsObject).forEach((k) => {
            if (typeof queryParamsObject[k] === 'object') {
                return ResourceClient._getRecordFromQueryParamsObject(queryParamsObject[k]);
            }
            queryParamsObject[k] = String(queryParamsObject[k]);
        });
        return queryParamsObject;
    }

    static _getPathQueryParams(queryParamsObject: Record<string, unknown>): string {
        const queryParamsRecord: Record<string, string> =
            ResourceClient._getRecordFromQueryParamsObject(queryParamsObject);
        return new URLSearchParams(queryParamsRecord).toString();
    }

    static async getResource(pathApi: string, queryParamsObject: Record<string, unknown>): Promise<any> {
        const pathQueryParams = ResourceClient._getPathQueryParams(queryParamsObject);
        const url: string = `${PATH_BASE}/${pathApi}?${pathQueryParams}`;
        const response = await axios({
            method: 'GET',
            url,
            headers: {
                // Authorization: MY_MOCK_JWT_TOKEN,
            },
            withCredentials: true,
        });
        if (response.status !== 200) {
            // TODO: handle error (log, surface, etc.)
            throw new Error('something went wrong');
        }
        const resource = await response.data;
        return resource;
    }

    static async postResourceUnauthenticated(
        pathApi: string,
        requestBodyObject: Record<string, unknown>,
    ): Promise<any> {
        const url: string = `${PATH_BASE}/${pathApi}`;
        const options = {
            method: 'POST',
            url,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
            },
            withCredentials: true,
            data: requestBodyObject,
        };
        return await axios(options);
    }

    static async postResource(
        pathApi: string,
        requestBodyObject: Record<string, unknown>,
        jwtToken: string,
    ): Promise<any> {
        const url: string = `${PATH_BASE}/${pathApi}`;
        const options = {
            method: 'POST',
            url,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${jwtToken}`,
            },
            withCredentials: true,
            data: requestBodyObject,
        };
        return await axios(options);
    }
}

export default ResourceClient;
