// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import React from 'react';
import { withViewModel } from '@dolittle/vanir-react';
import { HomeViewModel } from './HomeViewModel';

import { default as styles } from './Home.module.scss';
import { HomeProps } from './HomeProps';
import { PrimaryButton } from '@fluentui/react';

export const Home = withViewModel<HomeViewModel, HomeProps>(HomeViewModel, ({viewModel, props}) => {
//export const Home = (props: HomeProps) => {

    return (
        <div className={styles.content}>
            Hello world : {viewModel.counter}

            <PrimaryButton onClick={viewModel.goAway}>Navigate somewhere</PrimaryButton>

        </div>
    )
});
