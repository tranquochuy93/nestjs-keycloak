import jwtDecode from "jwt-decode";
import { camelCase, chain, isObject, map } from "lodash";
import {
  CamelCaseUser,
  User,
} from "~keycloak-connect/types/authenticated-request.type";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
function toCamelCase(data: any, excludeKeys: string[] = []): any {
  if (Array.isArray(data)) {
    return map(data, toCamelCase);
  }

  if (isObject(data)) {
    const objCamelCase = chain(data)
      .mapKeys((_, key: string) => {
        return !excludeKeys.includes(key) ? camelCase(key) : key;
      })
      .mapValues((value: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return toCamelCase(value, excludeKeys);
      })
      .value();

    return Object.keys(objCamelCase).reduce(
      (acc, key: string) => {
        if (!excludeKeys.includes(key)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          acc[key] = objCamelCase[key];
        }
        return acc;
      },
      {} as Record<string, any>
    );
  }

  return data;
}

export const parseToken = (token: string): CamelCaseUser => {
  const user = jwtDecode<User>(token);
  const camelCaseUser = toCamelCase(user, ["resource_access"]) as CamelCaseUser;
  camelCaseUser.resourceAccess = user.resource_access;
  return camelCaseUser;
};
