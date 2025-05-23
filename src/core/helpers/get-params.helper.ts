import { isString, isUndefined } from '@nestjs/common/utils/shared.utils';

export type ParamOptions = {
    key: string;
    nullable: boolean;
};

export function getParamOptions(options: ParamOptions | string, defaultKey = ''): ParamOptions {
    let newOptions: ParamOptions = {
        key: defaultKey,
        nullable: false
    };
    if (isUndefined(options)) {
        newOptions.key = defaultKey;
    } else if (isString(options)) {
        newOptions.key = options;
    } else {
        newOptions.nullable = options.nullable;
        newOptions.key = options.key ? options.key : defaultKey;
    }

    return newOptions;
}
