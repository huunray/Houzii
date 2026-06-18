import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, FileDown, CheckCircle2, TrendingUp, Users, AlertTriangle, Wallet } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface AdminBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminBlueprintModal: React.FC<AdminBlueprintModalProps> = ({ isOpen, onClose }) => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = '#591C2B'; // Maroon
    const secondaryColor = '#334155'; // Slate-700
    const lightBg = '#F8FAFC'; // slate-50
    const textColor = '#0F172A'; // slate-900
    const accentColor = '#2563EB'; // blue-600

    // Page 1: Cover Header & Category 1 & 2
    let currY = 20;

    // Head Banner Rect
    doc.setFillColor(89, 28, 43); // Maroon
    doc.rect(15, currY, 180, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('HOUZII ADMIN SPECIFICATION', 20, currY + 11);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Platform blueprints: seeker engagement, agent verifications, and inventory delisting logs.', 20, currY + 19);

    currY += 40;

    // Section title helper
    const drawSectionHeader = (title: string) => {
      // Background bar
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(15, currY - 5, 180, 8, 'F');
      
      // Left indicator line
      doc.setFillColor(89, 28, 43); // maroon
      doc.rect(15, currY - 5, 3, 8, 'F');

      doc.setTextColor(89, 28, 43);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(title, 21, currY + 1);
      currY += 9;
    };

    const drawBulletPoint = (boldText: string, normalText: string) => {
      doc.setFillColor(100, 116, 139); // slate-500
      doc.circle(18, currY - 1, 0.8, 'F');
      
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text(boldText + ': ', 22, currY);
      
      const boldWidth = doc.getTextWidth(boldText + ': ');
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(71, 85, 105); // slate-600
      
      // Word wrap text
      const wrapped = doc.splitTextToSize(normalText, 170 - boldWidth);
      doc.text(wrapped, 22 + boldWidth, currY);
      currY += (wrapped.length * 4) + 2;
    };

    // Category 1
    drawSectionHeader('1. USER LIFECYCLE & REGISTRATION MONITOR');
    drawBulletPoint('Growth Indicators', 'Log new registrations partitioned by target personas: Property Seekers, Independent Agents (Tier 1-3), Owners, and Industry Professionals.');
    drawBulletPoint('Tiered Agent pipeline', 'Review portal for submitted agent documentation (e.g. Land Use receipts, utility meter numbers, NBA seals) transitioning agents from basic Tier 1 to certified Tier 3.');
    drawBulletPoint('Verification Status', 'Log overall verification rate versus uncompleted profile completions. Safeguards platform reliability against mock profiles.');

    currY += 8;

    // Category 2
    drawSectionHeader('2. DELISTED PROPERTIES TRACKER & INVENTORY CONTROL');
    drawBulletPoint('Delisted Reasons', 'Every property delisting requires an execution prompt with precise business definitions:');
    drawBulletPoint('  • Sold / Rented via Houzii', 'Escrow finishes successfully, recording contract parameters to historic rent rates and releasing local downpayments.');
    drawBulletPoint('  • Expired Representation', 'Direct landlord mandate finished or owner retracted representation. Prevents deceptive outdated pricing.');
    drawBulletPoint('  • Disciplinary Delist', 'Admin removal triggered by seeker report (scam, fake agent layout, duplication, or illegal surcharge).');
    drawBulletPoint('  • Delisted for Editing', 'Temporary retract by the agent for specification adjustments, maintaining a safe draft stage.');
    drawBulletPoint('Notifications', 'Immediate notification dispatch to connected seekers to secure downpayments or void ongoing search sessions.');

    // Add Page 2
    doc.addPage();
    currY = 20;

    // Header strip on page 2
    doc.setFillColor(89, 28, 43); // Maroon
    doc.rect(15, currY, 180, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('HOUZII PLATFORM MONITOR SPECIFICATIONS (PAGE 2)', 20, currY + 5.5);
    currY += 18;

    // Category 3
    drawSectionHeader('3. SECURE RENTAL ESCROW & DIGITAL VAULT AUDITS');
    drawBulletPoint('Vault Telemetry', 'Active tracking of all financial states: Holds, Frozen funds (disputes), Released rents, and Secured naira balances.');
    drawBulletPoint('Payout Safeguard Alerts', 'Automatic triggers if bank account names resolved via API match verification records but misalign from original agent registration profiles.');
    drawBulletPoint('Durable ledgering', 'Full-bleed server audit trails showing downpayment locks to resolve disputes securely with zero risk.');

    currY += 8;

    // Category 4
    drawSectionHeader('4. SEEKER ENGAGEMENT AND TREND INSIGHTS');
    drawBulletPoint('Search Telemetry', 'Aggregated search coordinates (such as Lekki, Ikoyi, Yaba) indicating regional demand trends.');
    drawBulletPoint('Agent Intelligence', 'Underpins the marketplace demand cards shown on the Agent listing wizard, showing which locations have high demand.');
    drawBulletPoint('Interaction Tracking', 'Calculates ratio of search impressions to actual views and downpayment locks, isolating lagging listings.');

    currY += 8;

    // Category 5
    drawSectionHeader('5. SECURITY, WARNING ALERTS AND FLAG ACTIONS');
    drawBulletPoint('Seeker Reporting', 'Immediate interface markers for listing duplications, phantom listings, and fake prices.');
    drawBulletPoint('System Protection', 'Auto-locks active listings exceeding threshold report levels, frozen downpayments quarantined until admin review.');
    drawBulletPoint('Account Suspensions', 'Blacklists fraudulent agent licenses and devices. Preserves security for lawful participants.');

    // Footer
    doc.setTextColor(148, 163, 184); // slate-400
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.text('Confidential Houzii Admin Blueprint Specification document. Rendered in real-time.', 15, 280);

    doc.save('Houzii_Admin_Blueprint_Specification.pdf');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-black text-base">Houzii Admin Specifications</h3>
                  <p className="text-slate-400 text-xs font-medium">Core telemetry metrics, user sign-ups, and delisting workflows</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Notice & CTA */}
              <div className="p-4 bg-muted border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-slate-800 text-xs font-black">Official Admin Blueprint Spec</p>
                  <p className="text-slate-500 text-[11px] font-semibold">Perfectly categorized for database architecture, tracking cause and effect.</p>
                </div>
                <button
                  onClick={generatePDF}
                  className="w-full sm:w-auto h-10 px-4 rounded-full bg-primary text-white hover:bg-primary-dark font-black text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <FileDown className="w-4 h-4" />
                  Download Spec PDF
                </button>
              </div>

              {/* Grid of Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category 1 */}
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>01. User Lifecycle Monitor</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Signup counts:</strong> Segment totals by Seeker, Agent (Tiers 1-3), Owner, & Pro.
                    </li>
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Verification queues:</strong> Approvals for Land deeds, NBA legal seals, utility bills.
                    </li>
                  </ul>
                </div>

                {/* Category 2 */}
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>02. Delisted Properties Tracker</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Delisting Causes:</strong> Rented/sold via Houzii, Retracted representation, Duplicate/Scam flags.
                    </li>
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Connected notifications:</strong> Notify seekers of listing removals to safeguard deposits.
                    </li>
                  </ul>
                </div>

                {/* Category 3 */}
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                    <Wallet className="w-4 h-4" />
                    <span>03. Escrow & Digital Vault Audits</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Security vault status:</strong> Holds, disputes, and released rents of Seeker deposits.
                    </li>
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Mismatch triggers:</strong> Flags payout bank names misaligned with verification profiles.
                    </li>
                  </ul>
                </div>

                {/* Category 4 */}
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4" />
                    <span>04. Seeker Inquiry & Engagement</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Search telemetry:</strong> Tracks queries (Lekki, Yaba) feeding the Agent Pricing Advisor.
                    </li>
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Funnel rates:</strong> Compiles views versus downpayment conversion metrics.
                    </li>
                  </ul>
                </div>

                {/* Category 5 */}
                <div className="p-5 md:col-span-2 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4" />
                    <span>05. Security Audit Logs & Compliance Alerts</span>
                  </div>
                  <ul className="space-y-2 text-xs">
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Warning Indicators:</strong> Seekers flagging duplicated listings, phantom listings, and non-compliant agents.
                    </li>
                    <li className="text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">Automated Quarantine:</strong> Auto-locks listings surpassing warning quotas and holds disputes safely.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>HOUZII PLATFORM MONITORBLUEPRINT</span>
              <span>100% SPEC COMPLIANT</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
