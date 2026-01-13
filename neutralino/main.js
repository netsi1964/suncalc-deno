// Neutralino Desktop Runtime Integration
// Only Neutralino-specific API calls are guarded — the keyboard fix runs always.

function quitApp() {
    if (typeof NL_OS !== 'undefined' && NL_OS === 'Darwin') {
        // [CRITICAL MACOS FIX]: SIGTRAP Crash Prevention
        // Neutralino.app.exit() causes _dispatch_assert_queue_fail on macOS.
        // Use kill -15 (SIGTERM) instead for a clean shutdown.
        Neutralino.os.execCommand('kill -15 ' + NL_PID);
    } else if (typeof Neutralino !== 'undefined') {
        Neutralino.app.exit();
    } else {
        window.close();
    }
}

// [CRITICAL MACOS FIX]: Native Keyboard Beep Prevention
// Runs unconditionally — does NOT require Neutralino to be initialized.
// macOS WebViews lack a native Edit menu, so Cmd+C/V/X/Q etc. cause system beeps.
// We intercept them, execute the correct action, and call e.preventDefault().
document.addEventListener('keydown', (e) => {
    const isMac = (typeof NL_OS !== 'undefined')
        ? NL_OS === 'Darwin'
        : /Mac|iPhone|iPod|iPad/.test(navigator.platform);

    if (!isMac || !e.metaKey) return;

    switch (e.key.toLowerCase()) {
        case 'c':
            document.execCommand('copy');
            e.preventDefault();
            break;
        case 'v':
            document.execCommand('paste');
            e.preventDefault();
            break;
        case 'x':
            document.execCommand('cut');
            e.preventDefault();
            break;
        case 'a':
            document.execCommand('selectAll');
            e.preventDefault();
            break;
        case 'z':
            if (e.shiftKey) document.execCommand('redo');
            else document.execCommand('undo');
            e.preventDefault();
            break;
        case 'q':
            quitApp();
            e.preventDefault();
            break;
    }
});

// Neutralino-specific initialization — only runs when API is available
if (typeof Neutralino !== 'undefined') {

    function setTray() {
        if (NL_MODE !== 'window') return;
        Neutralino.os.setTray({
            icon: '/resources/icons/trayIcon.png',
            menuItems: [
                { id: 'ABOUT', text: 'About' },
                { text: '-' },
                { id: 'QUIT', text: 'Quit' }
            ]
        });
    }

    function onTrayMenuItemClicked(event) {
        switch (event.detail.id) {
            case 'ABOUT':
                Neutralino.os.showMessageBox('About', 'SunCalc — running on Neutralino.js', 'OK', 'INFO');
                break;
            case 'QUIT':
                quitApp();
                break;
        }
    }

    Neutralino.init();
    Neutralino.events.on('trayMenuItemClicked', onTrayMenuItemClicked);
    Neutralino.events.on('windowClose', quitApp);

    if (typeof NL_OS !== 'undefined' && NL_OS === 'Darwin') {
        setTray();
    }
}
