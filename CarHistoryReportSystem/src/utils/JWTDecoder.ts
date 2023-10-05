import { Token } from '../utils/Interfaces';
import jwt_decode from 'jwt-decode'

export function JWTDecoder(token: string): Token {
    const decodedToken = jwt_decode(token) as { [key: string]: any }
    return {
        aud: decodedToken["aud"],
        exp: decodedToken["exp"],
        roles: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        name: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        nameidentifier: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
        email: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
        iss: decodedToken["iss"]
    }
}