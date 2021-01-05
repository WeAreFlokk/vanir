// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Constructor } from '@dolittle/types';

import { container } from 'tsyringe';
import { PropertySubscriptions } from './PropertySubscriptions';

const privatePrefix = '_';
const internalPrefix = '__';
const subscriptionsPropertyName = `${internalPrefix}subscriptions`;

export class ViewModelHelpers {

    static isInternal(item: string): boolean {
        return item.indexOf(internalPrefix) === 0;
    }

    static isPrivate(item: string): boolean {
        return item.indexOf(privatePrefix) === 0;
    }

    static getNonInternalPropertiesFrom(object: any): string[] {
        let properties = Reflect.ownKeys(object) as string[];
        properties = properties.filter(_ => !ViewModelHelpers.isInternal(_) && !ViewModelHelpers.isPrivate(_) && typeof object[_] !== 'function');
        return properties;
    }

    static bindViewModelFunctions(vm: any): void {
        const proto = Reflect.getPrototypeOf(vm) as any;
        let functions = Reflect.ownKeys(proto) as string[];
        functions = functions.filter(_ => _.indexOf('constructor') < 0 && typeof proto[_] === 'function');
        for (const _function of functions) {
            vm[_function] = vm[_function].bind(vm);
        }
    }

    static getObservablePropertyNameFor(property: string): string {
        return `${internalPrefix}${property}`;
    }

    static clearSubscriptionsOn(viewModel: any) {
        if (viewModel[subscriptionsPropertyName]) {
            viewModel[subscriptionsPropertyName].unsubscribe();
            delete viewModel[subscriptionsPropertyName];
        }
    }

    static setSubscriptionsOn(viewModel: any, callback: () => void) {
        ViewModelHelpers.clearSubscriptionsOn(viewModel);
        viewModel[subscriptionsPropertyName] = new PropertySubscriptions(viewModel, callback);
    }
}
