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
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const fetchApiKey = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("user_api_keys")
            .select("polygon_api_key")
            .eq("user_id", user.id)
            .single();

          if (error) {
            console.error("Error fetching API key:", error);
            toast({
              title: "Error fetching API Key",
              description:
                "Failed to retrieve your Polygon API key. Please try again.",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else if (data && data.polygon_api_key) {
            setApiKey(data.polygon_api_key);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchApiKey();
  }, [user, toast]);

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
      const { error } = await supabase
        .from("user_api_keys")
        .upsert(
          [
            {
              user_id: user?.id,
              polygon_api_key: apiKey,
            },
          ],
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("Error saving API key:", error);
        toast({
          title: "Error saving API Key",
          description:
            "Failed to save your Polygon API key. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "API Key saved successfully",
          description: "Your Polygon API key has been saved to your account.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("user_api_keys")
        .update({ polygon_api_key: null })
        .eq("user_id", user?.id);

      if (error) {
        console.error("Error deleting API key:", error);
        toast({
          title: "Error deleting API Key",
          description:
            "Failed to delete your Polygon API key. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        setApiKey("");
        toast({
          title: "API Key deleted successfully",
          description: "Your Polygon API key has been removed from your account.",
          variant: "default", // Changed from "info" to "default"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

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
          To fetch real-time stock data, you need a Polygon.io API key.{" "}
          <Link
            href="https://polygon.io/"
            isExternal
            color="blue.500"
            fontWeight="medium"
          >
            Get your API key here
          </Link>
          .
        </Text>
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
            <Flex justify="space-between">
              <Button
                colorScheme="blue"
                isLoading={isLoading}
                type="submit"
                width="48%"
              >
                Save API Key
              </Button>
              <Button
                colorScheme="red"
                isLoading={isLoading}
                onClick={handleDeleteApiKey}
                width="48%"
                isDisabled={!apiKey}
              >
                Delete API Key
              </Button>
            </Flex>
          </Stack>
        </form>
      </Box>
    </LayoutContainer>
  );
};

export default PolygonApiKeyForm;
