// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

/* eslint-disable react/display-name */
import React, { FunctionComponent, useState, useEffect } from 'react';
import { Constructor } from '@dolittle/types';
import { IViewContext } from './IViewContext';
import { ViewModelObserver } from './ViewModelObserver';

import { useParams, useRouteMatch, useHistory, useLocation } from 'react-router-dom';


function getSearchStringParams(searchString: string): any {
    if (searchString === '') {
        return {};
    }
    const params = {};

    if (searchString.startsWith('/')) {
        searchString = searchString.substr(1);
    }
    if (searchString.startsWith('?')) {
        searchString = searchString.substr(1);
    }
    const keyValues = searchString.split('&');

    for (const keyValue of keyValues) {
        const keyAndValue = keyValue.split('=', 2);
        if (keyAndValue.length !== 2) {
            continue;
        }

        let value: any = decodeURIComponent(keyAndValue[1].replace(/\+/g, ' '));
        if (value !== '' && !isNaN(value as any)) {
            value = parseFloat(value);
        }

        params[keyAndValue[0]] = value;
    }
    return params;
}

export function withViewModel<TViewModel extends {}, TProps = {}>(viewModelType: Constructor<TViewModel>, view: FunctionComponent<IViewContext<TViewModel, TProps>>) {
    return (props: TProps) => {
        let params = useParams();
        const history = useHistory();
        const location = useLocation();
        const { path, url, isExact } = useRouteMatch();
        const [actualUrl, setActualUrl] = useState(history.location.pathname);

        params = { ...params, ...getSearchStringParams(location.search) };

        useEffect(() => {
            const listenerUnregisterCallback = history.listen((location?: any) => setActualUrl(location?.pathname));
            return () => listenerUnregisterCallback();
        });

        return (
            <>
                <ViewModelObserver
                    viewModelType={viewModelType}
                    props={props}
                    view={view}
                    params={params}
                    path={path}
                    matchedUrl={url}
                    isExactMatch={isExact}
                    url={actualUrl} />
            </>
        );
    };
}
