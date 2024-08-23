import { http, HttpFunction } from '@google-cloud/functions-framework'
import {
  HttpError,
  asyncHandler as valoraAsyncHandler,
} from '@valora/http-handler'
import { createLoggingMiddleware } from '@valora/logging'
import express from 'express'
import i18next from 'i18next'
import Backend from 'i18next-fs-backend'
import i18nextMiddleware from 'i18next-http-middleware'
import path from 'path'
import { z } from 'zod'
import { getConfig } from '../config'
import { logger } from '../log'
import { getPositions } from '../runtime/getPositions'
import { getShortcuts } from '../runtime/getShortcuts'
import {
  LegacyNetwork,
  legacyNetworkToNetworkId,
  NetworkId,
} from '../types/networkId'
import { Transaction } from '../types/shortcuts'
import { parseRequest } from './parseRequest'

const EARN_SUPPORTED_APP_IDS = ['aave', 'allbridge']
const EARN_SUPPORTED_POSITION_IDS = new Set([
  // Aave USDC
  `${NetworkId['arbitrum-one']}:0x724dc807b04555b71ed48a6896b6f41593b8c637`,
  `${NetworkId['arbitrum-sepolia']}:0x460b97bd498e1157530aeb3086301d5225b91216`,
  // Allbridge USDT
  `${NetworkId['celo-mainnet']}:0xfb2c7c10e731ebe96dabdf4a96d656bfe8e2b5af`,
])

const DEFAULT_LANGUAGE = 'base'

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      // eslint-disable-next-line no-path-concat
      loadPath: path.join(__dirname, '../../locales/{{lng}}.json'),
    },
    fallbackLng: DEFAULT_LANGUAGE,
    preload: [DEFAULT_LANGUAGE],
  })
  .catch((error) => {
    throw new Error(`Failed to initialize i18next: ${error}`)
  })

// Copied over from https://github.com/valora-inc/valora-rest-api/blob/main/src/middleware/requestMetadata.ts#L65
function getValoraAppVersion(userAgent: string | undefined) {
  const appInfo = getAppInfoFromUserAgent(userAgent)
  return appInfo?.app?.toLowerCase() === 'valora' ? appInfo.version : undefined
}

// Copied over from https://github.com/valora-inc/valora-rest-api/blob/main/src/middleware/requestMetadata.ts#L76
function getAppInfoFromUserAgent(userAgent: string | undefined):
  | {
      app?: string
      version?: string
    }
  | undefined {
  const match = userAgent?.match(/^([^\s/]+)(?:\/(\S+))?/)
  return match ? { app: match[1], version: match[2] } : undefined
}

function asyncHandler(handler: HttpFunction) {
  return valoraAsyncHandler(handler, logger)
}

function getNetworkIds(
  args: { network: LegacyNetwork } | { networkIds: NetworkId | NetworkId[] },
): NetworkId[] {
  if ('network' in args) {
    return [legacyNetworkToNetworkId[args.network]]
  } else if (Array.isArray(args.networkIds)) {
    return args.networkIds
  } else {
    return [args.networkIds]
  }
}

function serializeShortcuts(
  shortcuts: Awaited<ReturnType<typeof getShortcuts>>,
) {
  // TODO: consider returning JSON schema for triggerInputShape
  return shortcuts.map(({ onTrigger, triggerInputShape, ...shortcut }) => ({
    ...shortcut,
  }))
}

function serializeTransactions(transactions: Transaction[]) {
  return transactions.map((tx) => ({
    ...tx,
    ...(tx.gas !== undefined ? { gas: tx.gas.toString() } : {}),
    ...(tx.estimatedGasUse !== undefined
      ? { estimatedGasUse: tx.estimatedGasUse.toString() }
      : {}),
  }))
}

