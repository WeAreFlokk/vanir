// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { IFeatureToggles } from './IFeatureToggles';
import { IFeaturesProvider } from './IFeaturesProvider';
import { Features } from './Features';
import { injectable } from 'tsyringe';

/**
 * Represents an implementation of {@link IFeatureToggles}
 */
@injectable()
export class FeatureToggles implements IFeatureToggles {
    private _features: Features = new Features();

    /**
     * Initializes a new instance of {@link FeatureToggles}.
     * @param {IFeaturesProvider}┬áprovider Provider of features.
     */
    constructor(private readonly provider: IFeaturesProvider) {
        provider.features.subscribe(_ => this._features = _);
    }

    /** @inheritdoc */
    isOn(feature: string): boolean {
        return this._features.get(feature)?.isOn || false;
    }
}
