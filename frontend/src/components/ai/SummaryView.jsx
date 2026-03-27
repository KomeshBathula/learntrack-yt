import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Loader2, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

const SummaryView = ({ summary, videoTitle }) => {
    const [downloading, setDownloading] = useState(false);
    const [downloaded, setDownloaded] = useState(false);

    useEffect(() => {
        let timeoutId;
        if (downloaded) {
            timeoutId = setTimeout(() => setDownloaded(false), 3000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [downloaded]);

    if (!summary) return null;

    const handleSavePDF = async () => {
        setDownloading(true);
        setDownloaded(false);

        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const contentWidth = pageWidth - (margin * 2);
            const borderPadding = 5;

            // Draw border on page
            const drawBorder = () => {
                pdf.setDrawColor(100, 100, 100);
                pdf.setLineWidth(0.5);
                pdf.rect(margin - borderPadding, margin - borderPadding, contentWidth + (borderPadding * 2), pageHeight - (margin * 2) + (borderPadding * 2));
            };

            drawBorder();

            // Title
            const title = videoTitle || 'Video Summary Notes';
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(18);
            pdf.setTextColor(50, 50, 50);

            // Center the title
            const titleLines = pdf.splitTextToSize(title, contentWidth);
            let yPosition = margin + 10;
            titleLines.forEach((line) => {
                const titleWidth = pdf.getTextWidth(line);
                const titleX = (pageWidth - titleWidth) / 2;
                pdf.text(line, titleX, yPosition);
                yPosition += 8;
            });

            // Divider line under title
            yPosition += 5;
            pdf.setDrawColor(150, 150, 150);
            pdf.setLineWidth(0.3);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 15;

            // Content
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(11);
            pdf.setTextColor(30, 30, 30);

            const lines = pdf.splitTextToSize(summary.content, contentWidth);
            const lineHeight = 6;
            const maxY = pageHeight - margin - 15;

            // Helper to check if line is a list item (starts with number, bullet, dash, asterisk)
            const isListItem = (line) => {
                const trimmed = line.trim();
                return /^(\d+[\.\):]|\-|\*|\•|\–|\—|[a-zA-Z][\.\)])/.test(trimmed);
            };

            // Helper to check if line is a header/subheader (all caps, short, or ends with colon)
            const isHeader = (line) => {
                const trimmed = line.trim();
                return trimmed.length < 50 && (
                    trimmed === trimmed.toUpperCase() ||
                    trimmed.endsWith(':') ||
                    /^#{1,6}\s/.test(trimmed)
                );
            };

            lines.forEach((line, index) => {
                if (yPosition > maxY) {
                    pdf.addPage();
                    drawBorder();
                    yPosition = margin + 10;
                }

                const trimmedLine = line.trim();

                // Check if this is a list item or header - don't justify these
                const shouldNotJustify = isListItem(trimmedLine) ||
                                         isHeader(trimmedLine) ||
                                         trimmedLine === '' ||
                                         index === lines.length - 1 ||
                                         (lines[index + 1] && lines[index + 1].trim() === '');

                if (shouldNotJustify) {
                    // For list items, add slight indent
                    if (isListItem(trimmedLine)) {
                        pdf.text(line, margin + 3, yPosition);
                    } else if (isHeader(trimmedLine) && trimmedLine !== '') {
                        // Headers in bold
                        pdf.setFont('helvetica', 'bold');
                        pdf.text(line, margin, yPosition);
                        pdf.setFont('helvetica', 'normal');
                    } else {
                        pdf.text(line, margin, yPosition);
                    }
                } else {
                    // Justify regular paragraph text
                    const words = line.split(' ').filter(w => w.length > 0);
                    if (words.length > 3) {
                        const totalWordsWidth = words.reduce((acc, word) => acc + pdf.getTextWidth(word), 0);
                        const availableSpace = contentWidth - totalWordsWidth;
                        const spaceWidth = availableSpace / (words.length - 1);

                        // Only justify if space between words is reasonable (not too stretched)
                        if (spaceWidth < 8) {
                            let xPos = margin;
                            words.forEach((word, wordIndex) => {
                                pdf.text(word, xPos, yPosition);
                                xPos += pdf.getTextWidth(word) + (wordIndex < words.length - 1 ? spaceWidth : 0);
                            });
                        } else {
                            // Too stretched, just left-align
                            pdf.text(line, margin, yPosition);
                        }
                    } else {
                        pdf.text(line, margin, yPosition);
                    }
                }

                yPosition += lineHeight;
            });

            // Footer on last page
            pdf.setFont('helvetica', 'italic');
            pdf.setFontSize(9);
            pdf.setTextColor(120, 120, 120);
            const footerText = 'Generated by LearnTrackYT - Smart Summary';
            const footerWidth = pdf.getTextWidth(footerText);
            pdf.text(footerText, (pageWidth - footerWidth) / 2, pageHeight - margin + 5);

            // Generate filename from title
            const sanitizedTitle = (videoTitle || 'video-summary')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')
                .substring(0, 50);

            const finalTitle = sanitizedTitle || 'video-summary';
            pdf.save(`${finalTitle}-summary.pdf`);

            setDownloaded(true);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
        >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-semibold text-white">Video Summary ({summary.type})</h3>
                </div>

                <motion.button
                    onClick={handleSavePDF}
                    disabled={downloading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        downloaded
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: downloaded ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {downloading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Generating...
                        </>
                    ) : downloaded ? (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Downloaded!
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Save Summary Notes
                        </>
                    )}
                </motion.button>
            </div>

            <div className="p-6 text-gray-300 leading-relaxed whitespace-pre-wrap font-light">
                {summary.content}
            </div>
        </motion.div>
    );
};

export default SummaryView;
