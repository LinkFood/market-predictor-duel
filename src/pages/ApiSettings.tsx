
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PolygonApiKeyForm } from "@/components/settings/PolygonApiKeyForm";
import { ApiConnectionTest } from "@/components/prediction/ApiConnectionTest";
import { FEATURES } from "@/lib/config";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { BackButton } from "@/components/ui/back-button";
import { Box, Cloud, Server } from "lucide-react";

const ApiSettings: React.FC = () => {
  return (
    <LayoutContainer>
      <div className="mb-6">
        <BackButton href="/app/settings" />
        <h1 className="text-3xl font-bold mt-4 mb-2">API Connections</h1>
        <p className="text-muted-foreground">
          Configure external API connections to enable real-time data for predictions.
        </p>
      </div>

      <Tabs defaultValue="market-data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="market-data" className="flex items-center gap-2">
            <Box className="h-4 w-4" />
            Market Data
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            AI Services
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            API Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market-data" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Market Data API Configuration</CardTitle>
              <CardDescription>
                Connect to real market data from Polygon.io to power your predictions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <PolygonApiKeyForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>AI Services Configuration</CardTitle>
              <CardDescription>
                Configure connections to AI prediction services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                AI services are configured and managed by the application administrators.
                Contact support if you're experiencing issues with AI-powered predictions.
              </p>
              {FEATURES.enableAIAnalysis ? (
                <div className="bg-green-50 text-green-800 rounded-md p-3 text-sm">
                  AI analysis features are currently enabled.
                </div>
              ) : (
                <div className="bg-yellow-50 text-yellow-800 rounded-md p-3 text-sm">
                  AI analysis features are currently disabled.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Connection Status</CardTitle>
              <CardDescription>
                Test and verify connections to external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ApiConnectionTest />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </LayoutContainer>
  );
};

export default ApiSettings;
