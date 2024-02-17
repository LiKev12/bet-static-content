import { PATH_BASE } from 'src/javascripts/clients/ResourceClientConfig';
import axios from 'axios';

const MY_MOCK_JWT_TOKEN =
    'Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoiOTg1YTkyYjMtYzBmMy00ODZhLThkOTUtMWMyYjAyMGNhODBkIiwiaWF0IjoxNzA4MDc5NTI1LCJyb2xlcyI6IlVTRVIifQ.skbhmhl2_4vBA6TUwHqluxLo75grrzERLnaW5y2EcpTJighN6eCXQLzeDIUSgpMVmi-2hgFoF3W0qTBmgvV8X8Rfo3aH5TQu5pPtTS03bLfLrc6q6iLEvlj03ygqzxuzl9uLziDrEFJv4jo7HsyVsJp7ESWBEOy9fy-dDY_n1MhoQr2mMa8qQJiIRuHLdXE2syWHsPQ194BXlhECWJo4bqmAhPSSv2zWK5_2EhAIC-rRfNlgxHd-PiR7Uiuu8yfwCRbePlCYn7YCx9OOJwWs6OWwFA_p7s3tiUfFeSzdwvHBzP77Zz4BndsM-neOE6mIyFG_y846875Smfs-6QfQvg';
class ResourceClient {
    extraVar: string = 'filler'; // to combat eslint "Unexpected class with only static properties"

    static _getPathBase(): string {
        return 'http://localhost:8080';
    }

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
                Authorization: MY_MOCK_JWT_TOKEN,
            },
        });
        if (response.status !== 200) {
            // TODO: handle error (log, surface, etc.)
            throw new Error('something went wrong');
        }
        const resource = await response.data;
        return resource;
    }

    static async postResource(pathApi: string, requestBodyObject: Record<string, unknown>): Promise<any> {
        const url: string = `${PATH_BASE}/${pathApi}`;
        const options = {
            method: 'POST',
            url,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': '*',
                Authorization: MY_MOCK_JWT_TOKEN,
            },
            data: requestBodyObject,
        };
        const response = await axios(options);
        if (response.status !== 200) {
            // TODO: handle error (log, surface, etc.)
            throw new Error('something went wrong');
        }
        const resource = await response.data;
        return resource;
    }
}

export default ResourceClient;
