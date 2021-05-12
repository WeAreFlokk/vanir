// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using System;
using System.Reflection;

namespace Dolittle.Vanir.CLI.ProxyGenerator
{
    public class CommandDefinition : IProxyType
    {
        public string Name { get; init; }
        public string Namespace { get; init; }
        public string FilePathForImports { get; init; }
        public Type Type { get; init; }
        public string[] GraphPath { get; init; }
        public ParameterInfo Parameter { get; init; }
    }
}
