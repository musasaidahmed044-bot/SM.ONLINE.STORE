# ONLINE SM STORE

A responsive black-and-white e-commerce storefront built with plain HTML, CSS and JavaScript.

## Included
- Sign-in demo using browser localStorage
- Shopping cart with quantity controls
- Checkout / place-order flow
- WhatsApp order and contact buttons
- Men / Women / Kids / Accessories sections
- Product prices in Kenyan Shillings
- Mobile responsive layout
- Your uploaded product photos already included

## IMPORTANT: Set the store WhatsApp number
Open `app.js` and change:

`const STORE_WHATSAPP = "254700000000";`

to the store's real WhatsApp number in international format without the `+`.

Example:
`const STORE_WHATSAPP = "254712345678";`

## Change product prices
The products are at the top of `app.js`. Each product has a `price` field, for example:

`price: 2500`

Change it to the real selling price.

## Run it
Open `index.html` in a browser.

For a real public online store, you will still need:
1. Web hosting/domain.
2. A real customer/account backend if you want secure accounts.
3. A real order database/backend.
4. Payment integration such as M-Pesa/card checkout.
5. Your real WhatsApp number and delivery/return policies.

The current version is a working front-end store and sends completed orders to WhatsApp.
