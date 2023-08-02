# Live Preview in Valora

Hooks in development can be easily tested in Valora using the live preview feature.

<video controls muted playsInline width="100%">
  <source src="https://raw.githubusercontent.com/valora-inc/hooks/main/docs/assets/live-preview.mp4"/>
</video>

## Steps

1. Run `yarn start` to start the development server.
2. Open Valora on your phone and go to the QR scanner screen.
3. Scan the QR code displayed in the terminal.

## Additional Information

While in preview mode, changes to your hooks will reload the development server automatically.
You may need to pull down to refresh the screen in Valora to see the changes.

Valora shows a banner at the top of the screen when in preview mode. The color of the banner changes based on the fetch status for hooks.

- grey -> idle/loading
- green -> success
- red -> error

> [!IMPORTANT]
> Check the terminal for errors in the development server if you see a red banner, and make sure your phone and computer are on the same network.
