
import { Container, Box, Heading, Text } from "@chakra-ui/react";
import TarotTutorial from "../components/tarot/tarot-tutorial";

export default function TarotTutorialPage() {
  return (
    <Container maxW="container.xl" py={6}>
      <Box textAlign="center" mb={6}>
        <Heading as="h1" size="xl" mb={2}>
          Learn Tarot Reading
        </Heading>
        <Text color="gray.500">
          Understand the cards, spreads, and interpretation techniques
        </Text>
      </Box>
      
      <Box>
        <TarotTutorial />
      </Box>
    </Container>
  );
}
