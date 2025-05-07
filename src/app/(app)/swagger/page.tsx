
"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { PageHeader } from '@/components/page-header';

// It's good practice to load the CSS for Swagger UI specifically on this page
// to avoid conflicts or unnecessary global styles.
// "swagger-ui-react/swagger-ui.css" is already imported above.

const SwaggerPage = () => {
  return (
    <div className="flex flex-col h-full">
        <PageHeader
            title="API Documentation"
            description="Interactive API documentation for CourseNote."
        />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
            <div className="bg-card p-4 rounded-lg shadow">
                 {/*
                    The Swagger UI component will fetch and render the spec
                    from the /api/openapi.json endpoint.
                 */}
                <SwaggerUI url="/api/openapi.json" />
            </div>
        </main>
    </div>
  );
};

export default SwaggerPage;
