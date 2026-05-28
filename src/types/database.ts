/**
 * Database types — generated from the Supabase schema.
 *
 * In production, regenerate with:
 *   npx supabase gen types typescript --project-id <YOUR_REF> > src/types/database.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type MemberStatus     = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'TERMINATED'
export type StaffRole        = 'ADMIN' | 'MANAGER' | 'LOAN_OFFICER' | 'ACCOUNTANT' | 'CASHIER'
export type KycStatus        = 'PENDING' | 'VERIFIED' | 'REJECTED'
export type SavingsProduct   = 'REGULAR' | 'FIXED_DEPOSIT' | 'HOLIDAY' | 'EMERGENCY' | 'GOAL'
export type TxnType          = 'CONTRIBUTION' | 'WITHDRAWAL' | 'LOAN_DISBURSEMENT' | 'LOAN_REPAYMENT' | 'DIVIDEND' | 'PENALTY' | 'FEE' | 'INTEREST' | 'TRANSFER'
export type TxnMethod        = 'CASH' | 'BANK_TRANSFER' | 'M_PESA' | 'CHEQUE' | 'INTERNAL' | 'CARD'
export type TxnStatus        = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED'
export type LoanStatus       = 'PENDING' | 'APPROVED' | 'DISBURSED' | 'REPAID' | 'REJECTED' | 'DEFAULTED' | 'WRITTEN_OFF'
export type LoanRisk         = 'LOW' | 'MEDIUM' | 'HIGH'
export type DividendStatus   = 'PROJECTED' | 'PENDING' | 'PAID' | 'CANCELLED'
export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER'

export interface Database {
  public: {
    Tables: {
      saccos: {
        Row: {
          id: string
          name: string
          registration_no: string | null
          tax_pin: string | null
          short_code: string | null
          email: string | null
          phone: string | null
          address: string | null
          logo_url: string | null
          currency: string
          timezone: string
          language: string
          loan_policy: Json
          contribution_policy: Json
          dividend_policy: Json
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['saccos']['Row']> & { name: string }
        Update: Partial<Database['public']['Tables']['saccos']['Row']>
      }

      members: {
        Row: {
          id: string
          auth_user_id: string | null
          sacco_id: string
          branch_id: string | null
          membership_no: string
          first_name: string
          last_name: string
          national_id: string | null
          email: string | null
          phone: string
          date_of_birth: string | null
          gender: 'M' | 'F' | 'OTHER' | null
          address: string | null
          occupation: string | null
          next_of_kin: Json | null
          profile_picture_url: string | null
          avatar_color: string
          status: MemberStatus
          kyc_status: KycStatus
          referred_by: string | null
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['members']['Row'], 'id' | 'created_at' | 'updated_at' | 'joined_at'> & Partial<Pick<Database['public']['Tables']['members']['Row'], 'id' | 'joined_at'>>
        Update: Partial<Database['public']['Tables']['members']['Row']>
      }

      savings_accounts: {
        Row: {
          id: string
          member_id: string
          account_no: string
          product: SavingsProduct
          balance: number
          shares_owned: number
          interest_rate: number
          is_primary: boolean
          is_active: boolean
          opened_at: string
          closed_at: string | null
        }
        Insert: Partial<Database['public']['Tables']['savings_accounts']['Row']> & { member_id: string; account_no: string }
        Update: Partial<Database['public']['Tables']['savings_accounts']['Row']>
      }

      transactions: {
        Row: {
          id: string
          sacco_id: string
          member_id: string
          savings_account_id: string | null
          txn_type: TxnType
          amount: number
          method: TxnMethod
          reference: string
          description: string | null
          balance_after: number | null
          status: TxnStatus
          initiated_by: string | null
          processed_by: string | null
          metadata: Json
          occurred_at: string
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['transactions']['Row']> & {
          sacco_id: string; member_id: string; txn_type: TxnType
          amount: number; method: TxnMethod; reference: string
        }
        Update: Partial<Database['public']['Tables']['transactions']['Row']>
      }

      loans: {
        Row: {
          id: string
          sacco_id: string
          member_id: string
          loan_no: string
          amount_requested: number
          amount_approved: number | null
          interest_rate: number
          term_months: number
          monthly_payment: number | null
          total_payable: number | null
          remaining_balance: number | null
          purpose: string
          risk: LoanRisk
          status: LoanStatus
          applied_at: string
          approved_at: string | null
          approved_by: string | null
          disbursed_at: string | null
          disbursed_by: string | null
          rejected_at: string | null
          rejection_reason: string | null
          next_payment_date: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['loans']['Row']> & {
          sacco_id: string; member_id: string; loan_no: string
          amount_requested: number; interest_rate: number; term_months: number; purpose: string
        }
        Update: Partial<Database['public']['Tables']['loans']['Row']>
      }

      notifications: {
        Row: {
          id: string
          member_id: string | null
          staff_id: string | null
          title: string
          message: string
          type: NotificationType
          action_url: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: Partial<Database['public']['Tables']['notifications']['Row']> & { title: string; message: string }
        Update: Partial<Database['public']['Tables']['notifications']['Row']>
      }

      dividend_payouts: {
        Row: {
          id: string
          dividend_period_id: string
          member_id: string
          shares_at_payout: number
          amount: number
          transaction_id: string | null
          paid_at: string | null
          status: DividendStatus
        }
        Insert: Partial<Database['public']['Tables']['dividend_payouts']['Row']>
        Update: Partial<Database['public']['Tables']['dividend_payouts']['Row']>
      }

      savings_goals: {
        Row: {
          id: string
          member_id: string
          title: string
          icon: string
          target_amount: number
          current_amount: number
          target_date: string | null
          status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'CANCELLED'
          color: string
          auto_deposit: Json | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['savings_goals']['Row']> & { member_id: string; title: string; target_amount: number }
        Update: Partial<Database['public']['Tables']['savings_goals']['Row']>
      }
    }
    Views: {
      v_member_summary: { Row: Database['public']['Tables']['members']['Row'] & {
        total_savings: number; shares_owned: number; active_loans: number; lifetime_contributions: number
      } }
      v_loan_portfolio: { Row: Database['public']['Tables']['loans']['Row'] & {
        member_name: string; member_membership_no: string; member_phone: string; avatar_color: string
      } }
      v_member_credit_score: { Row: { member_id: string; credit_score: number } }
    }
    Functions: {
      process_contribution: {
        Args: { p_member_id: string; p_amount: number; p_method: TxnMethod; p_reference: string; p_description?: string }
        Returns: string
      }
      approve_loan: {
        Args: { p_loan_id: string; p_approved_amount?: number }
        Returns: void
      }
      disburse_loan: { Args: { p_loan_id: string }; Returns: string }
      calculate_dividend: {
        Args: { p_shares: number; p_annual_rate_pct: number; p_share_price: number; p_period_days?: number }
        Returns: number
      }
    }
    Enums: {
      member_status: MemberStatus
      loan_status: LoanStatus
      txn_type: TxnType
      txn_method: TxnMethod
    }
  }
}
