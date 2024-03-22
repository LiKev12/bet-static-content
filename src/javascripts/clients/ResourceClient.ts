import { PATH_BASE } from 'src/javascripts/clients/ResourceClientConfig';
import axios from 'axios';

// const MY_MOCK_JWT_TOKEN =
//     'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiOTg1YTkyYjMtYzBmMy00ODZhLThkOTUtMWMyYjAyMGNhODBkIiwiaWF0IjoxNzA4Mjk0NTc5LCJyb2xlcyI6IlVTRVIifQ.A8nFDA3Ju6v356gGrMFaqVA3ANLepPH61b4TWc9nqq8lRuQMUqBmJtHeSFBjp7Rk8aMuFYiPdmyXzmNhOvL5QmXZUVtSSX9oesTtQIbdopwmji4fNqvwvJjyTYWS4JG__UnP4L7vnuyFU5HoPqZihfN_KhDq9jrCIwHLWExeT--VGzzJMtA64_hen8DLiorOz_QAuyCTlgYM0iH8x7M-PTf9Ep1pF4iIaR25j3Mv-wYKO8hpjnv_kYrofEQSd3utg-XjR2MTjHmN3m1nEalRJe2uZUgblRloieYqou3bDH_gmH9ycD8ubDG6jj98phAw2kDsVEV0ml-zJIeo_RrXtw';

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
            data: requestBodyObject,
        };
        return await axios(options);
    }
}

export default ResourceClient;
