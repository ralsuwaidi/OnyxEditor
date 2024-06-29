import React from "react";
import classNames from "classnames";
import Badge from "./Badge";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  status: string;
  badgeColor: string;
  description?: string;
  className?: string;
  children?: React.ReactNode; // Add children prop
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title = "جعل الطرق اكثر امنا",
  subtitle,
  description = "تعزيز سعادة المتعاملين بالخدمات المتقدمة",
  status = "هدف",
  className,
  children, // Destructure children
}) => {
  return (
    <div
      dir="rtl"
      className={classNames(
        "flex flex-col border-t border-b items-start justify-between gap-x-8 gap-y-4 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8 bg-gray-50",
        className
      )}
    >
      <div>
        <div className="flex items-center gap-x-3">
          <Badge text={status} color="blue" />
          <h1 className="flex gap-x-3 text-lg leading-7">
            <span className="font-semibold text-gray-900">{title}</span>
            {subtitle && (
              <div>
                <span className="text-gray-600 ml-3">/</span>
                <span className="font-semibold text-gray-900">{subtitle}</span>
              </div>
            )}
          </h1>
        </div>
        <p className="mt-2 text-xs max-w-lg leading-6 text-gray-600">
          {description}
        </p>
      </div>
      {children && <div>{children}</div>} {/* Render children here */}
    </div>
  );
};
