import { useState } from "react";
import { CreditCard, Check, Download, ExternalLink, Calendar, RefreshCw } from "lucide-react";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  cycle: string;
  status: "Success" | "Failed";
}

export function BillingInvoicing() {
  const [activePlan, setActivePlan] = useState<"free" | "pro" | "enterprise">("pro");
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  const plans = [
    {
      id: "free",
      name: "Free Intern Tier",
      price: "₹0",
      description: "Basic RAG search for single researchers",
      features: [
        "Public Corpus search (Indian Kanoon)",
        "Max 100 queries/mo",
        "No private files storage",
        "No citation verification checks"
      ]
    },
    {
      id: "pro",
      name: "Pro Chamber Plan",
      price: "₹3,999/mo",
      description: "Complete operating system for active law chambers",
      features: [
        "Dual-Corpus search (Public + Chamber files)",
        "Unlimited search queries",
        "Up to 2,000 document uploads",
        "Enforced mechanical citation checks",
        "Smart Calendar & deadline reminders"
      ]
    },
    {
      id: "enterprise",
      name: "Enterprise Chamber Suite",
      price: "Custom Pricing",
      description: "Tailored vectors index and deployment nodes",
      features: [
        "Everything in Pro Plan",
        "Dedicated VPC vector databases",
        "Custom LLM prompts tuning",
        "Priority Azure OCR fallbacks",
        "Active SLAs support"
      ]
    }
  ];

  const invoices: Invoice[] = [
    {
      id: "inv_12",
      date: "2026-06-30",
      amount: "₹3,999",
      cycle: "Monthly Pro Renewal",
      status: "Success"
    },
    {
      id: "inv_11",
      date: "2026-05-30",
      amount: "₹3,999",
      cycle: "Monthly Pro Renewal",
      status: "Success"
    },
    {
      id: "inv_10",
      date: "2026-04-30",
      amount: "₹3,999",
      cycle: "First Monthly Pro Payment",
      status: "Success"
    }
  ];

  const handleCheckout = (planId: string) => {
    setIsProcessing(true);
    setCheckoutStatus(`Connecting to Razorpay checkout for ${planId}...`);
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStatus(null);
      // Simulating plan upgrade
      if (planId === "free" || planId === "pro" || planId === "enterprise") {
        setActivePlan(planId as any);
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground uppercase tracking-wider">
            SUBSCRIPTIONS &amp; BILLING
          </h1>
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-wide">
            Subscription Plans, Razorpay Gateway &amp; Invoices
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-secondary/80 border border-primary/20 rounded-lg py-1.5 px-3">
          <CreditCard size={13} className="text-primary" />
          <span className="font-mono text-primary">SECURE PAYMENTS POWERED BY RAZORPAY</span>
        </div>
      </div>

      {/* Plan selection grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isActive = activePlan === p.id;
          return (
            <div
              key={p.id}
              className={`bg-card border rounded-xl p-6 shadow-xl flex flex-col justify-between space-y-6 relative transition-all ${
                isActive
                  ? "border-primary ring-1 ring-primary"
                  : "border-primary/15 hover:border-primary/30"
              }`}
            >
              {isActive && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-background font-mono text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Active Subscription
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold font-mono text-foreground uppercase">{p.name}</h3>
                  <div className="text-2xl font-bold font-sans text-primary mt-2">{p.price}</div>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal font-mono">
                    {p.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 text-[10px] font-mono text-foreground/80">
                  {p.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check size={11} className="text-primary mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleCheckout(p.id)}
                disabled={isProcessing || isActive}
                className={`w-full py-2.5 font-bold uppercase font-mono text-[10px] rounded-lg transition-all ${
                  isActive
                    ? "bg-secondary text-muted-foreground border border-primary/10 cursor-default"
                    : "bg-primary text-background hover:bg-primary/95"
                }`}
              >
                {isActive ? "Current Active Plan" : p.id === "enterprise" ? "Contact Counsel" : "Upgrade Plan"}
              </button>
            </div>
          );
        })}
      </div>

      {checkoutStatus && (
        <div className="p-3 bg-secondary/50 border border-primary/25 rounded-lg flex items-center justify-center gap-2 text-xs font-mono text-primary animate-pulse max-w-md mx-auto">
          <RefreshCw size={14} className="animate-spin" />
          {checkoutStatus}
        </div>
      )}

      {/* Invoice Logs */}
      <div className="bg-card border border-primary/15 rounded-xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold font-mono text-primary uppercase tracking-wider flex items-center gap-1.5 border-b border-primary/10 pb-3">
          <Calendar size={14} />
          Payment Transactions &amp; Invoices
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-primary uppercase opacity-85">
              <tr className="border-b border-primary/10">
                <th className="pb-2">Invoice ID</th>
                <th className="pb-2">Billing Date</th>
                <th className="pb-2">Amount Paid</th>
                <th className="pb-2">Billing Cycle</th>
                <th className="pb-2 text-center">Payment Status</th>
                <th className="pb-2 text-right">Invoice file</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="py-3 text-foreground font-bold">{inv.id}</td>
                  <td className="py-3 text-muted-foreground">{inv.date}</td>
                  <td className="py-3 text-foreground">{inv.amount}</td>
                  <td className="py-3 text-muted-foreground">{inv.cycle}</td>
                  <td className="py-3">
                    <span className="flex justify-center items-center gap-1 mx-auto text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/20 bg-emerald-950/20 text-emerald-400 font-bold uppercase w-fit">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-[10px] text-primary hover:text-foreground font-bold uppercase transition-colors">
                      <Download size={11} /> PDF <ExternalLink size={10} className="opacity-70" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