function createApp() {
  const config = getConfig()

  const app = express()
  app.use(
    createLoggingMiddleware({
      logger,
      projectId: config.GOOGLE_CLOUD_PROJECT,
    }),
  )
  app.use(i18nextMiddleware.handle(i18next))

  const getHooksRequestSchema = z.object({
    query: z.intersection(
      z.object({
        address: z
          .string()
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .transform((val) => val.toLowerCase())
          .optional(),
      }),
      z.union([
        z.object({ network: z.nativeEnum(LegacyNetwork) }), // legacy schema: 'celo' or 'celoAlfajores' passed as 'network' field on the request
        z.object({
          networkIds: z
            .array(z.nativeEnum(NetworkId))
            .nonempty()
            .or(z.nativeEnum(NetworkId)), // singleton arrays sometimes serialize as single values
        }), // current schema: any members of NetworkId enum passed as 'networkIds' field on the request
      ]),
    ),
  })

  app.get(
    '/getPositions',
    asyncHandler(async (req, res) => {
      const parsedRequest = await parseRequest(req, getHooksRequestSchema)
      const userAgent = req.header('user-agent')
      const valoraAppVersion = getValoraAppVersion(userAgent)
      const returnAavePositions = valoraAppVersion
        ? valoraAppVersion >= '1.90.0'
        : false
      const { address } = parsedRequest.query
      const networkIds = getNetworkIds(parsedRequest.query)
      const appIds = config.POSITION_IDS.filter((appId) =>
        returnAavePositions ? true : appId !== 'aave',
      )
      const positions = (
        await Promise.all(
          networkIds.map((networkId) =>
            getPositions({ networkId, address, appIds, t: req.t }),
          ),
        )
      ).flat()
      res.send({ message: 'OK', data: positions })
    }),
  )

  const getEarnPositionsRequestSchema = z.object({
    query: z.object({
      networkIds: z
        .array(z.nativeEnum(NetworkId))
        .nonempty()
        .or(z.nativeEnum(NetworkId)), // singleton arrays sometimes serialize as single values
    }),
  })

  // Positions for the Earn feature
  app.get(
    '/getEarnPositions',
    asyncHandler(async (req, res) => {
      const parsedRequest = await parseRequest(
        req,
        getEarnPositionsRequestSchema,
      )
      const networkIds = getNetworkIds(parsedRequest.query).filter(
        (networkId) => config.EARN_SUPPORTED_NETWORK_IDS.includes(networkId),
      )

      const positions = (
        await Promise.all(
          networkIds.map((networkId) =>
            getPositions({
              networkId,
              // Earn positions are not user-specific
              address: undefined,
              appIds: EARN_SUPPORTED_APP_IDS,
              t: req.t,
            }),
          ),
        )
      )
        .flat()
        .filter(
          // For now limit to specific positions
          (position) => EARN_SUPPORTED_POSITION_IDS.has(position.positionId),
        )

      res.send({ message: 'OK', data: positions })
    }),
  )

  // Deprecated route, will be removed in the future
  app.get(
    '/getShortcuts',
    asyncHandler(async (_req, res) => {
      const shortcuts = await getShortcuts(
        NetworkId['celo-mainnet'],
        undefined,
        config.SHORTCUT_IDS,
      )
      res.send({ message: 'OK', data: serializeShortcuts(shortcuts) })
    }),
  )

  app.get(
    '/v2/getShortcuts',
    asyncHandler(async (req, res) => {
      const parsedRequest = await parseRequest(req, getHooksRequestSchema)
      const { address } = parsedRequest.query
      const networkIds = getNetworkIds(parsedRequest.query)
      const shortcuts = (
        await Promise.all(
          networkIds.map((networkId) =>
            getShortcuts(networkId, address, config.SHORTCUT_IDS),
          ),
        )
      ).flat()
      res.send({ message: 'OK', data: serializeShortcuts(shortcuts) })
    }),
  )

  const triggerShortcutRequestSchema = z.object({
    body: z.intersection(
      z.object({
        address: z
          .string({ required_error: 'address is required' })
          .regex(/^0x[a-fA-F0-9]{40}$/)
          .transform((val) => val.toLowerCase()),
        appId: z.string({ required_error: 'appId is required' }),
        shortcutId: z.string({ required_error: 'shortcutId is required' }),
      }),
      z.union([
        z.object({ network: z.nativeEnum(LegacyNetwork) }), // legacy schema: 'celo' or 'celoAlfajores' passed as 'network' field on the request
        z.object({ networkId: z.nativeEnum(NetworkId) }), // current schema: any member of NetworkId enum passed as 'networkId' field on the request
      ]),
    ),
  })

  app.post(
    '/triggerShortcut',
    asyncHandler(async (req, res) => {
      const parsedRequest = await parseRequest(
        req,
        triggerShortcutRequestSchema,
      )

      const { address, appId, shortcutId } = parsedRequest.body

      const networkId =
        'network' in parsedRequest.body
          ? legacyNetworkToNetworkId[parsedRequest.body.network]
          : parsedRequest.body.networkId

      const shortcuts = await getShortcuts(networkId, address, [appId])

      const shortcut = shortcuts.find((s) => s.id === shortcutId)
      if (!shortcut) {
        throw new HttpError(
          400,
          `No shortcut found with id '${shortcutId}' for app '${appId}', available shortcuts: ${shortcuts
            .map((s) => s.id)
            .join(', ')}`,
        )
      }

      // Now check the trigger input
      const parsedTriggerInput = await parseRequest(
        req,
        z.object({
          body: z.object(shortcut.triggerInputShape),
        }),
      )

      const transactions = await shortcut.onTrigger({
        networkId,
        address,
        ...parsedTriggerInput.body,
      })
      res.send({
        message: 'OK',
        data: { transactions: serializeTransactions(transactions) },
      })
    }),
  )

  // We'll add more routes here

  return app
}

// Register the main Cloud Function
http('hooks-api', createApp())
