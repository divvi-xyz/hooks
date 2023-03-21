// Helper script to call the plugins and get the positions
/* eslint-disable no-console */
import { ubeswapPlugin } from '../src/ubeswap/plugin'
import yargs from 'yargs'

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 --address <address>')
  .options({
    network: {
      alias: 'n',
      describe: 'Network to get positions for',
      choices: ['celo', 'celoAlfajores'],
      default: 'celo',
    },
    address: {
      alias: 'a',
      describe: 'Address to get positions for',
      type: 'string',
      demandOption: true,
    },
  })
  .parseSync()

void (async () => {
  const positions = await ubeswapPlugin.getPositions(argv.network, argv.address)
  console.log('positions', JSON.stringify(positions, null, ' '))

  console.table(
    positions.map((position) => {
      if (position.type === 'app-token') {
        const balanceDecimal =
          Number(position.balance) / 10 ** position.decimals
        return {
          address: position.address,
          label: position.label,
          priceUsd: Number(position.priceUsd).toFixed(2),
          balance: balanceDecimal.toFixed(2),
          balanceUsd: (balanceDecimal * position.priceUsd).toFixed(2),
          breakdown: position.tokens
            .map((token) => {
              const priceUsd = Number(token.priceUsd)
              const balance = Number(token.balance) / 10 ** token.decimals
              const balanceUsd = Number(balance) * priceUsd
              return `${balance.toFixed(2)} ${
                token.symbol
              } ($${balanceUsd.toFixed(2)}) @ $${priceUsd?.toFixed(2)}`
            })
            .join(', '),
        }
      } else {
        // TODO
        return position
      }
    }),
  )
})()
