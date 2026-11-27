import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  BadgeCheck,
  Check,
  Copy,
  Download,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import PageHeader from "../../components/layout/PageHeader.jsx";
import { Card, CardContent } from "../../components/ui/Card.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Alert from "../../components/ui/Alert.jsx";
import Button, { buttonClasses } from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import StatCard from "../../components/ui/StatCard.jsx";
import CertificateCard from "../../components/ui/CertificateCard.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { getNavigation } from "../../config/navigation.js";
import {
  downloadMyCertificateRequest,
  getMyCertificatesRequest,
} from "../../services/certificates.js";
import { formatDate } from "../../utils/roles.js";

export default function StudentCertificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getMyCertificatesRequest()
      .then((response) => {
        if (!active) return;
        setCertificates(response.data.certificates);
        setSummary(response.data.summary);
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message || "Could not load certificates.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <DashboardLayout
      title="Certificates"
      subtitle="Your Kodewar learning workspace"
      navItems={getNavigation(user.role)}
            variant="light"

    >
      <PageHeader
        eyebrow="Student workspace"
        title="Certificates"
        description="Certificates are issued automatically by the server when every required lesson, assessment and assignment in a course is complete. Each one has a public code anyone can verify."
        light
        largeTitle
        titleAccent="cates"
      />

      {error ? (
        <Alert tone="danger" title="Could not load certificates" light>
          {error}
        </Alert>
      ) : certificates === null ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-28 rounded-xl bg-white" />
            ))}
          </div>
          <Skeleton className="h-44 rounded-xl bg-white" />
        </div>
      ) : certificates.length ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard
              icon={Award}
              label="Certificates earned"
              value={summary.total}
              hint="One per completed course"
              light
              compact
            />
            <StatCard
              icon={BadgeCheck}
              label="Latest certificate"
              value={formatDate(summary.latestIssuedAt, "None yet")}
              tone="success"
              hint="Issued automatically after completion"
              light
              compact
            />
          </div>

          <div className="space-y-4">
            {certificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-[#d6e0ed] bg-white p-4 text-xs leading-5 text-[#526782] shadow-sm">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-emerald-300"
              aria-hidden="true"
            />
            <p>
              Anyone can confirm a certificate with its code on the public
              verification page. Verification shows the recipient, course and
              issue date without exposing account details.
            </p>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Award}
          title="No certificates yet"
          description="Finish every lesson, pass every published assessment and submit every published assignment in a course. The certificate is issued automatically when the server confirms the course is complete."
          light
          action={
            <Link
              to="/student/courses"
              className={buttonClasses({ variant: "secondary", size: "sm", light: true })}
            >
              Continue learning
            </Link>
          }
        />
      )}
    </DashboardLayout>
  );
}