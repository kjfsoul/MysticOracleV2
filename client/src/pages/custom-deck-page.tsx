
import { Container, Box, Heading, Text } from "@chakra-ui/react";
import CustomDeckCreator from "../components/tarot/custom-deck";
import TarotTutorial from "../components/tarot/tarot-tutorial";

export default function CustomDeckPage() {
  return (
    <Container maxW="container.xl" py={6}>
      <Box textAlign="center" mb={6}>
        <Heading as="h1" size="xl" mb={2}>
          Create Your Custom Tarot Experience
        </Heading>
        <Text color="gray.500">
          Design your own digital deck or scan your physical cards for online readings
        </Text>
      </Box>
      
      <Box mb={8}>
        <CustomDeckCreator />
      </Box>
      
      <Box>
        <TarotTutorial />
      </Box>
    </Container>
  );
}
