// Discord Token Checker - Bookmarklet Code Generator
// 言語とテーマに応じて、必要な値だけを埋め込んでコードを生成

window.BOOKMARKLET_GENERATOR = {
    // 設定値を完全に埋め込んでコードを生成（4パターン）
    generate: function(lang = 'en', isDark = false) {
        // 選択された言語のテキストのみ
        const texts = {
            ja: { success: 'トークン取得成功', copy: 'コピー', copied: 'コピー成功', close: '閉じる' },
            en: { success: 'Token Retrieved', copy: 'Copy', copied: 'Copied!', close: 'Close' }
        };
        const t = texts[lang];
        
        // 選択されたテーマのカラーコードのみ
        const colors = isDark ? {
            modalBg: '#2b2d31',
            modalText: '#dbdee1',
            titleText: '#dbdee1',
            textareaBg: '#1e1f22',
            textareaText: '#dbdee1',
            textareaBorder: '#3f4147',
            overlayBg: 'rgba(0,0,0,.6)'
        } : {
            modalBg: '#ffffff',
            modalText: '#2e3338',
            titleText: '#2e3338',
            textareaBg: '#f9fafb',
            textareaText: '#2e3338',
            textareaBorder: '#e3e5e8',
            overlayBg: 'rgba(0,0,0,.4)'
        };
        
        // すべての値が直接埋め込まれたコード（分岐なし、余計なデータなし）
        const source = `(function(){let captured=false;const showToken=(token)=>{const overlay=document.createElement('div');const modal=document.createElement('div');overlay.style.cssText='position:fixed;inset:0;background:${colors.overlayBg};backdrop-filter:blur(4px);z-index:999998';modal.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:${colors.modalBg};color:${colors.modalText};padding:32px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.4);z-index:999999;width:90%;max-width:600px;box-sizing:border-box';const close=()=>{overlay.remove();modal.remove()};modal.innerHTML='<div style="margin-bottom:20px;font-size:20px;font-weight:700;color:${colors.titleText}">${t.success}</div><textarea id="tokenTextArea" readonly style="width:100%;box-sizing:border-box;padding:14px 16px;border:2px solid ${colors.textareaBorder};background:${colors.textareaBg};color:${colors.textareaText};border-radius:10px;font-family:monospace;font-size:13px;resize:none;min-height:100px;word-break:break-all;margin-bottom:20px">'+token+'</textarea><div style="display:flex;gap:10px"><button id="copyTokenBtn" style="flex:8;padding:14px 20px;background:#5865f2;color:#fff;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:15px">${t.copy}</button><button id="closeModalBtn" style="flex:2;padding:14px 20px;background:#ed4245;color:#fff;border:none;border-radius:10px;cursor:pointer;font-weight:600;font-size:15px">${t.close}</button></div>';document.body.appendChild(overlay);document.body.appendChild(modal);overlay.onclick=close;const copyBtn=document.getElementById('copyTokenBtn');copyBtn.onclick=()=>{navigator.clipboard.writeText(token).then(()=>{copyBtn.textContent='${t.copied}';copyBtn.style.background='#43b581';setTimeout(()=>{copyBtn.textContent='${t.copy}';copyBtn.style.background='#5865f2'},2000)})};document.getElementById('closeModalBtn').onclick=close};const origFetch=window.fetch;window.fetch=function(...args){const[url,options]=args;if(options?.headers){let auth=options.headers.authorization||options.headers.Authorization;if(options.headers.get){auth=options.headers.get('authorization')||options.headers.get('Authorization')}if(auth&&!captured){captured=true;showToken(auth)}}return origFetch.apply(this,args)};const origSetHeader=XMLHttpRequest.prototype.setRequestHeader;XMLHttpRequest.prototype.setRequestHeader=function(header,value){if(header.toLowerCase()==='authorization'&&!captured){captured=true;showToken(value)}return origSetHeader.apply(this,arguments)}})();`;
        
        return 'javascript:' + source;
    },

    // 現在のサイト設定を使ってコードを取得
    getCode: function() {
        const config = window.DISCORD_TOKEN_CHECKER_CONFIG || { lang: 'en', theme: 'light' };
        return this.generate(config.lang, config.theme === 'dark');
    }
};
