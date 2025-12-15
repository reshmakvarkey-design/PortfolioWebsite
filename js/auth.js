/**
 * Simple client-side page locking mechanism.
 * Note: This is not secure against determined attackers who can inspect the source code.
 */

const AUTH_CONFIG = {
    // Hash for "open sesame"
    PAGE_HASH: '41ef4bb0b23661e66301aac36066912dac037827b4ae63a7b1165a5aa93ed4eb',
    SESSION_KEY: 'page_unlocked_status'
};

document.addEventListener('DOMContentLoaded', () => {
    checkLock();
});

function checkLock() {
    const isUnlocked = sessionStorage.getItem(AUTH_CONFIG.SESSION_KEY) === 'true';

    if (!isUnlocked) {
        showLockScreen();
    }
}

function showLockScreen() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'auth-overlay';

    // Create auth box
    const box = document.createElement('div');
    box.className = 'auth-box';

    const title = document.createElement('h3');
    title.textContent = 'Protected Content';
    title.style.marginBottom = '1rem';

    const description = document.createElement('p');
    description.textContent = 'Please enter the passcode to view this case study.';
    description.style.marginBottom = '1.5rem';
    description.style.fontSize = '0.9rem';
    description.style.color = '#666';

    const input = document.createElement('input');
    input.type = 'password';
    input.placeholder = 'Enter passcode';
    input.className = 'auth-input';

    // Handle Enter key
    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            attemptUnlock(input.value, errorMsg);
        }
    });

    const btn = document.createElement('button');
    btn.textContent = 'Unlock';
    btn.className = 'auth-btn';
    btn.onclick = () => attemptUnlock(input.value, errorMsg);

    const errorMsg = document.createElement('div');
    errorMsg.className = 'auth-error';
    errorMsg.style.display = 'none';

    box.appendChild(title);
    box.appendChild(description);
    box.appendChild(input);
    box.appendChild(errorMsg);
    box.appendChild(btn);
    overlay.appendChild(box);

    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    document.body.appendChild(overlay);

    // Focus input
    input.focus();
}

async function attemptUnlock(passcode, errorElement) {
    if (!passcode) return;

    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(passcode));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (hashHex === AUTH_CONFIG.PAGE_HASH) {
        sessionStorage.setItem(AUTH_CONFIG.SESSION_KEY, 'true');
        document.querySelector('.auth-overlay').remove();
        document.body.style.overflow = '';
    } else {
        errorElement.textContent = 'Incorrect passcode';
        errorElement.style.display = 'block';
        errorElement.style.color = '#dc2626';
        errorElement.style.marginTop = '10px';
        errorElement.style.fontSize = '0.875rem';

        // Shake animation effect
        const input = document.querySelector('.auth-input');
        input.classList.add('shake');
        setTimeout(() => input.classList.remove('shake'), 500);
    }
}
