import { Box, Heading, Image, Link, Stack, Text } from "@chakra-ui/react";
import ContentContainer from "../../components/ContentContainer";
import Header from "../../components/Header";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const About = () => {
  return (
    <>
      <Header path="/profile" title="About" />
      <ContentContainer paddingTop="16px">
        <Stack spacing={4} marginBottom={8}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image width="96px" src="/pssdconnect_logo.svg" marginY={4} />
          </Box>
          <Heading as="h1" size="lg">
            PSSD Connect
          </Heading>
          <Text>
            A dedicated community app for people affected by Post-SSRI Sexual Dysfunction
            (PSSD).
          </Text>
          <Text>
            We know how challenging it can be to find meaningful connections, especially
            when dealing with a condition that is often misunderstood or overlooked.
          </Text>
          <Text>
            That’s why we’re here: to help you connect with someone who truly understands.
          </Text>
          <Heading as="h2" size="md">
            Mission and Values
          </Heading>
          <Text>
            Our mission is simple: to create a safe, supportive, and compassionate space
            where people with PSSD can find connection and companionship.
          </Text>
          <Heading as="h2" size="md">
            Who We Are
          </Heading>
          <Text>
            PSSD Connect exists thanks to the hard work and dedication of volunteers from
            the PSSD Network.
          </Text>
          <Text>
            This initiative is powered by individuals who genuinely understand the unique
            challenges faced by those with PSSD and who are committed to building a
            community focused on support, advocacy, and awareness.
          </Text>
          <Heading as="h2" size="md">
            How You Can Help
          </Heading>
          <Text>
            If you’d like to support our app and mission, consider making a{" "}
            <Link
              textDecoration="underline"
              href="https://pssdnetwork.org/donate"
              isExternal
            >
              donation
            </Link>{" "}
            to the PSSD Network.
          </Text>
          <Text>
            Every contribution, big or small, helps us keep this platform running and
            reach more people who need support. to the PSSD Network's efforts.{" "}
          </Text>
          <Heading as="h2" size="md">
            Contact Us
          </Heading>
          <Text>
            Have questions, suggestions, or just need some support? Feel free to reach out
            to us via email at{" "}
            <Link textDecoration="underline" href="mailto:contact@pssdnetwork.org">
              contact@pssdnetwork.org
            </Link>
            .
          </Text>
          <Text></Text>
        </Stack>
      </ContentContainer>
    </>
  );
};

export default About;
