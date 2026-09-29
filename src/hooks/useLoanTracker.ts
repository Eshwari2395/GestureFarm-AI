import { useState, useCallback } from "react";

export interface LoanScheme {
  id: string;
  name: string;
  provider: string; // NABARD, SBI, RBI, etc.
  
  // Loan details
  type: "short-term" | "medium-term" | "long-term";
  maxAmount: number; // INR
  minAmount: number; // INR
  interestRate: number; // Annual %
  duration: number; // Years
  
  // Eligibility
  targetFarmers: string[]; // Farmer categories
  minLandHolding: number; // Acres
  maxLandHolding: number; // Acres
  
  // Documents required
  requiredDocuments: string[];
  
  // Features
  subsidyAvailable: boolean;
  subsidyPercentage: number;
  repaymentSchedule: string;
  processingFee: number;
  
  // Application
  applicationUrl: string;
  approvalTime: string; // Days to approve
  status: "active" | "closed";
  
  // Applicable states
  applicableStates: string[];
  
  description: string;
}

export interface SubsidyScheme {
  id: string;
  name: string;
  ministry: string; // Ministry/Department
  subsidyType: string; // Equipment, Seeds, Fertilizer, etc.
  
  // Subsidy amount
  subsidyAmount: number; // INR or %
  maximumBeneficiary: number;
  
  // Eligibility criteria
  farmSize: { min: number; max: number }; // Acres
  landType: string; // Irrigated/Rainfed/Both
  crops: string[]; // Applicable crops
  
  // Timeline
  applicationDeadline: string;
  disbursementMode: string;
  
  // Documents
  requiredDocuments: string[];
  
  // Application
  applicationUrl: string;
  applicationMode: "online" | "offline" | "both";
  
  // Contact
  contactDept: string;
  helplineNumber: string;
  
  description: string;
}

export interface LoanApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  farmerId: string;
  
  // Personal info
  farmerName: string;
  phone: string;
  email: string;
  state: string;
  
  // Loan details
  loanAmountApplied: number;
  purpose: string;
  landArea: number; // Acres
  
  // Status tracking
  status: "draft" | "submitted" | "approved" | "rejected" | "disbursed";
  submissionDate: string;
  approvalDate?: string;
  disbursedAmount?: number;
  
  // Documents
  uploadedDocuments: string[];
  
  // Tracking
  applicationRef: string;
  trackingNotes: string[];
}

interface UseLoanTrackerOptions {
  language?: string;
  state?: string;
}

interface UseLoanTrackerReturn {
  getAvailableLoans: (state: string, landArea: number) => LoanScheme[];
  getAvailableSubsidies: (state: string, crops: string[], landArea: number) => SubsidyScheme[];
  createApplication: (schemeId: string, formData: Partial<LoanApplication>) => Promise<LoanApplication>;
  trackApplication: (applicationRef: string) => Promise<LoanApplication | null>;
  calculateLoanBenefit: (principal: number, rate: number, duration: number) => { emi: number; totalPayable: number; totalInterest: number };
  getDocumentChecklist: (schemeId: string) => string[];
  isLoading: boolean;
  error: string | null;
}

