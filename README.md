# Hacker Wars Log Monitor Userscript

## Overview
This userscript monitors the log page on Hacker Wars (https://hackerwars.io/log) for root login events and sends notifications to a specified Discord user via a webhook. It operates in the background without a modal UI, using a hardcoded Discord webhook URL and includes a single test function for decoding the webhook URL.

## Features
- **Background Monitoring**: Continuously checks the Hacker Wars log page every 3 seconds for new root login events.
- **Discord Notifications**: Sends alerts to a Discord user when a new root login is detected, including the IP address and timestamp.
- **Key-Based Authentication**: Generates a random 8-character access key, sends it to the user's Discord, and requires validation to run the script.

## Installation
1. Install a userscript manager like [Tampermonkey](https://www.tampermonkey.net/).
2. Create a new userscript in Tampermonkey.
3. Copy and paste the provided script code into the editor.
4. Save the script. It will automatically run on pages matching `https://hackerwars.io/*`.

## Setup
1. Upon first run, the script prompts for your Discord User ID.
2. A random 8-character access key is generated and sent to your Discord via a webhook.
3. Check your Discord for the key, then enter it when prompted to validate.
4. Upon successful validation, the script starts monitoring and sends a setup confirmation to Discord.

## Usage
- The script runs automatically on Hacker Wars pages if validated and enabled.
- It fetches the log page (`https://hackerwars.io/log`) every 3 seconds.
- When a new root login is detected (format: `YYYY-MM-DD HH:MM - [IP] logged in as root`), a Discord notification is sent with the IP and timestamp.
- Duplicate notifications for the same IP are suppressed for 3 minutes.

## Notes
- The script requires a valid Discord User ID and a working webhook URL.
- If the key validation fails or credentials are missing, the script halts and prompts for re-authentication.
- Errors during Discord webhook calls are logged to the console but do not stop the script.

## Limitations
- Only monitors root login events matching the specific log format.
- Requires cookies to fetch the log page (`credentials: 'include'`).

## Author
GingerDev

## Version
2.0
