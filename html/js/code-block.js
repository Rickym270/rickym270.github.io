/**
 * Modern Code Block Component
 * Provides language switching, copy functionality, and syntax highlighting
 */

(function() {
    'use strict';

    // Supported languages with their display names
    const LANGUAGES = {
        'python': 'Python',
        'java': 'Java',
        'bash': 'Bash',
        'shell': 'Shell',
        'javascript': 'JavaScript',
        'js': 'JS',
        'typescript': 'TypeScript',
        'ts': 'TS',
        'jsx': 'React',
        'tsx': 'React TS',
        'sql': 'SQL',
        'html': 'HTML',
        'css': 'CSS',
        'json': 'JSON',
        'yaml': 'YAML',
        'xml': 'XML',
        'dockerfile': 'Docker',
        'go': 'Go',
        'rust': 'Rust',
        'cpp': 'C++',
        'c': 'C',
        'csharp': 'C#',
        'php': 'PHP',
        'ruby': 'Ruby',
        'swift': 'Swift',
        'kotlin': 'Kotlin'
    };

    /**
     * Initialize code blocks with language selector and copy button
     */
    function initCodeBlocks() {
        // Find all pre elements that contain code
        const preElements = document.querySelectorAll('#content pre, #FAQMain pre, .container pre');
        
        preElements.forEach(function(pre) {
            // Skip if already processed
            if (pre.closest('.code-block-wrapper')) {
                return;
            }

            const codeElements = pre.querySelectorAll('code');
            if (codeElements.length === 0) {
                return;
            }

            // Get the original code content - combine all code elements
            let originalCode = '';
            codeElements.forEach(function(codeEl) {
                const text = codeEl.textContent || codeEl.innerText;
                originalCode += text + '\n';
            });
            originalCode = originalCode.trim(); // Remove trailing newline
            
            // Use the first code element as the container, or create a new one
            const codeElement = codeElements[0];
            
            // Detect language from code content or class
            let detectedLanguage = detectLanguage(codeElement, originalCode);
            
            // Create wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            
            // Create header with language tabs and copy button
            const header = document.createElement('div');
            header.className = 'code-block-header';
            
            // Language tabs
            const tabsContainer = document.createElement('div');
            tabsContainer.className = 'code-language-tabs';
            
            // Get relevant languages for this code block
            const relevantLanguages = getRelevantLanguages(detectedLanguage);
            
            relevantLanguages.forEach(function(lang) {
                const tab = document.createElement('button');
                tab.className = 'code-language-tab';
                tab.textContent = LANGUAGES[lang] || lang;
                tab.dataset.language = lang;
                if (lang === detectedLanguage) {
                    tab.classList.add('active');
                }
                tab.addEventListener('click', function() {
                    switchLanguage(wrapper, lang, originalCode);
                    // Update active tab
                    tabsContainer.querySelectorAll('.code-language-tab').forEach(function(t) {
                        t.classList.remove('active');
                    });
                    tab.classList.add('active');
                });
                tabsContainer.appendChild(tab);
            });
            
            // Copy button
            const actionsContainer = document.createElement('div');
            actionsContainer.className = 'code-block-actions';
            
            const copyButton = document.createElement('button');
            copyButton.className = 'code-copy-button';
            copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy';
            copyButton.addEventListener('click', function() {
                copyToClipboard(originalCode, copyButton);
            });
            actionsContainer.appendChild(copyButton);
            
            header.appendChild(tabsContainer);
            header.appendChild(actionsContainer);
            
            // Content wrapper
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'code-block-content';
            contentWrapper.appendChild(pre);
            
            wrapper.appendChild(header);
            wrapper.appendChild(contentWrapper);
            
            // Replace all code elements with a single one containing the full code
            // This is needed because highlight.js expects a single code element
            const allCodeElements = pre.querySelectorAll('code');
            if (allCodeElements.length > 1) {
                // Create a new single code element with all the content
                const newCodeElement = document.createElement('code');
                newCodeElement.className = 'language-' + detectedLanguage;
                newCodeElement.textContent = originalCode;
                
                // Remove all old code elements
                allCodeElements.forEach(function(oldCode) {
                    oldCode.remove();
                });
                
                // Add the new single code element
                pre.appendChild(newCodeElement);
            } else {
                // Single code element - just update its class and content
                codeElement.className = 'language-' + detectedLanguage;
                codeElement.textContent = originalCode;
            }
            
            // Replace pre with wrapper
            pre.parentNode.replaceChild(wrapper, pre);
            
            // Get the code element again (it's now inside the wrapper)
            const finalCodeElement = wrapper.querySelector('pre code');
            
            // Apply syntax highlighting
            if (typeof hljs !== 'undefined' && finalCodeElement) {
                try {
                    hljs.highlightElement(finalCodeElement);
                } catch (e) {
                    console.warn('Failed to highlight code block:', e);
                }
            }
            
            // Add line numbers (use the pre inside wrapper)
            const preInWrapper = wrapper.querySelector('pre');
            if (preInWrapper) {
                addLineNumbers(preInWrapper);
            }
        });
    }

    /**
     * Detect programming language from code content or element class
     */
    function detectLanguage(codeElement, code) {
        // Check for language class (hljs or language-*)
        const classList = codeElement.className.split(/\s+/);
        for (let i = 0; i < classList.length; i++) {
            const cls = classList[i];
            if (cls.startsWith('language-')) {
                return cls.replace('language-', '');
            }
            if (cls.startsWith('hljs-')) {
                return cls.replace('hljs-', '');
            }
        }
        
        // Check parent pre element
        const pre = codeElement.parentElement;
        if (pre) {
            const preClasses = pre.className.split(/\s+/);
            for (let i = 0; i < preClasses.length; i++) {
                const cls = preClasses[i];
                if (cls.startsWith('language-')) {
                    return cls.replace('language-', '');
                }
            }
        }
        
        // Heuristic detection based on code content
        const codeLower = code.toLowerCase().trim();
        
        if (codeLower.includes('import ') || codeLower.includes('from ') || codeLower.includes('def ') || codeLower.includes('class ')) {
            if (codeLower.includes('import java') || codeLower.includes('public class')) {
                return 'java';
            }
            if (codeLower.includes('import ') && (codeLower.includes('subprocess') || codeLower.includes('paramiko') || codeLower.includes('logging'))) {
                return 'python';
            }
            if (codeLower.includes('import ') && (codeLower.includes('react') || codeLower.includes('from react'))) {
                return 'jsx';
            }
            if (codeLower.includes('import ') && codeLower.includes('typescript')) {
                return 'typescript';
            }
        }
        
        if (codeLower.includes('#!/bin/bash') || codeLower.includes('#!/bin/sh') || codeLower.includes('$')) {
            return 'bash';
        }
        
        if (codeLower.includes('function ') || codeLower.includes('const ') || codeLower.includes('let ') || codeLower.includes('var ')) {
            if (codeLower.includes('jsx') || codeLower.includes('react') || codeLower.includes('<div')) {
                return 'jsx';
            }
            return 'javascript';
        }
        
        if (codeLower.includes('SELECT ') || codeLower.includes('INSERT ') || codeLower.includes('UPDATE ')) {
            return 'sql';
        }
        
        // Default to python for Python docs
        if (window.location.pathname.includes('Python')) {
            return 'python';
        }
        
        return 'python'; // Default
    }

    /**
     * Get relevant languages for a code block
     * Returns languages that might be relevant based on the detected language
     */
    function getRelevantLanguages(detectedLang) {
        const languageGroups = {
            'python': ['python', 'bash', 'javascript'],
            'java': ['java', 'javascript', 'bash'],
            'bash': ['bash', 'python', 'javascript'],
            'shell': ['bash', 'python', 'javascript'],
            'javascript': ['javascript', 'typescript', 'jsx', 'python'],
            'js': ['javascript', 'typescript', 'jsx', 'python'],
            'typescript': ['typescript', 'javascript', 'jsx', 'python'],
            'ts': ['typescript', 'javascript', 'jsx', 'python'],
            'jsx': ['jsx', 'tsx', 'javascript', 'typescript'],
            'tsx': ['tsx', 'jsx', 'typescript', 'javascript'],
            'sql': ['sql', 'python', 'javascript'],
            'html': ['html', 'css', 'javascript'],
            'css': ['css', 'html', 'javascript']
        };
        
        return languageGroups[detectedLang] || [detectedLang, 'python', 'javascript', 'bash'];
    }

    /**
     * Switch language display (placeholder - would need actual code conversion)
     * For now, just updates the syntax highlighting
     */
    function switchLanguage(wrapper, language, originalCode) {
        const codeElement = wrapper.querySelector('pre code');
        if (!codeElement) {
            return;
        }
        
        // Update language class
        codeElement.className = 'language-' + language;
        
        // Re-highlight with new language
        if (typeof hljs !== 'undefined') {
            try {
                hljs.highlightElement(codeElement);
            } catch (e) {
                console.warn('Failed to highlight code block with language ' + language + ':', e);
                // Fallback: try to highlight without specific language
                try {
                    codeElement.textContent = originalCode;
                    hljs.highlightElement(codeElement);
                } catch (e2) {
                    console.warn('Fallback highlighting also failed:', e2);
                }
            }
        }
    }

    /**
     * Copy code to clipboard
     */
    function copyToClipboard(text, button) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(function() {
                showCopyFeedback(button);
            }).catch(function(err) {
                console.error('Failed to copy:', err);
                fallbackCopy(text, button);
            });
        } else {
            fallbackCopy(text, button);
        }
    }

    /**
     * Fallback copy method for older browsers
     */
    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopyFeedback(button);
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    }

    /**
     * Show visual feedback when code is copied
     */
    function showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!';
        
        setTimeout(function() {
            button.classList.remove('copied');
            button.innerHTML = originalHTML;
        }, 2000);
    }

    /**
     * Add line numbers to code block
     */
    function addLineNumbers(pre) {
        if (pre.classList.contains('code-with-lines')) {
            return; // Already has line numbers
        }
        
        const codeElement = pre.querySelector('code');
        if (!codeElement) {
            return;
        }
        
        // Count lines - handle both single code element and multiple code elements
        let codeText = codeElement.textContent || codeElement.innerText;
        // If empty, try to get from all code elements
        if (!codeText || codeText.trim().length === 0) {
            const allCodes = pre.querySelectorAll('code');
            codeText = '';
            allCodes.forEach(function(code) {
                codeText += (code.textContent || code.innerText) + '\n';
            });
            codeText = codeText.trim();
        }
        const lines = codeText.split('\n');
        const lineCount = lines.length;
        
        if (lineCount === 0) {
            return;
        }
        
        // Add class
        pre.classList.add('code-with-lines');
        pre.style.paddingLeft = '3.5rem';
        pre.style.position = 'relative';
        
        // Create line numbers
        const lineNumbersDiv = document.createElement('div');
        lineNumbersDiv.className = 'code-line-numbers';
        
        for (let i = 1; i <= lineCount; i++) {
            const lineNumber = document.createElement('span');
            lineNumber.className = 'line-number';
            lineNumber.textContent = i;
            lineNumbersDiv.appendChild(lineNumber);
        }
        
        pre.insertBefore(lineNumbersDiv, pre.firstChild);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Wait for highlight.js to be fully loaded
            if (typeof hljs !== 'undefined') {
                initCodeBlocks();
            } else {
                // Retry after a short delay if hljs isn't ready yet
                setTimeout(initCodeBlocks, 100);
            }
        });
    } else {
        if (typeof hljs !== 'undefined') {
            initCodeBlocks();
        } else {
            setTimeout(initCodeBlocks, 100);
        }
    }

    // Re-initialize when content is loaded dynamically
    if (typeof jQuery !== 'undefined') {
        jQuery(document).on('contentLoaded', function() {
            setTimeout(initCodeBlocks, 100);
        });
    }

    // Also watch for dynamically added content
    const observer = new MutationObserver(function(mutations) {
        let shouldReinit = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && (node.tagName === 'PRE' || node.querySelector('pre'))) {
                        shouldReinit = true;
                    }
                });
            }
        });
        if (shouldReinit) {
            setTimeout(initCodeBlocks, 100);
        }
    });

    // Observe content area for dynamically loaded code blocks
    const contentArea = document.getElementById('content') || document.getElementById('FAQMain');
    if (contentArea) {
        observer.observe(contentArea, { childList: true, subtree: true });
    }

    // Export for manual initialization
    window.initCodeBlocks = initCodeBlocks;
})();

