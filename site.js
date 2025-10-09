// Discord Token Checker - Site Script

// URL parameters utility
function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        from: params.get('from'),
        lang: params.get('lang'),
        theme: params.get('theme')
    };
}

// Build URL with current settings
function buildReturnURL(baseURL) {
    const url = new URL(baseURL);
    url.searchParams.set('lang', currentLang);
    url.searchParams.set('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    return url.toString();
}

// Language toggle functionality
let currentLang = 'en';

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'ja' : 'en';
    updateLanguage();
    updateBackButtonURL();
    updateBookmarkletPreview();
}

function updateLanguage() {
    document.querySelectorAll('[data-lang]').forEach(elem => {
        if (elem.getAttribute('data-lang') === currentLang) {
            elem.classList.remove('lang-hidden');
        } else {
            elem.classList.add('lang-hidden');
        }
    });
    
    // Update page title based on language
    document.title = currentLang === 'en' 
        ? 'Get Your Discord Token'
        : 'Discordのトークン確認方法';
    
    // Update language button text
    const languageText = document.getElementById('languageText');
    if (languageText) {
        languageText.textContent = currentLang === 'en' ? 'English' : '日本語';
    }
    
    // Save preference
    sessionStorage.setItem('preferredLanguage', currentLang);
}

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('themeText').textContent = isDark ? '☀️' : '🌙';
    sessionStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateBackButtonURL();
    updateBookmarkletPreview();
}

// Update back button URL with current settings
function updateBackButtonURL() {
    const backBtn = document.getElementById('backBtn');
    const returnURL = sessionStorage.getItem('returnURL');
    if (returnURL && backBtn) {
        backBtn.href = buildReturnURL(returnURL);
    }
}

// Bookmarklet code (自動生成) - 現在の設定を反映
function getBookmarkletCode() {
    window.DISCORD_TOKEN_CHECKER_CONFIG = {
        lang: currentLang,
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    };
    return window.BOOKMARKLET_GENERATOR.getCode();
}

// Update bookmarklet preview
function updateBookmarkletPreview() {
    const config = {
        lang: currentLang,
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    };
    console.log('Bookmarklet config updated:', config);
    console.log('Language:', config.lang === 'ja' ? 'Japanese' : 'English');
    console.log('Theme:', config.theme === 'dark' ? 'Dark Mode' : 'Light Mode');
    
    // Update manual copy textarea if visible
    const manualSection = document.getElementById('manualSection');
    const textarea = document.getElementById('codeTextarea');
    if (manualSection && manualSection.style.display !== 'none') {
        textarea.value = getBookmarkletCode();
    }
}

// Copy button functionality
document.getElementById('copyBtn').addEventListener('click', function() {
    const bookmarkletCode = getBookmarkletCode();
    navigator.clipboard.writeText(bookmarkletCode).then(() => {
        const btn = this;
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span data-lang="ja" class="lang-hidden">コピー完了！</span><span data-lang="en">Copied!</span>';
        updateLanguage();
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            updateLanguage();
        }, 2000);
    });
});

// Manual copy button functionality
document.getElementById('deleteTextareaBtn').addEventListener('click', function() {
    const manualSection = document.getElementById('manualSection');
    const textarea = document.getElementById('codeTextarea');
    
    if (manualSection.style.display === 'none') {
        manualSection.style.display = 'block';
        textarea.value = getBookmarkletCode();
        textarea.select();
    } else {
        manualSection.style.display = 'none';
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = getURLParams();
    
    // Handle return URL (from parameter)
    if (urlParams.from) {
        try {
            // Validate and store return URL
            const returnURL = decodeURIComponent(urlParams.from);
            sessionStorage.setItem('returnURL', returnURL);
            
            // Show back button
            const backBtn = document.getElementById('backBtn');
            if (backBtn) {
                backBtn.style.display = 'flex';
                backBtn.href = returnURL;
            }
        } catch (error) {
            console.error('Invalid return URL:', error);
        }
    }
    
    // Priority: URL params > Session storage > Default
    // Load language preference
    if (urlParams.lang && (urlParams.lang === 'ja' || urlParams.lang === 'en')) {
        currentLang = urlParams.lang;
    } else {
        const savedLang = sessionStorage.getItem('preferredLanguage');
        if (savedLang) {
            currentLang = savedLang;
        }
    }
    updateLanguage();
    
    // Load theme preference
    let isDarkMode = false;
    if (urlParams.theme && (urlParams.theme === 'dark' || urlParams.theme === 'light')) {
        isDarkMode = urlParams.theme === 'dark';
    } else {
        const savedTheme = sessionStorage.getItem('theme');
        if (savedTheme) {
            isDarkMode = savedTheme === 'dark';
        }
    }
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('themeText').textContent = '☀️';
    }
    
    // Update back button URL with current settings
    updateBackButtonURL();
    
    // 初回のブックマークレット設定を表示
    updateBookmarkletPreview();
});

