import React, { useState } from 'react';
import { CreditCard, FileCheck, DollarSign, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useLoanTracker } from '@/hooks/useLoanTracker';
import {
  AgriculturalCard,
  AgriculturalStat,
  AgriculturalButton,
  AgriculturalProgress,
  AgriculturalAlert,
  AgriculturalBadge,
  AgriculturalGrid,
  AgriculturalHero,
} from './AgriculturalComponents';

export const LoanTrackerUI: React.FC = () => {
  const { getAvailableLoans, createApplication, calculateLoanBenefit } = useLoanTracker();

  const [farmSize, setFarmSize] = useState(5);
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [loanAmount, setLoanAmount] = useState(300000);
  const [loanTerm, setLoanTerm] = useState(36);

  const states = [
    'Maharashtra',
    'Karnataka',
    'Uttar Pradesh',
    'Punjab',
    'Tamil Nadu',
    'Gujarat',
    'Rajasthan',
    'West Bengal',
  ];

  const availableLoans = getAvailableLoans(selectedState, farmSize);
  const loanBenefit = selectedLoan ? calculateLoanBenefit(selectedLoan, loanAmount, loanTerm) : null;

  const handleSelectLoan = (loan: any) => {
    setSelectedLoan(loan);
    setLoanAmount(Math.min(loanAmount, loan.maxAmount));
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <AgriculturalHero
        title="💰 Government Loan & Subsidy Tracker"
        subtitle="Find and apply for agricultural loans and subsidies"
        icon={CreditCard}
        backgroundVariant="harvest"
      />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filter Panel */}
        <div className="lg:col-span-1 space-y-4">
          <AgriculturalCard variant="harvest" padding="lg">
            <h3 className="text-lg font-bold mb-4 text-orange-900">📍 Select State</h3>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 font-semibold"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Farm Size: {farmSize} hectares
              </label>
              <input
                type="range"
                min="0.5"
                max="100"
                step="0.5"
                value={farmSize}
                onChange={(e) => setFarmSize(Number(e.target.value))}
                className="w-full h-2 bg-orange-200 rounded-lg"
              />
            </div>
          </AgriculturalCard>

          {selectedLoan && (
            <AgriculturalCard variant="harvest" padding="lg">
              <h3 className="text-lg font-bold mb-4 text-orange-900">💵 Loan Amount</h3>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ₹{(loanAmount / 100000).toFixed(1)} Lakhs
              </label>
              <input
                type="range"
                min={10000}
                max={selectedLoan.maxAmount}
                step={10000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 bg-orange-200 rounded-lg"
              />

              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loan Term: {loanTerm} months
                </label>
                <input
                  type="range"
                  min="12"
                  max="60"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-2 bg-orange-200 rounded-lg"
                />
              </div>

              <AgriculturalButton fullWidth variant="secondary" className="mt-4">
                Calculate EMI
              </AgriculturalButton>
            </AgriculturalCard>
          )}
        </div>

        {/* Loans List */}
        <div className="lg:col-span-3 space-y-6">
          {/* Available Loans */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">🏦 Available Loans</h3>
            <div className="space-y-4">
              {availableLoans.map((loan: any, idx: number) => (
                <div
                  key={idx}
                  onClick={() => handleSelectLoan(loan)}
                  className={`cursor-pointer transition-all transform hover:scale-105 ${
                    selectedLoan?.id === loan.id ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <AgriculturalCard
                    variant={selectedLoan?.id === loan.id ? 'harvest' : 'default'}
                    padding="lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">{loan.schemeName}</h4>
                        <p className="text-sm text-gray-600">{loan.provider}</p>
                      </div>
                      {selectedLoan?.id === loan.id && (
                        <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-gray-600 text-xs">Max Amount</p>
                        <p className="font-bold text-gray-900">₹{loan.maxAmount / 100000} L</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-gray-600 text-xs">Interest Rate</p>
                        <p className="font-bold text-green-600">{loan.interestRate}%</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-gray-600 text-xs">Processing</p>
                        <p className="font-bold text-gray-900">{loan.processingTime}</p>
                      </div>
                    </div>

                    {loan.subsidy && (
                      <AgriculturalBadge variant="green" className="mb-3">
                        {loan.subsidy}% Interest Subsidy Available
                      </AgriculturalBadge>
                    )}

                    <p className="text-sm text-gray-700">{loan.description}</p>
                  </AgriculturalCard>
                </div>
              ))}
            </div>
          </div>

          {/* Loan Calculator */}
          {selectedLoan && loanBenefit && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Loan Calculation</h3>
                <AgriculturalCard variant="harvest" padding="lg">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
                        <p className="text-2xl font-bold text-orange-600">
                          ₹{(loanAmount / 100000).toFixed(1)}L
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {loanBenefit.effectiveRate}%
                        </p>
                      </div>
                    </div>

                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                      <p className="text-sm text-gray-700 mb-2">Monthly EMI</p>
                      <p className="text-3xl font-bold text-orange-600">
                        ₹{loanBenefit.monthlyEMI.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">for {loanTerm} months</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-white rounded p-3 border-2 border-gray-100">
                        <p className="text-gray-600 text-xs">Total Payable</p>
                        <p className="font-bold text-gray-900">
                          ₹{loanBenefit.totalPayable.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-white rounded p-3 border-2 border-gray-100">
                        <p className="text-gray-600 text-xs">Total Interest</p>
                        <p className="font-bold text-gray-900">
                          ₹{loanBenefit.totalInterest.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded p-3 border-2 border-green-200">
                        <p className="text-gray-600 text-xs">Subsidy Benefit</p>
                        <p className="font-bold text-green-600">
                          ₹{loanBenefit.subsidyAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </AgriculturalCard>
              </div>

              {/* Documents Required */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Required Documents</h3>
                <AgriculturalCard padding="lg">
                  <div className="space-y-2">
                    {selectedLoan.documentChecklist?.map((doc: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-gray-700">
                        <FileCheck className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                </AgriculturalCard>
              </div>

              {/* Eligibility & Terms */}
              <div className="grid grid-cols-2 gap-4">
                <AgriculturalCard padding="lg">
                  <h4 className="font-bold text-gray-900 mb-3">✅ Your Eligibility</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Farm Size: {farmSize} hectares ✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">Location: {selectedState} ✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700">
                        Repayment Capacity: {loanBenefit.approvalLikelihood}%
                      </span>
                    </div>
                  </div>
                </AgriculturalCard>

                <AgriculturalCard padding="lg">
                  <h4 className="font-bold text-gray-900 mb-3">⏱️ Processing Timeline</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Application: 1-2 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Approval: 7-15 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700">Disbursement: 2-3 days</span>
                    </div>
                  </div>
                </AgriculturalCard>
              </div>

              {/* Apply Button */}
              <AgriculturalButton fullWidth variant="success" className="text-lg py-4">
                Apply for This Loan
              </AgriculturalButton>
            </div>
          )}

          {/* Subsidies Section */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">🎁 Government Subsidies</h3>
            <div className="space-y-3">
              <AgriculturalCard variant="growth" padding="lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-green-900">PM KISAN - Direct Cash Transfer</h4>
                    <p className="text-sm text-gray-700">₹6,000/year to all farmers</p>
                  </div>
                  <AgriculturalBadge variant="green">Active</AgriculturalBadge>
                </div>
                <AgriculturalButton fullWidth variant="primary" className="mt-2">
                  Check Eligibility
                </AgriculturalButton>
              </AgriculturalCard>

              <AgriculturalCard variant="growth" padding="lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-green-900">PMKSY - Micro Irrigation</h4>
                    <p className="text-sm text-gray-700">55% subsidy on drip/sprinkler systems</p>
                  </div>
                  <AgriculturalBadge variant="green">Active</AgriculturalBadge>
                </div>
                <AgriculturalButton fullWidth variant="primary" className="mt-2">
                  Apply Now
                </AgriculturalButton>
              </AgriculturalCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanTrackerUI;