// Government Loan Schemes in India
const LOAN_SCHEMES: LoanScheme[] = [
  {
    id: "pm-kisan-credit",
    name: "PM Kisan Credit Card Scheme",
    provider: "Ministry of Agriculture & NABARD",
    type: "short-term",
    maxAmount: 300000,
    minAmount: 10000,
    interestRate: 4.0, // With subsidy
    duration: 1.5,
    targetFarmers: ["Marginal farmers", "Small farmers", "All farmers"],
    minLandHolding: 0.1,
    maxLandHolding: 10,
    requiredDocuments: ["Aadhar", "Voter ID", "Land records", "Bank passbook"],
    subsidyAvailable: true,
    subsidyPercentage: 2.0,
    repaymentSchedule: "Quarterly/Seasonal",
    processingFee: 0,
    applicationUrl: "https://www.pmkisan.gov.in",
    approvalTime: "7-15",
    status: "active",
    applicableStates: ["All States"],
    description: "Short-term loan for agricultural purposes at concessional rate with interest subsidy",
  },

  {
    id: "sbi-agri-loan",
    name: "SBI Agri Loan",
    provider: "State Bank of India",
    type: "medium-term",
    maxAmount: 1000000,
    minAmount: 50000,
    interestRate: 6.5,
    duration: 3,
    targetFarmers: ["Farmers", "Agricultural organizations"],
    minLandHolding: 0.5,
    maxLandHolding: 50,
    requiredDocuments: ["Aadhar", "Land title deed", "Income certificate", "Bank statements"],
    subsidyAvailable: true,
    subsidyPercentage: 1.0,
    repaymentSchedule: "Monthly",
    processingFee: 2500,
    applicationUrl: "https://www.sbi.co.in",
    approvalTime: "15-30",
    status: "active",
    applicableStates: ["All States"],
    description: "Agricultural loan for farm equipment, seed, fertilizer, and machinery",
  },

  {
    id: "nabard-ssi-loan",
    name: "NABARD Agriculture Infrastructure Fund",
    provider: "NABARD",
    type: "long-term",
    maxAmount: 5000000,
    minAmount: 500000,
    interestRate: 5.5,
    duration: 10,
    targetFarmers: ["Farmers", "FPOs", "Agri-startups"],
    minLandHolding: 1,
    maxLandHolding: 100,
    requiredDocuments: ["Business plan", "Land documents", "Financial statements", "Aadhar"],
    subsidyAvailable: true,
    subsidyPercentage: 1.5,
    repaymentSchedule: "Annual/Quarterly",
    processingFee: 5000,
    applicationUrl: "https://www.nabard.org",
    approvalTime: "30-45",
    status: "active",
    applicableStates: ["All States"],
    description: "Long-term loan for agricultural infrastructure like ponds, wells, storage facilities",
  },

  {
    id: "mudra-loan",
    name: "PMMY Mudra Loan",
    provider: "Ministry of MSME",
    type: "short-term",
    maxAmount: 1000000,
    minAmount: 50000,
    interestRate: 3.5,
    duration: 5,
    targetFarmers: ["Agri-entrepreneurs", "Farm-based startups"],
    minLandHolding: 0,
    maxLandHolding: 10,
    requiredDocuments: ["Aadhar", "Business plan", "Bank statements"],
    subsidyAvailable: false,
    subsidyPercentage: 0,
    repaymentSchedule: "Flexible",
    processingFee: 0,
    applicationUrl: "https://www.mudra.org.in",
    approvalTime: "7-14",
    status: "active",
    applicableStates: ["All States"],
    description: "Unsecured loan for agricultural business ventures without collateral",
  },
];

// Government Subsidy Schemes
const SUBSIDY_SCHEMES: SubsidyScheme[] = [
  {
    id: "pm-kisan-scheme",
    name: "PM KISAN - Pradhan Mantri Kisan Samman Nidhi",
    ministry: "Ministry of Agriculture",
    subsidyType: "Direct Cash Transfer",
    subsidyAmount: 6000, // Annual
    maximumBeneficiary: 2, // Hectares (for full benefit)
    farmSize: { min: 0.01, max: 5 },
    landType: "Both",
    crops: ["All crops"],
    applicationDeadline: "Rolling",
    disbursementMode: "Direct Bank Transfer (Quarterly)",
    requiredDocuments: ["Aadhar", "Bank account", "Land records"],
    applicationUrl: "https://www.pmkisan.gov.in",
    applicationMode: "online",
    contactDept: "State Agriculture Department",
    helplineNumber: "1800-180-1551",
    description: "₹6000/year (₹2000 x 3 times annually) to all landholding farmers",
  },

  {
    id: "subsidy-farm-equipment",
    name: "State Farm Equipment Subsidy",
    ministry: "Ministry of Agriculture",
    subsidyType: "Equipment",
    subsidyAmount: 50, // Percentage
    maximumBeneficiary: 500000, // Max subsidy amount
    farmSize: { min: 0.5, max: 10 },
    landType: "All",
    crops: ["All crops"],
    applicationDeadline: "As per state notification",
    disbursementMode: "Direct to vendor/Beneficiary",
    requiredDocuments: ["Land records", "Aadhar", "Quotation from vendor"],
    applicationUrl: "https://agriharyana.gov.in", // Example state
    applicationMode: "both",
    contactDept: "District Agriculture Office",
    helplineNumber: "1234567890",
    description: "50% subsidy on farm equipment like harvesters, sprayers, pumps",
  },

  {
    id: "subsidy-drip-irrigation",
    name: "Pradhan Mantri Kisan Sinchayee Yojana - Micro Irrigation",
    ministry: "Ministry of Water Resources",
    subsidyType: "Irrigation Infrastructure",
    subsidyAmount: 55, // Percentage
    maximumBeneficiary: 500000,
    farmSize: { min: 0.5, max: 5 },
    landType: "Irrigated",
    crops: ["All crops"],
    applicationDeadline: "As per state notification",
    disbursementMode: "Work-based payment",
    requiredDocuments: ["Land records", "Survey report", "Cost estimate"],
    applicationUrl: "https://pmksy.gov.in",
    applicationMode: "online",
    contactDept: "District Irrigation Department",
    helplineNumber: "1800-2727-307",
    description: "55% subsidy on drip/sprinkler irrigation systems for water conservation",
  },

  {
    id: "mulching-subsidy",
    name: "Organic Farming Subsidy - Mulching Materials",
    ministry: "Ministry of Agriculture",
    subsidyType: "Agricultural Inputs",
    subsidyAmount: 80, // Percentage
    maximumBeneficiary: 100000,
    farmSize: { min: 0.25, max: 2 },
    landType: "All",
    crops: ["Vegetables", "Spices", "Medicinal plants"],
    applicationDeadline: "March-April (Annual)",
    disbursementMode: "Grant",
    requiredDocuments: ["Aadhar", "Land record", "Organic cert (if applicable)"],
    applicationUrl: "https://darpan.aajeevika.gov.in",
    applicationMode: "online",
    contactDept: "State Agriculture Department",
    helplineNumber: "011-2340-1714",
    description: "80% subsidy on mulching materials for organic farming and soil health",
  },
];

