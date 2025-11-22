import { FileSearch, UserX, GraduationCap, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  type: 'resume' | 'profile' | 'essay' | 'general';
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'resume':
        return <FileSearch className="w-12 h-12 text-gray-600" />;
      case 'profile':
        return <UserX className="w-12 h-12 text-gray-600" />;
      case 'essay':
        return <GraduationCap className="w-12 h-12 text-gray-600" />;
      default:
        return <RefreshCw className="w-12 h-12 text-gray-600" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'resume':
        return 'No Resume Analyses Yet';
      case 'profile':
        return 'No Profile Checks Yet';
      case 'essay':
        return 'No Essay Analyses Yet';
      default:
        return 'No Data Available';
    }
  };

  const getDefaultDescription = () => {
    switch (type) {
      case 'resume':
        return 'Upload your first resume to get AI-powered analysis and humanization suggestions.';
      case 'profile':
        return 'Check your first profile to detect AI-generated content and improve authenticity.';
      case 'essay':
        return 'Analyze your first essay to ensure academic integrity and originality.';
      default:
        return 'Start by adding some content to see results here.';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="mb-4">
        {getIcon()}
      </div>
      <h3 className="text-xl font-semibold text-gray-300 mb-2">
        {title || getDefaultTitle()}
      </h3>
      <p className="text-gray-500 max-w-md mb-6">
        {description || getDefaultDescription()}
      </p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}
