import { pluginClientName } from '@kubb/plugin-client'
import { Client } from '@kubb/plugin-client/components'
import { createReactGenerator } from '@kubb/plugin-oas'
import { useOperationManager } from '@kubb/plugin-oas/hooks'
import { pluginTsName } from '@kubb/plugin-ts'
import { pluginZodName } from '@kubb/plugin-zod'
import { File, useApp } from '@kubb/react'
import { difference } from 'remeda'
import { QueryKey, QueryOptions, SuspenseQuery } from '../components'
import type { PluginReactQuery } from '../types'

export const suspenseQueryGenerator = createReactGenerator<PluginReactQuery>({
  name: 'react-suspense-query',
  Operation({ options, operation }) {
    const {
      plugin: {
        options: { output },
      },
    } = useApp<PluginReactQuery>()
    const { getSchemas, getName, getFile } = useOperationManager()

    const isQuery = typeof options.query === 'boolean' ? true : options.query?.methods.some((method) => operation.method === method)
    const isMutation = difference(options.mutation ? options.mutation.methods : [], options.query ? options.query.methods : []).some(
      (method) => operation.method === method,
    )

    const isSuspense = !!options.suspense

    const importPath = options.query ? options.query.importPath : '@tanstack/react-query'

    const query = {
      name: getName(operation, { type: 'function', prefix: 'use', suffix: 'suspense' }),
      typeName: getName(operation, { type: 'type' }),
      file: getFile(operation, { prefix: 'use', suffix: 'suspense' }),
    }

    const client = {
      name: getName(operation, { type: 'function', pluginKey: [pluginClientName] }),
    }

    const queryOptions = {
      name: getName(operation, { type: 'function', suffix: 'SuspenseQueryOptions' }),
    }

    const queryKey = {
      name: getName(operation, { type: 'const', suffix: 'SuspenseQueryKey' }),
      typeName: getName(operation, { type: 'type', suffix: 'SuspenseQueryKey' }),
    }

    const type = {
      file: getFile(operation, { pluginKey: [pluginTsName] }),
      //todo remove type?
      schemas: getSchemas(operation, { pluginKey: [pluginTsName], type: 'type' }),
    }

    const zod = {
      file: getFile(operation, { pluginKey: [pluginZodName] }),
      schemas: getSchemas(operation, { pluginKey: [pluginZodName], type: 'function' }),
    }

    if (!isQuery || isMutation || !isSuspense) {
      return null
    }

    return (
      <File baseName={query.file.baseName} path={query.file.path} meta={query.file.meta} banner={output?.banner} footer={output?.footer}>
        {options.parser === 'zod' && <File.Import name={[zod.schemas.response.name]} root={query.file.path} path={zod.file.path} />}
        <File.Import name={'client'} path={options.client.importPath} />
        <File.Import name={['RequestConfig']} path={options.client.importPath} isTypeOnly />
        {options.client.dataReturnType === 'full' && <File.Import name={['ResponseConfig']} path={options.client.importPath} isTypeOnly />}
        <File.Import
          name={[
            type.schemas.request?.name,
            type.schemas.response.name,
            type.schemas.pathParams?.name,
            type.schemas.queryParams?.name,
            type.schemas.headerParams?.name,
            ...(type.schemas.statusCodes?.map((item) => item.name) || []),
          ].filter(Boolean)}
          root={query.file.path}
          path={type.file.path}
          isTypeOnly
        />
        <QueryKey
          name={queryKey.name}
          typeName={queryKey.typeName}
          operation={operation}
          pathParamsType={options.pathParamsType}
          typeSchemas={type.schemas}
          transformer={options.queryKey}
        />

        <Client
          name={client.name}
          isExportable={false}
          isIndexable={false}
          baseURL={options.client.baseURL}
          operation={operation}
          typeSchemas={type.schemas}
          zodSchemas={zod.schemas}
          dataReturnType={options.client.dataReturnType}
          paramsType={options.paramsType}
          pathParamsType={options.pathParamsType}
          parser={options.parser}
        />
        <File.Import name={['queryOptions']} path={importPath} />
        <QueryOptions
          name={queryOptions.name}
          clientName={client.name}
          queryKeyName={queryKey.name}
          typeSchemas={type.schemas}
          paramsType={options.paramsType}
          pathParamsType={options.pathParamsType}
        />
        {options.suspense && (
          <>
            <File.Import name={['useSuspenseQuery']} path={importPath} />
            <File.Import name={['QueryKey', 'UseSuspenseQueryOptions', 'UseSuspenseQueryResult']} path={importPath} isTypeOnly />
            <SuspenseQuery
              name={query.name}
              queryOptionsName={queryOptions.name}
              typeSchemas={type.schemas}
              paramsType={options.paramsType}
              pathParamsType={options.pathParamsType}
              operation={operation}
              dataReturnType={options.client.dataReturnType}
              queryKeyName={queryKey.name}
              queryKeyTypeName={queryKey.typeName}
            />
          </>
        )}
      </File>
    )
  },
})
