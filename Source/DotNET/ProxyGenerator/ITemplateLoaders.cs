// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

namespace Dolittle.Vanir.ProxyGenerator
{
    public interface ITemplateLoaders
    {
        string Load(string templateName);
    }
}