
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Text,
  Link,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useUser } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { LayoutContainer } from "@/components/layout/LayoutContainer";
import { SectionHeader } from "@/components/ui/SectionHeader";

const PolygonApiKeyForm: React.FC = () => {
  const { user, session } = useUser();
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<null | "success" | "error">(null);
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
          
        if (data && data.is_admin) {
          setIsAdmin(true);
          fetchApiKey();
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };
    
    checkAdmin();
  }, [user]);

  const fetchApiKey = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("polygon-market-data", {
        body: { test: true }
      });

      if (error) {
        console.error("Error testing API connection:", error);
      } else if (data && data.success) {
        setConnectionStatus("success");
        setApiKey("••••••••••••••••••••••"); // Mask the actual key
      } else {
        setConnectionStatus("error");
      }
    } catch (error) {
      console.error("Error fetching API key status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Polygon API key.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("set-polygon-api-key", {
        body: { apiKey }
      });

      if (error) {
        console.error("Error saving API key:", error);
        toast({
          title: "Error saving API Key",
          description: "Failed to save the Polygon API key. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else if (data && data.success) {
        toast({
          title: "API Key saved successfully",
          description: "The Polygon API key has been saved and validated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setConnectionStatus("success");
      } else {
        toast({
          title: "Error saving API Key",
          description: data?.error || "Failed to save the API key. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    try {
      const { data, error } = await supabase.functions.invoke("polygon-market-data", {
        body: { test: true }
      });

      if (error) {
        console.error("Error testing API connection:", error);
        toast({
          title: "Connection Test Failed",
          description: "Could not connect to Polygon API. Please check the key.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setConnectionStatus("error");
      } else if (data && data.success) {
        toast({
          title: "Connection Successful",
          description: "Successfully connected to Polygon API.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setConnectionStatus("success");
      } else {
        toast({
          title: "Connection Test Failed",
          description: data?.message || "Could not connect to Polygon API.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setConnectionStatus("error");
      }
    } finally {
      setIsTestingConnection(false);
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  if (!isAdmin) {
    return (
      <LayoutContainer>
        <SectionHeader title="Polygon API Key" />
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Access Restricted</AlertTitle>
          <AlertDescription>
            Market data API configuration is managed by administrators.
          </AlertDescription>
        </Alert>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer>
      <SectionHeader title="Polygon API Key" />
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={6}
        bg="white"
        boxShadow="md"
        maxWidth="xl"
        mx="auto"
      >
        <Text mb={4}>
          Configure the application's Polygon.io API key for real-time stock data.{" "}
          <Link
            href="https://polygon.io/"
            isExternal
            color="blue.500"
            fontWeight="medium"
          >
            Get an API key from Polygon.io
          </Link>
        </Text>
        
        {connectionStatus === "success" && (
          <Alert status="success" mb={4} borderRadius="md">
            <AlertIcon />
            <Flex justify="space-between" w="100%" align="center">
              <Text>Polygon API connection is active and working.</Text>
              <Badge colorScheme="green">Connected</Badge>
            </Flex>
          </Alert>
        )}
        
        {connectionStatus === "error" && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            <Flex justify="space-between" w="100%" align="center">
              <Text>Polygon API connection is not working.</Text>
              <Badge colorScheme="red">Not Connected</Badge>
            </Flex>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="api-key">
              <FormLabel>Polygon.io API Key</FormLabel>
              <InputGroup size="md">
                <Input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={handleApiKeyChange}
                  placeholder="Enter your API key"
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    onClick={toggleShowApiKey}
                    aria-label={
                      showApiKey ? "Hide API Key" : "Show API Key"
                    }
                    icon={showApiKey ? <ViewOffIcon /> : <ViewIcon />}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Flex justify="space-between" gap={4} direction={{ base: "column", md: "row" }}>
              <Button
                colorScheme="blue"
                isLoading={isLoading}
                type="submit"
                width={{ base: "100%", md: "auto" }}
                flex={{ md: 1 }}
              >
                Save API Key
              </Button>
              <Button
                colorScheme="teal"
                isLoading={isTestingConnection}
                onClick={testConnection}
                width={{ base: "100%", md: "auto" }}
                flex={{ md: 1 }}
              >
                Test Connection
              </Button>
            </Flex>
          </Stack>
        </form>
      </Box>
    </LayoutContainer>
  );
};

export default PolygonApiKeyForm;
