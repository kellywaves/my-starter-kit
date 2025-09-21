import { router } from '@inertiajs/react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface AdvancedPaginationProps {
    pagination: PaginationData;
    className?: string;
}

export function AdvancedPagination({ pagination, className = "" }: AdvancedPaginationProps) {
    const { current_page, last_page, links } = pagination;

    // Generate page numbers to display
    const generatePageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 7; // Show up to 7 page numbers
        
        if (last_page <= maxVisiblePages) {
            // Show all pages if total pages is less than max visible
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (current_page <= 4) {
                // Show first 5 pages + ellipsis + last page
                for (let i = 2; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(last_page);
            } else if (current_page >= last_page - 3) {
                // Show first page + ellipsis + last 5 pages
                pages.push('...');
                for (let i = last_page - 4; i <= last_page; i++) {
                    pages.push(i);
                }
            } else {
                // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
                pages.push('...');
                for (let i = current_page - 1; i <= current_page + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(last_page);
            }
        }
        
        return pages;
    };

    const pageNumbers = generatePageNumbers();

    const handlePageClick = (page: number) => {
        const pageLink = links.find(link => 
            link.label === page.toString() && link.url
        );
        if (pageLink?.url) {
            router.get(pageLink.url, {}, { preserveState: true });
        }
    };

    const handlePrevious = () => {
        const prevLink = links[0];
        if (prevLink?.url) {
            router.get(prevLink.url, {}, { preserveState: true });
        }
    };

    const handleNext = () => {
        const nextLink = links[links.length - 1];
        if (nextLink?.url) {
            router.get(nextLink.url, {}, { preserveState: true });
        }
    };

    if (last_page <= 1) {
        return null;
    }

    return (
        <Pagination className={className}>
            <PaginationContent>
                {/* Previous Button */}
                {current_page > 1 && (
                    <PaginationItem>
                        <PaginationPrevious 
                            onClick={handlePrevious}
                            className="cursor-pointer"
                        />
                    </PaginationItem>
                )}

                {/* Page Numbers */}
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <PaginationItem key={`ellipsis-${index}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    const pageNum = page as number;
                    const isActive = pageNum === current_page;

                    return (
                        <PaginationItem key={pageNum}>
                            <PaginationLink
                                onClick={() => handlePageClick(pageNum)}
                                isActive={isActive}
                                className="cursor-pointer"
                            >
                                {pageNum}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                {/* Next Button */}
                {current_page < last_page && (
                    <PaginationItem>
                        <PaginationNext 
                            onClick={handleNext}
                            className="cursor-pointer"
                        />
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
