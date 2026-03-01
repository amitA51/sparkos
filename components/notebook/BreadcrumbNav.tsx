/**
 * BreadcrumbNav
 * Navigation breadcrumb trail for the notebook hierarchy
 * Shows: Notebooks > [Notebook Name] > [Section Name] > [Page Name]
 */

import { motion } from 'framer-motion';
import { useNotebook } from '../../src/contexts/NotebookContext';
import { ChevronLeftIcon, HomeIcon } from '../icons';

interface BreadcrumbNavProps {
    className?: string;
}

const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({ className = '' }) => {
    const {
        activeNotebook,
        activeSection,
        activePage,
        navigateToHub,
        navigateToNotebook,
        navigateToSection,
    } = useNotebook();

    // Build breadcrumb items
    const items: Array<{
        id: string;
        label: string;
        icon?: string;
        onClick: () => void;
        isActive: boolean;
    }> = [];

    // Hub (home)
    items.push({
        id: 'hub',
        label: 'מחברות',
        onClick: navigateToHub,
        isActive: !activeNotebook,
    });

    // Active notebook
    if (activeNotebook) {
        items.push({
            id: `notebook-${activeNotebook.id}`,
            label: activeNotebook.title,
            icon: activeNotebook.icon,
            onClick: () => navigateToNotebook(activeNotebook.id),
            isActive: !activeSection,
        });
    }

    // Active section
    if (activeSection && activeNotebook) {
        items.push({
            id: `section-${activeSection.id}`,
            label: activeSection.title,
            icon: activeSection.icon,
            onClick: () => navigateToSection(activeNotebook.id, activeSection.id),
            isActive: !activePage,
        });
    }

    // Active page
    if (activePage) {
        items.push({
            id: `page-${activePage.id}`,
            label: activePage.title,
            icon: activePage.icon,
            onClick: () => { }, // Current page, no action
            isActive: true,
        });
    }

    return (
        <nav
            className={`flex items-center gap-1 overflow-x-auto hide-scrollbar ${className}`}
            aria-label="ניווט"
        >
            {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-1 shrink-0"
                >
                    {/* Separator */}
                    {index > 0 && (
                        <ChevronLeftIcon className="w-4 h-4 text-theme-muted shrink-0" />
                    )}

                    {/* Breadcrumb item */}
                    <motion.button
                        onClick={item.onClick}
                        whileHover={!item.isActive ? { scale: 1.02 } : {}}
                        whileTap={!item.isActive ? { scale: 0.98 } : {}}
                        disabled={item.isActive}
                        className={`
              flex items-center gap-1.5 px-2 py-1 rounded-lg
              text-sm font-medium truncate max-w-[120px]
              transition-colors duration-150
              ${item.isActive
                                ? 'text-white bg-white/5 cursor-default'
                                : 'text-theme-secondary hover:text-white hover:bg-white/5'
                            }
            `}
                    >
                        {/* Icon or Home icon for hub */}
                        {index === 0 ? (
                            <HomeIcon className="w-4 h-4 shrink-0" />
                        ) : item.icon ? (
                            <span className="text-sm shrink-0">{item.icon}</span>
                        ) : null}

                        {/* Label */}
                        <span className="truncate">{item.label}</span>
                    </motion.button>
                </motion.div>
            ))}
        </nav>
    );
};

export default BreadcrumbNav;