export const useLoanTracker = ({
  language = "en",
  state = "India",
}: UseLoanTrackerOptions = {}): UseLoanTrackerReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  /**
   * Get available loan schemes based on eligibility
   */
  const getAvailableLoans = useCallback((state: string, landArea: number): LoanScheme[] => {
    return LOAN_SCHEMES.filter((scheme) => {
      const stateMatch = scheme.applicableStates.includes("All States") || scheme.applicableStates.includes(state);
      const landMatch = landArea >= scheme.minLandHolding && landArea <= scheme.maxLandHolding;
      return stateMatch && landMatch && scheme.status === "active";
    });
  }, []);

  /**
   * Get available subsidy schemes
   */
  const getAvailableSubsidies = useCallback(
    (state: string, crops: string[], landArea: number): SubsidyScheme[] => {
      return SUBSIDY_SCHEMES.filter((scheme) => {
        const landMatch = landArea >= scheme.farmSize.min && landArea <= scheme.farmSize.max;
        const cropMatch = scheme.crops.includes("All crops") || crops.some((c) => scheme.crops.includes(c));
        return landMatch && cropMatch;
      });
    },
    []
  );

  /**
   * Create loan application
   */
  const createApplication = useCallback(
    async (schemeId: string, formData: Partial<LoanApplication>): Promise<LoanApplication> => {
      try {
        setIsLoading(true);
        const scheme = LOAN_SCHEMES.find((s) => s.id === schemeId);
        if (!scheme) throw new Error("Scheme not found");

        const application: LoanApplication = {
          id: `app-${Date.now()}`,
          schemeId,
          schemeName: scheme.name,
          farmerId: formData.farmerId || "",
          farmerName: formData.farmerName || "",
          phone: formData.phone || "",
          email: formData.email || "",
          state: formData.state || "",
          loanAmountApplied: formData.loanAmountApplied || 0,
          purpose: formData.purpose || "",
          landArea: formData.landArea || 0,
          status: "draft",
          submissionDate: new Date().toISOString(),
          uploadedDocuments: [],
          applicationRef: `REF-${Date.now()}`,
          trackingNotes: ["Application created"],
        };

        setApplications((prev) => [application, ...prev]);
        return application;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to create application";
        setError(errorMsg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Track application status
   */
  const trackApplication = useCallback(
    async (applicationRef: string): Promise<LoanApplication | null> => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const app = applications.find((a) => a.applicationRef === applicationRef);
        return app || null;
      } finally {
        setIsLoading(false);
      }
    },
    [applications]
  );

  /**
   * Calculate EMI and loan benefits
   */
  const calculateLoanBenefit = useCallback(
    (principal: number, rate: number, duration: number): { emi: number; totalPayable: number; totalInterest: number } => {
      const monthlyRate = rate / 12 / 100;
      const months = duration * 12;

      const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      const totalPayable = emi * months;
      const totalInterest = totalPayable - principal;

      return {
        emi: Math.round(emi),
        totalPayable: Math.round(totalPayable),
        totalInterest: Math.round(totalInterest),
      };
    },
    []
  );

  /**
   * Get document checklist for a scheme
   */
  const getDocumentChecklist = useCallback((schemeId: string): string[] => {
    const scheme = LOAN_SCHEMES.find((s) => s.id === schemeId);
    return scheme?.requiredDocuments || [];
  }, []);

  return {
    getAvailableLoans,
    getAvailableSubsidies,
    createApplication,
    trackApplication,
    calculateLoanBenefit,
    getDocumentChecklist,
    isLoading,
    error,
  };
};

export default useLoanTracker;
