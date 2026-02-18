import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

export function PageContainer({ title, description, children, actions }: PageContainerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
               {title}
            </h1>
            {description && <p className="text-muted-foreground">{description}</p>}
         </div>
         {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      
      {children ? (
        children
      ) : (
        <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Manage {title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-xl border-muted-foreground/20 text-muted-foreground">
               Dashboard for {title} management will appear here.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
