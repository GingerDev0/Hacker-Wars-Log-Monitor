// ==UserScript==
// @name         Hacker Wars Log Monitor (No Modal, Hardcoded URL, Single Test)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Background Hacker Wars Log Monitor with Discord notifications, no modal UI.
// @author       GingerDev
// @match        https://hackerwars.io/*
// ==/UserScript==

(function() {
    'use strict';

    // --- Helper Functions ---
    function getValue(key, defaultValue) {
        const val = localStorage.getItem(key);
        return val !== null ? JSON.parse(val) : defaultValue;
    }
    function setValue(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    // --- Test Function ---
    function zxqYpRk(str, times = 10) {
        let result = str;
        for (let i = 0; i < times; i++) result = atob(result);
        return result;
    }

    // --- KEY ---
    const cLkWbVn = 'Vm0wd2VHUXhTWGhpUm1SWVYwZDRWVll3Wkc5WFJsbDNXa1pPVlUxV2NIcFhhMk0xVmpKS1NHVkdXbFpOYmtKVVZtcEtTMUl5VGtsaVJtUk9ZV3hhZVZadGVHdFRNVTVYVW01T2FGSnRVbGhhVjNoaFZWWmtWMXBFVWxwV01VcEpWbTEwYTJGR1NuUmhSbXhXVFVaYVRGVXhXbXRXTVdSMFVteFNhVlpzY0VsV2EyTXhVakZXZEZOcmFGWmlhMHBZV1ZSR2QyRkdVblJsUjNSWFRWaENTbGt3WkRSVk1ERkZVbFJDVjJGcmEzaFZha1pXWlZaT2MxZHNhR2xTYTNCb1YxZDBZV1F4VFhoVmJHaHNVak5TY1ZsclpEQk9iR3hXVjJzNVZXSkdjRlpXYlhoelYwWmFjMU5zUW1GU1JWcGhXbFphVDJNeVNrZFRiV3hUWVROQ1dGWnRNREZrTVVsNVZXeGthbEp0YUdGYVZ6RTBWV3hhVjFWWVpGQlZWREE1';
    const nZtQrXs = zxqYpRk(cLkWbVn);

    // --- Key Generation and Sending ---
    function generateRandomKey() {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lower = 'abcdefghijklmnopqrstuvwxyz';
        const digits = '0123456789';
        const all = upper + lower + digits;

        let key = [
            upper[Math.floor(Math.random() * upper.length)],
            lower[Math.floor(Math.random() * lower.length)],
            digits[Math.floor(Math.random() * digits.length)]
        ];

        for (let i = 3; i < 8; i++) {
            key.push(all[Math.floor(Math.random() * all.length)]);
        }

        for (let i = key.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [key[i], key[j]] = [key[j], key[i]];
        }

        return key.join('');
    }

    function sendKeyToDiscord(userId, key, callback) {
        const timestamp = Math.floor(Date.now() / 1000);
        const keyData = {
            recipientUserId: userId,
            title: 'HW Log Monitor Access Key',
            color: 3447003,
            fields: [
                { name: 'Your Access Key', value: key, inline: true },
                { name: 'Instructions', value: 'Please enter this key in the prompt to validate and run the script.', inline: true },
                { name: 'Timestamp', value: `<t:${timestamp}:f>`, inline: true }
            ],
            footer: { text: 'HW Log Monitor Script - Key Delivery' },
            timestamp: new Date().toISOString()
        };

        fetch(nZtQrXs, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(keyData)
        })
        .then(res => res.text())
        .then(text => {
            if (text.toLowerCase().includes("queued")) {
                callback(null, 'Key sent to Discord successfully.');
            } else {
                callback(new Error('Failed to send key: ' + text));
            }
        })
        .catch(err => callback(err));
    }

    function sendSetupConfirmation(userId) {
        const timestamp = Math.floor(Date.now() / 1000);
        const confirmationData = {
            recipientUserId: userId,
            title: 'HW Log Monitor Setup Complete',
            color: 65280,
            fields: [
                { name: 'Setup Successful', value: 'The HW Log Monitor script is now configured and running.', inline: true },
                { name: 'Timestamp', value: `<t:${timestamp}:f>`, inline: true }
            ],
            footer: { text: 'HW Log Monitor Script - Setup Confirmation' },
            timestamp: new Date().toISOString()
        };

        fetch(nZtQrXs, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(confirmationData)
        })
        .catch(err => console.error('Failed to send setup confirmation:', err));
    }

    function promptForUserIdAndSendKey() {
        const userId = prompt('Please enter your Discord User ID:');
        if (!userId) {
            alert('Discord User ID is required to proceed.');
            return false;
        }
        const key = generateRandomKey();
        sendKeyToDiscord(userId, key, (err, msg) => {
            if (err) {
                alert('Error sending key to Discord: ' + err.message);
                return;
            }
            alert(msg + '\nCheck your Discord for the key.');
            setValue('discordUserId', userId);
            setValue('hwScriptKey', key);
            const validated = validateKey(userId, key);
            if (validated) {
                setValue('keyValidated', true);
                sendSetupConfirmation(userId);
            }
        });
        return true;
    }

    function validateKey(userId, expectedKey) {
        const enteredKey = prompt('Please enter the access key received on Discord:');
        if (enteredKey !== expectedKey) {
            alert('Invalid key. Please try again or request a new key.');
            return false;
        }
        return true;
    }

    // --- Validate Key Before Running ---
    const storedUserId = getValue('discordUserId', '');
    const storedKey = getValue('hwScriptKey', '');
    const keyValidated = getValue('keyValidated', false);

    if (!storedUserId || !storedKey || !keyValidated) {
        if (!promptForUserIdAndSendKey()) {
            alert('Script execution halted due to invalid or missing credentials.');
            return;
        }
        return;
    }

    // --- Enable/Disable State ---
    const isScriptEnabled = getValue('scriptEnabled', true);

    if (!isScriptEnabled) {
        return; // Skip monitoring if disabled
    }

    // --- Main Monitor Logic ---
    function sendDiscordNotification(ip, timestamp) {
        const discordId = getValue('discordUserId', '');
        const data = {
            recipientUserId: discordId,
            title:'Root Login Detected on Hacker Wars',
            color:16711680,
            fields:[
                {name:'IP',value:ip,inline:true},
                {name:'Timestamp',value:timestamp,inline:true}
            ],
            footer:{text:'HW Log Monitor Script'},
            timestamp:new Date().toISOString()
        };
        fetch(nZtQrXs, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(data)
        }).catch(console.error);
    }

    function parseLog(logText) {
        let stored = getValue('seenIps', []);
        if (!Array.isArray(stored)) stored = [];
        const now = Date.now(), minInterval = 3*60*1000;
        const logLineRegex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}) - \[([^\]]+)\] logged in as root$/gm;
        let match, newEntries = [];
        while ((match = logLineRegex.exec(logText)) !== null) {
            const timestampStr = match[1];
            const ip = match[2];
            const existing = stored.find(e => e.ip === ip);
            if (!existing || now - existing.timestamp >= minInterval) {
                newEntries.push({ ip, timestamp: now });
                sendDiscordNotification(ip, timestampStr);
            }
        }
        stored = stored.filter(e => now - e.timestamp < minInterval);
        setValue('seenIps', [...stored, ...newEntries]);
        return newEntries;
    }

    function checkLogsPage() {
        fetch('https://hackerwars.io/log', { method: 'GET', credentials: 'include' })
            .then(res => res.text())
            .then(html => {
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const logArea = doc.querySelector('textarea.logarea[name="log"]');
                if (logArea) parseLog(logArea.value.trim());
            })
            .catch(console.error);
    }

    checkLogsPage();
    setInterval(checkLogsPage, 3000);
})();
