/**
 * SmartText Component
 * Renders text with smart features: auto-links, markdown, and backlinks
 * Uses the useSmartText hook to respect user settings
 */

import React, { useMemo } from 'react';
import { useSmartText } from '../hooks/useSmartText';

interface SmartTextProps {
    /** The text content to render */
    text: string;
    /** Additional CSS class */
    className?: string;
    /** If true, renders as inline span, otherwise as div */
    inline?: boolean;
    /** Callback when a backlink is clicked */
    onBacklinkClick?: (linkText: string) => void;
    /** Maximum length before truncation (0 = no limit) */
    maxLength?: number;
}

const SmartText: React.FC<SmartTextProps> = ({
    text,
    className = '',
    inline = false,
    onBacklinkClick,
    maxLength = 0,
}) => {
    const { renderSmartText } = useSmartText();

    const processedText = useMemo(() => {
        let content = text;

        // Truncate if needed
        if (maxLength > 0 && content.length > maxLength) {
            content = content.substring(0, maxLength) + '...';
        }

        return renderSmartText(content);
    }, [text, maxLength, renderSmartText]);

    const handleClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;

        // Handle backlink clicks
        if (target.classList.contains('smart-text-backlink')) {
            e.preventDefault();
            const backlinkText = target.getAttribute('data-backlink');
            if (backlinkText && onBacklinkClick) {
                onBacklinkClick(backlinkText);
            }
        }
    };

    const Tag = inline ? 'span' : 'div';

    return (
        <Tag
            className={`smart-text ${className}`}
            dangerouslySetInnerHTML={{ __html: processedText }}
            onClick={handleClick}
        />
    );
};

export default SmartText;
