---
sidebar_position: 1
---

# Extend Divvi apps using Hooks

> If you want to start coding, check out the [Live
> Preview](live-preview) and the [example application](https://github.com/divvi-xyz/hooks/blob/master/src/apps/example)
> with hook implementations.

Divvi Hooks is a system that allows developers to extend apps (_e.g._, the Valora wallet and other Divvi apps) by
writing short programs called "hooks". Divvi apps will call hooks in
response to certain in-app or blockchain events and use the results
from hooks to extend the apps' functionality.

Divvi Hooks is currently an experimental feature. We are
developing the Divvi Hooks system incrementally based on feedback
from developers. Eventually we hope developers will be able to publish
hooks that users can enable or disable at will.

## Example: position pricing

Users often hold asset-like positions with dapps that are specific to
the dapp implementation. For example, DeFi dapps
implement yield farms with smart contracts specific to the dapp and
these contracts track each users' state in the yield farm, like
liquidity and unclaimed rewards. A developer can implement a Divvi
hook to detect these types of positions and price them. If a user is
yield farming they will see their yield farm positions directly in
the app.

## Developing a hook

A developer can write a short TypeScript program that handles a
specific hook type. A user's Divvi wallet passes information to the
hook, the hook executes in an isolated environment and returns a
result, and the app uses the results to extend its default behavior.

Currently all hooks need to be approved by a Valora engineer before
being available to users in the app. Please contact us if
you're interested in developing a hook and haven't chatted with us
yet.

## Hook types

Divvi supports or is working on support for the types of hooks we
list below:

- Position pricing: show a custom contract position in a Divvi app
- Name resolution: map an arbitrary identifier or name to a wallet address
- Shortcut (coming soon): complete simple dapp (or inter-dapp) actions
  within a Divvi app

We plan on adding support for more hook types. If you have a request
please reach out on Discord.

## Contact

`#hooks-dev` on Divvi's discord.

## Related work

- https://docs.metamask.io/snaps/
- https://zapper.xyz/
