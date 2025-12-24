export interface ReportInterface {
  id?: number;
  location: string;
  description: string;
  category: string|null;
  severity: number|null;
  probability: number|null;
  risk_score?: number|null;
  risk_level?: string|null;
  status: string;
  action_taken?: string|null;
  attachments: never[];
  old_attachments?: never[];
  report_date?: string;
}
