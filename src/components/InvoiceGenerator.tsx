// Invoice Generator Component

import React, { useState, useEffect } from 'react';
import { useInvoice } from '../hooks/useInvoice';
import { useTimeTracker } from '../hooks/useTimeTracker';
import { type InvoiceLineItem } from '../types/api';

const InvoiceGenerator: React.FC = () => {
  const { timeEntries } = useTimeTracker();
  const { generateInvoice, isLoading, error, lastInvoice, clearError, clearLastInvoice } = useInvoice();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedEntries, setSelectedEntries] = useState<Set<number>>(new Set());
  const [customRate, setCustomRate] = useState(75); // Default hourly rate

  // Auto-populate client name from recent entries
  useEffect(() => {
    if (timeEntries.length > 0 && !clientName) {
      const recentClient = timeEntries[0].client;
      setClientName(recentClient);
    }
  }, [timeEntries, clientName]);

  const handleEntryToggle = (index: number) => {
    const newSelected = new Set(selectedEntries);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedEntries(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEntries.size === timeEntries.length) {
      setSelectedEntries(new Set());
    } else {
      setSelectedEntries(new Set(timeEntries.map((_, index) => index)));
    }
  };


  const generateLineItems = (): InvoiceLineItem[] => {
    const clientEntries = timeEntries.filter((_, index) => selectedEntries.has(index));
    
    // Group by project
    const projectGroups = clientEntries.reduce((groups, entry) => {
      const key = entry.project;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(entry);
      return groups;
    }, {} as Record<string, typeof clientEntries>);

    return Object.entries(projectGroups).map(([project, entries]) => {
      const totalHours = entries.reduce((sum, entry) => sum + (entry.duration_minutes || 0) / 60, 0);
      const descriptions = entries.map(e => e.description).filter(Boolean).join(', ');
      
      return {
        description: `${project}${descriptions ? ` - ${descriptions}` : ''}`,
        hours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
        rate: customRate,
        amount: Math.round(totalHours * customRate * 100) / 100,
      };
    });
  };

  const handleGenerateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || selectedEntries.size === 0) return;

    const lineItems = generateLineItems();
    if (lineItems.length === 0) return;

    await generateInvoice({
      client_name: clientName.trim(),
      client_email: clientEmail.trim(),
      line_items: lineItems,
      notes: notes.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timeString: string): string => {
    return new Date(timeString).toLocaleString();
  };

  const totalAmount = generateLineItems().reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Invoice Generator</h2>
        {lastInvoice && (
          <button
            onClick={clearLastInvoice}
            className="p-2 rounded-lg bg-gray-500/20 hover:bg-gray-500/30 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-200">{error}</p>
            <button
              onClick={clearError}
              className="text-red-300 hover:text-red-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {lastInvoice && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
          <h3 className="text-lg font-semibold text-green-200 mb-2">Invoice Generated Successfully!</h3>
          <p className="text-green-300">{lastInvoice.message}</p>
          {lastInvoice.invoice_path && (
            <p className="text-green-400 text-sm mt-1">
              Saved to: {lastInvoice.invoice_path}
            </p>
          )}
          {lastInvoice.download_url && (
            <div className="mt-3">
              <a
                href={`http://localhost:8080${lastInvoice.download_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </a>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleGenerateInvoice} className="space-y-6">
        {/* Client Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Client Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Client Name *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Client Email *
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="Enter client email"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              value={customRate}
              onChange={(e) => setCustomRate(Number(e.target.value))}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Time Entries Selection */}
        {timeEntries.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Select Time Entries</h3>
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-colors text-sm"
              >
                {selectedEntries.size === timeEntries.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {timeEntries.map((entry, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedEntries.has(index)
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                  onClick={() => handleEntryToggle(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedEntries.has(index)}
                        onChange={() => handleEntryToggle(index)}
                        className="w-4 h-4 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                      />
                      <div>
                        <p className="text-white font-medium">
                          {entry.client} - {entry.project}
                        </p>
                        {entry.description && (
                          <p className="text-white/60 text-sm">{entry.description}</p>
                        )}
                        <p className="text-white/60 text-sm">
                          {formatTime(entry.start_time)}
                          {entry.end_time && ` - ${formatTime(entry.end_time)}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">
                        {entry.duration_minutes ? formatDuration(entry.duration_minutes) : 'Running...'}
                      </p>
                      {entry.duration_minutes && (
                        <p className="text-white/60 text-sm">
                          ${(entry.duration_minutes / 60 * customRate).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invoice Preview */}
        {selectedEntries.size > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Invoice Preview</h3>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="space-y-2">
                {generateLineItems().map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-white/10">
                    <div>
                      <p className="text-white font-medium">{item.description}</p>
                      <p className="text-white/60 text-sm">
                        {item.hours} hours × ${item.rate}/hour
                      </p>
                    </div>
                    <p className="text-white font-medium">${item.amount.toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between items-center py-2 font-bold text-lg">
                  <span className="text-white">Total:</span>
                  <span className="text-white">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter any additional notes for the invoice"
            rows={3}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Generate Button */}
        <button
          type="submit"
          disabled={isLoading || !clientName.trim() || !clientEmail.trim() || selectedEntries.size === 0}
          className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Generating Invoice...' : 'Generate Invoice'}
        </button>
      </form>
    </div>
  );
};

export default InvoiceGenerator;
